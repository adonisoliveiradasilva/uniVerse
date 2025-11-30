package br.com.my_universe.api.domain;

import java.math.BigDecimal;

public class EnrolledSubject {

    private Integer periodId;
    private String studentEmail;
    private String subjectCode;

    private String status;
    private BigDecimal grade;
    private Integer absences;

    public Integer getPeriodId() { return periodId; }
    public void setPeriodId(Integer periodId) { this.periodId = periodId; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getGrade() { return grade; }
    public void setGrade(BigDecimal grade) { this.grade = grade; }
    public Integer getAbsences() { return absences; }
    public void setAbsences(Integer absences) { this.absences = absences; }
}