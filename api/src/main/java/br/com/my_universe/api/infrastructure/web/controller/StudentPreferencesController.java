package br.com.my_universe.api.infrastructure.web.controller;

import br.com.my_universe.api.application.services.StudentPreferencesService;
import br.com.my_universe.api.domain.StudentPreferences;
import br.com.my_universe.api.infrastructure.web.dto.Preferences.ThemeRequest;
import br.com.my_universe.api.infrastructure.web.dto.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/preferences")
public class StudentPreferencesController {

    private final StudentPreferencesService preferencesService;

    public StudentPreferencesController(StudentPreferencesService preferencesService) {
        this.preferencesService = preferencesService;
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @PutMapping
    public ResponseEntity<ApiResponse<StudentPreferences>> updateTheme(@RequestBody ThemeRequest request) {
        String email = getAuthenticatedUserEmail(); 
        
        StudentPreferences updatedPreferences = preferencesService.saveTheme(email, request.getTheme());
        
        return ResponseEntity.ok(new ApiResponse<>(updatedPreferences));
    }
}