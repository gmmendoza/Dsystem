import { initialAlumnos, initialCursos, initialPlanificaciones } from '../mock/mockData';

// Helper para persistencia en localStorage
const getLS = (key, initial) => {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(saved);
};

const setLS = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Inicializar datos si no existen
getLS('dsystem_alumnos', initialAlumnos);
getLS('dsystem_cursos', initialCursos);
getLS('dsystem_planificaciones', initialPlanificaciones);

// ─── Auth (Mock) ─────────────────────────────────────
export const authAPI = {
  login: async (data) => {
    // Simulación de delay de red
    await new Promise(r => setTimeout(r, 800));
    if (data.username === 'admin' && data.password === 'admin') {
      return { data: { token: 'mock-jwt-token-123', username: 'admin', rol: 'DOCENTE', mensaje: 'Login exitoso' } };
    }
    throw new Error('Credenciales inválidas (usa admin/admin)');
  },
  register: async (data) => {
    await new Promise(r => setTimeout(r, 800));
    return { data: { token: 'mock-jwt-token-new', username: data.username, rol: 'DOCENTE', mensaje: 'Registro exitoso' } };
  }
};

// ─── Alumnos ─────────────────────────────────────────
export const alumnoAPI = {
  getAll: async () => ({ data: getLS('dsystem_alumnos', initialAlumnos) }),
  getById: async (id) => {
    const list = getLS('dsystem_alumnos', initialAlumnos);
    return { data: list.find(a => a.id === Number(id)) };
  },
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

// ─── Cursos ──────────────────────────────────────────
export const cursoAPI = {
  getAll: async () => ({ data: getLS('dsystem_cursos', initialCursos) }),
  getById: async (id) => {
    const list = getLS('dsystem_cursos', initialCursos);
    return { data: list.find(c => c.id === Number(id)) };
  },
  create: async (data) => {
    const list = getLS('dsystem_cursos', initialCursos);
    const newItem = { ...data, id: Date.now(), alumnos: data.alumnos || [] };
    setLS('dsystem_cursos', [...list, newItem]);
    return { data: newItem };
  },
  update: async (id, data) => {
    const list = getLS('dsystem_cursos', initialCursos);
    const updated = list.map(c => c.id === Number(id) ? { ...c, ...data } : c);
    setLS('dsystem_cursos', updated);
    return { data: updated.find(c => c.id === Number(id)) };
  },
  delete: async (id) => {
    const list = getLS('dsystem_cursos', initialCursos);
    setLS('dsystem_cursos', list.filter(c => c.id !== Number(id)));
    return { data: null };
  },
  addAlumno: async (cursoId, alumnoId) => {
    const list = getLS('dsystem_cursos', initialCursos);
    const updated = list.map(c => {
      if (c.id === Number(cursoId)) {
        const alumnos = c.alumnos || [];
        if (!alumnos.includes(Number(alumnoId))) {
          return { ...c, alumnos: [...alumnos, Number(alumnoId)] };
        }
      }
      return c;
    });
    setLS('dsystem_cursos', updated);
    return { data: updated.find(c => c.id === Number(cursoId)) };
  },
  removeAlumno: async (cursoId, alumnoId) => {
    const list = getLS('dsystem_cursos', initialCursos);
    const updated = list.map(c => {
      if (c.id === Number(cursoId)) {
        return { ...c, alumnos: (c.alumnos || []).filter(aid => aid !== Number(alumnoId)) };
      }
      return c;
    });
    setLS('dsystem_cursos', updated);
    return { data: updated.find(c => c.id === Number(cursoId)) };
  }
};

// ─── Planificaciones ─────────────────────────────────
export const planificacionAPI = {
  getAll: async () => {
    await new Promise(r => setTimeout(r, 600));
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    return { data: list.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)) };
  },
  getByDocente: async (docenteId) => {
    await new Promise(r => setTimeout(r, 600));
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    return { data: list.filter(p => p.docenteId === Number(docenteId)) };
  },
  create: async (data) => {
    await new Promise(r => setTimeout(r, 1000));
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    const newItem = { ...data, id: Date.now(), lastModified: new Date().toISOString() };
    setLS('dsystem_planificaciones', [newItem, ...list]);
    return { data: newItem };
  },
  update: async (id, data) => {
    await new Promise(r => setTimeout(r, 800));
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    const updated = list.map(p => p.id === Number(id) ? { ...p, ...data, lastModified: new Date().toISOString() } : p);
    setLS('dsystem_planificaciones', updated);
    return { data: updated.find(p => p.id === Number(id)) };
  },
  delete: async (id) => {
    await new Promise(r => setTimeout(r, 1000));
    const list = getLS('dsystem_planificaciones', initialPlanificaciones);
    setLS('dsystem_planificaciones', list.filter(p => p.id !== Number(id)));
    return { data: null };
  }
};

// Mock apiClient if needed elsewhere
const apiClient = {};
export default apiClient;
