package com.sistema.docentes.controller;

import com.sistema.docentes.dto.AppDto;
import com.sistema.docentes.service.PlanificacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gestión de Planificaciones.
 * Base: /api/planificaciones
 */
@RestController
@RequestMapping("/api/planificaciones")
@RequiredArgsConstructor
public class PlanificacionController {

    private final PlanificacionService planificacionService;

    /** GET /api/planificaciones - Listar todas */
    @GetMapping
    public ResponseEntity<List<AppDto.PlanificacionResponse>> getAll() {
        return ResponseEntity.ok(planificacionService.getAll());
    }

    /** GET /api/planificaciones/{id} - Obtener por ID */
    @GetMapping("/{id}")
    public ResponseEntity<AppDto.PlanificacionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(planificacionService.getById(id));
    }

    /** GET /api/planificaciones/docente/{docenteId} - Obtener planificaciones de un docente */
    @GetMapping("/docente/{docenteId}")
    public ResponseEntity<List<AppDto.PlanificacionResponse>> getByDocente(
            @PathVariable Long docenteId) {
        return ResponseEntity.ok(planificacionService.getByDocenteId(docenteId));
    }

    /** POST /api/planificaciones - Crear nueva planificación */
    @PostMapping
    public ResponseEntity<AppDto.PlanificacionResponse> create(
            @Valid @RequestBody AppDto.PlanificacionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(planificacionService.create(request));
    }

    /** PUT /api/planificaciones/{id} - Actualizar planificación */
    @PutMapping("/{id}")
    public ResponseEntity<AppDto.PlanificacionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AppDto.PlanificacionRequest request) {
        return ResponseEntity.ok(planificacionService.update(id, request));
    }

    /** DELETE /api/planificaciones/{id} - Eliminar planificación */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        planificacionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
