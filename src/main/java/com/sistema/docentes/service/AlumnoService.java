package com.sistema.docentes.service;

import com.sistema.docentes.dto.AppDto;
import com.sistema.docentes.entity.Alumno;
import com.sistema.docentes.exception.ResourceNotFoundException;
import com.sistema.docentes.repository.AlumnoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AlumnoService {

    private final AlumnoRepository alumnoRepository;

    public List<AppDto.AlumnoResponse> getAll() {
        return alumnoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AppDto.AlumnoResponse getById(Long id) {
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + id));
        return toResponse(alumno);
    }

    public AppDto.AlumnoResponse create(AppDto.AlumnoRequest request) {
        if (alumnoRepository.existsByDni(request.getDni())) {
            throw new RuntimeException("Ya existe un alumno con el DNI: " + request.getDni());
        }
        if (alumnoRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe un alumno con el email: " + request.getEmail());
        }
        Alumno alumno = Alumno.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .dni(request.getDni())
                .email(request.getEmail())
                .build();
        return toResponse(alumnoRepository.save(alumno));
    }

    public AppDto.AlumnoResponse update(Long id, AppDto.AlumnoRequest request) {
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + id));
        alumno.setNombre(request.getNombre());
        alumno.setApellido(request.getApellido());
        alumno.setDni(request.getDni());
        alumno.setEmail(request.getEmail());
        return toResponse(alumnoRepository.save(alumno));
    }

    public void delete(Long id) {
        if (!alumnoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Alumno no encontrado con id: " + id);
        }
        alumnoRepository.deleteById(id);
    }

    private AppDto.AlumnoResponse toResponse(Alumno a) {
        return AppDto.AlumnoResponse.builder()
                .id(a.getId())
                .nombre(a.getNombre())
                .apellido(a.getApellido())
                .dni(a.getDni())
                .email(a.getEmail())
                .build();
    }
}
