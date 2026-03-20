package com.sistema.docentes.repository;

import com.sistema.docentes.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    boolean existsByNombre(String nombre);
}
