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
    bg: 'bg-red-500/10'
  },
  { 
    title: 'Planificación Smart', 
    desc: 'Genero secuencias didácticas en segundos.',
    icon: BookOpen,
    color: 'text-primary-500',
    bg: 'bg-primary-500/10'
  },
  { 
    title: 'Informes Ejecutivos', 
    desc: 'Resumo el estado de tus aulas para dirección.',
    icon: BarChart2,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  }
]

const EXAMPLE_PROMPTS = [
  { label: 'Analizar Riesgo Académico', prompt: '¿Qué alumnos están en riesgo académico y por qué?' },
  { label: 'Resumen de Asistencia', prompt: 'Dame un resumen de la asistencia de esta semana.' },
  { label: 'Sugerir Actividad', prompt: 'Sugerí una actividad interactiva para el Aula 2.' },
  { label: 'Informe de Gestión', prompt: 'Generá un informe del progreso de mis cursos.' }
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 px-2">
      <div className="w-8 h-8 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
        <Bot size={16} className="text-primary-500" />
      </div>
      <div className="bg-surface-subtle dark:bg-white/5 px-6 py-4 rounded-[1.5rem] rounded-bl-sm">
        <div className="flex gap-2 items-center h-4">
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-400"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, delay, repeat: Infinity }}
            />
          ))}
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
    await callAI(content, messages, (chunk, full) => {
      accumulated = full
      setMessages(prev => prev.map(m => m.id === aiId ? { ...m, content: full } : m))
    })

    setMessages(prev => prev.map(m =>
      m.id === aiId ? { ...m, content: accumulated || m.content, streaming: false, canCopy: true } : m
    ))
    setIsStreaming(false)
  }, [input, messages, isStreaming, callAI])

  const renderMarkdown = (text) => {
    return (text || '').toString()
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-500">$1</strong>')
      .replace(/ - (.*?)\n/g, '<li class="ml-4 list-disc mb-1">$1</li>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="fixed bottom-10 right-10 z-[200] flex flex-col items-end gap-4 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="w-[450px] bg-white dark:bg-slate-950 rounded-[3.5rem] shadow-2xl overflow-hidden border border-black/5 dark:border-white/5 flex flex-col h-[750px]"
          >
            {/* Header Premium */}
            <div className="px-10 py-8 bg-surface-subtle/50 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 rotate-3">
                     <Bot size={28} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">DocenTico <span className="text-primary-500">Pro</span></h3>
                     <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mente Artificial Educativa</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-4 text-gray-400 hover:text-white transition-all">
                  <X size={24} />
               </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
               {messages.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                  >
                     <div className="space-y-6">
                        <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-400">¿Qué puedo hacer por vos?</h4>
                        <div className="grid grid-cols-1 gap-5">
                           {CAPABILITIES.map((cap, i) => (
                              <div key={i} className="flex items-start gap-5 p-6 bg-surface-subtle/40 border border-black/5 dark:border-white/5 rounded-3xl hover:border-primary-500/30 transition-all group">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${cap.bg} ${cap.color}`}>
                                    <cap.icon size={22} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black uppercase italic tracking-tight mb-1 group-hover:text-primary-500 transition-colors">{cap.title}</p>
                                    <p className="text-[11px] font-medium text-gray-500 leading-relaxed">{cap.desc}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-400">Probá con estos prompts</h4>
                        <div className="flex flex-wrap gap-3">
                           {EXAMPLE_PROMPTS.map((ex, i) => (
                              <button 
                                key={i} 
                                onClick={() => handleSend(ex.prompt)}
                                className="px-6 py-3 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-primary-500/40 hover:text-primary-500 transition-all active:scale-95"
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
                          initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-start gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                           <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center flex-shrink-0 shadow-lg ${
                             msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-surface-subtle dark:bg-white/10 text-primary-500'
                           }`}>
                              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                           </div>
                           <div className={`max-w-[85%] p-8 rounded-[2.5rem] text-sm font-medium leading-[1.8] ${
                             msg.role === 'user' 
                               ? 'bg-primary-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/20' 
                               : 'bg-surface-subtle dark:bg-white/5 rounded-tl-none border border-black/5 dark:border-white/5'
                           }`}>
                              {msg.role === 'assistant' ? (
                                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} className="markdown-chat" />
                              ) : (
                                msg.content
                              )}
                              {msg.streaming && (
                                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-2 h-4 bg-primary-400 ml-2 rounded-sm align-middle" />
                              )}
                           </div>
                        </motion.div>
                     ))}
                     {isStreaming && messages[messages.length - 1]?.content === '' && <TypingIndicator />}
                     <div ref={chatEndRef} />
                  </>
               )}
            </div>

            {/* Input Area */}
            <div className="p-10 pt-4 bg-surface-subtle/30 border-t border-black/5 dark:border-white/5 shrink-0">
               <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Consultá a la Inteligencia..."
                    className="w-full bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-[2rem] py-6 pl-8 pr-20 text-sm font-medium outline-none focus:border-primary-500/50 transition-all shadow-premium"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isStreaming}
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isStreaming}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all disabled:opacity-40 active:scale-95"
                  >
                     <Send size={18} />
                  </button>
               </div>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 text-center mt-6">Basado en modelos GPT-4o Pedagógicos</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(o => !o)}
        className="w-16 h-16 bg-primary-600 hover:bg-primary-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 relative z-30 transition-all"
      >
        <AnimatePresence mode="wait">
           {isOpen ? <X size={28} key="x" /> : <Sparkles size={28} key="bot" />}
        </AnimatePresence>
        {!isOpen && unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-4 border-surface shadow-lg">
             {unreadCount}
          </div>
        )}
      </motion.button>
    </div>
  )
}
