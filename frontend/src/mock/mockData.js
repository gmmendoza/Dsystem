export const initialAlumnos = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', dni: '11111111', email: 'juan.perez@example.com' },
  { id: 2, nombre: 'María', apellido: 'García', dni: '22222222', email: 'maria.garcia@example.com' },
  { id: 3, nombre: 'Carlos', apellido: 'Sánchez', dni: '33333333', email: 'carlos.sanchez@example.com' },
  { id: 4, nombre: 'Ana', apellido: 'Martínez', dni: '44444444', email: 'ana.martinez@example.com' },
  { id: 5, nombre: 'Luis', apellido: 'Rodríguez', dni: '55555555', email: 'luis.rodriguez@example.com' },
  { id: 6, nombre: 'Elena', apellido: 'Gómez', dni: '66666666', email: 'elena.gomez@example.com' },
  { id: 7, nombre: 'Pedro', apellido: 'López', dni: '77777777', email: 'pedro.lopez@example.com' },
  { id: 8, nombre: 'Sofía', apellido: 'Fernández', dni: '88888888', email: 'sofia.fernandez@example.com' },
  { id: 9, nombre: 'Diego', apellido: 'González', dni: '99999999', email: 'diego.gonzalez@example.com' },
  { id: 10, nombre: 'Lucía', apellido: 'Díaz', dni: '10101010', email: 'lucia.diaz@example.com' },
];

export const initialCursos = [
  { 
    id: 1, 
    nombre: '3° A - Primaria', 
    descripcion: 'Año de fortalecimiento en lectoescritura', 
    nivel: 'Primaria', 
    alumnos: [1, 2, 3, 4, 5],
    recursos: [
      { id: 101, titulo: 'Video Fracciones', tipo: 'video', url: 'https://www.youtube.com/embed/P_NEn9vR9_k' },
      { id: 102, titulo: 'Imagen Figuras', tipo: 'imagen', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=200&auto=format&fit=crop' }
    ]
  },
  { 
    id: 2, 
    nombre: 'Sala de 5 - Jardín', 
    descripcion: 'Nivel Inicial: Sala Roja', 
    nivel: 'Inicial', 
    alumnos: [6, 7, 8],
    recursos: [
      { id: 103, titulo: 'Canción Infantil', tipo: 'video', url: 'https://www.youtube.com/embed/7P6L7p3E6yM' }
    ]
  },
];

export const initialPlanificaciones = [
  { 
    id: 1, 
    titulo: 'Unidad 1: Los Números', 
    cursoId: 1, 
    fechaInicio: '2026-03-01', 
    fechaFin: '2026-03-15', 
    estado: 'Finalizada', 
    completada: true,
    observaciones: 'Buena participación del grupo.',
    secciones: [
      { id: 'obj', label: 'Objetivos', value: 'Conocer los números del 1 al 100' },
      { id: 'act', label: 'Actividades', value: 'Dictado y juegos de mesa' }
    ],
    lastModified: '2026-03-10T10:00:00Z'
  },
  { 
    id: 2, 
    titulo: 'Unidad 2: Multiplicación', 
    cursoId: 1, 
    fechaInicio: '2026-03-16', 
    fechaFin: '2026-03-30', 
    estado: 'Activa', 
    completada: false,
    observaciones: '',
    secciones: [
      { id: 'obj', label: 'Objetivos', value: 'Aprender las tablas del 2 al 5' },
      { id: 'act', label: 'Actividades', value: 'Ejercicios en el cuaderno' }
    ],
    lastModified: '2026-03-20T08:30:00Z'
  },
];
