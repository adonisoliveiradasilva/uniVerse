package br.com.my_universe.api.infrastructure.web.dto.Course;

import java.util.List;

public class CourseRequest {
    private String code;
    private String name;
    private Integer periodsQuantity;
    private String description;
    private List<String> subjectsIds;

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
        return periodsQuantity;
    }
    public void setPeriodsQuantity(Integer periodsQuantity) {
        this.periodsQuantity = periodsQuantity;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getSubjectsIds() {
        return subjectsIds;
    }
    public void setSubjectsIds(List<String> subjectsIds) {
        this.subjectsIds = subjectsIds;
    }
}
