package com.sistema.docentes.service;

import com.sistema.docentes.dto.AppDto;
import com.sistema.docentes.entity.Alumno;
import com.sistema.docentes.entity.Curso;
import com.sistema.docentes.exception.ResourceNotFoundException;
import com.sistema.docentes.repository.AlumnoRepository;
import com.sistema.docentes.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CursoService {

    private final CursoRepository cursoRepository;
    private final AlumnoRepository alumnoRepository;

    public List<AppDto.CursoResponse> getAll() {
        return cursoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AppDto.CursoResponse getById(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));
        return toResponse(curso);
    }

    public AppDto.CursoResponse create(AppDto.CursoRequest request) {
        Set<Alumno> alumnos = resolveAlumnos(request.getAlumnoIds());
        Curso curso = Curso.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .nivel(request.getNivel())
                .alumnos(alumnos)
                .build();
        return toResponse(cursoRepository.save(curso));
    }

    public AppDto.CursoResponse update(Long id, AppDto.CursoRequest request) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));
        curso.setNombre(request.getNombre());
        curso.setDescripcion(request.getDescripcion());
        curso.setNivel(request.getNivel());
        curso.setAlumnos(resolveAlumnos(request.getAlumnoIds()));
        return toResponse(cursoRepository.save(curso));
    }

    public void delete(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Curso no encontrado con id: " + id);
        }
        cursoRepository.deleteById(id);
    }

    // Agrega un alumno al curso
    public AppDto.CursoResponse addAlumno(Long cursoId, Long alumnoId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + cursoId));
        Alumno alumno = alumnoRepository.findById(alumnoId)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + alumnoId));
        curso.getAlumnos().add(alumno);
        return toResponse(cursoRepository.save(curso));
    }

    // Remueve un alumno del curso
    public AppDto.CursoResponse removeAlumno(Long cursoId, Long alumnoId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + cursoId));
        curso.getAlumnos().removeIf(a -> a.getId().equals(alumnoId));
        return toResponse(cursoRepository.save(curso));
    }

    private Set<Alumno> resolveAlumnos(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        return new HashSet<>(alumnoRepository.findAllById(ids));
    }

    private AppDto.CursoResponse toResponse(Curso c) {
        Set<AppDto.AlumnoResponse> alumnosDto = c.getAlumnos().stream()
                .map(a -> AppDto.AlumnoResponse.builder()
                        .id(a.getId())
                        .nombre(a.getNombre())
                        .apellido(a.getApellido())
                        .dni(a.getDni())
                        .email(a.getEmail())
                        .build())
                .collect(Collectors.toSet());

        return AppDto.CursoResponse.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .descripcion(c.getDescripcion())
                .nivel(c.getNivel())
                .alumnos(alumnosDto)
                .build();
    }
}
