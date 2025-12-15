package br.com.my_universe.api.infrastructure.web.dto.Period;

import java.math.BigDecimal;

public class PeriodSubjectDto {
    private String subjectCode;
    private String status;
    private BigDecimal grade;
    private Integer absences;

    public PeriodSubjectDto() {}

    public PeriodSubjectDto(String subjectCode, String status, BigDecimal grade, Integer absences) {
        this.subjectCode = subjectCode;
        this.status = status;
        this.grade = grade;
        this.absences = absences;
    }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getGrade() { return grade; }
    public void setGrade(BigDecimal grade) { this.grade = grade; }
    public Integer getAbsences() { return absences; }
    public void setAbsences(Integer absences) { this.absences = absences; }
}