package br.com.my_universe.api.infrastructure.persistence.mappers;

import br.com.my_universe.api.domain.StudentPreferences;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class StudentPreferencesRowMapper implements RowMapper<StudentPreferences> {
    @Override
    public StudentPreferences mapRow(ResultSet rs, int rowNum) throws SQLException {
        StudentPreferences prefs = new StudentPreferences();
        prefs.setEmail(rs.getString("email"));
        prefs.setTheme(rs.getString("theme"));
        return prefs;
    }
}