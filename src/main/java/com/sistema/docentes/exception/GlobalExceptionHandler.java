package com.sistema.docentes.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Errores de validación @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String field = ((FieldError) error).getField();
            String msg = error.getDefaultMessage();
            errores.put(field, msg);
        });
        return buildResponse(HttpStatus.BAD_REQUEST, "Errores de validación", errores);
    }

    // Recurso no encontrado
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    // Duplicados / conflictos de negocio
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
    }

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status, String mensaje, Object detalles) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("mensaje", mensaje);
        if (detalles != null) body.put("errores", detalles);
        return ResponseEntity.status(status).body(body);
    }
}
