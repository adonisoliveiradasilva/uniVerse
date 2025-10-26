package br.com.my_universe.api.application.ports;

import java.util.List;
import java.util.Optional;
import br.com.my_universe.api.domain.Subject;

public interface SubjectRepository {
    Subject save(Subject subject);
    Subject update(String originalCode, String originalAcronym, Subject subjectDetails);
    Optional<Subject> findByCodeAndInstitutionAcronym(String code, String institutionAcronym);
    List<Subject> findAllByInstitutionAcronym(String institutionAcronym);
    List<Subject> findAll();
    void deleteByCodeAndInstitutionAcronym(String code, String institutionAcronym);
}