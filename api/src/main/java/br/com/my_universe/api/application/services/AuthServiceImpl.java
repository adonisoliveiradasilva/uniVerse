package br.com.my_universe.api.application.services;

import br.com.my_universe.api.application.exceptions.ResourceNotFoundException;
import br.com.my_universe.api.application.ports.*;
import br.com.my_universe.api.domain.PasswordResetToken;
import br.com.my_universe.api.domain.Student;
import br.com.my_universe.api.domain.StudentPreferences;
import br.com.my_universe.api.infrastructure.web.dto.Auth.LoginResponse;
import br.com.my_universe.api.infrastructure.web.dto.Auth.UserData;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final StudentPreferencesRepository studentPreferencesRepository;
    private final EmailServiceImpl emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthServiceImpl(StudentRepository studentRepository,
                           StudentPasswordRepository studentPasswordRepository,
                           PasswordResetRepository passwordResetRepository,
                           StudentPreferencesRepository studentPreferencesRepository,
                           EmailServiceImpl emailService,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtService jwtService,
                           UserDetailsServiceImpl userDetailsService) {
        this.studentRepository = studentRepository;
        this.studentPasswordRepository = studentPasswordRepository;
        this.passwordResetRepository = passwordResetRepository;
        this.studentPreferencesRepository = studentPreferencesRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    public LoginResponse login(String email, String password) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (AuthenticationException e) {
            throw new ResourceNotFoundException("E-mail ou senha inválidos.");
        }

        Student student = studentRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("E-mail ou senha inválidos."));
            
        StudentPreferences prefs = studentPreferencesRepository.findByEmail(email)
            .orElse(new StudentPreferences()); // Retorna default se não achar

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        
        String token = jwtService.generateToken(userDetails);

        UserData userData = new UserData();
        userData.setEmail(student.getEmail());
        userData.setName(student.getName());
        userData.setTheme(prefs.getTheme() != null ? prefs.getTheme() : "light");

        return new LoginResponse(token, userData);
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