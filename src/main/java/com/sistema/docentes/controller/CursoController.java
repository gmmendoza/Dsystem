package com.sistema.docentes.controller;

import com.sistema.docentes.dto.AppDto;
import com.sistema.docentes.service.CursoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gestión de Cursos.
 * Base: /api/cursos
 */
@RestController
@RequestMapping("/api/cursos")
@RequiredArgsConstructor
public class CursoController {

    private final CursoService cursoService;

    /** GET /api/cursos - Listar todos */
    @GetMapping
    public ResponseEntity<List<AppDto.CursoResponse>> getAll() {
        return ResponseEntity.ok(cursoService.getAll());
    }

    /** GET /api/cursos/{id} - Obtener por ID */
    @GetMapping("/{id}")
    public ResponseEntity<AppDto.CursoResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(cursoService.getById(id));
    }

    /** POST /api/cursos - Crear nuevo curso */
    @PostMapping
    public ResponseEntity<AppDto.CursoResponse> create(
            @Valid @RequestBody AppDto.CursoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cursoService.create(request));
    }

    /** PUT /api/cursos/{id} - Actualizar curso */
    @PutMapping("/{id}")
    public ResponseEntity<AppDto.CursoResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AppDto.CursoRequest request) {
        return ResponseEntity.ok(cursoService.update(id, request));
    }

    /** DELETE /api/cursos/{id} - Eliminar curso */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cursoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/cursos/{cursoId}/alumnos/{alumnoId} - Agregar alumno a curso */
    @PostMapping("/{cursoId}/alumnos/{alumnoId}")
    public ResponseEntity<AppDto.CursoResponse> addAlumno(
            @PathVariable Long cursoId,
            @PathVariable Long alumnoId) {
        return ResponseEntity.ok(cursoService.addAlumno(cursoId, alumnoId));
    }

    /** DELETE /api/cursos/{cursoId}/alumnos/{alumnoId} - Remover alumno de curso */
    @DeleteMapping("/{cursoId}/alumnos/{alumnoId}")
    public ResponseEntity<AppDto.CursoResponse> removeAlumno(
            @PathVariable Long cursoId,
            @PathVariable Long alumnoId) {
        return ResponseEntity.ok(cursoService.removeAlumno(cursoId, alumnoId));
    }
}
