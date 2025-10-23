package br.com.my_universe.api.infrastructure.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.my_universe.api.application.services.InstitutionServiceImpl;
import br.com.my_universe.api.domain.Institution;
import br.com.my_universe.api.infrastructure.web.dto.Institution.InstitutionRequest;
import br.com.my_universe.api.infrastructure.web.dto.Institution.InstitutionResponse;
import br.com.my_universe.api.infrastructure.web.dto.shared.ApiResponse;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/institutions")
public class InstitutionController {
private final InstitutionServiceImpl institutionService;

    public InstitutionController(InstitutionServiceImpl institutionService) {
        this.institutionService = institutionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InstitutionResponse>> createInstitution(@RequestBody InstitutionRequest request) {

        Institution institution = new Institution();
        institution.setName(request.getName());
        institution.setAcronym(request.getAcronym());
        


        Institution createdInstitution = institutionService.createInstitution(institution);
        InstitutionResponse dto = toResponse(createdInstitution);
        
        ApiResponse<InstitutionResponse> response = new ApiResponse<>(dto);

        return ResponseEntity.created(URI.create("/api/institutions/" + dto.getAcronym())).body(response);
    }

    @GetMapping("/{acronym}")
    public ResponseEntity<ApiResponse<InstitutionResponse>> getInstitutionByAcronym(@PathVariable String acronym) {
        Institution institution = institutionService.getInstitutionByAcronym(acronym);
        return ResponseEntity.ok(new ApiResponse<>(toResponse(institution)));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<InstitutionResponse>>> getAllInstitutions() {
        List<Institution> institutions = institutionService.getAllInstitutions();
        List<InstitutionResponse> dtoList = institutions.stream()
                                            .map(this::toResponse)
                                            .collect(Collectors.toList());

        ApiResponse<List<InstitutionResponse>> response = new ApiResponse<>(dtoList);
        return ResponseEntity.ok(response);
    }
    
    private InstitutionResponse toResponse(Institution institution) {
        InstitutionResponse res = new InstitutionResponse();
        res.setName(institution.getName());
        res.setAcronym(institution.getAcronym());
        res.setCreatedAt(institution.getCreatedAt());
        return res;
    }
}
