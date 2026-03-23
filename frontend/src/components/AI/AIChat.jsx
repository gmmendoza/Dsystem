import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, X, Send, User, Sparkles, MessageSquare, Zap,
  RotateCcw, ArrowRight, ThumbsUp, ThumbsDown, Copy,
  AlertTriangle, Info, CheckCircle2, ChevronDown, 
  BrainCircuit, BookOpen, BarChart2, ShieldAlert
} from 'lucide-react'
import { useAI } from '../../context/AIContext'
import { useNavigate } from 'react-router-dom'

const CAPABILITIES = [
  { 
    title: 'Análisis de Riesgo', 
    desc: 'Detecto alumnos con inasistencias o bajas notas.',
    icon: ShieldAlert,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    prompt: 'Hacé un análisis de riesgo académico de mis alumnos ahora.'
  },
  { 
    title: 'Planificación Smart', 
    desc: 'Genero secuencias didácticas en segundos.',
    icon: BookOpen,
    color: 'text-primary-500',
    bg: 'bg-primary-500/10',
    prompt: 'Ayudame a planificar una secuencia didáctica innovadora.'
  },
  { 
    title: 'Informes Ejecutivos', 
    desc: 'Resumo el estado de tus aulas para dirección.',
    icon: BarChart2,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    prompt: 'Generá un informe ejecutivo del estado de mis aulas para la dirección.'
  }
]

const EXAMPLE_PROMPTS = [
  { label: 'Analizar Riesgo Académico', prompt: '¿Qué alumnos están en riesgo académico y por qué?' },
  { label: 'Resumen de Asistencia', prompt: 'Dame un resumen de la asistencia de esta semana.' },
  { label: 'Sugerir Actividad', prompt: 'Sugerí una actividad interactiva para el Aula 2.' },
  { label: 'Informe de Gestión', prompt: 'Generá un informe del progreso de mis cursos.' }
]

function TypingIndicator({ message = "DocenTico está analizando..." }) {
  return (
    <div className="flex items-end gap-3 px-2">
      <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-950/20">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-surface-subtle dark:bg-white/5 px-5 py-3 rounded-2xl rounded-bl-none border border-black/5 dark:border-white/10">
        <div className="flex flex-col gap-2">
           <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 animate-pulse">{message}</span>
           <div className="flex gap-1.5 items-center h-2">
             {[0, 0.15, 0.3].map((delay, i) => (
               <motion.div
                 key={i}
                 className="w-1.5 h-1.5 rounded-full bg-primary-400"
                 animate={{ opacity: [0.3, 1, 0.3] }}
                 transition={{ duration: 0.8, delay, repeat: Infinity }}
               />
             ))}
           </div>
        </div>
      </div>
    </div>
  )
}

export default function AIChat() {
  const { suggestions, unreadCount, callAI } = useAI()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState('chat') // 'chat' | 'suggestions'
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    const handler = () => { setIsOpen(o => !o) }
    window.addEventListener('toggle-ai-chat', handler)
    return () => window.removeEventListener('toggle-ai-chat', handler)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  const handleSend = useCallback(async (text) => {
    const content = (text || input).trim()
    if (!content || isStreaming) return

    const userMsg = { id: Date.now(), role: 'user', content }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)

    const aiId = Date.now() + 1
    setMessages(prev => [...prev, { id: aiId, role: 'assistant', content: '', streaming: true }])

    let accumulated = ''
    const response = await callAI(content, messages, (chunk, full) => {
      accumulated = full
      setMessages(prev => prev.map(m => m.id === aiId ? { ...m, content: full } : m))
    })

    setMessages(prev => prev.map(m =>
      m.id === aiId ? { ...m, content: response || accumulated || m.content, streaming: false, canCopy: true } : m
    ))
    setIsStreaming(false)
  }, [input, messages, isStreaming, callAI])

  const getSuggestedActions = (aiContent) => {
    const content = aiContent.toLowerCase()
    if (content.includes('asistencia') && content.includes('redacte')) {
      return [{ label: 'Sí, redactar seguimiento', prompt: 'si, redactá el mensaje' }, { label: 'No por ahora', prompt: 'gracias' }]
    }
    if (content.includes('riesgo') && content.includes('generar')) {
      return [{ label: 'Generar Plan de Refuerzo', prompt: 'si, generá el plan' }, { label: 'Analizar más', prompt: 'dame más detalles' }]
    }
    if (content.includes('planificar') || content.includes('secuencia')) {
      return [{ label: 'Enfoque ABP', prompt: 'prefiero enfoque ABP' }, { label: 'Enfoque Tradicional', prompt: 'mejor tradicional' }]
    }
    if (content.includes('objetivos simplificados')) {
       return [{ label: 'Ver Objetivos', prompt: 'si, mostrame los objetivos' }]
    }
    return []
  }

  const renderMarkdown = (text) => {
    return (text || '').toString()
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-500">$1</strong>')
      .replace(/ - (.*?)\n/g, '<li class="ml-4 list-disc mb-1">$1</li>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="w-[380px] bg-white dark:bg-slate-950 rounded-[1.5rem] shadow-2xl overflow-hidden border border-black/5 dark:border-white/10 flex flex-col h-[500px]"
          >
            {/* Header Premium */}
            <div className="px-5 py-4 bg-surface-subtle/50 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-950/20 rotate-3">
                     <Bot size={18} />
                  </div>
                  <div>
                     <h3 className="text-base font-black uppercase italic tracking-tighter leading-none">DocenTico <span className="text-primary-500">Pro</span></h3>
                     <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Mente Artificial Educativa</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-primary-500 transition-all">
                  <X size={18} />
               </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
               {messages.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">¿Qué puedo hacer por vos?</h4>
                        <div className="grid grid-cols-1 gap-3">
                           {CAPABILITIES.map((cap, i) => (
                               <div 
                                 key={i} 
                                 onClick={() => handleSend(cap.prompt)}
                                 className="flex items-center gap-4 p-4 bg-surface-subtle/40 border border-black/5 dark:border-white/5 rounded-2xl hover:border-primary-500/30 transition-all group cursor-pointer active:scale-[0.98]"
                               >
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cap.bg} ${cap.color}`}>
                                    <cap.icon size={18} />
                                 </div>
                                 <div className="flex-1">
                                    <p className="text-[12px] font-black uppercase italic tracking-tight mb-0.5 group-hover:text-primary-500 transition-colors leading-none">{cap.title}</p>
                                    <p className="text-[10px] font-medium text-slate-500 leading-tight">{cap.desc}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Probá con estos prompts</h4>
                        <div className="flex flex-wrap gap-2">
                           {EXAMPLE_PROMPTS.map((ex, i) => (
                              <button 
                                key={i} 
                                onClick={() => handleSend(ex.prompt)}
                                className="px-4 py-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:border-primary-500/40 hover:text-primary-500 transition-all active:scale-95 text-slate-600 dark:text-slate-300"
                              >
                                {ex.label}
                              </button>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               ) : (
                  <>
                     {messages.map((msg, idx) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, x: msg.role === 'user' ? 15 : -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex ${msg.role === 'user' ? 'flex-row-reverse' : 'items-start'} gap-4`}
                        >
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md ${
                             msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-surface-subtle dark:bg-white/10 text-primary-500'
                           }`}>
                              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                           </div>
                           <div className={`max-w-[85%] p-4 rounded-2xl text-[12px] font-medium leading-[1.6] ${
                             msg.role === 'user' 
                               ? 'bg-primary-600 text-white rounded-tr-none shadow-lg shadow-primary-950/20' 
                               : 'bg-surface-subtle dark:bg-white/5 rounded-tl-none border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-300'
                           }`}>
                              {msg.role === 'assistant' ? (
                                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} className="markdown-chat" />
                              ) : (
                                msg.content
                              )}
                              {msg.streaming && (
                                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-1.5 h-3.5 bg-primary-400 ml-1.5 rounded-sm align-middle" />
                              )}
                           </div>

                            {/* Suggested Actions within the flow */}
                            {!msg.streaming && msg.role === 'assistant' && idx === messages.length - 1 && (
                               <div className="flex flex-wrap gap-2 mt-2 pl-12">
                                  {getSuggestedActions(msg.content).map((action, i) => (
                                     <motion.button
                                       key={i}
                                       initial={{ opacity: 0, scale: 0.9 }}
                                       animate={{ opacity: 1, scale: 1 }}
                                       transition={{ delay: 0.2 + (i * 0.1) }}
                                       onClick={() => handleSend(action.prompt)}
                                       className="px-3 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary-600 hover:bg-primary-500 hover:text-white transition-all shadow-sm active:scale-95"
                                     >
                                        {action.label}
                                     </motion.button>
                                  ))}
                               </div>
                            )}
                        </motion.div>
                     ))}
                     {isStreaming && messages[messages.length - 1]?.content === '' && (
                        <TypingIndicator message={
                           input.toLowerCase().includes('asistencia') ? 'Analizando registros de asistencia...' :
                           input.toLowerCase().includes('riesgo') ? 'Escaneando rendimiento académico...' :
                           'Consultando a la Mente Artificial...'
                        } />
                     )}
                     <div ref={chatEndRef} />
                  </>
               )}
            </div>

            {/* Input Area */}
            <div className="p-6 pt-2 bg-surface-subtle/30 border-t border-black/5 dark:border-white/5 shrink-0">
               <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Consultá a la Inteligencia..."
                    className="w-full bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 pl-5 pr-14 text-[12px] font-medium outline-none focus:border-primary-500/50 transition-all shadow-sm text-slate-800 dark:text-white"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isStreaming}
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isStreaming}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary-600 hover:bg-primary-500 text-white rounded-xl flex items-center justify-center shadow-md transition-all disabled:opacity-40 active:scale-95"
                  >
                     <Send size={15} />
                  </button>
               </div>
               <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 text-center mt-4">Basado en modelos GPT-4o Pedagógicos</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(o => !o)}
        className="w-14 h-14 bg-primary-600 hover:bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-950/30 relative z-30 transition-all"
      >
        <AnimatePresence mode="wait">
           {isOpen ? <X size={24} key="x" /> : <Sparkles size={24} key="bot" />}
        </AnimatePresence>
        {!isOpen && unreadCount > 0 && (
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-black border-4 border-slate-950 shadow-lg">
             {unreadCount}
          </div>
        )}
      </motion.button>
    </div>
  )
}
