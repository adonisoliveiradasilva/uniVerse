package br.com.my_universe.api.application.services;

import br.com.my_universe.api.application.ports.StudentPreferencesRepository;
import br.com.my_universe.api.domain.StudentPreferences;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentPreferencesService {

    private final StudentPreferencesRepository preferencesRepository;

    public StudentPreferencesService(StudentPreferencesRepository preferencesRepository) {
        this.preferencesRepository = preferencesRepository;
    }

    @Transactional
    public StudentPreferences saveTheme(String email, String theme) {
        if (!"light".equals(theme) && !"dark".equals(theme)) {
            throw new IllegalArgumentException("Tema inválido. Use 'light' ou 'dark'.");
        }
        
        StudentPreferences preferences = preferencesRepository.findByEmail(email)
            .orElse(new StudentPreferences());
            
        preferences.setEmail(email);
        preferences.setTheme(theme);
        
        preferencesRepository.save(preferences);
        return preferences;
    }
}