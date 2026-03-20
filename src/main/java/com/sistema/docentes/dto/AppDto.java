package com.sistema.docentes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

public class AppDto {

    // ─── Docente ────────────────────────────────────────────────
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DocenteRequest {
        @NotBlank(message = "El nombre no puede estar vacío")
        private String nombre;
        @NotBlank(message = "El apellido no puede estar vacío")
        private String apellido;
        @NotBlank(message = "El email no puede estar vacío")
        @Email(message = "El email debe tener un formato válido")
        private String email;
        @NotBlank(message = "La especialidad no puede estar vacía")
        private String especialidad;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DocenteResponse {
        private Long id;
        private String nombre;
        private String apellido;
        private String email;
        private String especialidad;
    }

    // ─── Alumno ─────────────────────────────────────────────────
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AlumnoRequest {
        @NotBlank(message = "El nombre no puede estar vacío")
        private String nombre;
        @NotBlank(message = "El apellido no puede estar vacío")
        private String apellido;
        @NotBlank(message = "El DNI no puede estar vacío")
        private String dni;
        @NotBlank(message = "El email no puede estar vacío")
        @Email(message = "El email debe tener un formato válido")
        private String email;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AlumnoResponse {
        private Long id;
        private String nombre;
        private String apellido;
        private String dni;
        private String email;
    }

    // ─── Curso ──────────────────────────────────────────────────
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CursoRequest {
        @NotBlank(message = "El nombre del curso no puede estar vacío")
        private String nombre;
        @NotBlank(message = "La descripción no puede estar vacía")
        private String descripcion;
        @NotBlank(message = "El nivel no puede estar vacío")
        private String nivel;
        private Set<Long> alumnoIds;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CursoResponse {
        private Long id;
        private String nombre;
        private String descripcion;
        private String nivel;
        private Set<AlumnoResponse> alumnos;
    }

    // ─── Planificacion ──────────────────────────────────────────
    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PlanificacionRequest {
        @NotBlank(message = "El título no puede estar vacío")
        private String titulo;
        @NotBlank(message = "El contenido no puede estar vacío")
        private String contenido;
        @NotBlank(message = "Los objetivos no pueden estar vacíos")
        private String objetivos;
        @NotNull(message = "La fecha de inicio no puede estar vacía")
        private LocalDate fechaInicio;
        @NotNull(message = "La fecha de fin no puede estar vacía")
        private LocalDate fechaFin;
        @NotNull(message = "El id del docente no puede estar vacío")
        private Long docenteId;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PlanificacionResponse {
        private Long id;
        private String titulo;
        private String contenido;
        private String objetivos;
        private LocalDate fechaInicio;
        private LocalDate fechaFin;
        private Long docenteId;
        private String docenteNombre;
    }
}
