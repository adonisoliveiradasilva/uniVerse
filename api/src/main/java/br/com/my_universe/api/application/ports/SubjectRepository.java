package br.com.my_universe.api.application.ports;

import java.util.List;
import java.util.Optional;

import br.com.my_universe.api.domain.Student;
import br.com.my_universe.api.domain.Subject;

public interface SubjectRepository {
    Subject save(Subject subject);
    Subject update(String originalCode, String studentEmail, Subject subjectDetails);
    Optional<Subject> findByCodeAndStudentEmail(String code, String studentEmail);
    List<Subject> findAllByStudentEmail(String studentEmail);
    List<Subject> findAll();
    void deleteByCodeAndStudentEmail(String code, String studentEmail);
    List<Subject> findAvailableSubjectsByStudentEmail(String studentEmail);
}