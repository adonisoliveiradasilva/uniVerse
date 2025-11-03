package br.com.my_universe.api.infrastructure.persistence.repositorys;

import br.com.my_universe.api.application.ports.StudentPreferencesRepository;
import br.com.my_universe.api.domain.StudentPreferences;
import br.com.my_universe.api.infrastructure.persistence.mappers.StudentPreferencesRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public class JdbcStudentPreferencesRepository implements StudentPreferencesRepository {

    private final JdbcTemplate jdbcTemplate;
    private final StudentPreferencesRowMapper rowMapper;

    public JdbcStudentPreferencesRepository(JdbcTemplate jdbcTemplate, StudentPreferencesRowMapper rowMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.rowMapper = rowMapper;
    }

    @Override
    public Optional<StudentPreferences> findByEmail(String email) {
        String sql = "SELECT * FROM tb_student_preferences WHERE email = ?";
        return jdbcTemplate.query(sql, rowMapper, email).stream().findFirst();
    }

    @Override
    public void save(StudentPreferences preferences) {
        String sql = "INSERT INTO tb_student_preferences (email, theme) VALUES (?, ?) " +
                     "ON CONFLICT (email) DO UPDATE SET theme = EXCLUDED.theme";
        jdbcTemplate.update(sql, preferences.getEmail(), preferences.getTheme());
    }
}