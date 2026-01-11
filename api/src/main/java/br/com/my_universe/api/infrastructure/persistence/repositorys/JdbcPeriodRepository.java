package br.com.my_universe.api.infrastructure.persistence.repositorys;

import br.com.my_universe.api.application.ports.PeriodRepository;
import br.com.my_universe.api.domain.Period;
import br.com.my_universe.api.infrastructure.persistence.mappers.PeriodRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcPeriodRepository implements PeriodRepository {

    private final JdbcTemplate jdbcTemplate;
    private final PeriodRowMapper rowMapper;

    public JdbcPeriodRepository(JdbcTemplate jdbcTemplate, PeriodRowMapper rowMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.rowMapper = rowMapper;
    }

    @Override
    public Period save(Period period) {
        String sql = "INSERT INTO tb_periods (student_email) VALUES (?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[] {"id"});
            ps.setString(1, period.getStudentEmail());
            return ps;
        }, keyHolder);

        if (keyHolder.getKeys() != null && keyHolder.getKey() != null) {
            period.setId(keyHolder.getKeyAs(Integer.class));
        } else {
            throw new RuntimeException("Falha ao criar período, não foi possível obter o ID.");
        }
        
        return findById(period.getId(), period.getStudentEmail())
            .orElseThrow(() -> new RuntimeException("Falha ao buscar período recém-criado."));
    }

    @Override
    public Period update(Period period) {
        return period;
    }

    @Override
    public void deleteById(Integer id, String studentEmail) {
        String sql = "DELETE FROM tb_periods WHERE id = ? AND student_email = ?";
        int rows = jdbcTemplate.update(sql, id, studentEmail);
        if (rows == 0) {
            throw new RuntimeException("Falha ao deletar. Período não encontrado ou não pertence ao usuário.");
        }
    }

    @Override
    public Optional<Period> findById(Integer id, String studentEmail) {
        String sql = "SELECT * FROM tb_periods WHERE id = ? AND student_email = ?";
        return jdbcTemplate.query(sql, rowMapper, id, studentEmail).stream().findFirst();
    }

    @Override
    public List<Period> findAllByStudentEmail(String studentEmail) {
        String sql = "SELECT * FROM tb_periods WHERE student_email = ? ORDER BY created_at ASC";
        return jdbcTemplate.query(sql, rowMapper, studentEmail);
    }

    @Override
    public Double getGlobalAverageIndex(String studentEmail) {
        String sql = """
            SELECT COALESCE(AVG(es.grade), 0) 
            FROM tb_period_subjects es
            JOIN tb_periods p ON es.period_id = p.id
            WHERE p.student_email = ? 
            AND es.status IN ('aprovado', 'reprovado', 'concluido')
        """;
        
        return jdbcTemplate.queryForObject(sql, Double.class, studentEmail);
    }
}