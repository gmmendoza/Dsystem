package com.sistema.docentes.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "docentes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El apellido no puede estar vacío")
    @Column(nullable = false)
    private String apellido;

    @NotBlank(message = "El email no puede estar vacío")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "La especialidad no puede estar vacía")
    @Column(nullable = false)
    private String especialidad;

    @OneToMany(mappedBy = "docente", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Planificacion> planificaciones;
}
