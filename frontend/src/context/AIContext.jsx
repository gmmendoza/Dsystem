import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { mockDataService } from '../services/mockDataService'

const AIContext = createContext(null)

/**
 * Builds a rich system prompt from live student/course data.
 */
function buildSystemPrompt() {
  const alumnos = mockDataService.getAlumnos()
  const cursos  = mockDataService.getCursos()

  const lowAtt  = alumnos.filter(a => (a.asistencia || 0) < 80)
  const atRisk  = alumnos.filter(a => {
    const vals = Object.values(a.notas || {})
    if (vals.length === 0) return false
    const avg  = vals.reduce((s, v) => s + (Number(v) || 0), 0) / vals.length
    return avg < 6
  })
  const attendanceSum = alumnos.reduce((s, a) => s + (Number(a.asistencia) || 0), 0)
  const avgAtt = alumnos.length ? (attendanceSum / alumnos.length).toFixed(1) : '0'

  return `Eres DocenTico, el asistente de inteligencia artificial experto en pedagogía integrado en DSystem.
Tu objetivo es ayudar al Prof. Mendoza a optimizar su labor docente.

📊 ESTADO DEL AULA:
- Alumnos: ${alumnos.length}
- Asistencia: ${avgAtt}%
- En riesgo académico: ${atRisk.length} (${atRisk.map(a => `${a.nombre}`).join(', ')})
- Alumnos destacados (mejora > 10% asistencia): ${alumnos.filter(a => (a.asistencia || 0) > 95).length}

📌 NORMAS:
- Sugiere ACCIONES ASISTIDAS (ej: "Crear plan de refuerzo", "Enviar felicitación").
- Sé proactivo: si ves que falta planificación en un aula, coméntalo.
- Usa un tono profesional pero motivador.
- Limita tus respuestas a 2-3 párrafos cortos.`
}

export function AIProvider({ children }) {
  const [suggestions, setSuggestions]     = useState([])
  const [dailySummary, setDailySummary]   = useState(null)
  const [unreadCount, setUnreadCount]     = useState(0)

  // Build proactive suggestions from real data with Trend Analysis
  const refreshSuggestions = useCallback(() => {
    const alumnos = mockDataService.getAlumnos()
    const generated = []

    // 1. Critical Attendance (Current)
    alumnos.filter(a => (a.asistencia || 0) < 75).forEach(a => {
      generated.push({
        id: `att-${a.id}`, type: 'warning', priority: 'high',
        title: 'Alerta de Inasistencia',
        message: `${a.nombre} ${a.apellido} tiene ${a.asistencia}% de asistencia. Requiere contacto urgente con tutores.`,
        action: { label: 'Notificar Tutores', path: `/estudiantes?id=${a.id}&action=notify` }
      })
    })

    // 2. Academic Risk (Current)
    alumnos.filter(a => {
      const vals = Object.values(a.notas || {})
      if (vals.length === 0) return false
      return (vals.reduce((s, v) => s + (Number(v) || 0), 0) / vals.length) < 6
    }).forEach(a => {
      generated.push({
        id: `risk-${a.id}`, type: 'danger', priority: 'high',
        title: 'Riesgo Académico',
        message: `${a.nombre} está por debajo del promedio. Sugiero aplicar Plan de Refuerzo Personalizado.`,
        action: { label: 'Crear Plan Refuerzo', path: `/planificador?suggest=refuerzo&alumnoId=${a.id}` }
      })
    })

    // 3. Trend Analysis (Proactive - Detecting decline before failure)
    // We mock trends by checking if participation < 85 while attendance is still OK
    alumnos.filter(a => (a.participacion || 0) < 80 && (a.asistencia || 0) >= 90).forEach(a => {
      generated.push({
        id: `trend-down-${a.id}`, type: 'info', priority: 'medium',
        title: 'Tendencia en Descenso',
        message: `He detectado una baja del 15% en la participación de ${a.nombre}. ¿Querés que analice su historial emocional?`,
        action: { label: 'Analizar Causa', path: `/estudiantes?id=${a.id}&tab=ia` }
      })
    })

    // 4. Positive Reinforcement
    alumnos.filter(a => (a.asistencia || 0) > 97 && (a.participacion || 0) > 95).forEach(a => {
      generated.push({
        id: `congrat-${a.id}`, type: 'success', priority: 'low',
        title: 'Alumno Destacado',
        message: `${a.nombre} mantiene un nivel de excelencia. ¿Enviamos una nota de felicitación?`,
        action: { label: 'Felicitar', path: `https://wa.me/5491100000000?text=Felicitaciones%20por%20el%20desempeño%20de%20${a.nombre}` }
      })
    })

    const courses = mockDataService.getCursos()
    courses.forEach(c => {
       generated.push({
         id: `gap-geo-${c.id}`, type: 'info', priority: 'low',
         title: 'Puntos Ciegos del Programa',
         message: `En ${c.nombre} falta cubrir el eje de Geometría. DocenTico puede generar una secuencia ahora.`,
         action: { label: 'Generar Secuencia', path: `/planificador?cursoId=${c.id}&suggested=geometria` }
       })
    })

    const sorted = generated.sort((a, b) => {
      const p = { high: 3, medium: 2, low: 1 }
      return p[b.priority] - p[a.priority]
    })
    
    setSuggestions(sorted)
    setUnreadCount(sorted.filter(s => s.priority === 'high').length)

    const attSum = alumnos.reduce((s, a) => s + (Number(a.asistencia) || 0), 0)
    const avg = alumnos.length ? (attSum / alumnos.length).toFixed(1) : '0'
    
    setDailySummary({
      greeting: `Buen día, Prof. Mendoza`,
      status: `DocenTico ha detectado ${sorted.filter(s => s.priority === 'high').length} puntos de intervención urgente. El compromiso general del aula se mantiene estable en ${avg}%.`,
      topInsight: sorted[0],
      stats: { attendanceAvg: `${avg}%`, activePlans: 12, atRisk: sorted.filter(s => s.type === 'danger').length }
    })
  }, [])

  useEffect(() => { refreshSuggestions() }, [refreshSuggestions])

  /**
   * Calls OpenAI API if VITE_OPENAI_API_KEY is set, otherwise falls back to mock.
   */
  const callAI = useCallback(async (userMessage, history = [], onChunk) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY

    if (apiKey) {
      try {
        const messages = [
          { role: 'system', content: buildSystemPrompt() },
          ...history.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage }
        ]

        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({ model: 'gpt-4o-mini', messages, stream: true, max_tokens: 600, temperature: 0.7 })
        })

        if (!resp.ok) throw new Error('OpenAI API error')

        return fullText
      } catch (err) {
        console.warn('OpenAI call failed, falling back to mock', err)
      }
    }

    // Improved Mock Flow with thinking delay
    await new Promise(r => setTimeout(r, 1200))
    const response = mockAIResponse(userMessage, history)
    if (onChunk) onChunk(response, response) 
    return response
  }, [])

  /**
   * Specifically for generating lesson plan content.
   */
  const generateSmartFill = useCallback(async (subject, title, onChunk) => {
    const prompt = `Actúa como un experto pedagogo. Genera una propuesta de planificación docente para la materia "${subject}" con el título "${title}". 
      
      IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido con esta estructura:
      {
        "titulo": "Título optimizado",
        "objetivos": ["Objetivo 1", "Objetivo 2", "Objetivo 3"],
        "actividades": ["Actividad 1", "Actividad 2", "Actividad 3"],
        "evaluacion": "Descripción de la evaluación"
      }
      
      No incluyas explicaciones adicionales, solo el JSON.`

    const result = await callAI(prompt, [], (chunk, full) => {
      if (onChunk) onChunk(chunk, full)
    })

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(result)
    } catch (err) {
      console.error('Failed to parse AI Smart Fill JSON', err)
      return null
    }
  }, [callAI])

  /**
   * Generates a weekly strategy for a classroom
   */
  const getWeeklyStrategy = useCallback(async (cursoNombre, alumnos) => {
    await new Promise(r => setTimeout(r, 1500))
    const low = alumnos.filter(a => (a.asistencia || 0) < 75 || (Object.values(a.notas || {}).reduce((s,v)=>s+v,0)/Math.max(1,Object.values(a.notas || {}).length)) < 6)
    
    return {
      estrategia: "Refuerzo Conceptual Grupal",
      impacto: "Mejora proyectada del 15% en el próximo examen.",
      consejito: "He notado que el grupo responde mejor a disparadores visuales los miércoles.",
      plan: [
        `Focalizar en los ${low.length} alumnos con rezago.`,
        "Implementar 'Cápsulas de Repaso' de 10 min al inicio.",
        "Asignar tutoría de pares entre alumnos destacados y en riesgo."
      ]
    }
  }, [])

  /**
   * Refines a piece of content (objective or activity)
   */
  const refineContent = useCallback(async (content, mode) => {
    await new Promise(r => setTimeout(r, 1200))
    const refinements = {
      'gamify': `[GAMIFICADO] ${content} - Incorporar un sistema de 'Experiencia' (XP) y desafíos por niveles para aumentar la motivación.`,
      'simplify': `[SIMPLIFICADO] ${content} - Reducir la carga cognitiva enfocándose solo en el concepto núcleo y eliminando tecnicismos secundarios.`,
      'inclusion': `[INCLUSIVO] ${content} - Adaptar con apoyos visuales y lectura fácil, permitiendo múltiples formas de expresión (dibujo, audio, texto).`
    }
    return refinements[mode] || content
  }, [])

  /**
   * Generates a concrete pedagogical solution (material, guide, etc.)
   */
  const suggestSolution = useCallback(async (type, data) => {
    // Simulated AI material generation
    await new Promise(r => setTimeout(r, 1500));
    
    const solutions = {
      'refuerzo': {
        titulo: 'Guía de Refuerzo Personalizada',
        descripcion: `Material diseñado específicamente para ${data?.nombre || 'el alumno'} enfocándose en las brechas detectadas en la última evaluación.`,
        pasos: [
          'Repaso de conceptos básicos de la unidad.',
          'Ejercicios prácticos con andamiaje visual.',
          'Autoevaluación de metacoognición.'
        ],
        recursoRelacionado: { nombre: 'Guía Completa PDF', tipo: 'PDF' }
      },
      'actividad': {
        titulo: 'Propuesta de Actividad Adaptada',
        descripcion: 'Secuencia didáctica dinámica para trabajar contenidos curriculares con gamificación.',
        pasos: [
          'Inicio: Problematización de la realidad.',
          'Desarrollo: Trabajo grupal por estaciones.',
          'Cierre: Puesta en común digital.'
        ],
        recursoRelacionado: { nombre: 'Presentación de Apoyo', tipo: 'Enlace' }
      }
    };

    return solutions[type] || solutions['actividad'];
  }, []);

  /**
   * Generates a personalized roadmap for a student
   */
  const getStudentRoadmap = useCallback(async (alumno) => {
    await new Promise(r => setTimeout(r, 1800))
    const prom = (Object.values(alumno.notas || {}).reduce((s,v)=>s+v,0)/Math.max(1,Object.values(alumno.notas || {}).length)).toFixed(1)
    
    return {
      nombre: `Ruta Pro de ${alumno.nombre}`,
      diagnostico: `Detectamos una brecha en el promedio (${prom}). Su estilo de aprendizaje es pragmático.`,
      etapas: [
        { titulo: 'Nivelación Fundamental', desc: 'Repaso de prerrequisitos mediante micro-aprendizajes.' },
        { titulo: 'Práctica con Andamiaje', desc: 'Ejercicios guiados con feedback inmediato de 1 a 1.' },
        { titulo: 'Validación de Saberes', desc: 'Evaluación alternativa (proyecto o presentación).' }
      ],
      proximaMeta: 'Alcanzar el 7.0 en el cierre de contenidos.'
    }
  }, [])

  const downloadReport = useCallback((content, filename = 'Informe_DocenTico.txt') => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  return (
    <AIContext.Provider value={{ 
      suggestions, 
      dailySummary, 
      unreadCount, 
      refreshSuggestions, 
      callAI, 
      generateSmartFill, 
      suggestSolution,
      getWeeklyStrategy,
      getStudentRoadmap,
      refineContent,
      downloadReport
    }}>
      {children}
    </AIContext.Provider>
  )
}

export const useAI = () => {
  const ctx = useContext(AIContext)
  if (!ctx) throw new Error('useAI must be used within AIProvider')
  return ctx
}

// ── MOCK RESPONSE ENGINE ────────────────────────────────────────
function mockAIResponse(prompt, history = []) {
  const p = prompt.toLowerCase()
  const alumnos = mockDataService.getAlumnos()
  const low = alumnos.filter(a => (a.asistencia || 0) < 75 || (Object.values(a.notas || {}).reduce((s,v)=>s+v,0)/Math.max(1,Object.values(a.notas || {}).length)) < 6)
  
  // Get last AI message for context
  const lastAI = [...history].reverse().find(m => m.role === 'assistant')?.content?.toLowerCase() || ''
  
  // 1. Contextual Follow-up Detection
  if (p === 'si' || p === 'claro' || p === 'dale' || p === 'bueno' || p === 'procedé') {
    if (lastAI.includes('asistencia')) {
      return `**¡Perfecto!** Redactando informe de seguimiento para los tutores de los alumnos rezagados. \n\n¿Querés que lo envíe automáticamente o preferís revisarlo primero?`
    }
    if (lastAI.includes('riesgo') || lastAI.includes('académico')) {
      return `**Entendido.** He generado una propuesta de **Plan de Refuerzo Personalizado**. \n\n¿Querés ver los objetivos simplificados que propongo para la primera semana?`
    }
    if (lastAI.includes('planificar') || lastAI.includes('secuencia')) {
      return `**Excelente elección.** Vamos a detallar la secuencia didáctica. \n\n¿Preferís que el enfoque sea principalmente **Práctico/Técnico** o más **Investigativo/ABP**?`
    }
  }

  // 2. Main Keyword Detection
  if (p.includes('asistencia')) {
    const attSum = alumnos.reduce((s, a) => s + (Number(a.asistencia) || 0), 0)
    const avg = alumnos.length ? (attSum / alumnos.length).toFixed(1) : '0'
    const names = low.filter(a => a.asistencia < 75).map(a => `**${a.nombre}** (${a.asistencia}%)`).join(', ')
    return `**Análisis de Asistencia DocenTico:**\n\nEl promedio grupal es del **${avg}%**. He detectado que las faltas se concentran los lunes post-feriado.\n\n⚠️ **Casos Críticos:** ${names || 'Sin alertas.'}\n\n¿Querés que redacte un mensaje de seguimiento para sus tutores?`
  }

  if (p.includes('riesgo') || p.includes('académico')) {
    const at = low.filter(a => (Object.values(a.notas || {}).reduce((s,v)=>s+v,0)/Math.max(1,Object.values(a.notas || {}).length)) < 6)
    return `**Reporte de Riesgo Académico:**\n\nHe identificado a **${at.length} alumnos** por debajo del umbral de aprobación (6.0).\n\n- **Contenido Afectado:** Principalmente en el eje de Resolución de Problemas.\n- **Sugerencia:** Aplicar técnica de *andamiaje* en las próximas dos clases.\n\n¿Querés que genere una propuesta de refuerzo para **${at[0]?.nombre || 'ellos'}**?`
  }

  if (p.includes('planificar') || p.includes('secuencia')) {
    return `**Propuesta de Planificación DocenTico:**\n\nPara el tema solicitado, sugiero una estructura de **Aprendizaje Basado en Proyectos (ABP)**:\n\n1. **Inicio:** Pregunta disparadora vinculada a la vida cotidiana.\n2. **Desarrollo:** Investigación guiada usando recursos multimedia.\n3. **Cierre:** Gamificación para verificar la comprensión.\n\n¿Querés que detalle los objetivos pedagógicos específicos?`
  }

  if (p.includes('informe') || p.includes('ejecutivo')) {
    return `**INFORME EJECUTIVO DE GESTIÓN (MOCK)**\n\n- **Métricas:** Asistencia ${ (alumnos.reduce((s,a)=>s+a.asistencia,0)/alumnos.length).toFixed(1) }%, Rendimiento 8.2\n- **Intervenciones:** ${low.length} sugeridas esta semana.\n- **Próximos Pasos:** Nivelar el grupo en contenidos de Lectoescritura.\n\nInforme listo para exportar a PDF.`
  }

  if (p.includes('gracias') || p.includes('ok') || p.includes('listo')) {
     return `¡De nada! Quedo a tu disposición para cualquier otra consulta sobre tus aulas o alumnos. ¡Que tengas una excelente jornada escolar! 🍎`
  }

  // Fallback / Initial
  return `Entendido. He analizado el historial de tus **${alumnos.length} alumnos**.\n\nComo tu asistente **DocenTico Pro**, detecto que el clima escolar es positivo pero hay una brecha en la entrega de trabajos prácticos en **3° A**. \n\n¿En qué área específica necesitás mi ayuda hoy?`
}
