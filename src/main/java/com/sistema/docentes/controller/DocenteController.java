package com.sistema.docentes.controller;

import com.sistema.docentes.dto.AppDto;
import com.sistema.docentes.service.DocenteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gestión del Docente.
 * Base: /api/docentes
 */
@RestController
@RequestMapping("/api/docentes")
@RequiredArgsConstructor
public class DocenteController {

    private final DocenteService docenteService;

    /** GET /api/docentes - Listar todos */
    @GetMapping
    public ResponseEntity<List<AppDto.DocenteResponse>> getAll() {
        return ResponseEntity.ok(docenteService.getAll());
    }

    /** GET /api/docentes/{id} - Obtener por ID */
    @GetMapping("/{id}")
    public ResponseEntity<AppDto.DocenteResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(docenteService.getById(id));
    }

    /** POST /api/docentes - Crear nuevo docente */
    @PostMapping
    public ResponseEntity<AppDto.DocenteResponse> create(
            @Valid @RequestBody AppDto.DocenteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(docenteService.create(request));
    }

    /** PUT /api/docentes/{id} - Actualizar docente */
    @PutMapping("/{id}")
    public ResponseEntity<AppDto.DocenteResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AppDto.DocenteRequest request) {
        return ResponseEntity.ok(docenteService.update(id, request));
    }

    /** DELETE /api/docentes/{id} - Eliminar docente */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        docenteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
