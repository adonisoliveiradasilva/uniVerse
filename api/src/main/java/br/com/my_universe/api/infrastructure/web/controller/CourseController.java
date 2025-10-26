package br.com.my_universe.api.infrastructure.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.my_universe.api.application.services.CourseServiceImpl;
import br.com.my_universe.api.domain.Course;
import br.com.my_universe.api.infrastructure.web.dto.Course.CourseRequest;
import br.com.my_universe.api.infrastructure.web.dto.Course.CourseResponse;
import br.com.my_universe.api.infrastructure.web.dto.shared.ApiResponse;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/institutions/{acronym}/courses")
public class CourseController {

    private final CourseServiceImpl courseService;

    public CourseController(CourseServiceImpl courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
        @PathVariable String acronym,
        @RequestBody CourseRequest request) {

        Course course = new Course();
        course.setCode(request.getCode());
        course.setName(request.getName());
        course.setPeriodsQuantity(request.getPeriodsQuantity());
        course.setDescription(request.getDescription());
        course.setInstitutionAcronym(acronym);

        Course createdCourse = courseService.createCourse(course);
        CourseResponse dto = toResponse(createdCourse);
        ApiResponse<CourseResponse> response = new ApiResponse<>(dto);

        return ResponseEntity.created(URI.create(
                String.format("/api/institutions/%s/courses/%s", dto.getInstitutionAcronym(), dto.getCode())))
                .body(response);
    }

    @PutMapping("/{code}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
        @PathVariable String acronym,
        @PathVariable String code,
        @RequestBody CourseRequest request) {

        Course courseDetails = new Course();
        courseDetails.setCode(request.getCode());
        courseDetails.setName(request.getName());
        courseDetails.setPeriodsQuantity(request.getPeriodsQuantity());
        courseDetails.setDescription(request.getDescription());
        courseDetails.setInstitutionAcronym(acronym);

        Course updatedCourse = courseService.updateCourse(code, acronym, courseDetails);

        CourseResponse dto = toResponse(updatedCourse);
        ApiResponse<CourseResponse> response = new ApiResponse<>(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseByKey(
        @PathVariable String acronym,
        @PathVariable String code) {
        Course course = courseService.getCourseByCodeAndAcronym(code, acronym);
        return ResponseEntity.ok(new ApiResponse<>(toResponse(course)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCoursesByInstitution(
        @PathVariable String acronym) {

        List<Course> courses = courseService.getAllCoursesByInstitution(acronym);

        List<CourseResponse> dtoList = courses.stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(dtoList));
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<ApiResponse<CourseResponse>> deleteCourse(
        @PathVariable String acronym,
        @PathVariable String code) {
        Course deletedCourse = courseService.deleteCourse(code, acronym);
        return ResponseEntity.ok(new ApiResponse<>(toResponse(deletedCourse)));
    }

    private CourseResponse toResponse(Course course) {
        CourseResponse res = new CourseResponse();
        res.setCode(course.getCode());
        res.setName(course.getName());
        res.setPeriodsQuantity(course.getPeriodsQuantity());
        res.setDescription(course.getDescription());
        res.setInstitutionAcronym(course.getInstitutionAcronym());
        res.setCreatedAt(course.getCreatedAt());
        res.setUpdatedAt(course.getUpdatedAt());
        return res;
    }
}
