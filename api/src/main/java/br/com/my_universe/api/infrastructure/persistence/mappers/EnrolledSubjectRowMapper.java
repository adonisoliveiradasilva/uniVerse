package br.com.my_universe.api.infrastructure.persistence.mappers;

import br.com.my_universe.api.domain.EnrolledSubject;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class EnrolledSubjectRowMapper implements RowMapper<EnrolledSubject> {

    @Override
    public EnrolledSubject mapRow(ResultSet rs, int rowNum) throws SQLException {
        EnrolledSubject enrolled = new EnrolledSubject();
        enrolled.setPeriodId(rs.getInt("period_id"));
        enrolled.setStudentEmail(rs.getString("student_email"));
        enrolled.setSubjectCode(rs.getString("subject_code"));
        enrolled.setStatus(rs.getString("status"));
        enrolled.setGrade(rs.getBigDecimal("grade"));
        enrolled.setAbsences(rs.getInt("absences"));
        return enrolled;
    }
}