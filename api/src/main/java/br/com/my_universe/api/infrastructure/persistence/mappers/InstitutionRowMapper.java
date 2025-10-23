package br.com.my_universe.api.infrastructure.persistence.mappers;

import org.springframework.jdbc.core.RowMapper;

import br.com.my_universe.api.domain.Institution;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;

public class InstitutionRowMapper implements RowMapper<Institution>{
    @Override
    public Institution mapRow(ResultSet rs, int rowNum) throws SQLException {
        Institution institution = new Institution();
        institution.setName(rs.getString("name"));
        institution.setAcronym(rs.getString("acronym"));
        institution.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
        institution.setUpdatedAt(rs.getObject("updated_at", OffsetDateTime.class));
        return institution;
    }
}
