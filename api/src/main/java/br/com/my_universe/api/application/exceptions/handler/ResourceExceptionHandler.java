package br.com.my_universe.api.application.exceptions.handler;

import br.com.my_universe.api.application.exceptions.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class ResourceExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<StandardError> handleBusinessException(BusinessException e, HttpServletRequest request) {
        
        HttpStatus status = HttpStatus.CONFLICT; 
        
        StandardError err = new StandardError();
        err.setTimestamp(LocalDateTime.now());
        err.setStatus(status.value());
        err.setError("Conflito de Agendamento");
        err.setMessage(e.getMessage());
        err.setPath(request.getRequestURI());
        
        return ResponseEntity.status(status).body(err);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StandardError {
        private LocalDateTime timestamp;
        private Integer status;
        private String error;
        private String message;
        private String path;
    }
}