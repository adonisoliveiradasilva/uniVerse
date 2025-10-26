package br.com.my_universe.api.application.services;

import org.springframework.stereotype.Service;
import br.com.my_universe.api.application.exceptions.ResourceAlreadyExistsException;
import br.com.my_universe.api.application.exceptions.ResourceNotFoundException;
import br.com.my_universe.api.application.ports.SubjectRepository;
import br.com.my_universe.api.application.ports.InstitutionRepository;
import br.com.my_universe.api.domain.Subject;
import java.util.List;

@Service
public class SubjectServiceImpl {

    private final SubjectRepository subjectRepository;
    private final InstitutionRepository institutionRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository, InstitutionRepository institutionRepository) {
        this.subjectRepository = subjectRepository;
        this.institutionRepository = institutionRepository;
    }

    public Subject createSubject(Subject subject) {
        if (subject.getCode() == null || subject.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("O código (code) da disciplina não pode ser vazio.");
        }

        if (subject.getName() == null || subject.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome (name) da disciplina não pode ser vazio.");
        }

        if (subject.getInstitutionAcronym() == null || subject.getInstitutionAcronym().trim().isEmpty()) {
            throw new IllegalArgumentException("A sigla da instituição (institutionAcronym) não pode ser vazia.");
        }

        if (subject.getHours() == null || subject.getHours() <= 0) {
            throw new IllegalArgumentException("A carga horária (hours) deve ser um número positivo.");
        }

        institutionRepository.findByAcronym(subject.getInstitutionAcronym())
            .orElseThrow(() -> new ResourceNotFoundException("Instituição com sigla '" + subject.getInstitutionAcronym() + "' não encontrada. Não é possível criar a disciplina."));

        subjectRepository.findByCodeAndInstitutionAcronym(subject.getCode(), subject.getInstitutionAcronym())
            .ifPresent(s -> {
                throw new ResourceAlreadyExistsException("Disciplina com código '" + subject.getCode() + "' já existe para a instituição '" + subject.getInstitutionAcronym() + "'.");
            });

        institutionRepository.findByAcronym(subject.getInstitutionAcronym())
            .orElseThrow(() -> new ResourceNotFoundException("Instituição com sigla '" + subject.getInstitutionAcronym() + "' não encontrada."));

        subjectRepository.findByCodeAndInstitutionAcronym(subject.getCode(), subject.getInstitutionAcronym())
            .ifPresent(s -> {
                throw new ResourceAlreadyExistsException("Disciplina com código '" + subject.getCode() + "' já existe para a instituição '" + subject.getInstitutionAcronym() + "'.");
            });

        return subjectRepository.save(subject);
    }

    public Subject updateSubject(String originalCode, String originalAcronym, Subject subjectDetails) {
        Subject existingSubject = getSubjectByCodeAndAcronym(originalCode, originalAcronym);

        boolean uniqueKeyChanged = !existingSubject.getCode().equals(subjectDetails.getCode()) || 
                                   !existingSubject.getInstitutionAcronym().equals(subjectDetails.getInstitutionAcronym());

        if (uniqueKeyChanged) {
            subjectRepository.findByCodeAndInstitutionAcronym(subjectDetails.getCode(), subjectDetails.getInstitutionAcronym())
                .ifPresent(s -> {
                    throw new ResourceAlreadyExistsException("Já existe outra disciplina com o código '" + subjectDetails.getCode() + "' para a instituição '" + subjectDetails.getInstitutionAcronym() + "'.");
                });
        }
        
        return subjectRepository.update(originalCode, originalAcronym, subjectDetails);
    }
    
    public Subject getSubjectByCodeAndAcronym(String code, String acronym) {
        return subjectRepository.findByCodeAndInstitutionAcronym(code, acronym)
            .orElseThrow(() -> new ResourceNotFoundException("Disciplina com código '" + code + "' e instituição '" + acronym + "' não encontrada."));
    }

    public Subject deleteSubject(String code, String acronym) {
        Subject subjectToDelete = getSubjectByCodeAndAcronym(code, acronym);
        subjectRepository.deleteByCodeAndInstitutionAcronym(code, acronym);
        return subjectToDelete;
    }

    public List<Subject> getAllSubjectsByInstitution(String institutionAcronym) {
        return subjectRepository.findAllByInstitutionAcronym(institutionAcronym);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }
}