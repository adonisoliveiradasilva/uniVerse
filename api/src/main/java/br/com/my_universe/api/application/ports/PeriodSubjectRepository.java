package br.com.my_universe.api.application.ports;

import br.com.my_universe.api.domain.EnrolledSubject;
import br.com.my_universe.api.infrastructure.web.dto.Period.PeriodSubjectDto; 
import java.util.List;
import java.util.Optional;

public interface PeriodSubjectRepository {
    
    void linkSubjectsToPeriod(Integer periodId, String studentEmail, List<PeriodSubjectDto> subjects);
    
    void unlinkAllSubjectsFromPeriod(Integer periodId, String studentEmail);
    
    List<EnrolledSubject> findEnrolledSubjectsByPeriod(Integer periodId, String studentEmail);

    Optional<EnrolledSubject> findEnrolledSubjectByKey(Integer periodId, String studentEmail, String subjectCode);

    EnrolledSubject updateEnrolledSubject(EnrolledSubject enrolledSubject);

    Optional<Integer> findPeriodIdBySubject(String subjectCode, String studentEmail);
}