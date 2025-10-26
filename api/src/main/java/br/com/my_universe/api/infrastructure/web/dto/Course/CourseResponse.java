package br.com.my_universe.api.infrastructure.web.dto.Course;

import java.time.OffsetDateTime;

public class CourseResponse {

    private String code;
    private String name;
    private Integer periods_quantity;
    private String description;
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

    public Integer getPeriodsQuantity() {
        return periods_quantity;
    }
    public void setPeriodsQuantity(Integer periods_quantity) {
        this.periods_quantity = periods_quantity;
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
