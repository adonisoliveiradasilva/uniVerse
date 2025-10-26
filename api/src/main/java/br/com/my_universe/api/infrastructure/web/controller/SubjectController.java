package br.com.my_universe.api.infrastructure.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.my_universe.api.application.services.SubjectServiceImpl;
import br.com.my_universe.api.domain.Subject;
import br.com.my_universe.api.infrastructure.web.dto.Subject.SubjectRequest;
import br.com.my_universe.api.infrastructure.web.dto.Subject.SubjectResponse;
import br.com.my_universe.api.infrastructure.web.dto.shared.ApiResponse;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/institutions/{acronym}/subjects")
public class SubjectController {

    private final SubjectServiceImpl subjectService;

    public SubjectController(SubjectServiceImpl subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> createSubject(
        @PathVariable String acronym,
        @RequestBody SubjectRequest request) {

        Subject subject = new Subject();
        subject.setCode(request.getCode());
        subject.setName(request.getName());
        subject.setHours(request.getHours());
        subject.setInstitutionAcronym(acronym);

        Subject createdSubject = subjectService.createSubject(subject);
        SubjectResponse dto = toResponse(createdSubject);
        ApiResponse<SubjectResponse> response = new ApiResponse<>(dto);

        return ResponseEntity.created(URI.create(
                String.format("/api/institutions/%s/subjects/%s", dto.getInstitutionAcronym(), dto.getCode())))
                .body(response);
    }

    @PutMapping("/{code}")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(
        @PathVariable String acronym,
        @PathVariable String code,
        @RequestBody SubjectRequest request) {

        Subject subjectDetails = new Subject();
        subjectDetails.setCode(request.getCode());
        subjectDetails.setName(request.getName());
        subjectDetails.setHours(request.getHours());
        subjectDetails.setInstitutionAcronym(acronym);

        Subject updatedSubject = subjectService.updateSubject(code, acronym, subjectDetails);

        SubjectResponse dto = toResponse(updatedSubject);
        ApiResponse<SubjectResponse> response = new ApiResponse<>(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectByKey(
        @PathVariable String acronym,
        @PathVariable String code) {
        Subject subject = subjectService.getSubjectByCodeAndAcronym(code, acronym);
        return ResponseEntity.ok(new ApiResponse<>(toResponse(subject)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjectsByInstitution(
        @PathVariable String acronym) {

        List<Subject> subjects = subjectService.getAllSubjectsByInstitution(acronym);

        List<SubjectResponse> dtoList = subjects.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(dtoList));
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<ApiResponse<SubjectResponse>> deleteSubject(
        @PathVariable String acronym,
        @PathVariable String code) {
        Subject deletedSubject = subjectService.deleteSubject(code, acronym);
        return ResponseEntity.ok(new ApiResponse<>(toResponse(deletedSubject)));
    }

    private SubjectResponse toResponse(Subject subject) {
        SubjectResponse res = new SubjectResponse();
        res.setCode(subject.getCode());
        res.setName(subject.getName());
        res.setHours(subject.getHours());
        res.setInstitutionAcronym(subject.getInstitutionAcronym());
        res.setCreatedAt(subject.getCreatedAt());
        res.setUpdatedAt(subject.getUpdatedAt());
        return res;
    }
}