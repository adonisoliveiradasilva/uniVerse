package br.com.my_universe.api.infrastructure.persistence.repositorys;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import br.com.my_universe.api.application.ports.CourseRepository;
import br.com.my_universe.api.domain.Course;
import br.com.my_universe.api.infrastructure.persistence.mappers.CourseRowMapper;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Optional;

@Repository
public class JdccCourseRepository implements CourseRepository {

    private final JdbcTemplate jdbcTemplate;
    private final CourseRowMapper courseRowMapper;

    public JdccCourseRepository(JdbcTemplate jdbcTemplate, CourseRowMapper courseRowMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.courseRowMapper = courseRowMapper;
    }

    @Override
    public Course save(Course course) {
        String sql = "INSERT INTO tb_courses (code, name, periods_quantity, description, institution_acronym) VALUES (?, ?, ?, ?, ?)";
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, course.getCode());
            ps.setString(2, course.getName());
            ps.setInt(3, course.getPeriodsQuantity());
            ps.setString(4, course.getDescription());
            ps.setString(5, course.getInstitutionAcronym());
            return ps;
        });

        return findByCodeAndInstitutionAcronym(course.getCode(), course.getInstitutionAcronym())
            .orElseThrow(() -> new RuntimeException("Falha ao buscar curso recém-criado."));
    }

    @Override
    public Course update(String originalCode, String originalAcronym, Course courseDetails) {
        String sql = "UPDATE tb_courses SET code = ?, name = ?, periods_quantity = ?, description = ?, institution_acronym = ? " +
                     "WHERE code = ? AND institution_acronym = ?";
        
        int updatedRows = jdbcTemplate.update(sql,
            courseDetails.getCode(),
            courseDetails.getName(),
            courseDetails.getPeriodsQuantity(),
            courseDetails.getDescription(),
            courseDetails.getInstitutionAcronym(),
            originalCode,
            originalAcronym
        );

        if (updatedRows > 0) {
            return courseDetails;
        }
        throw new RuntimeException("Falha ao atualizar o curso.");
    }

    @Override
    public Optional<Course> findByCodeAndInstitutionAcronym(String code, String institutionAcronym) {
        String sql = "SELECT * FROM tb_courses WHERE code = ? AND institution_acronym = ?";
        return jdbcTemplate.query(sql, courseRowMapper, code, institutionAcronym).stream().findFirst();
    }

    @Override
    public List<Course> findAllByInstitutionAcronym(String institutionAcronym) {
        String sql = "SELECT * FROM tb_courses WHERE institution_acronym = ? ORDER BY name ASC";
        return jdbcTemplate.query(sql, courseRowMapper, institutionAcronym);
    }

    @Override
    public List<Course> findAll() {
        String sql = "SELECT * FROM tb_courses ORDER BY name ASC";
        return jdbcTemplate.query(sql, courseRowMapper);
    }

    @Override
    public void deleteByCodeAndInstitutionAcronym(String code, String institutionAcronym) {
        String sql = "DELETE FROM tb_courses WHERE code = ? AND institution_acronym = ?";
        int updatedRows = jdbcTemplate.update(sql, code, institutionAcronym);
        
        if (updatedRows == 0) {
             throw new RuntimeException("Falha ao deletar. Disciplina não encontrada.");
        }
    }
}