package br.com.my_universe.api.application.services;

import br.com.my_universe.api.application.exceptions.ResourceNotFoundException;
import br.com.my_universe.api.application.ports.PasswordResetRepository;
import br.com.my_universe.api.application.ports.StudentPasswordRepository;
import br.com.my_universe.api.application.ports.StudentRepository;
import br.com.my_universe.api.domain.PasswordResetToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl {

    private final StudentRepository studentRepository;
    private final StudentPasswordRepository studentPasswordRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final EmailServiceImpl emailService;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(StudentRepository studentRepository,
                           StudentPasswordRepository studentPasswordRepository,
                           PasswordResetRepository passwordResetRepository,
                           EmailServiceImpl emailService,
                           PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.studentPasswordRepository = studentPasswordRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void requestPasswordSetup(String email) {
        studentRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Estudante com e-mail '" + email + "' não encontrado."));
        
        String token = UUID.randomUUID().toString();
        
        OffsetDateTime expiresAt = OffsetDateTime.now().plusMinutes(15);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(email);
        resetToken.setToken(token);
        resetToken.setExpiresAt(expiresAt);
        passwordResetRepository.saveOrUpdate(resetToken);

        emailService.sendPasswordSetupEmail(email, token);
    }

    @Transactional
    public void definePassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetRepository.findByToken(token)
            .orElseThrow(() -> new ResourceNotFoundException("Token inválido ou não encontrado."));

        if (resetToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
            passwordResetRepository.deleteByToken(token);
            throw new IllegalArgumentException("Token expirado. Por favor, solicite um novo link.");
        }
        
        if (newPassword == null || newPassword.length() < 8) {
            throw new IllegalArgumentException("A senha deve ter pelo menos 8 caracteres.");
        }
        
        String email = resetToken.getEmail();
        
        String passwordHash = passwordEncoder.encode(newPassword);
        
        studentPasswordRepository.saveOrUpdate(email, passwordHash);
        
        passwordResetRepository.deleteByToken(token);
    }
}