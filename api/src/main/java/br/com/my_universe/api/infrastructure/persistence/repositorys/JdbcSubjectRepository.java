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
        String sql = "INSERT INTO tb_subjects (code, name, hours, description, institution_acronym) VALUES (?, ?, ?, ?, ?)";
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql); // Sem chaves de retorno
            ps.setString(1, subject.getCode());
            ps.setString(2, subject.getName());
            ps.setInt(3, subject.getHours());
            ps.setString(4, subject.getDescription());
            ps.setString(5, subject.getInstitutionAcronym());
            return ps;
        });

        return findByCodeAndInstitutionAcronym(subject.getCode(), subject.getInstitutionAcronym())
            .orElseThrow(() -> new RuntimeException("Falha ao buscar disciplina recém-criada."));
    }

    @Override
    public Subject update(String originalCode, String originalAcronym, Subject subjectDetails) {
        String sql = "UPDATE tb_subjects SET code = ?, name = ?, hours = ?, description = ?, institution_acronym = ? " +
                     "WHERE code = ? AND institution_acronym = ?";
        
        int updatedRows = jdbcTemplate.update(sql,
            subjectDetails.getCode(),
            subjectDetails.getName(),
            subjectDetails.getHours(),
            subjectDetails.getDescription(),
            subjectDetails.getInstitutionAcronym(),
            originalCode,
            originalAcronym
        );

        if (updatedRows > 0) {
            return subjectDetails;
        }
        throw new RuntimeException("Falha ao atualizar a disciplina.");
    }

    @Override
    public Optional<Subject> findByCodeAndInstitutionAcronym(String code, String institutionAcronym) {
        String sql = "SELECT * FROM tb_subjects WHERE code = ? AND institution_acronym = ?";
        return jdbcTemplate.query(sql, subjectRowMapper, code, institutionAcronym).stream().findFirst();
    }

    @Override
    public List<Subject> findAllByInstitutionAcronym(String institutionAcronym) {
        String sql = "SELECT * FROM tb_subjects WHERE institution_acronym = ? ORDER BY name ASC";
        return jdbcTemplate.query(sql, subjectRowMapper, institutionAcronym);
    }

    @Override
    public List<Subject> findAll() {
        String sql = "SELECT * FROM tb_subjects ORDER BY name ASC";
        return jdbcTemplate.query(sql, subjectRowMapper);
    }

    @Override
    public void deleteByCodeAndInstitutionAcronym(String code, String institutionAcronym) {
        String sql = "DELETE FROM tb_subjects WHERE code = ? AND institution_acronym = ?";
        int updatedRows = jdbcTemplate.update(sql, code, institutionAcronym);
        
        if (updatedRows == 0) {
             throw new RuntimeException("Falha ao deletar. Disciplina não encontrada.");
        }
    }
}