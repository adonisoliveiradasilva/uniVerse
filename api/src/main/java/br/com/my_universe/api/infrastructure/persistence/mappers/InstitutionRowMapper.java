package br.com.my_universe.api.infrastructure.persistence.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import br.com.my_universe.api.domain.Institution;
import org.springframework.jdbc.core.RowMapper;

public class InstitutionRowMapper implements RowMapper<Institution>{

    @Override
    public Institution mapRow(ResultSet rs, int rowNum) throws SQLException {
        Institution university = new Institution();
        university.setName(rs.getString("name"));
        university.setAcronym(rs.getString("acronym"));
        university.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
        university.setUpdatedAt(rs.getObject("updated_at", OffsetDateTime.class));
        return university;
    }
}
