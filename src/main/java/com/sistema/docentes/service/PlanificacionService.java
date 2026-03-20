package com.sistema.docentes.service;

import com.sistema.docentes.dto.AppDto;
import com.sistema.docentes.entity.Docente;
import com.sistema.docentes.entity.Planificacion;
import com.sistema.docentes.exception.ResourceNotFoundException;
import com.sistema.docentes.repository.DocenteRepository;
import com.sistema.docentes.repository.PlanificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PlanificacionService {

    private final PlanificacionRepository planificacionRepository;
    private final DocenteRepository docenteRepository;

    public List<AppDto.PlanificacionResponse> getAll() {
        return planificacionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AppDto.PlanificacionResponse> getByDocenteId(Long docenteId) {
        return planificacionRepository.findByDocenteId(docenteId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AppDto.PlanificacionResponse getById(Long id) {
        Planificacion p = planificacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Planificación no encontrada con id: " + id));
        return toResponse(p);
    }

    public AppDto.PlanificacionResponse create(AppDto.PlanificacionRequest request) {
        Docente docente = docenteRepository.findById(request.getDocenteId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Docente no encontrado con id: " + request.getDocenteId()));

        Planificacion planificacion = Planificacion.builder()
                .titulo(request.getTitulo())
                .contenido(request.getContenido())
                .objetivos(request.getObjetivos())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .docente(docente)
                .build();

        return toResponse(planificacionRepository.save(planificacion));
    }

    public AppDto.PlanificacionResponse update(Long id, AppDto.PlanificacionRequest request) {
        Planificacion planificacion = planificacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Planificación no encontrada con id: " + id));

        Docente docente = docenteRepository.findById(request.getDocenteId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Docente no encontrado con id: " + request.getDocenteId()));

        planificacion.setTitulo(request.getTitulo());
        planificacion.setContenido(request.getContenido());
        planificacion.setObjetivos(request.getObjetivos());
        planificacion.setFechaInicio(request.getFechaInicio());
        planificacion.setFechaFin(request.getFechaFin());
        planificacion.setDocente(docente);

        return toResponse(planificacionRepository.save(planificacion));
    }

    public void delete(Long id) {
        if (!planificacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Planificación no encontrada con id: " + id);
        }
        planificacionRepository.deleteById(id);
    }

    private AppDto.PlanificacionResponse toResponse(Planificacion p) {
        return AppDto.PlanificacionResponse.builder()
                .id(p.getId())
                .titulo(p.getTitulo())
                .contenido(p.getContenido())
                .objetivos(p.getObjetivos())
                .fechaInicio(p.getFechaInicio())
                .fechaFin(p.getFechaFin())
                .docenteId(p.getDocente().getId())
                .docenteNombre(p.getDocente().getNombre() + " " + p.getDocente().getApellido())
                .build();
    }
}
