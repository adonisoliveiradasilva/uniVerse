package br.com.my_universe.api.infrastructure.persistence;

// IMPORTS DAS NOVAS EXCEÇÕES
import br.com.my_universe.api.application.exceptions.ResourceAlreadyExistsException;
import br.com.my_universe.api.application.exceptions.ResourceNotFoundException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * NOVO HANDLER: Captura erros 404 (Não Encontrado)
     * Lançado quando findById(...).orElseThrow(...) falha.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(), // 404
            "Recurso Não Encontrado",
            ex.getMessage(), // Mensagem específica (ex: "Disciplina com ID 5 não encontrada")
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    /**
     * NOVO HANDLER: Captura erros 409 (Conflito) da LÓGICA DE NEGÓCIO
     * Lançado quando a validação ANTES de salvar falha.
     */
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleResourceAlreadyExists(ResourceAlreadyExistsException ex, WebRequest request) {
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT.value(), // 409
            "Conflito de Dados",
            ex.getMessage(), // Mensagem específica (ex: "Disciplina com código 'COMP101' já existe...")
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    /**
     * SEU HANDLER: Captura erros 409 (Conflito) do BANCO DE DADOS
     * Lançado se a validação de negócio falhar e o banco pegar (ex: constraint)
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex, WebRequest request) {
        String message = ex.getMessage(); // Correto!

        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            "Conflito de Banco de Dados",
            message,
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    /**
     * NOVO HANDLER: Captura erros 400 (Requisição Ruim)
     * Lançado quando um campo obrigatório está vazio (ex: nome, código).
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex, WebRequest request) {
        
        ErrorResponse errorResponse = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(), // 400
            "Requisição Inválida",
            ex.getMessage(), // Mensagem específica (ex: "O nome (name) da disciplina não pode ser vazio.")
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}