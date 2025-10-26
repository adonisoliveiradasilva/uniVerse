package br.com.my_universe.api.infrastructure.persistence.mappers;

import br.com.my_universe.api.domain.Course;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;

@Component 
public class CourseRowMapper implements RowMapper<Course> {

    @Override
    public Course mapRow(ResultSet rs, int rowNum) throws SQLException {
        Course course = new Course();

        course.setCode(rs.getString("code"));
        course.setName(rs.getString("name"));
        course.setPeriodsQuantity(rs.getInt("periods_quantity"));
        course.setDescription(rs.getString("description"));
        course.setInstitutionAcronym(rs.getString("institution_acronym"));
        
        course.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
        course.setUpdatedAt(rs.getObject("updated_at", OffsetDateTime.class));
        
        return course;
    }
}