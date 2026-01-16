package br.com.my_universe.api.infrastructure.persistence.repositorys;

import br.com.my_universe.api.application.ports.PeriodSubjectRepository;
import br.com.my_universe.api.domain.EnrolledSubject;
import br.com.my_universe.api.infrastructure.persistence.mappers.EnrolledSubjectRowMapper;
import br.com.my_universe.api.infrastructure.web.dto.Period.PeriodSubjectDto;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcPeriodSubjectRepository implements PeriodSubjectRepository {

    private final JdbcTemplate jdbcTemplate;
    private final EnrolledSubjectRowMapper enrolledSubjectRowMapper;

    public JdbcPeriodSubjectRepository(JdbcTemplate jdbcTemplate, EnrolledSubjectRowMapper enrolledSubjectRowMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.enrolledSubjectRowMapper = enrolledSubjectRowMapper;
    }

    @Override
    public void linkSubjectsToPeriod(Integer periodId, String studentEmail, List<PeriodSubjectDto> subjects) {
        String sql = "INSERT INTO tb_period_subjects (period_id, student_email, subject_code, status, grade, absences) VALUES (?, ?, ?, ?, ?, ?)";

        jdbcTemplate.batchUpdate(sql, 
            subjects,
            100, 
            (PreparedStatement ps, PeriodSubjectDto subject) -> {
                ps.setInt(1, periodId);
                ps.setString(2, studentEmail);
                ps.setString(3, subject.getSubjectCode());
                
                ps.setString(4, subject.getStatus() != null ? subject.getStatus() : "cursando");
                ps.setObject(5, subject.getGrade());
                ps.setInt(6, subject.getAbsences() != null ? subject.getAbsences() : 0);
            });
    }

    @Override
    public void unlinkAllSubjectsFromPeriod(Integer periodId, String studentEmail) {
        String sql = "DELETE FROM tb_period_subjects WHERE period_id = ? AND student_email = ?";
        jdbcTemplate.update(sql, periodId, studentEmail);
    }

    @Override
    public List<EnrolledSubject> findEnrolledSubjectsByPeriod(Integer periodId, String studentEmail) {
        String sql = "SELECT * FROM tb_period_subjects WHERE period_id = ? AND student_email = ?";
        return jdbcTemplate.query(sql, enrolledSubjectRowMapper, periodId, studentEmail);
    }

    @Override
    public Optional<EnrolledSubject> findEnrolledSubjectByKey(Integer periodId, String studentEmail, String subjectCode) {
        String sql = "SELECT * FROM tb_period_subjects WHERE period_id = ? AND student_email = ? AND subject_code = ?";
        return jdbcTemplate.query(sql, enrolledSubjectRowMapper, periodId, studentEmail, subjectCode).stream().findFirst();
    }

    @Override
    public EnrolledSubject updateEnrolledSubject(EnrolledSubject enrolledSubject) {
        String sql = "UPDATE tb_period_subjects SET status = ?, grade = ?, absences = ? " +
                     "WHERE period_id = ? AND student_email = ? AND subject_code = ?";
        
        int rows = jdbcTemplate.update(sql,
            enrolledSubject.getStatus(),
            enrolledSubject.getGrade(),
            enrolledSubject.getAbsences(),
            enrolledSubject.getPeriodId(),
            enrolledSubject.getStudentEmail(),
            enrolledSubject.getSubjectCode()
        );

        if (rows == 0) {
            throw new RuntimeException("Falha ao atualizar matrícula, registro não encontrado.");
        }
        return enrolledSubject;
    }

    @Override
    public Optional<Integer> findPeriodIdBySubject(String subjectCode, String studentEmail) {
        String sql = """
            SELECT p.id 
            FROM tb_periods p
            JOIN tb_period_subjects ps ON p.id = ps.period_id
            WHERE ps.subject_code = ? 
            AND p.student_email = ?
            LIMIT 1
        """;
        
        try {
            Integer periodId = jdbcTemplate.queryForObject(sql, Integer.class, subjectCode, studentEmail);
            return Optional.ofNullable(periodId);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}