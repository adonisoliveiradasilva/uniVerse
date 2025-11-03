package br.com.my_universe.api.infrastructure.persistence.repositorys;

import br.com.my_universe.api.application.ports.StudentRepository;
import br.com.my_universe.api.domain.Student;
import br.com.my_universe.api.infrastructure.persistence.mappers.StudentRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class JdbcStudentRepository implements StudentRepository {

    private final JdbcTemplate jdbcTemplate;
    private final StudentRowMapper studentRowMapper;

    public JdbcStudentRepository(JdbcTemplate jdbcTemplate, StudentRowMapper studentRowMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.studentRowMapper = studentRowMapper;
    }

    @Override
    public Student save(Student student) {
        String sql = "INSERT INTO tb_students (email, name) VALUES (?, ?)";
        
        jdbcTemplate.update(sql, student.getEmail(), student.getName());
        
        return findByEmail(student.getEmail())
            .orElseThrow(() -> new RuntimeException("Falha ao buscar estudante recém-criado."));
    }

    @Override
    public Student update(String originalEmail, Student student) {
        String sql = "UPDATE tb_students SET email = ?, name = ? WHERE email = ?";
        
        int updatedRows = jdbcTemplate.update(sql,
            student.getEmail(),
            student.getName(),
            originalEmail
        );

        if (updatedRows > 0) {
            return findByEmail(student.getEmail())
                .orElse(student); // Fallback
        }
        throw new RuntimeException("Falha ao atualizar estudante com email: " + originalEmail);
    }

    @Override
    public Optional<Student> findByEmail(String email) {
        String sql = "SELECT * FROM tb_students WHERE email = ?";
        return jdbcTemplate.query(sql, studentRowMapper, email).stream().findFirst();
    }

    @Override
    public List<Student> findAll() {
        String sql = "SELECT * FROM tb_students ORDER BY name ASC";
        return jdbcTemplate.query(sql, studentRowMapper);
    }

    @Override
    public void deleteByEmail(String email) {
        String sql = "DELETE FROM tb_students WHERE email = ?";
        int updatedRows = jdbcTemplate.update(sql, email);
        
        if (updatedRows == 0) {
            throw new RuntimeException("Falha ao deletar. Estudante com email '" + email + "' não encontrado.");
        }
    }
}