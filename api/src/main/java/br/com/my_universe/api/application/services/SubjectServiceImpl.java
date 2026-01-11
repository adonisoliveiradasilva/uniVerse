package br.com.my_universe.api.application.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.com.my_universe.api.application.exceptions.ResourceAlreadyExistsException;
import br.com.my_universe.api.application.exceptions.ResourceNotFoundException;
import br.com.my_universe.api.application.ports.SubjectRepository;
import br.com.my_universe.api.application.ports.StudentRepository;
import br.com.my_universe.api.domain.Subject;
import java.util.List;

@Service
public class SubjectServiceImpl {

    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository, StudentRepository studentRepository) {
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public Subject createSubject(Subject subject) {
        if (subject.getCode() == null || subject.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("O código (code) da disciplina não pode ser vazio.");
        }
        if (subject.getName() == null || subject.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome (name) da disciplina não pode ser vazio.");
        }
        if (subject.getStudentEmail() == null || subject.getStudentEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("O e-mail do estudante (studentEmail) não pode ser vazio.");
        }
        if (subject.getHours() == null || subject.getHours() <= 0) {
            throw new IllegalArgumentException("A carga horária (hours) deve ser um número positivo.");
        }

        studentRepository.findByEmail(subject.getStudentEmail())
            .orElseThrow(() -> new ResourceNotFoundException("Aluno com e-mail '" + subject.getStudentEmail() + "' não encontrado. Não é possível criar a disciplina."));

        subjectRepository.findByCodeAndStudentEmail(subject.getCode(), subject.getStudentEmail())
            .ifPresent(s -> {
                throw new ResourceAlreadyExistsException("Disciplina com código '" + subject.getCode() + "' já existe para este aluno.");
            });

        return subjectRepository.save(subject);
    }

    @Transactional
    public Subject updateSubject(String originalCode, String studentEmail, Subject subjectDetails) {
        Subject existingSubject = getSubjectByCodeAndStudentEmail(originalCode, studentEmail);

        boolean uniqueKeyChanged = !existingSubject.getCode().equals(subjectDetails.getCode());

        if (uniqueKeyChanged) {
            subjectRepository.findByCodeAndStudentEmail(subjectDetails.getCode(), studentEmail)
                .ifPresent(s -> {
                    throw new ResourceAlreadyExistsException("Já existe outra disciplina com o código '" + subjectDetails.getCode() + "' para este aluno.");
                });
        }
        
        return subjectRepository.update(originalCode, studentEmail, subjectDetails);
    }
    
    public Subject getSubjectByCodeAndStudentEmail(String code, String studentEmail) {
        return subjectRepository.findByCodeAndStudentEmail(code, studentEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Disciplina com código '" + code + "' não encontrada para este aluno."));
    }

    @Transactional
    public Subject deleteSubject(String code, String studentEmail) {
        Subject subjectToDelete = getSubjectByCodeAndStudentEmail(code, studentEmail);
        subjectRepository.deleteByCodeAndStudentEmail(code, studentEmail);
        return subjectToDelete;
    }

    public List<Subject> getAllSubjectsByStudentEmail(String studentEmail) {
        studentRepository.findByEmail(studentEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Aluno com e-mail '" + studentEmail + "' não encontrado."));
            
        return subjectRepository.findAllByStudentEmail(studentEmail);
    }   

    public List<Subject> getAvailableSubjectsByStudentEmail(String studentEmail) {
        studentRepository.findByEmail(studentEmail)
            .orElseThrow(() -> new ResourceNotFoundException("Aluno com e-mail '" + studentEmail + "' não encontrado."));
        
        return subjectRepository.findAvailableSubjectsByStudentEmail(studentEmail);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }
}