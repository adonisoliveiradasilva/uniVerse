package br.com.my_universe.api.infrastructure.web.dto.Task;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {
    
    @NotBlank(message = "O título é obrigatório")
    private String title;
    
    private String description;
    
    private String subjectCode;
    
    private String tag;
    
    @NotBlank(message = "Hora de início é obrigatória")
    private String startTime;
    
    @NotBlank(message = "Hora de fim é obrigatória")
    private String endTime;
    
    @NotBlank(message = "Data é obrigatória")
    private String date;
}