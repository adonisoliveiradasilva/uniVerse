package br.com.my_universe.api.domain;

import java.time.OffsetDateTime;

public class PasswordResetToken {
    private String email;
    private String token;
    private OffsetDateTime expiresAt;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(OffsetDateTime expiresAt) { this.expiresAt = expiresAt; }
}
