import { mockDataService } from './mockDataService';

export const AIService = {
  /**
   * Generates proactive suggestions based on current students and courses data.
   */
  getProactiveSuggestions: () => {
    const alumnos = mockDataService.getAlumnos();
    const suggestions = [];

    // 1. Check for low attendance (Risk of dropout)
    const lowAttendance = alumnos.filter(a => a.asistencia < 75);
    lowAttendance.forEach(a => {
      suggestions.push({
        id: `attr-${a.id}`,
        type: 'warning',
        title: 'Alerta de Inasistencia',
        message: `El alumno ${a.nombre} ${a.apellido} tiene un ${a.asistencia}% de asistencia. Considerá contactar a su tutor.`,
        actionLabel: 'Ver Ficha',
        actionPath: `/estudiantes?id=${a.id}`,
        priority: 'high'
      });
    });

    // 2. Check for low grades
    const lowGrades = alumnos.filter(a => {
      if (!a.notas) return false;
      const values = Object.values(a.notas);
      const avg = values.reduce((acc, curr) => acc + curr, 0) / values.length;
      return avg < 6;
    });
    
    lowGrades.forEach(a => {
      suggestions.push({
        id: `grade-${a.id}`,
        type: 'danger',
        title: 'Riesgo Académico',
        message: `${a.nombre} ${a.apellido} muestra un rendimiento bajo en materias clave. Se sugiere un plan de refuerzo.`,
        actionLabel: 'Crear Plan',
        actionPath: `/planificador?suggest=refuerzo&alumnoId=${a.id}`,
        priority: 'high'
      });
    });

    // 3. General Classroom patterns (simulated)
    suggestions.push({
      id: 'pattern-1',
      type: 'info',
      title: 'Patrón Detectado',
      message: 'El curso 3°A tiene un 40% de inasistencias los lunes. Revisá si hay un examen o actividad que cause esto.',
      actionLabel: 'Ver Gráfico',
      actionPath: '/aula/1?tab=progreso',
      priority: 'medium'
    });

    return suggestions.sort((a, b) => (a.priority === 'high' ? -1 : 1));
  },

  /**
   * Generates a high-level summary for the user at login.
   */
  getDailySummary: () => {
    const suggestions = AIService.getProactiveSuggestions();
    const highPriority = suggestions.filter(s => s.priority === 'high');
    
    return {
      greeting: '¡Hola, Prof. Mendoza!',
      status: 'Hoy tienes 4 clases programadas y 2 alertas críticas que requieren tu atención.',
      topInsight: highPriority[0] || suggestions[0],
      stats: {
        attendanceAvg: '92%',
        activePlans: 12,
        unreviewedNotes: 5
      }
    };
  }
};
