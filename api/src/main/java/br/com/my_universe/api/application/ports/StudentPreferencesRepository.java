package br.com.my_universe.api.application.ports;

import br.com.my_universe.api.domain.StudentPreferences;
import java.util.Optional;

public interface StudentPreferencesRepository {
    Optional<StudentPreferences> findByEmail(String email);
    void save(StudentPreferences preferences);
}