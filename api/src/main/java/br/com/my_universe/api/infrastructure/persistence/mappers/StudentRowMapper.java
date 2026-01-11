package br.com.my_universe.api.infrastructure.persistence.mappers;

import br.com.my_universe.api.domain.Student;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;

@Component
public class StudentRowMapper implements RowMapper<Student> {

    @Override
    public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
        Student student = new Student();
        student.setEmail(rs.getString("email"));
        student.setName(rs.getString("name"));
        student.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
        student.setUpdatedAt(rs.getObject("updated_at", OffsetDateTime.class));
        return student;
    }
}