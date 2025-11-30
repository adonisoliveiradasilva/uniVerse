package br.com.my_universe.api.application.ports;

import java.util.List;
import java.util.Optional;

import br.com.my_universe.api.domain.EnrolledSubject;

public interface PeriodSubjectRepository {
    void linkSubjectsToPeriod(Integer periodId, String studentEmail, List<String> subjectCodes);
    
    void unlinkAllSubjectsFromPeriod(Integer periodId, String studentEmail);
    
    List<EnrolledSubject> findEnrolledSubjectsByPeriod(Integer periodId, String studentEmail);
    Optional<EnrolledSubject> findEnrolledSubjectByKey(Integer periodId, String studentEmail, String subjectCode);
    EnrolledSubject updateEnrolledSubject(EnrolledSubject enrolledSubject);
}