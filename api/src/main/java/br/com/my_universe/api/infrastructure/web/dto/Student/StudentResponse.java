package br.com.my_universe.api.infrastructure.web.dto.Student;

import java.time.OffsetDateTime;

public class StudentResponse {

    private String email;
    private String name;
    private OffsetDateTime created_at;
    private OffsetDateTime updated_at;
    
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public OffsetDateTime getCreatedAt() {
        return created_at;
    }
    public void setCreatedAt(OffsetDateTime created_at) {
        this.created_at = created_at;
    }
    public OffsetDateTime getUpdatedAt() {
        return updated_at;
    }
    public void setUpdatedAt(OffsetDateTime updated_at) {
        this.updated_at = updated_at;
    }
}