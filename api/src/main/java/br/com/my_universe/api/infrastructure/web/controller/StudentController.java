package br.com.my_universe.api.infrastructure.web.controller;

import br.com.my_universe.api.application.services.StudentServiceImpl;
import br.com.my_universe.api.domain.Student;
import br.com.my_universe.api.infrastructure.web.dto.Student.StudentRequest;
import br.com.my_universe.api.infrastructure.web.dto.Student.StudentResponse;
import br.com.my_universe.api.infrastructure.web.dto.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentServiceImpl studentService;

    public StudentController(StudentServiceImpl studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(@RequestBody StudentRequest request) {
        Student student = new Student();
        student.setEmail(request.getEmail());
        student.setName(request.getName());

        Student createdStudent = studentService.createStudent(student);
        
        StudentResponse dto = toResponse(createdStudent);
        ApiResponse<StudentResponse> response = new ApiResponse<>(dto);

        return ResponseEntity.created(URI.create("/api/students/" + dto.getEmail())).body(response);
    }

    @PutMapping("/{email}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable String email,
            @RequestBody StudentRequest request) {
        
        Student studentDetails = new Student();
        studentDetails.setEmail(request.getEmail());
        studentDetails.setName(request.getName());

        Student updatedStudent = studentService.updateStudent(email, studentDetails);
        
        StudentResponse dto = toResponse(updatedStudent);
        ApiResponse<StudentResponse> response = new ApiResponse<>(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{email}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentByEmail(@PathVariable String email) {
        Student student = studentService.getStudentByEmail(email);
        return ResponseEntity.ok(new ApiResponse<>(toResponse(student)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        List<StudentResponse> dtoList = students.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(new ApiResponse<>(dtoList));
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<ApiResponse<StudentResponse>> deleteStudent(@PathVariable String email) {
        Student deletedStudent = studentService.deleteStudent(email);
        return ResponseEntity.ok(new ApiResponse<>(toResponse(deletedStudent)));
    }

    // Helper de conversão
    private StudentResponse toResponse(Student student) {
        StudentResponse res = new StudentResponse();
        res.setEmail(student.getEmail());
        res.setName(student.getName());
        res.setCreatedAt(student.getCreatedAt());
        res.setUpdatedAt(student.getUpdatedAt());
        return res;
    }
}