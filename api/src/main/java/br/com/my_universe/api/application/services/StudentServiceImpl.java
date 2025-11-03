package br.com.my_universe.api.application.services;

import br.com.my_universe.api.application.exceptions.ResourceAlreadyExistsException;
import br.com.my_universe.api.application.exceptions.ResourceNotFoundException;
import br.com.my_universe.api.application.ports.StudentRepository;
import br.com.my_universe.api.domain.Student;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import br.com.my_universe.api.application.services.AuthServiceImpl; 

@Service
public class StudentServiceImpl {

    private final StudentRepository studentRepository;
    private final AuthServiceImpl authService;

    public StudentServiceImpl(StudentRepository studentRepository, AuthServiceImpl authService) {
        this.studentRepository = studentRepository;
        this.authService = authService;
    }

    @Transactional
    public Student createStudent(Student student) {
        if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("O Email não pode ser vazio.");
        }
        if (student.getName() == null || student.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("O Nome não pode ser vazio.");
        }
        
        studentRepository.findByEmail(student.getEmail())
            .ifPresent(s -> {
                throw new ResourceAlreadyExistsException("Estudante com email '" + student.getEmail() + "' já existe.");
            });

        Student savedStudent = studentRepository.save(student);

        try {
            authService.requestPasswordSetup(savedStudent.getEmail());
        
        } catch (Exception e) {
            System.err.println(
                "### AVISO: Aluno " + savedStudent.getEmail() + " criado com sucesso, " + 
                "mas falha ao enviar e-mail de configuração de senha: " + e.getMessage()
            );
        }

        return savedStudent;
    }

    @Transactional
    public Student updateStudent(String originalEmail, Student studentDetails) {
        Student existingStudent = getStudentByEmail(originalEmail);

        if (!originalEmail.equalsIgnoreCase(studentDetails.getEmail())) {
            studentRepository.findByEmail(studentDetails.getEmail())
                .ifPresent(s -> {
                    throw new ResourceAlreadyExistsException("O novo email '" + studentDetails.getEmail() + "' já está em uso.");
                });
        }
        
        return studentRepository.update(originalEmail, studentDetails);
    }

    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Estudante com email '" + email + "' não encontrado."));
    }

    public Student deleteStudent(String email) {
        Student studentToDelete = getStudentByEmail(email);
        studentRepository.deleteByEmail(email);
        return studentToDelete;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
}