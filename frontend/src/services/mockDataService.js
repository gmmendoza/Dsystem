import { initialAlumnos, initialCursos, initialPlanificaciones } from '../mock/mockData';

const KEYS = {
  ALUMNOS: 'dsystem_alumnos',
  CURSOS: 'dsystem_cursos',
  PLANIFICACIONES: 'dsystem_planificaciones',
  ASISTENCIA: 'dsystem_asistencia',
  MATERIAS: 'dsystem_materias'
};

const initialMaterias = [
  { id: 1, nombre: 'Matemática', area: 'Exactas' },
  { id: 2, nombre: 'Lengua y Literatura', area: 'Comunicación' },
  { id: 3, nombre: 'Ciencias Naturales', area: 'Exactas' },
  { id: 4, nombre: 'Ciencias Sociales', area: 'Sociales' },
  { id: 5, nombre: 'Programación I', area: 'Tecnología' },
  { id: 6, nombre: 'Base de Datos', area: 'Tecnología' }
];

const getLS = (key, initial) => {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(saved);
};

const setLS = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const mockDataService = {
  // Inicialización
  init: () => {
    getLS(KEYS.ALUMNOS, initialAlumnos);
    getLS(KEYS.CURSOS, initialCursos);
    getLS(KEYS.PLANIFICACIONES, initialPlanificaciones);
    getLS(KEYS.MATERIAS, initialMaterias);
  },

  // Alumnos
  getAlumnos: () => getLS(KEYS.ALUMNOS, initialAlumnos),
  getAlumnoById: (id) => mockDataService.getAlumnos().find(a => a.id === Number(id)),
  saveAlumno: (data) => {
    const students = mockDataService.getAlumnos();
    const newStudent = { 
      ...data, 
      id: Date.now(), 
      asistencia: Number(data.asistencia) || Math.floor(Math.random() * (100 - 80 + 1)) + 80, 
      participacion: Number(data.participacion) || Math.floor(Math.random() * (100 - 70 + 1)) + 70 
    };
    setLS(KEYS.ALUMNOS, [newStudent, ...students]);
    return newStudent;
  },
  updateAlumno: (id, data) => {
    const students = mockDataService.getAlumnos();
    const updated = students.map(s => s.id === Number(id) ? { 
      ...s, 
      ...data,
      asistencia: Number(data.asistencia) || s.asistencia || 100,
      participacion: Number(data.participacion) || s.participacion || 100
    } : s);
    setLS(KEYS.ALUMNOS, updated);
    return updated.find(s => s.id === Number(id));
  },
  deleteAlumno: (id) => {
    const students = mockDataService.getAlumnos();
    const filtered = students.filter(s => s.id !== Number(id));
    setLS(KEYS.ALUMNOS, filtered);
  },

  // Cursos
  getCursos: () => getLS(KEYS.CURSOS, initialCursos),
  getCursoById: (id) => mockDataService.getCursos().find(c => c.id === Number(id)),
  saveCurso: (data) => {
    const courses = mockDataService.getCursos();
    const isUpdate = data.id && courses.some(c => c.id === Number(data.id));
    
    let updatedCourses;
    let savedItem;

    if (isUpdate) {
      savedItem = { ...courses.find(c => c.id === Number(data.id)), ...data };
      updatedCourses = courses.map(c => c.id === Number(data.id) ? savedItem : c);
    } else {
      savedItem = { 
        ...data, 
        id: Date.now(),
        alumnos: [],
        lastModified: new Date().toISOString()
      };
      updatedCourses = [savedItem, ...courses];
    }
    
    setLS(KEYS.CURSOS, updatedCourses);
    return savedItem;
  },
  deleteCurso: (id) => {
    const courses = mockDataService.getCursos();
    const filtered = courses.filter(c => c.id !== Number(id));
    setLS(KEYS.CURSOS, filtered);
  },

  // Materias
  getMaterias: () => getLS(KEYS.MATERIAS, initialMaterias),

  // Planificaciones
  getPlanificaciones: () => {
    const plans = getLS(KEYS.PLANIFICACIONES, initialPlanificaciones);
    return plans.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  },
  getPlanificacionesByCurso: (cursoId) => {
    return mockDataService.getPlanificaciones().filter(p => p.cursoId === Number(cursoId));
  },
  savePlanificacion: (data) => {
    const plans = mockDataService.getPlanificaciones();
    const isUpdate = data.id && plans.some(p => p.id === Number(data.id));
    
    let updatedPlans;
    let savedItem;

    if (isUpdate) {
      savedItem = { ...data, lastModified: new Date().toISOString() };
      updatedPlans = plans.map(p => p.id === Number(data.id) ? savedItem : p);
    } else {
      savedItem = { 
        ...data, 
        id: Date.now(), 
        lastModified: new Date().toISOString(),
        estado: data.estado || 'Activa'
      };
      updatedPlans = [savedItem, ...plans];
    }
    
    setLS(KEYS.PLANIFICACIONES, updatedPlans);
    return savedItem;
  },
  deletePlanificacion: (id) => {
    const plans = mockDataService.getPlanificaciones();
    const filtered = plans.filter(p => p.id !== Number(id));
    setLS(KEYS.PLANIFICACIONES, filtered);
  },

  // Asistencia
  getAsistencia: (cursoId, fecha) => {
    const all = getLS(KEYS.ASISTENCIA, {});
    return all[`${cursoId}_${fecha}`] || {};
  },
  saveAsistencia: (cursoId, fecha, data) => {
    const all = getLS(KEYS.ASISTENCIA, {});
    all[`${cursoId}_${fecha}`] = data;
    setLS(KEYS.ASISTENCIA, all);
    return data;
  }
};
