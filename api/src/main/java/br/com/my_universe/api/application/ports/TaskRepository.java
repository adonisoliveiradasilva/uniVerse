package br.com.my_universe.api.application.ports;

import br.com.my_universe.api.domain.Task;
import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository {
    Task save(Task task);
    boolean hasTimeConflict(String studentEmail, LocalDateTime start, LocalDateTime end);
    List<Task> findByMonth(String studentEmail, LocalDateTime startOfMonth, LocalDateTime endOfMonth);
}