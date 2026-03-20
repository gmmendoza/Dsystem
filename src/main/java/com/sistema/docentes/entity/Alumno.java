package com.sistema.docentes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "alumnos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El apellido no puede estar vacío")
    @Column(nullable = false)
    private String apellido;

    @NotBlank(message = "El DNI no puede estar vacío")
    @Column(nullable = false, unique = true)
    private String dni;

    @NotBlank(message = "El email no puede estar vacío")
    @Column(nullable = false, unique = true)
    private String email;

    @ManyToMany(mappedBy = "alumnos")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Curso> cursos = new HashSet<>();
}
