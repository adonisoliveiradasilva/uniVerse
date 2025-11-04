package br.com.my_universe.api.infrastructure.web.controller;

import br.com.my_universe.api.application.services.AuthServiceImpl;
import br.com.my_universe.api.infrastructure.web.dto.Auth.*;
import br.com.my_universe.api.infrastructure.web.dto.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthServiceImpl authService;

    public AuthController(AuthServiceImpl authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new ApiResponse<>(loginResponse));
    }
    
    @PostMapping("/request-password")
    public ResponseEntity<ApiResponse<String>> requestPasswordSetup(@RequestBody PasswordRequest request) {
        authService.requestPasswordSetup(request.getEmail());
        String message = "Se o e-mail estiver cadastrado, um link será enviado.";
        return ResponseEntity.ok(new ApiResponse<>(message));
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<ApiResponse<String>> requestPasswordReset(@RequestBody PasswordRequest request) {
        authService.requestPasswordSetup(request.getEmail()); 
        String message = "Se o e-mail estiver cadastrado, um link será enviado.";
        return ResponseEntity.ok(new ApiResponse<>(message));
    }

    @PostMapping("/set-password")
    public ResponseEntity<ApiResponse<String>> definePassword(@RequestBody PasswordDefine request) {
        authService.definePassword(request.getToken(), request.getNewPassword());
        String message = "Senha definida com sucesso!";
        return ResponseEntity.ok(new ApiResponse<>(message));
    }
}