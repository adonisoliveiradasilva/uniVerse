package br.com.my_universe.api.infrastructure.persistence.mappers;

import br.com.my_universe.api.domain.Period;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;

@Component
public class PeriodRowMapper implements RowMapper<Period> {

    @Override
    public Period mapRow(ResultSet rs, int rowNum) throws SQLException {
        Period period = new Period();
        period.setId(rs.getInt("id"));
        period.setStudentEmail(rs.getString("student_email"));
        period.setCreatedAt(rs.getObject("created_at", OffsetDateTime.class));
        period.setUpdatedAt(rs.getObject("updated_at", OffsetDateTime.class));
        return period;
    }
}