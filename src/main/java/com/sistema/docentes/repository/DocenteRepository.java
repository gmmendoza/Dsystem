package com.sistema.docentes.repository;

import com.sistema.docentes.entity.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {
    Optional<Docente> findByEmail(String email);
    boolean existsByEmail(String email);
}
