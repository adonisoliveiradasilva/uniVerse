package br.com.my_universe.api.application.ports;

import br.com.my_universe.api.domain.Student;
import java.util.List;
import java.util.Optional;

public interface StudentRepository {
    
    Student save(Student student);
    
    Student update(String originalEmail, Student student);
    
    Optional<Student> findByEmail(String email);
    
    List<Student> findAll();
    
    void deleteByEmail(String email);
}