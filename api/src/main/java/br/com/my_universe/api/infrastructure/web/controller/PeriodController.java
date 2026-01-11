package br.com.my_universe.api.infrastructure.web.controller;

import br.com.my_universe.api.application.services.PeriodServiceImpl;
import br.com.my_universe.api.domain.EnrolledSubject;
import br.com.my_universe.api.domain.Period;
import br.com.my_universe.api.infrastructure.web.dto.Period.EnrolledSubjectRequest;
import br.com.my_universe.api.infrastructure.web.dto.Period.EnrolledSubjectResponse;
import br.com.my_universe.api.infrastructure.web.dto.Period.PeriodRequest;
import br.com.my_universe.api.infrastructure.web.dto.Period.PeriodResponse;
import br.com.my_universe.api.infrastructure.web.dto.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/periods")
public class PeriodController {

    private final PeriodServiceImpl periodService;

    public PeriodController(PeriodServiceImpl periodService) {
        this.periodService = periodService;
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @GetMapping("/stats/global-average")
    public ResponseEntity<Double> getGlobalAverage() {
        String email = getAuthenticatedUserEmail();
        Double average = periodService.getStudentGlobalAverage(email);
        return ResponseEntity.ok(average);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PeriodResponse>> createPeriod(@RequestBody PeriodRequest request) {
        String email = getAuthenticatedUserEmail();
        Period period = new Period();
        period.setStudentEmail(email);
        
        Period createdPeriod = periodService.createPeriod(period, request.getSubjects());
        
        return ResponseEntity.created(URI.create("/api/periods/" + createdPeriod.getId()))
                             .body(new ApiResponse<>(toResponse(createdPeriod)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PeriodResponse>> updatePeriod(@PathVariable Integer id,
                                                                    @RequestBody PeriodRequest request) {
        String email = getAuthenticatedUserEmail();
        Period updatedPeriod = periodService.updatePeriod(id, email, request.getSubjects());
        return ResponseEntity.ok(new ApiResponse<>(toResponse(updatedPeriod)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PeriodResponse>> getPeriod(@PathVariable Integer id) {
        String email = getAuthenticatedUserEmail();
        Period period = periodService.getPeriodById(id, email);
        return ResponseEntity.ok(new ApiResponse<>(toResponse(period)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PeriodResponse>>> getAllPeriods() {
        String email = getAuthenticatedUserEmail();
        List<Period> periods = periodService.getAllPeriodsByStudentEmail(email);
        List<PeriodResponse> dtos = periods.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(dtos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePeriod(@PathVariable Integer id) {
        String email = getAuthenticatedUserEmail();
        periodService.deletePeriod(id, email);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/subjects/{subjectCode}")
    public ResponseEntity<ApiResponse<EnrolledSubjectResponse>> updateSubjectDetails(
            @PathVariable Integer id,
            @PathVariable String subjectCode,
            @RequestBody EnrolledSubjectRequest request) {
        
        String email = getAuthenticatedUserEmail();
        
        EnrolledSubject details = new EnrolledSubject();
        details.setStatus(request.getStatus());
        details.setGrade(request.getGrade());
        details.setAbsences(request.getAbsences());

        EnrolledSubject updated = periodService.updateEnrolledSubjectDetails(id, email, subjectCode, details);
        
        return ResponseEntity.ok(new ApiResponse<>(toEnrolledSubjectResponse(updated)));
    }

    private PeriodResponse toResponse(Period period) {
        PeriodResponse res = new PeriodResponse();
        res.setId(period.getId());
        res.setStudentEmail(period.getStudentEmail());
        res.setCreatedAt(period.getCreatedAt());
        res.setUpdatedAt(period.getUpdatedAt());
        
        if (period.getEnrolledSubjects() != null) {
            res.setSubjects(
                period.getEnrolledSubjects().stream()
                    .map(this::toEnrolledSubjectResponse)
                    .collect(Collectors.toList())
            );
        }
        return res;
    }

    private EnrolledSubjectResponse toEnrolledSubjectResponse(EnrolledSubject enrolled) {
        EnrolledSubjectResponse res = new EnrolledSubjectResponse();
        res.setSubjectCode(enrolled.getSubjectCode());
        res.setStatus(enrolled.getStatus());
        res.setGrade(enrolled.getGrade());
        res.setAbsences(enrolled.getAbsences());
        return res;
    }
}