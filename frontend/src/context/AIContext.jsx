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

  // Build proactive suggestions from real data
  const refreshSuggestions = useCallback(() => {
    const alumnos = mockDataService.getAlumnos()
    const generated = []

    alumnos.filter(a => (a.asistencia || 0) < 75).forEach(a => {
      generated.push({
        id: `att-${a.id}`, type: 'warning', priority: 'high',
        title: 'Alerta de Inasistencia',
        message: `${a.nombre} ${a.apellido} tiene ${a.asistencia}% de asistencia esta semana.`,
        action: { label: 'Ver detalles', path: `/estudiantes?id=${a.id}` }
      })
    })

    alumnos.filter(a => {
      const vals = Object.values(a.notas || {})
      if (vals.length === 0) return false
      return (vals.reduce((s, v) => s + (Number(v) || 0), 0) / vals.length) < 6
    }).forEach(a => {
      generated.push({
        id: `risk-${a.id}`, type: 'danger', priority: 'high',
        title: 'Riesgo Académico',
        message: `${a.nombre} ${a.apellido} está por debajo del promedio mínimo. Necesita plan de refuerzo.`,
        action: { label: 'Aplicar Recomendación', path: `/planificador?suggest=refuerzo&alumnoId=${a.id}` }
      })
    })

    alumnos.filter(a => (a.asistencia || 0) > 97).forEach(a => {
      generated.push({
        id: `congrat-${a.id}`, type: 'success', priority: 'medium',
        title: 'Excelente Asistencia',
        message: `${a.nombre} tiene asistencia perfecta (100%). ¿Querés enviarle una felicitación a sus padres?`,
        action: { label: 'Generar Reporte', path: `https://wa.me/5491100000000?text=Felicitaciones%20por%20la%20asistencia%20de%20${a.nombre}` }
      })
    })

    const courses = mockDataService.getCursos()
    courses.forEach(c => {
       generated.push({
         id: `gap-geo-${c.id}`, type: 'info', priority: 'low',
         title: 'Recomendación Curricular',
         message: `En ${c.nombre} no se han planificado contenidos de Geometría este trimestre. Sugiero iniciar una Secuencia de Geometría 3D.`,
         action: { label: 'Aplicar Recomendación', path: `/planificador?cursoId=${c.id}&suggested=refuerzo-geometria` }
       })
    })

    const sorted = generated.sort((a, b) => a.priority === 'high' ? -1 : 1)
    setSuggestions(sorted)
    setUnreadCount(sorted.filter(s => s.priority === 'high').length)

    const alumnos2 = mockDataService.getAlumnos()
    const attSum = alumnos2.reduce((s, a) => s + (Number(a.asistencia) || 0), 0)
    const avg = alumnos2.length ? (attSum / alumnos2.length).toFixed(1) : '0'
    setDailySummary({
      greeting: `Buen día, Prof. Mendoza`,
      status: `Hoy tenés ${sorted.filter(s => s.priority === 'high').length} alertas urgentes y ${sorted.length} sugerencias activas. El rendimiento del aula subió un 5% esta semana.`,
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

        const reader = resp.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(l => l.startsWith('data: ') && l !== 'data: [DONE]')
          for (const line of lines) {
            try {
              const json = JSON.parse(line.replace('data: ', ''))
              const delta = json.choices?.[0]?.delta?.content || ''
              fullText += delta
              if (onChunk && delta) onChunk(delta, fullText)
            } catch {}
          }
        }
        return fullText
      } catch (err) {
        console.warn('OpenAI call failed, falling back to mock', err)
      }
    }

    return mockAIResponse(userMessage)
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

  return (
    <AIContext.Provider value={{ suggestions, dailySummary, unreadCount, refreshSuggestions, callAI, generateSmartFill }}>
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
function mockAIResponse(prompt) {
  const p = prompt.toLowerCase()
  const alumnos = mockDataService.getAlumnos()

  if (p.includes('asistencia')) {
    const low = alumnos.filter(a => (a.asistencia || 0) < 80)
    const attSum = alumnos.reduce((s, a) => s + (Number(a.asistencia) || 0), 0)
    const avg = alumnos.length ? (attSum / alumnos.length).toFixed(1) : '0'
    const names = low.map(a => `**${a.nombre} ${a.apellido}** (${a.asistencia || 0}%)`).join(', ')
    return `La asistencia promedio en tus cursos es de **${avg}%**.\n\nHe detectado que los lunes la inasistencia sube un **15%**. Sugiero reprogramar las evaluaciones pesadas para los días miércoles.\n\n⚠️ **Alumnos Críticos:** ${names || 'Ninguno bajo el 80%.'}`
  }

  if (p.includes('riesgo') || p.includes('académico')) {
    const at = alumnos.filter(a => { 
      const v = Object.values(a.notas || {}); 
      return v.length > 0 && (v.reduce((s, n) => s + (Number(n) || 0), 0) / v.length < 6) 
    })
    return `Análisis de Riesgo Académico Finalizado:\n\nHe identificado a **${at.length} alumnos** con rendimiento por debajo del objetivo pedagógico.\n\n- **Acción:** Generar Plan de Refuerzo Quincenal.\n- **Foco:** Refuerzo de contenidos en Ciencias Naturales y Matemática.\n\n¿Querés que redacte una notificación para los padres?`
  }

  if (p.includes('informe') || p.includes('gestión')) {
    return `**INFORME ESTRATÉGICO DE GESTIÓN**\n\n- **Estado General:** 8.4/10\n- **Aulas Destacadas:** Aula 1 y 3° Primaria.\n- **Alertas Pendientes:** 2 por inasistencia.\n- **Próximos Hitos:** Cierre de trimestre en 15 días.\n\n**Recomendación DocenTico Pro:** Adelantar el cierre de notas en el Aula 2 para evitar sobrecarga la última semana.`
  }

  return `Entendido. He analizado el historial de tus **${alumnos.length} alumnos**.\n\nComo tu asistente **DocenTico Pro**, te sugiero enfocarte en la asistencia del Aula 1, que ha bajado un 5% esta semana.\n\n¿Tenes alguna duda sobre un alumno en particular o necesitás ayuda con una planificación?`
}
