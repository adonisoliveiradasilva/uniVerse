package br.com.my_universe.api.infrastructure.persistence;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import br.com.my_universe.api.application.ports.InstitutionRepository;
import br.com.my_universe.api.domain.Institution;

import java.sql.PreparedStatement;
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
            ps.setString(2, institution.getAcronym());
            return ps;
        });
        return findByAcronym(institution.getAcronym())
                .orElseThrow(() -> new RuntimeException("Falha ao buscar instituição recém-criada com o acrônimo: " + institution.getAcronym()));
    }

    @Override
    public List<Institution> findAll() {
        String sql = "SELECT * FROM tb_institutions ORDER BY name ASC";
        return jdbcTemplate.query(sql, new InstitutionRowMapper());
    }

    @Override
    public Optional<Institution> findByAcronym(String acronym) {
        String sql = "SELECT * FROM tb_institutions WHERE acronym = ?";
        return jdbcTemplate.query(sql, new InstitutionRowMapper(), acronym).stream().findFirst();
    }

    @Override
    public Institution update(String originalAcronym, Institution university) {
        String sql = "UPDATE tb_institutions SET name = ?, acronym = ? WHERE acronym = ?";
        int updatedRows = jdbcTemplate.update(sql,
                university.getName(),
                university.getAcronym(),
                originalAcronym);

        if (updatedRows > 0) {
            return university;
        }
        throw new RuntimeException("Falha ao atualizar a instituição com acrônimo: " + originalAcronym);
    }


    @Override
    public Institution deleteByAcronym(String acronym) {
        Institution institutionToDelete = findByAcronym(acronym)
                .orElseThrow(() -> new RuntimeException("Instituição com acrônimo '" + acronym + "' não encontrada para exclusão."));

        String sql = "DELETE FROM tb_institutions WHERE acronym = ?";
        int updatedRows = jdbcTemplate.update(sql, acronym);
        if (updatedRows > 0) {
            return institutionToDelete;
        }
        throw new RuntimeException("Falha ao deletar a instituição com acrônimo: " + acronym);
    }
}
