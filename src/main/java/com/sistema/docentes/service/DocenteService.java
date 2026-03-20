package com.sistema.docentes.service;

import com.sistema.docentes.dto.AppDto;
import com.sistema.docentes.entity.Docente;
import com.sistema.docentes.exception.ResourceNotFoundException;
import com.sistema.docentes.repository.DocenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DocenteService {

    private final DocenteRepository docenteRepository;

    public List<AppDto.DocenteResponse> getAll() {
        return docenteRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AppDto.DocenteResponse getById(Long id) {
        Docente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado con id: " + id));
        return toResponse(docente);
    }

    public AppDto.DocenteResponse create(AppDto.DocenteRequest request) {
        if (docenteRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe un docente con el email: " + request.getEmail());
        }
        Docente docente = Docente.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .especialidad(request.getEspecialidad())
                .build();
        return toResponse(docenteRepository.save(docente));
    }

    public AppDto.DocenteResponse update(Long id, AppDto.DocenteRequest request) {
        Docente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado con id: " + id));
        docente.setNombre(request.getNombre());
        docente.setApellido(request.getApellido());
        docente.setEmail(request.getEmail());
        docente.setEspecialidad(request.getEspecialidad());
        return toResponse(docenteRepository.save(docente));
    }

    public void delete(Long id) {
        if (!docenteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Docente no encontrado con id: " + id);
        }
        docenteRepository.deleteById(id);
    }

    private AppDto.DocenteResponse toResponse(Docente d) {
        return AppDto.DocenteResponse.builder()
                .id(d.getId())
                .nombre(d.getNombre())
                .apellido(d.getApellido())
                .email(d.getEmail())
                .especialidad(d.getEspecialidad())
                .build();
    }
}
