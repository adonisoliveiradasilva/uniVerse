package br.com.my_universe.api.application.services;

import br.com.my_universe.api.application.exceptions.ResourceNotFoundException;
import br.com.my_universe.api.application.ports.PeriodRepository;
import br.com.my_universe.api.application.ports.PeriodSubjectRepository;
import br.com.my_universe.api.application.ports.StudentRepository;
import br.com.my_universe.api.domain.EnrolledSubject;
import br.com.my_universe.api.domain.Period;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PeriodServiceImpl {

    private final PeriodRepository periodRepository;
    private final PeriodSubjectRepository periodSubjectRepository;
    private final StudentRepository studentRepository;

    public PeriodServiceImpl(PeriodRepository periodRepository,
                             PeriodSubjectRepository periodSubjectRepository,
                             StudentRepository studentRepository) {
        this.periodRepository = periodRepository;
        this.periodSubjectRepository = periodSubjectRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public Period createPeriod(Period period, List<String> subjectCodes) {
        String studentEmail = period.getStudentEmail();
        
        studentRepository.findByEmail(studentEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Aluno com e-mail '" + studentEmail + "' não encontrado."));

        
        List<Period> allPeriods = periodRepository.findAllByStudentEmail(studentEmail);
        
        if (!allPeriods.isEmpty()) {
            Period latestPeriod = allPeriods.get(allPeriods.size() - 1);
            
            List<EnrolledSubject> latestPeriodSubjects = 
                periodSubjectRepository.findEnrolledSubjectsByPeriod(latestPeriod.getId(), studentEmail);

            if (latestPeriodSubjects.isEmpty()) {
                throw new IllegalArgumentException("Não é possível criar um novo período pois o período anterior (ID: " + latestPeriod.getId() + ") está vazio. Adicione disciplinas a ele primeiro.");
            }
            
            boolean hasSubjectsInProgress = latestPeriodSubjects.stream()
                .anyMatch(subject -> "cursando".equals(subject.getStatus()));
                
            if (hasSubjectsInProgress) {
                throw new IllegalArgumentException("Não é possível criar um novo período pois o período anterior (ID: " + latestPeriod.getId() + ") ainda possui disciplinas em 'cursando'.");
            }
        }

        Period savedPeriod = periodRepository.save(period);
        
        if (subjectCodes != null && !subjectCodes.isEmpty()) {
            periodSubjectRepository.linkSubjectsToPeriod(savedPeriod.getId(), savedPeriod.getStudentEmail(), subjectCodes);
        }
        
        List<EnrolledSubject> enrolled = periodSubjectRepository.findEnrolledSubjectsByPeriod(savedPeriod.getId(), savedPeriod.getStudentEmail());
        savedPeriod.setEnrolledSubjects(enrolled);
        
        return savedPeriod;
    }

    @Transactional
    public Period updatePeriod(Integer periodId, String studentEmail, List<String> subjectCodes) {
        Period existingPeriod = getPeriodById(periodId, studentEmail);
        
        periodSubjectRepository.unlinkAllSubjectsFromPeriod(periodId, studentEmail);
        
        if (subjectCodes != null && !subjectCodes.isEmpty()) {
            periodSubjectRepository.linkSubjectsToPeriod(periodId, studentEmail, subjectCodes);
        }
        
        List<EnrolledSubject> enrolled = periodSubjectRepository.findEnrolledSubjectsByPeriod(periodId, studentEmail);
        existingPeriod.setEnrolledSubjects(enrolled);
        return existingPeriod;
    }

    public Period getPeriodById(Integer periodId, String studentEmail) {
        Period period = periodRepository.findById(periodId, studentEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Período com ID '" + periodId + "' não encontrado para este aluno."));
    
        List<EnrolledSubject> enrolled = periodSubjectRepository.findEnrolledSubjectsByPeriod(periodId, studentEmail);
        period.setEnrolledSubjects(enrolled);
        
        return period;
    }

    public List<Period> getAllPeriodsByStudentEmail(String studentEmail) {
        List<Period> periods = periodRepository.findAllByStudentEmail(studentEmail);
        
        for (Period p : periods) {
            p.setEnrolledSubjects(
                periodSubjectRepository.findEnrolledSubjectsByPeriod(p.getId(), p.getStudentEmail())
            );
        }
        return periods;
    }

    @Transactional
    public void deletePeriod(Integer periodId, String studentEmail) {
        getPeriodById(periodId, studentEmail);
        periodRepository.deleteById(periodId, studentEmail);
    }
    
    @Transactional
    public EnrolledSubject updateEnrolledSubjectDetails(Integer periodId, String studentEmail, String subjectCode, EnrolledSubject details) {
        EnrolledSubject existing = periodSubjectRepository.findEnrolledSubjectByKey(periodId, studentEmail, subjectCode)
            .orElseThrow(() -> new ResourceNotFoundException("A disciplina '" + subjectCode + "' não está matriculada no período '" + periodId + "'."));

        if (details.getStatus() != null && !List.of("cursando", "aprovado", "reprovado").contains(details.getStatus())) {
            throw new IllegalArgumentException("Status inválido. Use 'cursando', 'aprovado' ou 'reprovado'.");
        }

        existing.setStatus(details.getStatus());
        existing.setGrade(details.getGrade());
        existing.setAbsences(details.getAbsences());

        return periodSubjectRepository.updateEnrolledSubject(existing);
    }
}