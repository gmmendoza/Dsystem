import { mockDataService } from './mockDataService';

// Inicializar datos si es necesario
mockDataService.init();

export const authAPI = {
  login: async (data) => {
    await new Promise(r => setTimeout(r, 600));
    if (data.username === 'admin') return { data: { token: 'tk-123', username: 'admin', rol: 'DOCENTE' } };
    throw new Error('User not found');
  }
};

export const alumnoAPI = {
  getAll: async () => ({ data: mockDataService.getAlumnos() }),
  getById: async (id) => ({ data: mockDataService.getAlumnoById(id) }),
  create: async (data) => ({ data: mockDataService.saveAlumno(data) }), // Expandir mockDataService si es necesario
  update: async (id, data) => ({ data: mockDataService.updateAlumno(id, data) }),
  delete: async (id) => ({ data: mockDataService.deleteAlumno(id) })
};

export const cursoAPI = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 400));
    return { data: mockDataService.getCursos() };
  },
  getById: async (id) => {
    await new Promise(r => setTimeout(r, 400));
    return { data: mockDataService.getCursoById(id) };
  },
  update: async (id, data) => {
      return { data: mockDataService.saveCurso({ ...data, id }) };
  },
  create: async (data) => {
      await new Promise(r => setTimeout(r, 600));
      return { data: mockDataService.saveCurso(data) };
  },
  delete: async (id) => {
      await new Promise(r => setTimeout(r, 400));
      mockDataService.deleteCurso(id);
      return { data: null };
  },
  addRecurso: async (cursoId, recurso) => {
    return { data: mockDataService.getCursoById(cursoId) };
  }
};

export const planificacionAPI = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 600));
    return { data: mockDataService.getPlanificaciones() };
  },
  getById: async (id) => {
    await new Promise(r => setTimeout(r, 400));
    const plans = mockDataService.getPlanificaciones();
    return { data: plans.find(p => p.id === Number(id)) };
  },
  getByCursoId: async (cursoId) => {
    await new Promise(r => setTimeout(r, 600));
    return { data: mockDataService.getPlanificacionesByCurso(cursoId) };
  },
  create: async (data) => {
    await new Promise(r => setTimeout(r, 800));
    return { data: mockDataService.savePlanificacion(data) };
  },
  update: async (id, data) => {
    await new Promise(r => setTimeout(r, 600));
    return { data: mockDataService.savePlanificacion({ ...data, id }) };
  },
  save: async (data) => {
    if (data.id) {
       return await planificacionAPI.update(data.id, data);
    } else {
       return await planificacionAPI.create(data);
    }
  },
  duplicate: async (id) => {
    const plans = mockDataService.getPlanificaciones();
    const original = plans.find(p => p.id === Number(id));
    const duplicate = { ...original, id: null, titulo: `Copia de ${original.titulo}` };
    return { data: mockDataService.savePlanificacion(duplicate) };
  },
  delete: async (id) => {
    mockDataService.deletePlanificacion(id);
    return { data: null };
  }
};

export const asistenciaAPI = {
  get: async (cursoId, fecha) => {
    await new Promise(r => setTimeout(r, 400));
    return { data: mockDataService.getAsistencia(cursoId, fecha) };
  },
  save: async (cursoId, fecha, data) => {
    await new Promise(r => setTimeout(r, 600));
    return { data: mockDataService.saveAsistencia(cursoId, fecha, data) };
  }
};
