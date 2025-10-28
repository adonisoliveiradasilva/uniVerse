package br.com.my_universe.api.infrastructure.persistence.repositorys;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import br.com.my_universe.api.application.ports.CourseSubjectRepository;

import java.sql.PreparedStatement;
import java.util.List;

@Repository
public class JdbcCourseSubjectRepository implements CourseSubjectRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcCourseSubjectRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void linkSubjectsToCourse(String institutionAcronym, String courseCode, List<String> subjectCodes) {
        String sql = "INSERT INTO tb_course_subjects (institution_acronym, course_code, subject_code) VALUES (?, ?, ?)";

        jdbcTemplate.batchUpdate(sql, 
            subjectCodes,
            100,
            (PreparedStatement ps, String subjectCode) -> {
                ps.setString(1, institutionAcronym);
                ps.setString(2, courseCode);
                ps.setString(3, subjectCode);
            });
    }

    @Override
    public void unlinkAllSubjectsFromCourse(String institutionAcronym, String courseCode) {
        String sql = "DELETE FROM tb_course_subjects WHERE institution_acronym = ? AND course_code = ?";
        jdbcTemplate.update(sql, institutionAcronym, courseCode);
    }

    @Override
    public List<String> findSubjectCodesByCourse(String institutionAcronym, String courseCode) {
        String sql = "SELECT subject_code FROM tb_course_subjects WHERE institution_acronym = ? AND course_code = ?";
        
        return jdbcTemplate.query(sql, 
            (rs, rowNum) -> rs.getString("subject_code"), 
            institutionAcronym, courseCode
        );
    }
}