package br.com.my_universe.api.infrastructure.persistence.repositorys;

import br.com.my_universe.api.application.ports.PasswordResetRepository;
import br.com.my_universe.api.domain.PasswordResetToken;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public class JdbcPasswordResetRepository implements PasswordResetRepository {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordResetRowMapper rowMapper = new PasswordResetRowMapper();

    public JdbcPasswordResetRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void saveOrUpdate(PasswordResetToken token) {
        String sql = "INSERT INTO tb_password_resets (email, token, expires_at) VALUES (?, ?, ?) " +
                     "ON CONFLICT (email) DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at";
        jdbcTemplate.update(sql, token.getEmail(), token.getToken(), token.getExpiresAt());
    }

    @Override
    public Optional<PasswordResetToken> findByToken(String token) {
        String sql = "SELECT * FROM tb_password_resets WHERE token = ?";
        return jdbcTemplate.query(sql, rowMapper, token).stream().findFirst();
    }

    @Override
    public void deleteByToken(String token) {
        String sql = "DELETE FROM tb_password_resets WHERE token = ?";
        jdbcTemplate.update(sql, token);
    }
    
    private static class PasswordResetRowMapper implements RowMapper<PasswordResetToken> {
        @Override
        public PasswordResetToken mapRow(ResultSet rs, int rowNum) throws SQLException {
            PasswordResetToken token = new PasswordResetToken();
            token.setEmail(rs.getString("email"));
            token.setToken(rs.getString("token"));
            token.setExpiresAt(rs.getObject("expires_at", OffsetDateTime.class));
            return token;
        }
    }
}