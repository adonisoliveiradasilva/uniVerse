package br.com.my_universe.api.domain;

import java.time.OffsetDateTime;

public class Subject {    
    private String code; 
    
    private String name;
    
    private Integer hours; 
    
    private String institutionAcronym; 

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

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

    public String getInstitutionAcronym() {
        return institutionAcronym;
    }
    public void setInstitutionAcronym(String institutionAcronym) {
        this.institutionAcronym = institutionAcronym;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}