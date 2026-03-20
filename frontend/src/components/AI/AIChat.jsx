import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  BrainCircuit,
  MessageCircle,
  MoreHorizontal,
  ThumbsUp,
  RotateCcw
} from 'lucide-react'
import { mockDataService } from '../../services/mockDataService'

const SUGGESTIONS = [
  "¿Cómo va la asistencia de 3° A?",
  "Sugerime un recurso para Geometría",
  "Alumnos con baja participación",
  "Resumen de mi semana"
]

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hola, soy DocenTico. ¿En qué puedo ayudarte con tu planificación hoy? Puedo analizar el progreso de tus alumnos o sugerirte recursos dinámicos.' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Listener para abrir el chat desde cualquier parte del sistema
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true)
    window.addEventListener('toggle-ai-chat', handleOpenChat)
    return () => window.removeEventListener('toggle-ai-chat', handleOpenChat)
  }, [])
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { id: Date.now(), role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI Response logic with Data Context
    setTimeout(() => {
        const alumnos = mockDataService.getAlumnos()
        const cursos = mockDataService.getCursos()
        
        let aiContent = "Soy DocenTico. Estoy analizando los datos de tus aulas para darte una respuesta precisa..."
        let canCopyToPlan = false
        const prompt = input.toLowerCase()
        
        if (prompt.includes('asistencia')) {
            const lowAtt = alumnos.filter(a => a.asistencia < 80)
            const avgAtt = (alumnos.reduce((acc, a) => acc + a.asistencia, 0) / alumnos.length).toFixed(1)
            
            aiContent = `La asistencia promedio general es del **${avgAtt}%**. He detectado que **${lowAtt.length} alumnos** (incluyendo a ${lowAtt[0]?.nombre || 'algunos'}) están por debajo del umbral del 80%. ¿Deseas que prepare un reporte para los tutores?`
            canCopyToPlan = true
        } else if (prompt.includes('geometría') || prompt.includes('recurso')) {
            aiContent = "Para **Geometría**, el 3° A muestra una dificultad específica en 'Cuerpos 3D'. Te sugiero el recurso interactivo de 'Realidad Aumentada' que tienes en tu banco para reforzar este tema el lunes."
            canCopyToPlan = true
        } else if (prompt.includes('pedro') || prompt.includes('rodríguez')) {
            const pedro = alumnos.find(a => a.id === 3)
            aiContent = `Análisis de **Pedro Rodríguez**: Su promedio actual es **${Object.values(pedro.notas).reduce((a,b)=>a+b,0)/4}**. Su asistencia ha bajado al **${pedro.asistencia}%**. Sugiero una reunión de seguimiento pedagógico prioritaria.`
            canCopyToPlan = true
        } else if (prompt.includes('resumen') || prompt.includes('semana')) {
            aiContent = `Resumen Docente: Tienes **${cursos.length} aulas** activas. El rendimiento en Matemática subió un **12%** general, pero la asistencia los lunes sigue siendo un punto de atención (82% promedio).`
        }

        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            role: 'assistant', 
            content: aiContent,
            canCopy: canCopyToPlan
        }])
        setIsTyping(false)
    }, 1500)
  }

  const handleCopyToPlan = (content) => {
    // In a real app, this would dispatch an action or call an API
    // For now, we simulate success
    alert("IA: Sugerencia copiada a tu borrador de planificación actual.")
  }

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            className="absolute bottom-20 right-0 w-[320px] h-[500px] bg-surface-subtle/95 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden transition-colors duration-300"
          >
            {/* AI Header */}
            <div className="p-4 bg-gradient-to-r from-primary-600/20 to-indigo-600/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-900/40">
                       <Bot size={24} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-emerald rounded-full border-4 border-surface-subtle" />
                </div>
                <div>
                   <h3 className="text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
                     DocenTico <Sparkles size={12} className="text-primary-400" />
                   </h3>
                   <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Inteligencia Pedagógica</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-primary-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] p-3 rounded-2xl text-[10px] leading-relaxed relative ${
                    msg.role === 'user' 
                      ? 'bg-primary-600 text-white font-bold rounded-tr-none shadow-lg' 
                      : 'bg-surface border border-black/5 dark:border-white/5 rounded-tl-none'
                  }`} style={msg.role !== 'user' ? { color: 'rgb(var(--color-text))' } : {}}>
                    {msg.role === 'assistant' && (
                        <div className="absolute -top-4 -left-1 text-[8px] font-black uppercase tracking-widest text-primary-500 bg-surface px-2 py-0.5 rounded border border-black/5 dark:border-white/5">AI Response</div>
                    )}
                    <p dangerouslySetInnerHTML={{ __html: (msg.content || '').toString().replace(/\*\*(.*?)\*\*/g, '<b style="color: rgb(var(--color-primary))">$1</b>') }} />
                    
                    {msg.role === 'assistant' && msg.canCopy && (
                        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex gap-2">
                            <button 
                              onClick={() => handleCopyToPlan(msg.content)}
                              className="px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600 text-[8px] font-black uppercase tracking-widest text-primary-400 hover:text-white rounded-lg transition-all flex items-center gap-1.5"
                            >
                                <Plus size={10} /> Copiar al Plan
                            </button>
                            <button className="px-3 py-1.5 bg-surface-subtle hover:bg-surface-muted text-[8px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-500 rounded-lg transition-all border border-black/5 dark:border-white/5 shadow-sm">
                                <RotateCcw size={10} /> Regenerar
                            </button>
                        </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-surface-subtle border border-black/5 dark:border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-primary-500/40 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary-500/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-primary-500/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions & Input */}
            <div className="p-4 space-y-3 bg-surface-muted/30 border-t border-black/5 dark:border-white/5">
              {!messages.some(m => m.role === 'user') && (
                 <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => { setInput(s); }}
                        className="px-3 py-2 bg-white/5 hover:bg-primary-600/10 border border-white/5 hover:border-primary-500/30 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-400 rounded-lg transition-all"
                      >
                        {s}
                      </button>
                    ))}
                 </div>
              )}
              
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  placeholder="CONSULTAR..."
                  className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-4 pr-12 text-[9px] font-black uppercase tracking-widest outline-none focus:border-primary-500/50 transition-all placeholder:text-gray-800"
                  style={{ color: 'rgb(var(--color-text))' }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-all shadow-lg"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center text-white shadow-[0_10px_40px_rgba(79,70,229,0.4)] border-4 border-white/10 relative group"
      >
        <div className="absolute -inset-2 bg-primary-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={28} /> : <Bot size={28} />}
        {!isOpen && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-accent-rose rounded-full border-4 border-surface flex items-center justify-center shadow-lg"
            >
               <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
        )}
      </motion.button>
    </div>
  )
}
