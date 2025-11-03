package br.com.my_universe.api.application.ports;
import java.util.Optional;

public interface StudentPasswordRepository {
    void saveOrUpdate(String email, String passwordHash);

    Optional<String> findPasswordHashByEmail(String email);
}