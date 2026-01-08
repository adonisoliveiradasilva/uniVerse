package br.com.my_universe.api.infrastructure.persistence.repositorys;

import br.com.my_universe.api.application.ports.TaskRepository;
import br.com.my_universe.api.domain.Task;
import br.com.my_universe.api.domain.enums.TaskType;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class JdbcTaskRepository implements TaskRepository {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public Task save(Task task) {
        String sql = """
            INSERT INTO tb_tasks (student_email, subject_code, title, description, task_type, start_date, end_date, finished)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING id
        """;

        Integer id = jdbcTemplate.queryForObject(sql, Integer.class,
            task.getStudentEmail(),
            task.getSubjectCode(),
            task.getTitle(),
            task.getDescription(),
            task.getTaskType().name(), // Salva como String no banco
            task.getStartDate(),
            task.getEndDate(),
            task.getFinished() != null ? task.getFinished() : false
        );

        task.setId(id);
        return task;
    }

    @Override
    public boolean hasTimeConflict(String studentEmail, LocalDateTime start, LocalDateTime end) {
        String sql = """
            SELECT COUNT(*) FROM tb_tasks 
            WHERE student_email = ? 
            AND start_date < ? 
            AND end_date > ?
        """;

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, studentEmail, end, start);
        return count != null && count > 0;
    }

    @Override
    public List<Task> findByMonth(String studentEmail, LocalDateTime startOfMonth, LocalDateTime endOfMonth) {
        String sql = "SELECT * FROM tb_tasks WHERE student_email = ? AND start_date BETWEEN ? AND ?";
        return jdbcTemplate.query(sql, new TaskRowMapper(), studentEmail, startOfMonth, endOfMonth);
    }

    private static class TaskRowMapper implements RowMapper<Task> {
        @Override
        public Task mapRow(ResultSet rs, int rowNum) throws SQLException {
            Task task = new Task();
            task.setId(rs.getInt("id"));
            task.setStudentEmail(rs.getString("student_email"));
            task.setSubjectCode(rs.getString("subject_code"));
            task.setTitle(rs.getString("title"));
            task.setDescription(rs.getString("description"));
            
            try {
                task.setTaskType(TaskType.valueOf(rs.getString("task_type")));
            } catch (Exception e) {
                task.setTaskType(TaskType.OUTROS);
            }
            
            task.setStartDate(rs.getTimestamp("start_date").toLocalDateTime());
            if(rs.getTimestamp("end_date") != null) {
                task.setEndDate(rs.getTimestamp("end_date").toLocalDateTime());
            }
            
            task.setFinished(rs.getBoolean("finished"));
            return task;
        }
    }
}