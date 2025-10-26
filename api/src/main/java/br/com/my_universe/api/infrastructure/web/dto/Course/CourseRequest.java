package br.com.my_universe.api.infrastructure.web.dto.Course;

public class CourseRequest {
    private String code;
    private String name;
    private Integer periods_quantity;
    private String description;

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

}
