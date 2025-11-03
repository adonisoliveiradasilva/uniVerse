package br.com.my_universe.api.infrastructure.web.controller;

import br.com.my_universe.api.application.services.AuthServiceImpl;
import br.com.my_universe.api.infrastructure.web.dto.Auth.PasswordDefine;
import br.com.my_universe.api.infrastructure.web.dto.Auth.PasswordRequest;
import br.com.my_universe.api.infrastructure.web.dto.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthServiceImpl authService;

    public AuthController(AuthServiceImpl authService) {
        this.authService = authService;
    }

    @PostMapping("/request-password")
    public ResponseEntity<ApiResponse<String>> requestPasswordSetup(@RequestBody PasswordRequest request) {
        
        authService.requestPasswordSetup(request.getEmail());
        
        // Retorna 200 OK com uma mensagem genérica (para não vazar se o e-mail existe)
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