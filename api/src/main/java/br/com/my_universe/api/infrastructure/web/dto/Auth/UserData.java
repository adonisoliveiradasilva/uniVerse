package br.com.my_universe.api.infrastructure.web.dto.Auth;

public class UserData {
    private String email;
    private String name;
    private String theme;
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}