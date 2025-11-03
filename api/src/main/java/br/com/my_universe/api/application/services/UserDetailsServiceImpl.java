package br.com.my_universe.api.application.services;

import br.com.my_universe.api.application.ports.StudentPasswordRepository;
import br.com.my_universe.api.application.ports.StudentRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final StudentRepository studentRepository;
    private final StudentPasswordRepository studentPasswordRepository;

    public UserDetailsServiceImpl(StudentRepository studentRepository, StudentPasswordRepository studentPasswordRepository) {
        this.studentRepository = studentRepository;
        this.studentPasswordRepository = studentPasswordRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        studentRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com e-mail: " + email));
        
        String passwordHash = studentPasswordRepository.findPasswordHashByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Senha não encontrada para o e-mail: " + email));

        return new User(email, passwordHash, Collections.emptyList());
    }
}