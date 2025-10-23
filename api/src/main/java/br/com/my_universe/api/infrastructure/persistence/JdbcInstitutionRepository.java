package br.com.my_universe.api.infrastructure.persistence;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import br.com.my_universe.api.application.ports.InstitutionRepository;
import br.com.my_universe.api.domain.Institution;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcInstitutionRepository implements InstitutionRepository {
    private final JdbcTemplate jdbcTemplate;

    public JdbcInstitutionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Institution save(Institution institution) {
        String sql = "INSERT INTO tb_institutions (name, acronym) VALUES (?, ?)";
        

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, institution.getName());
            return ps;
        });
        return institution;
    }

    @Override
    public List<Institution> findAll() {
        String sql = "SELECT * FROM tb_institutions";
        return jdbcTemplate.query(sql, new InstitutionRowMapper());
    }

    @Override
    public Optional<Institution> findByAcronym(String acronym) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByAcronym'");
    }

    @Override
    public Institution update(Institution university) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public void deleteByAcronym(String acronym) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteByAcronym'");
    }
}
