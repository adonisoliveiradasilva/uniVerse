package br.com.my_universe.api.infrastructure.persistence.repositorys;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import br.com.my_universe.api.application.ports.SubjectRepository;
import br.com.my_universe.api.domain.Subject;
import br.com.my_universe.api.infrastructure.persistence.mappers.SubjectRowMapper;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcSubjectRepository implements SubjectRepository {

    private final JdbcTemplate jdbcTemplate;
    private final SubjectRowMapper subjectRowMapper;

    public JdbcSubjectRepository(JdbcTemplate jdbcTemplate, SubjectRowMapper subjectRowMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.subjectRowMapper = subjectRowMapper;
    }

    @Override
    public Subject save(Subject subject) {
        String sql = "INSERT INTO tb_subjects (code, name, hours, description, student_email) VALUES (?, ?, ?, ?, ?)";
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, subject.getCode());
            ps.setString(2, subject.getName());
            ps.setInt(3, subject.getHours());
            ps.setString(4, subject.getDescription());
            ps.setString(5, subject.getStudentEmail());
            return ps;
        });

        return findByCodeAndStudentEmail(subject.getCode(), subject.getStudentEmail())
            .orElseThrow(() -> new RuntimeException("Falha ao buscar disciplina recém-criada."));
    }

    @Override
    public Subject update(String originalCode, String studentEmail, Subject subjectDetails) {
        String sql = "UPDATE tb_subjects SET code = ?, name = ?, hours = ?, description = ?, student_email = ? " +
                     "WHERE code = ? AND student_email = ?";
        
        int updatedRows = jdbcTemplate.update(sql,
            subjectDetails.getCode(),
            subjectDetails.getName(),
            subjectDetails.getHours(),
            subjectDetails.getDescription(),
            subjectDetails.getStudentEmail(),
            originalCode,
            studentEmail
        );

        if (updatedRows > 0) {
            return subjectDetails;
        }
        throw new RuntimeException("Falha ao atualizar a disciplina.");
    }

    @Override
    public Optional<Subject> findByCodeAndStudentEmail(String code, String studentEmail) {
        String sql = "SELECT * FROM tb_subjects WHERE code = ? AND student_email = ?";
        return jdbcTemplate.query(sql, subjectRowMapper, code, studentEmail).stream().findFirst();
    }

    @Override
    public List<Subject> findAllByStudentEmail(String studentEmail) {
        String sql = "SELECT * FROM tb_subjects WHERE student_email = ? ORDER BY name ASC";
        return jdbcTemplate.query(sql, subjectRowMapper, studentEmail);
    }

    @Override
    public List<Subject> findAll() {
        String sql = "SELECT * FROM tb_subjects ORDER BY name ASC";
        return jdbcTemplate.query(sql, subjectRowMapper);
    }

    @Override
    public void deleteByCodeAndStudentEmail(String code, String studentEmail) {
        String sql = "DELETE FROM tb_subjects WHERE code = ? AND student_email = ?";
        int updatedRows = jdbcTemplate.update(sql, code, studentEmail);
        
        if (updatedRows == 0) {
             throw new RuntimeException("Falha ao deletar. Disciplina não encontrada.");
        }
    }

    @Override
    public List<Subject> findAvailableSubjectsByStudentEmail(String studentEmail) {
        String sql = "SELECT * FROM tb_subjects s " +
                     "WHERE s.student_email = ? " +
                     "AND s.code NOT IN ( " +
                     "    SELECT ps.subject_code " +
                     "    FROM tb_period_subjects ps " +
                     "    WHERE ps.student_email = ? " +
                     "    AND ps.status = 'aprovado' " +
                     ") ORDER BY s.name ASC";

        return jdbcTemplate.query(sql, subjectRowMapper, studentEmail, studentEmail);
    }
}