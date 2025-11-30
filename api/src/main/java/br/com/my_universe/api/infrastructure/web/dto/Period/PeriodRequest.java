package br.com.my_universe.api.infrastructure.web.dto.Period;

import java.util.List;

public class PeriodRequest {
    private List<String> subjectCodes;

    public List<String> getSubjectCodes() {
        return subjectCodes;
    }
    public void setSubjectCodes(List<String> subjectCodes) {
        this.subjectCodes = subjectCodes;
    }
}