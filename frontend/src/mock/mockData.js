export const initialAlumnos = [
  { id: 1, nombre: "Juan", apellido: "Pérez", dni: "42.123.456", email: "juan.perez@escuela.edu" },
  { id: 2, nombre: "María", apellido: "García", dni: "41.987.654", email: "maria.garcia@escuela.edu" },
  { id: 3, nombre: "Pedro", apellido: "Rodríguez", dni: "43.555.444", email: "pedro.rod@escuela.edu" },
  { id: 4, nombre: "Ana", apellido: "Martínez", dni: "42.333.222", email: "ana.martinez@escuela.edu" },
  { id: 5, nombre: "Lucas", apellido: "Sánchez", dni: "44.111.999", email: "lucas.sanchez@escuela.edu" }
];

export const initialCursos = [
  { 
    id: 1, 
    nombre: "3° A - Primaria", 
    nivel: "Primaria", 
    descripcion: "Turno Mañana - Ciclo Básico",
    alumnos: [1, 2, 3, 4, 5],
    recursos: [
      { id: 101, titulo: "Mapa de Argentina", tipo: "image", url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800" },
      { id: 102, titulo: "Video: Fotosíntesis", tipo: "video", url: "https://www.youtube.com/watch?v=kYbe_2xVezM" },
      { id: 103, titulo: "Gráfico de Barras", tipo: "image", url: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=800" }
    ]
  },
  { 
    id: 2, 
    nombre: "Sala Roja (5 años)", 
    nivel: "Inicial", 
    descripcion: "Jardín de Infantes - Turno Tarde",
    alumnos: [1, 3, 5],
    recursos: [
      { id: 201, titulo: "Canción de los Colores", tipo: "video", url: "https://www.youtube.com/watch?v=7uV_G1Q6RzM" },
      { id: 202, titulo: "Témperas y Pinceles", tipo: "image", url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800" }
    ]
  }
];

export const initialPlanificaciones = [
  {
    id: 1,
    titulo: "Funciones Lineales y Gráficos",
    materia: "Matemática",
    cursoId: 1,
    nivel: "Primaria",
    tipo: "Diaria",
    fechaInicio: "2026-03-20",
    fechaFin: "2026-03-20",
    objetivos: ["Comprender el concepto de pendiente", "Interpretar gráficos cartesianos"],
    actividades: ["Introducción teórica mediante pizarra digital", "Resolución de ejercicios prácticos", "Debate sobre aplicaciones en la vida diaria"],
    recursos: [
      { id: 1, type: "image", url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800", title: "Gráfico de Funciones" },
      { id: 2, type: "video", url: "https://www.youtube.com/watch?v=kYbe_2xVezM", title: "Explicación Pendiente" }
    ],
    evaluacion: "Resolución de problemas prácticos individuales.",
    estado: "Activa",
    lastModified: "2026-03-20T10:00:00Z"
  },
  {
    id: 2,
    titulo: "Exploración de Colores",
    materia: "Expresión Artística",
    cursoId: 2,
    nivel: "Inicial",
    tipo: "Diaria",
    fechaInicio: "2026-03-22",
    fechaFin: "2026-03-22",
    objetivos: ["Reconocimiento de colores primarios", "Fomentar la motricidad fina"],
    actividades: ["Mezcla de témperas sobre papel madera", "Juego de búsqueda de objetos rojos", "Canción de despedida descriptiva"],
    recursos: [
       { id: 3, type: "video", url: "https://www.youtube.com/watch?v=7uV_G1Q6RzM", title: "Canción: Los Colores" }
    ],
    evaluacion: "Observación directa de la participación y disfrute lúdico.",
    estado: "En progreso",
    lastModified: "2026-03-20T11:00:00Z"
  }
];
