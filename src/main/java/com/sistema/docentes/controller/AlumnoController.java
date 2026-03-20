package com.sistema.docentes.controller;

import com.sistema.docentes.dto.AppDto;
import com.sistema.docentes.service.AlumnoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gestión de Alumnos.
 * Base: /api/alumnos
 */
@RestController
@RequestMapping("/api/alumnos")
@RequiredArgsConstructor
public class AlumnoController {

    private final AlumnoService alumnoService;

    /** GET /api/alumnos - Listar todos */
    @GetMapping
    public ResponseEntity<List<AppDto.AlumnoResponse>> getAll() {
        return ResponseEntity.ok(alumnoService.getAll());
    }

    /** GET /api/alumnos/{id} - Obtener por ID */
    @GetMapping("/{id}")
    public ResponseEntity<AppDto.AlumnoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(alumnoService.getById(id));
    }

    /** POST /api/alumnos - Crear nuevo alumno */
    @PostMapping
    public ResponseEntity<AppDto.AlumnoResponse> create(
            @Valid @RequestBody AppDto.AlumnoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alumnoService.create(request));
    }

    /** PUT /api/alumnos/{id} - Actualizar alumno */
    @PutMapping("/{id}")
    public ResponseEntity<AppDto.AlumnoResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AppDto.AlumnoRequest request) {
        return ResponseEntity.ok(alumnoService.update(id, request));
    }

    /** DELETE /api/alumnos/{id} - Eliminar alumno */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alumnoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
