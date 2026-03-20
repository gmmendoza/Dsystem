import { initialAlumnos, initialCursos, initialPlanificaciones } from '../mock/mockData';

const getLS = (key, initial) => {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(saved);
};

const setLS = (key, data) => localStorage.setItem(key, JSON.stringify(data));

getLS('dsystem_alumnos', initialAlumnos);
getLS('dsystem_cursos', initialCursos);
getLS('dsystem_planificaciones', initialPlanificaciones);

export const authAPI = {
  login: async (data) => {
    await new Promise(r => setTimeout(r, 600));
    if (data.username === 'admin') return { data: { token: 'tk-123', username: 'admin', rol: 'DOCENTE' } };
    throw new Error('User not found');
  }
};

export const alumnoAPI = {
  getAll: async () => ({ data: getLS('dsystem_alumnos', initialAlumnos) }),
  getById: async (id) => ({ data: getLS('dsystem_alumnos', initialAlumnos).find(a => a.id === Number(id)) }),
  create: async (data) => {
    const list = getLS('dsystem_alumnos', initialAlumnos);
    const newItem = { ...data, id: Date.now() };
    setLS('dsystem_alumnos', [...list, newItem]);
    return { data: newItem };
  },
  update: async (id, data) => {
    const list = getLS('dsystem_alumnos', initialAlumnos);
    const updated = list.map(a => a.id === Number(id) ? { ...a, ...data } : a);
    setLS('dsystem_alumnos', updated);
    return { data: updated.find(a => a.id === Number(id)) };
  },
  delete: async (id) => {
    const list = getLS('dsystem_alumnos', initialAlumnos);
    setLS('dsystem_alumnos', list.filter(a => a.id !== Number(id)));
    return { data: null };
  }
};

export const cursoAPI = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 400));
    return { data: getLS('dsystem_cursos', initialCursos) };
  },
  getById: async (id) => {
    await new Promise(r => setTimeout(r, 400));
    const list = getLS('dsystem_cursos', initialCursos);
    return { data: list.find(c => c.id === Number(id)) };
  },
  update: async (id, data) => {
      const list = getLS('dsystem_cursos', initialCursos);
      const updated = list.map(c => c.id === Number(id) ? { ...c, ...data } : c);
      setLS('dsystem_cursos', updated);
      return { data: updated.find(c => c.id === Number(id)) };
  },
  // Banco de Recursos
  addRecurso: async (cursoId, recurso) => {
    const list = getLS('dsystem_cursos', initialCursos);
    const updated = list.map(c => {
      if (c.id === Number(cursoId)) {
        const recursos = c.recursos || [];
        return { ...c, recursos: [...recursos, { ...recurso, id: Date.now() }] };
      }
      return c;
    });
    setLS('dsystem_cursos', updated);
    return { data: updated.find(c => c.id === Number(cursoId)) };
  }
};

export const planificacionAPI = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 600));
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    return { data: list.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)) };
  },
  getByCursoId: async (cursoId) => {
    await new Promise(r => setTimeout(r, 600));
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    return { data: list.filter(p => p.cursoId === Number(cursoId)) };
  },
  create: async (data) => {
    await new Promise(r => setTimeout(r, 800));
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    const newItem = { 
        ...data, 
        id: Date.now(), 
        lastModified: new Date().toISOString(),
        estado: data.estado || 'Activa',
        completada: false,
        observaciones: ''
    };
    setLS('dsystem_planificaciones', [newItem, ...list]);
    return { data: newItem };
  },
  update: async (id, data) => {
    await new Promise(r => setTimeout(r, 600));
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    const updated = list.map(p => p.id === Number(id) ? { ...p, ...data, lastModified: new Date().toISOString() } : p);
    setLS('dsystem_planificaciones', updated);
    return { data: updated.find(p => p.id === Number(id)) };
  },
  duplicate: async (id) => {
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    const original = list.find(p => p.id === Number(id));
    const duplicate = { ...original, id: Date.now(), titulo: `Copia de ${original.titulo}`, lastModified: new Date().toISOString() };
    setLS('dsystem_planificaciones', [duplicate, ...list]);
    return { data: duplicate };
  },
  delete: async (id) => {
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    setLS('dsystem_planificaciones', list.filter(p => p.id !== Number(id)));
    return { data: null };
  }
};

export const asistenciaAPI = {
  get: async (cursoId, fecha) => {
    await new Promise(r => setTimeout(r, 400));
    const all = getLS('dsystem_asistencia', {});
    return { data: all[`${cursoId}_${fecha}`] || {} };
  },
  save: async (cursoId, fecha, data) => {
    await new Promise(r => setTimeout(r, 600));
    const all = getLS('dsystem_asistencia', {});
    all[`${cursoId}_${fecha}`] = data;
    setLS('dsystem_asistencia', all);
    return { data };
  }
};
