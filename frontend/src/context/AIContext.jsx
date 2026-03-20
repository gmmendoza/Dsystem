import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { mockDataService } from '../services/mockDataService'

const AIContext = createContext(null)

/**
 * Builds a rich system prompt from live student/course data.
 */
function buildSystemPrompt() {
  const alumnos = mockDataService.getAlumnos()
  const cursos  = mockDataService.getCursos()

  const lowAtt  = alumnos.filter(a => a.asistencia < 80)
  const atRisk  = alumnos.filter(a => {
    if (!a.notas) return false
    const vals = Object.values(a.notas)
    const avg  = vals.reduce((s, v) => s + v, 0) / vals.length
    return avg < 6
  })
  const avgAtt = alumnos.length
    ? (alumnos.reduce((s, a) => s + a.asistencia, 0) / alumnos.length).toFixed(1)
    : '0'

  return `Eres DocenTico, el asistente de inteligencia artificial integrado en DSystem, una plataforma SaaS de gestión educativa.
Tu objetivo es ayudar al docente Prof. Mendoza a gestionar sus aulas, planificaciones y estudiantes de forma eficiente.

📊 DATOS DEL SISTEMA (actualizado en tiempo real):
- Total de alumnos: ${alumnos.length}
- Asistencia promedio: ${avgAtt}%
- Alumnos con asistencia < 80%: ${lowAtt.length} (${lowAtt.map(a => `${a.nombre} ${a.apellido}`).join(', ') || 'ninguno'})
- Alumnos en riesgo académico (promedio < 6): ${atRisk.length} (${atRisk.map(a => `${a.nombre} ${a.apellido}`).join(', ') || 'ninguno'})
- Aulas activas: ${cursos.length}

📌 INSTRUCCIONES:
- Responde siempre en español, de forma concisa y directa.
- Usa datos reales del sistema cuando corresponda.
- Termina las sugerencias con UNA acción concreta y específica.
- Si detectas un problema urgente (asistencia < 70% o promedio < 5), marqualo como URGENTE.
- Usa negritas para valores importantes.
- No inventes datos que no estén en el contexto.`
}

export function AIProvider({ children }) {
  const [suggestions, setSuggestions]     = useState([])
  const [dailySummary, setDailySummary]   = useState(null)
  const [unreadCount, setUnreadCount]     = useState(0)

  // Build proactive suggestions from real data
  const refreshSuggestions = useCallback(() => {
    const alumnos = mockDataService.getAlumnos()
    const generated = []

    alumnos.filter(a => a.asistencia < 75).forEach(a => {
      generated.push({
        id: `att-${a.id}`, type: 'warning', priority: 'high',
        title: 'Alerta de Inasistencia',
        message: `${a.nombre} ${a.apellido} tiene ${a.asistencia}% de asistencia esta semana.`,
        action: { label: 'Ver ficha', path: `/estudiantes?id=${a.id}` }
      })
    })

    alumnos.filter(a => {
      if (!a.notas) return false
      const vals = Object.values(a.notas)
      return (vals.reduce((s, v) => s + v, 0) / vals.length) < 6
    }).forEach(a => {
      generated.push({
        id: `risk-${a.id}`, type: 'danger', priority: 'high',
        title: 'Riesgo Académico',
        message: `${a.nombre} ${a.apellido} está por debajo del promedio mínimo. Necesita plan de refuerzo.`,
        action: { label: 'Crear plan', path: `/planificador?suggest=refuerzo&alumnoId=${a.id}` }
      })
    })

    generated.push({
      id: 'pattern-monday', type: 'info', priority: 'medium',
      title: 'Patrón Detectado',
      message: 'El curso 3°A registra 40% más inasistencias los lunes. Considerá revisar actividades de inicio de semana.',
      action: { label: 'Ver estadísticas', path: '/aula/1?tab=progreso' }
    })

    const sorted = generated.sort((a, b) => a.priority === 'high' ? -1 : 1)
    setSuggestions(sorted)
    setUnreadCount(sorted.filter(s => s.priority === 'high').length)

    const alumnos2 = mockDataService.getAlumnos()
    const avg = alumnos2.length
      ? (alumnos2.reduce((s, a) => s + a.asistencia, 0) / alumnos2.length).toFixed(1)
      : '0'
    setDailySummary({
      greeting: `Buen día, Prof. Mendoza`,
      status: `Hoy tenés ${sorted.filter(s => s.priority === 'high').length} alertas urgentes y ${sorted.length} sugerencias activas.`,
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

    // ── MOCK FALLBACK ──────────────────────────────────────────
    return mockAIResponse(userMessage)
  }, [])

  return (
    <AIContext.Provider value={{ suggestions, dailySummary, unreadCount, refreshSuggestions, callAI }}>
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
    const low = alumnos.filter(a => a.asistencia < 80)
    const avg = alumnos.length
      ? (alumnos.reduce((s, a) => s + a.asistencia, 0) / alumnos.length).toFixed(1) : '0'
    const names = low.map(a => `**${a.nombre} ${a.apellido}** (${a.asistencia}%)`).join(', ')
    return `La asistencia promedio es **${avg}%**.\n\n${low.length > 0 ? `⚠️ ${low.length} alumno${low.length > 1 ? 's' : ''} por debajo del 80%: ${names}.\n\n**Acción recomendada:** Enviá una notificación a los tutores esta semana.` : '✅ Todos los alumnos mantienen buena asistencia.'}`
  }

  if (p.includes('riesgo') || p.includes('bajo rendimiento')) {
    const at = alumnos.filter(a => { if (!a.notas) return false; const v = Object.values(a.notas); return v.reduce((s, n) => s + n, 0) / v.length < 6 })
    return at.length
      ? `Detecté **${at.length} alumnos en riesgo académico**: ${at.map(a => `**${a.nombre} ${a.apellido}**`).join(', ')}.\n\n**Sugerencia:** Creá un plan de refuerzo personalizado desde el Planificador para estos estudiantes.`
      : '✅ Todos los alumnos tienen rendimiento aceptable actualmente.'
  }

  if (p.includes('plan') || p.includes('planificaci')) {
    return 'Para crear un plan efectivo de refuerzo, te sugiero:\n\n1. **Identifica las materias críticas** donde el alumno tiene menos de 6.\n2. **Programa 2 sesiones semanales** de 30 min de práctica focalizada.\n3. **Usa recursos visuales** de tu banco de materiales en el Planificador.\n\n¿Quiero que genere un borrador automático?'
  }

  if (p.includes('resumen') || p.includes('semana')) {
    const avg = alumnos.length ? (alumnos.reduce((s, a) => s + a.asistencia, 0) / alumnos.length).toFixed(1) : '0'
    const at = alumnos.filter(a => { if (!a.notas) return false; const v = Object.values(a.notas); return v.reduce((s, n) => s + n, 0) / v.length < 6 }).length
    return `**Resumen de la semana:**\n\n📊 Asistencia general: **${avg}%**\n⚠️ Alumnos en riesgo: **${at}**\n📋 Planes activos: **12**\n\n**Prioridad esta semana:** Hacer seguimiento de alumnos con inasistencia y crear planes de refuerzo antes del viernes.`
  }

  return `Entendido. Analicé los datos de tus **${alumnos.length} alumnos** y la información del sistema.\n\n¿Sobre qué aspecto específico necesitás más detalle? Puedo ayudarte con asistencia, rendimiento, planificación o generación de reportes.`
}
