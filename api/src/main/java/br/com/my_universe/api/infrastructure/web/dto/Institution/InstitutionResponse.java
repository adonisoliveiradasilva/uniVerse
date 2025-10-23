package br.com.my_universe.api.infrastructure.web.dto.Institution;

import java.time.OffsetDateTime;

public class InstitutionResponse {
    private String acronym;
    private String name;
    private OffsetDateTime createdAt;

    public String getAcronym() {
        return acronym;
    }
    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
