package br.com.my_universe.api.infrastructure.web.dto.Period;

import java.time.OffsetDateTime;
import java.util.List;

public class PeriodResponse {

    private Integer id;
    private String studentEmail;
    private OffsetDateTime created_at;
    private OffsetDateTime updated_at;
    private List<EnrolledSubjectResponse> subjects;

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getStudentEmail() {
        return studentEmail;
    }
    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
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
    public List<EnrolledSubjectResponse> getSubjects() {
        return subjects;
    }
    public void setSubjects(List<EnrolledSubjectResponse> subjects) {
        this.subjects = subjects;
    }
}