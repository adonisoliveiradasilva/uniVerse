package br.com.my_universe.api.infrastructure.web.dto.Institution;

public class InstitutionRequest {
    private String name;
    private String acronym;

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getAcronym() {
        return acronym;
    }
    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }
}
