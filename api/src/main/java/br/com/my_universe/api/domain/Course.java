package br.com.my_universe.api.domain;

import java.time.OffsetDateTime;
import java.util.List;

public class Course {
    private String code; 
    private String name;
    private String description;
    private Integer periodsQuantity; 
    private List<String> subjectCodes;
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

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPeriodsQuantity() {
        return periodsQuantity;
    }
    public void setPeriodsQuantity(Integer periodsQuantity) {
        this.periodsQuantity = periodsQuantity;
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

    public List<String> getSubjectCodes() {
        return subjectCodes;
    }
    public void setSubjectCodes(List<String> subjectCodes) {
        this.subjectCodes = subjectCodes;
    }
}
