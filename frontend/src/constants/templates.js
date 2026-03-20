export const PLANNING_TEMPLATES = [
  {
    id: 'diaria',
    nombre: 'Planificación Diaria',
    nivel: 'Primaria',
    icon: '🎯',
    secciones: [
      { id: 'objetivos', label: 'Objetivos del Día', type: 'text', placeholder: '¿Qué deben aprender hoy?', value: { text: '' } },
      { id: 'actividades', label: 'Secuencia de Actividades', type: 'text', placeholder: 'Paso 1, Paso 2...', value: { text: '' } },
      { id: 'evaluacion', label: 'Evaluación / Cierre', type: 'text', placeholder: '¿Cómo verificarás el aprendizaje?', value: { text: '' } }
    ]
  },
  {
    id: 'semanal',
    nombre: 'Planificación Semanal',
    nivel: 'Primaria',
    icon: '📅',
    secciones: [
      { id: 'lunes', label: 'Lunes', type: 'text', placeholder: 'Inicio de unidad...', value: { text: '' } },
      { id: 'martes', label: 'Martes', type: 'text', placeholder: 'Desarrollo...', value: { text: '' } },
      { id: 'miercoles', label: 'Miércoles', type: 'text', placeholder: 'Práctica...', value: { text: '' } },
      { id: 'jueves', label: 'Jueves', type: 'text', placeholder: 'Refuerzo...', value: { text: '' } },
      { id: 'viernes', label: 'Viernes', type: 'text', placeholder: 'Cierre semanal...', value: { text: '' } }
    ]
  },
  {
    id: 'inicial_juego',
    nombre: 'Unidad de Juego (Inicial)',
    nivel: 'Inicial',
    icon: '🧩',
    secciones: [
      { id: 'sala', label: 'Sala / Edad', type: 'text', placeholder: 'Ej: 4 años (Sala Roja)', value: { text: '' } },
      { id: 'area', label: 'Área de Experiencia', type: 'text', placeholder: 'Ej: Expresión Corporal', value: { text: '' } },
      { id: 'propositos', label: 'Propósitos Docentes', type: 'text', placeholder: '¿Qué pretendes fomentar?', value: { text: '' } },
      { id: 'actividades_ludicas', label: 'Desarrollo del Juego', type: 'text', placeholder: 'Descripción de la propuesta grupal...', value: { text: '' } },
      { id: 'recursos', label: 'Recursos y Materiales', type: 'text', placeholder: 'Canciones, bloques, telas...', value: { text: '' } }
    ]
  },
  {
    id: 'proyecto',
    nombre: 'Proyecto Educativo',
    nivel: 'Cualquiera',
    icon: '🚀',
    secciones: [
      { id: 'problema', label: 'Pregunta / Problema Eje', type: 'text', placeholder: '¿Cuál es el disparador del proyecto?', value: { text: '' } },
      { id: 'etapas', label: 'Etapas de Investigación', type: 'text', placeholder: '¿Cómo se organizará el proceso?', value: { text: '' } },
      { id: 'producto', label: 'Producto Final', type: 'text', placeholder: '¿Qué crearán los alumnos?', value: { text: '' } }
    ]
  }
];
