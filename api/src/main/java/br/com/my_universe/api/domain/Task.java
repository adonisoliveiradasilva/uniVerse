package br.com.my_universe.api.domain;

import br.com.my_universe.api.domain.enums.TaskType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Task {
    private Integer id;
    private String studentEmail;
    private String subjectCode;
    private String title;
    private String description;
    private TaskType taskType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean finished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}