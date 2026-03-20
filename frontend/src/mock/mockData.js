export const initialAlumnos = [
  { 
    id: 1, 
    nombre: "Juan", 
    apellido: "Pérez", 
    dni: "42.123.456", 
    email: "juan.perez@escuela.edu",
    asistencia: 95,
    participacion: 85,
    dificultades: ["Tablas del 7 y 8", "División compleja"],
    progreso: [8, 7, 9, 8, 9]
  },
  { 
    id: 2, 
    nombre: "María", 
    apellido: "García", 
    dni: "41.987.654", 
    email: "maria.garcia@escuela.edu",
    asistencia: 88,
    participacion: 92,
    dificultades: ["Comprensión lectora"],
    progreso: [9, 9, 10, 9, 10]
  },
  { 
    id: 3, 
    nombre: "Pedro", 
    apellido: "Rodríguez", 
    dni: "43.555.444", 
    email: "pedro.rod@escuela.edu",
    asistencia: 75,
    participacion: 60,
    dificultades: ["Ortografía", "Geometría"],
    progreso: [6, 5, 7, 6, 6]
  },
  { 
    id: 4, 
    nombre: "Ana", 
    apellido: "Martínez", 
    dni: "42.333.222", 
    email: "ana.martinez@escuela.edu",
    asistencia: 100,
    participacion: 95,
    dificultades: [],
    progreso: [10, 10, 10, 10, 10]
  },
  { 
    id: 5, 
    nombre: "Lucas", 
    apellido: "Sánchez", 
    dni: "44.111.999", 
    email: "lucas.sanchez@escuela.edu",
    asistencia: 82,
    participacion: 70,
    dificultades: ["Cálculo mental"],
    progreso: [7, 8, 7, 8, 7]
  },
  {
    id: 6,
    nombre: "Valentina",
    apellido: "Gómez",
    dni: "45.222.111",
    email: "vale.gomez@escuela.edu",
    asistencia: 91,
    participacion: 88,
    dificultades: ["Fracciones"],
    progreso: [8, 9, 8, 9, 8]
  },
  {
    id: 7,
    nombre: "Santiago",
    apellido: "López",
    dni: "44.888.777",
    email: "santi.lopez@escuela.edu",
    asistencia: 94,
    participacion: 90,
    dificultades: [],
    progreso: [9, 9, 9, 9, 10]
  },
  {
    id: 8,
    nombre: "Camila",
    apellido: "Díaz",
    dni: "43.111.000",
    email: "cami.diaz@escuela.edu",
    asistencia: 85,
    participacion: 75,
    dificultades: ["Lectura en voz alta"],
    progreso: [7, 7, 8, 7, 8]
  },
  {
    id: 9,
    nombre: "Mateo",
    apellido: "Silva",
    dni: "42.999.888",
    email: "mateo.silva@escuela.edu",
    asistencia: 98,
    participacion: 94,
    dificultades: ["Geometría"],
    progreso: [9, 10, 9, 10, 9]
  },
  {
    id: 10,
    nombre: "Sofía",
    apellido: "Torres",
    dni: "41.000.111",
    email: "sofia.torres@escuela.edu",
    asistencia: 90,
    participacion: 82,
    dificultades: ["Multiplicación"],
    progreso: [8, 8, 7, 8, 8]
  }
];

export const initialCursos = [
  { 
    id: 1, 
    nombre: "3° A - Primaria", 
    nivel: "Primaria", 
    descripcion: "Turno Mañana - Ciclo Básico",
    alumnos: [1, 2, 3, 4, 5, 6, 7],
    metrics: {
        rendimientoMaterias: [
            { materia: "Matemática", promedio: 7.5, tendencia: "+5%" },
            { materia: "Lengua", promedio: 8.2, tendencia: "+2%" },
            { materia: "Ciencias Sociales", promedio: 9.0, tendencia: "0%" },
            { materia: "Ciencias Naturales", promedio: 8.5, tendencia: "+8%" }
        ],
        asistenciaPromedio: 88,
        asistenciaPorDia: [95, 92, 85, 90, 78],
        temasDificultad: ["Tablas de multiplicar", "Uso de tildes", "Fracciones"]
    },
    insights: [
        "Se detecta baja asistencia los viernes (78%) en comparación al resto de la semana.",
        "Matemática muestra una mejora del 5% tras la última unidad de fracciones.",
        "4 alumnos requieren refuerzo en comprensión lectora."
    ],
    recursos: [
      { id: 101, titulo: "Mapa de Argentina Político", materia: "Ciencias Sociales", nivel: "Primaria", tipo: "image", url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800", usageCount: 5, recent: true, usedIn: ["Geografía"] },
      { id: 102, titulo: "Video: El Ciclo del Agua", materia: "Ciencias Naturales", nivel: "Primaria", tipo: "video", url: "https://www.youtube.com/watch?v=kYbe_2xVezM", usageCount: 3, recent: true, usedIn: ["Hidrosfera"] },
      { id: 103, titulo: "Guía de Fracciones PDF", materia: "Matemática", nivel: "Primaria", tipo: "pdf", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800", usageCount: 8, recent: false, usedIn: ["Aritmética"] },
      { id: 104, titulo: "Célula Animal 3D", materia: "Ciencias Naturales", nivel: "Primaria", tipo: "image", url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=800", usageCount: 12, recent: false, usedIn: ["Biología"] }
    ]
  },
  { 
    id: 2, 
    nombre: "Sala Roja (5 años)", 
    nivel: "Inicial", 
    descripcion: "Jardín de Infantes - Turno Tarde",
    alumnos: [1, 3, 5, 8],
    recursos: [
      { id: 201, titulo: "Canción de los Colores", materia: "Música", nivel: "Inicial", tipo: "video", url: "https://www.youtube.com/watch?v=7uV_G1Q6RzM", usageCount: 15 },
      { id: 202, titulo: "Témperas y Pinceles", materia: "Arte", nivel: "Inicial", tipo: "image", url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800", usageCount: 2 }
    ]
  },
  {
    id: 3,
    nombre: "4° B - Primaria",
    nivel: "Primaria",
    descripcion: "Turno Tarde - Ciclo Intermedio",
    alumnos: [6, 7, 8, 9, 10],
    metrics: {
        rendimientoMaterias: [
            { materia: "Matemática", promedio: 8.8, tendencia: "+10%" },
            { materia: "Lengua", promedio: 7.9, tendencia: "-2%" },
            { materia: "Informática", promedio: 9.5, tendencia: "+15%" }
        ],
        asistenciaPromedio: 92,
        asistenciaPorDia: [90, 94, 95, 92, 89],
        temasDificultad: ["Anatomía Humana", "División por dos cifras"]
    },
    recursos: [
        { id: 301, titulo: "Sistemas del Cuerpo Humano", materia: "Ciencias Naturales", nivel: "Primaria", tipo: "image", url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800", usageCount: 20 },
        { id: 302, titulo: "Introducción a la Programación", materia: "Informática", nivel: "Primaria", tipo: "video", url: "https://www.youtube.com/watch?v=cKhVupvyhKk", usageCount: 45 }
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
  },
  {
    id: 3,
    titulo: "El Cuerpo Humano: Sistema Circulatorio",
    materia: "Ciencias Naturales",
    cursoId: 3,
    nivel: "Primaria",
    tipo: "Semanal",
    fechaInicio: "2026-03-25",
    fechaFin: "2026-03-31",
    objetivos: ["Identificar organos principales", "Entender flujo sanguíneo"],
    actividades: ["Visualización de modelos 3D", "Taller de RCP básico", "Esquema conceptual"],
    recursos: [
        { id: 4, type: "image", url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800", title: "Corazón Humano 3D" }
    ],
    evaluacion: "Presentación grupal de maquetas.",
    estado: "Activa",
    lastModified: "2026-03-20T12:00:00Z"
  }
];
