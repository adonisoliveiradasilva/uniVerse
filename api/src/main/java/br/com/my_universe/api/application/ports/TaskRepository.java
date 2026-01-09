package br.com.my_universe.api.application.ports;

import br.com.my_universe.api.domain.Task;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TaskRepository {
    Task save(Task task);
    
    void update(Task task);
    
    Optional<Task> findById(Integer id);
    
    void deleteById(Integer id);
    
    boolean hasTimeConflict(String studentEmail, LocalDateTime start, LocalDateTime end);
    
    boolean hasTimeConflict(String studentEmail, LocalDateTime start, LocalDateTime end, Integer excludeTaskId);
    
    List<Task> findByMonth(String studentEmail, LocalDateTime startOfMonth, LocalDateTime endOfMonth);
}