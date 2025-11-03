package br.com.my_universe.api.application.ports;

import br.com.my_universe.api.domain.PasswordResetToken;
import java.util.Optional;

public interface PasswordResetRepository {
    void saveOrUpdate(PasswordResetToken token);
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByToken(String token);
}