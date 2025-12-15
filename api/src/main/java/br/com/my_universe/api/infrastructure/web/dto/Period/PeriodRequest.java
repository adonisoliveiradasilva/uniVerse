package br.com.my_universe.api.infrastructure.web.dto.Period;

import java.util.List;

public class PeriodRequest {
    private List<PeriodSubjectDto> subjects;    
    public List<PeriodSubjectDto> getSubjects() { return subjects; }
    public void setSubjects(List<PeriodSubjectDto> subjects) { this.subjects = subjects; }
}