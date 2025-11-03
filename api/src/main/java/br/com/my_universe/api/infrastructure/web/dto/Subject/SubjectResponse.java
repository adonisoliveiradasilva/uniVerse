package br.com.my_universe.api.infrastructure.web.dto.Subject;

import java.time.OffsetDateTime;

public class SubjectResponse {

    private String code;
    private String name;
    private Integer hours;
    private String description;
    private String institutionAcronym;
    private OffsetDateTime created_at;
    private OffsetDateTime updated_at;

    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Integer getHours() {
        return hours;
    }
    public void setHours(Integer hours) {
        this.hours = hours;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstitutionAcronym() {
        return institutionAcronym;
    }
    public void setInstitutionAcronym(String institutionAcronym) {
        this.institutionAcronym = institutionAcronym;
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