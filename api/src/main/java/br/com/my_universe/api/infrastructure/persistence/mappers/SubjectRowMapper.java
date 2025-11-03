package br.com.my_universe.api.infrastructure.persistence.mappers;

import br.com.my_universe.api.domain.Subject;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;

@Component 
public class SubjectRowMapper implements RowMapper<Subject> {

    @Override
    public Subject mapRow(ResultSet rs, int rowNum) throws SQLException {
        Subject subject = new Subject();

        subject.setCode(rs.getString("code"));
        subject.setName(rs.getString("name"));
        subject.setHours(rs.getInt("hours"));
        subject.setDescription(rs.getString("description"));
        subject.setStudentEmail(rs.getString("student_email"));
        
        subject.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
        subject.setUpdatedAt(rs.getObject("updated_at", OffsetDateTime.class));
        
        return subject;
    }
}