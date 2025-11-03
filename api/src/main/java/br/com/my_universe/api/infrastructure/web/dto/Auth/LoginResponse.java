package br.com.my_universe.api.infrastructure.web.dto.Auth;

public class LoginResponse {
    private String token;
    private UserData user;

    public LoginResponse(String token, UserData user) {
        this.token = token;
        this.user = user;
    }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public UserData getUser() { return user; }
    public void setUser(UserData user) { this.user = user; }
}