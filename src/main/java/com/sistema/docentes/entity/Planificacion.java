package com.sistema.docentes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "planificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Planificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título no puede estar vacío")
    @Column(nullable = false)
    private String titulo;

    @NotBlank(message = "El contenido no puede estar vacío")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @NotBlank(message = "Los objetivos no pueden estar vacíos")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String objetivos;

    @Column(nullable = false)
    private LocalDate fechaInicio;

    @Column(nullable = false)
    private LocalDate fechaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Docente docente;
}
