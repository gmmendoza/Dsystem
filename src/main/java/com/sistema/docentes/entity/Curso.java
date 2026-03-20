package com.sistema.docentes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "cursos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del curso no puede estar vacío")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Column(nullable = false)
    private String descripcion;

    @NotBlank(message = "El nivel no puede estar vacío")
    @Column(nullable = false)
    private String nivel;

    @ManyToMany
    @JoinTable(
        name = "curso_alumno",
        joinColumns = @JoinColumn(name = "curso_id"),
        inverseJoinColumns = @JoinColumn(name = "alumno_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Alumno> alumnos = new HashSet<>();
}
