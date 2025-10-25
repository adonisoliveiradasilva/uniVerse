package br.com.my_universe.api.application.services;

import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

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
        // Validação proativa para verificar se a instituição já existe
        institutionRepository.findByAcronym(university.getAcronym()).ifPresent(i -> {
            throw new DataIntegrityViolationException("Instituição com a sigla '" + university.getAcronym() + "' já existe.");
        });

        // Aqui poderiam entrar regras de negócio, ex:
        if (university.getAcronym().isEmpty()) {
            throw new IllegalArgumentException("Acronimo não pode ser vazio");
        }
        if (university.getName().isEmpty()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
        return institutionRepository.save(university);
    }

    public Institution updateInstitution(String acronym, Institution institutionDetails) {
        Institution existingInstitution = institutionRepository.findByAcronym(acronym)
            .orElseThrow(() -> new RuntimeException("Instituição com sigla '" + acronym + "' não encontrada."));
            
        // // 2. Validar se a nova sigla (se mudou) já existe
        // if (institutionDetails.getAcronym() != null && !institutionDetails.getAcronym().equals(acronym)) {
        //     institutionRepository.findByAcronym(institutionDetails.getAcronym()).ifPresent(i -> {
        //         throw new ResourceAlreadyExistsException("Instituição com a sigla '" + institutionDetails.getAcronym() + "' já existe.");
        //     });
        // }
        
        existingInstitution.setName(institutionDetails.getName());
        existingInstitution.setAcronym(institutionDetails.getAcronym());
        
        return institutionRepository.update(acronym, existingInstitution);
    }
    
    public Institution getInstitutionByAcronym(String acronym) {
        return institutionRepository.findByAcronym(acronym)
            .orElseThrow(() -> new RuntimeException("Universidade não encontrada"));
    }

    public Institution deleteInstitution(String acronym) {
        return institutionRepository.deleteByAcronym(acronym);
    }


    public List<Institution> getAllInstitutions() {
        return institutionRepository.findAll();
    }
}
