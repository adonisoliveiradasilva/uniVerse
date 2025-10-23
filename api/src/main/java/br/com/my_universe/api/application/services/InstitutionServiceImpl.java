package br.com.my_universe.api.application.services;

import org.springframework.stereotype.Service;

import br.com.my_universe.api.application.ports.InstitutionRepository;
import br.com.my_universe.api.domain.Institution;

import java.util.List;

@Service
public class InstitutionServiceImpl {
    private final InstitutionRepository institutionRepository;

    public InstitutionServiceImpl(InstitutionRepository institutionRepository) {
        this.institutionRepository = institutionRepository;
    }

    public Institution createInstitution(Institution university) {
        // Aqui poderiam entrar regras de negócio, ex:
        if (university.getAcronym().isEmpty()) {
            throw new IllegalArgumentException("Acronimo não pode ser vazio");
        }
        if (university.getName().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        return institutionRepository.save(university);
    }
    
    public Institution getInstitutionByAcronym(String acronym) {
        return institutionRepository.findByAcronym(acronym)
            .orElseThrow(() -> new RuntimeException("Universidade não encontrada"));
    }

    public List<Institution> getAllInstitutions() {
        return institutionRepository.findAll();
    }
}
