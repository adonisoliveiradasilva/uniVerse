package br.com.my_universe.api.infrastructure.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.my_universe.api.application.services.SubjectServiceImpl;
import br.com.my_universe.api.domain.Subject;
import br.com.my_universe.api.infrastructure.web.dto.Subject.SubjectRequest;
import br.com.my_universe.api.infrastructure.web.dto.Subject.SubjectResponse;
import br.com.my_universe.api.infrastructure.web.dto.shared.ApiResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectServiceImpl subjectService;

    public SubjectController(SubjectServiceImpl subjectService) {
        this.subjectService = subjectService;
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado.");
        }
        return authentication.getName();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> createSubject(@RequestBody SubjectRequest request) {
        String userEmail = getAuthenticatedUserEmail();

        Subject subject = new Subject();
        subject.setCode(request.getCode());
        subject.setName(request.getName());
        subject.setHours(request.getHours());
        subject.setDescription(request.getDescription());
        subject.setStudentEmail(userEmail);
        
        Subject createdSubject = subjectService.createSubject(subject); 
        SubjectResponse dto = toResponse(createdSubject);
        ApiResponse<SubjectResponse> response = new ApiResponse<>(dto);

        return ResponseEntity.created(URI.create(
            String.format("/api/subjects/%s", dto.getCode())
        )).body(response);
    }

    @PutMapping("/{code}")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(
            @PathVariable String code, 
            @RequestBody SubjectRequest request) {
        
        String userEmail = getAuthenticatedUserEmail();

        Subject subjectDetails = new Subject();
        subjectDetails.setCode(request.getCode());
        subjectDetails.setName(request.getName());
        subjectDetails.setHours(request.getHours());
        subjectDetails.setDescription(request.getDescription());
        subjectDetails.setStudentEmail(userEmail);
        
        Subject updatedSubject = subjectService.updateSubject(code, userEmail, subjectDetails);

        SubjectResponse dto = toResponse(updatedSubject);
        ApiResponse<SubjectResponse> response = new ApiResponse<>(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectByKey(@PathVariable String code) {
        String userEmail = getAuthenticatedUserEmail();
        Subject subject = subjectService.getSubjectByCodeAndStudentEmail(code, userEmail);
        return ResponseEntity.ok(new ApiResponse<>(toResponse(subject)));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjects() {
        String userEmail = getAuthenticatedUserEmail();
        List<Subject> subjects = subjectService.getAllSubjectsByStudentEmail(userEmail);
        
        List<SubjectResponse> dtoList = subjects.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(dtoList));
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<ApiResponse<SubjectResponse>> deleteSubject(@PathVariable String code) {
        String userEmail = getAuthenticatedUserEmail();
        Subject deletedSubject = subjectService.deleteSubject(code, userEmail);
        return ResponseEntity.ok(new ApiResponse<>(toResponse(deletedSubject)));
    }

    private SubjectResponse toResponse(Subject subject) {
        SubjectResponse res = new SubjectResponse();
        res.setCode(subject.getCode());
        res.setName(subject.getName());
        res.setHours(subject.getHours());
        res.setDescription(subject.getDescription());
        res.setStudentEmail(subject.getStudentEmail());
        res.setCreatedAt(subject.getCreatedAt());
        res.setUpdatedAt(subject.getUpdatedAt());
        return res;
    }
}