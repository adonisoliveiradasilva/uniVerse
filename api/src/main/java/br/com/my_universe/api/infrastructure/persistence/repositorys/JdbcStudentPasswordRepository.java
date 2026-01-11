package br.com.my_universe.api.infrastructure.persistence.repositorys;

import br.com.my_universe.api.application.ports.StudentPasswordRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public class JdbcStudentPasswordRepository implements StudentPasswordRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcStudentPasswordRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void saveOrUpdate(String email, String passwordHash) {
        String sql = "INSERT INTO tb_student_passwords (email, password_hash) VALUES (?, ?) " +
                     "ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = CURRENT_TIMESTAMP";
        
        jdbcTemplate.update(sql, email, passwordHash);
    }

    @Override
    public Optional<String> findPasswordHashByEmail(String email) {
        String sql = "SELECT password_hash FROM tb_student_passwords WHERE email = ?";
        
        try {
            String hash = jdbcTemplate.queryForObject(sql, String.class, email);
            return Optional.ofNullable(hash);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}