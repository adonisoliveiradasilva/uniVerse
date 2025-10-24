package br.com.my_universe.api.application.ports;

import java.util.List;
import java.util.Optional;

import br.com.my_universe.api.domain.Institution;

public interface InstitutionRepository {
    Institution save(Institution institution);
    Optional<Institution> findByAcronym(String acronym);
    List<Institution> findAll();
    Institution update(String originalAcronym, Institution institution);
    void deleteByAcronym(String acronym);
}
