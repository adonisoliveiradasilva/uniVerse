package br.com.my_universe.api.infrastructure.web.controller;

import br.com.my_universe.api.application.services.TaskService;
import br.com.my_universe.api.domain.Task;
import br.com.my_universe.api.infrastructure.web.dto.Task.TaskRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody @Valid TaskRequest request, 
                                           @AuthenticationPrincipal UserDetails userDetails) {
        
        String email = userDetails.getUsername();
        
        Task createdTask = taskService.createTask(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping("/month")
    public ResponseEntity<List<Task>> getByMonth(@RequestParam int month, 
                                                 @RequestParam int year,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        
        String email = userDetails.getUsername();
        List<Task> tasks = taskService.getTasksByMonth(email, month, year);
        return ResponseEntity.ok(tasks);
    }
}