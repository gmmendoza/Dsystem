export const PLANNING_TEMPLATES = [
  {
    id: 'diaria',
    nombre: 'Planificación Diaria',
    nivel: 'Primaria',
    icon: '🎯',
    secciones: [
      { id: 'objetivos', label: 'Objetivos del Día', placeholder: '¿Qué deben aprender hoy?', value: '' },
      { id: 'actividades', label: 'Secuencia de Actividades', placeholder: 'Paso 1, Paso 2...', value: '' },
      { id: 'evaluacion', label: 'Evaluación / Cierre', placeholder: '¿Cómo verificarás el aprendizaje?', value: '' }
    ]
  },
  {
    id: 'semanal',
    nombre: 'Planificación Semanal',
    nivel: 'Primaria',
    icon: '📅',
    secciones: [
      { id: 'lunes', label: 'Lunes', placeholder: 'Inicio de unidad...', value: '' },
      { id: 'martes', label: 'Martes', placeholder: 'Desarrollo...', value: '' },
      { id: 'miercoles', label: 'Miércoles', placeholder: 'Práctica...', value: '' },
      { id: 'jueves', label: 'Jueves', placeholder: 'Refuerzo...', value: '' },
      { id: 'viernes', label: 'Viernes', placeholder: 'Cierre semanal...', value: '' }
    ]
  },
  {
    id: 'inicial_juego',
    nombre: 'Unidad de Juego (Inicial)',
    nivel: 'Inicial',
    icon: '🧩',
    secciones: [
      { id: 'sala', label: 'Sala / Edad', placeholder: 'Ej: 4 años (Sala Roja)', value: '' },
      { id: 'area', label: 'Área de Experiencia', placeholder: 'Ej: Expresión Corporal', value: '' },
      { id: 'propositos', label: 'Propósitos Docentes', placeholder: '¿Qué pretendes fomentar?', value: '' },
      { id: 'actividades_ludicas', label: 'Desarrollo del Juego', placeholder: 'Descripción de la propuesta grupal...', value: '' },
      { id: 'recursos', label: 'Recursos y Materiales', placeholder: 'Canciones, bloques, telas...', value: '' }
    ]
  },
  {
    id: 'proyecto',
    nombre: 'Proyecto Educativo',
    nivel: 'Cualquiera',
    icon: '🚀',
    secciones: [
      { id: 'problema', label: 'Pregunta / Problema Eje', placeholder: '¿Cuál es el disparador del proyecto?', value: '' },
      { id: 'etapas', label: 'Etapas de Investigación', placeholder: '¿Cómo se organizará el proceso?', value: '' },
      { id: 'producto', label: 'Producto Final', placeholder: '¿Qué crearán los alumnos?', value: '' }
    ]
  }
];
