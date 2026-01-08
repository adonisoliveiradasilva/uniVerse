package br.com.my_universe.api.application.services;

import br.com.my_universe.api.domain.Task;
import br.com.my_universe.api.infrastructure.web.dto.Task.TaskRequest;

import java.util.List;

public interface TaskService {
    Task createTask(TaskRequest request, String studentEmail);
    List<Task> getTasksByMonth(String studentEmail, int month, int year);
}