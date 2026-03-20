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

const SUGGESTIONS = [
  "¿Cómo va la asistencia de 3° A?",
  "Sugerime un recurso para Geometría",
  "Alumnos con baja participación",
  "Resumen de mi semana"
]

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      content: '¡Hola! Soy **DocenTico**, tu copiloto pedagógico. He analizado tus clases y tengo nuevos *insights* listos. ¿En qué te ayudo hoy?' 
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
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

    // Simulate AI Response logic
    setTimeout(() => {
        let aiContent = "Estoy procesando tu solicitud basándome en los datos del aula..."
        const prompt = input.toLowerCase()
        
        if (prompt.includes('asistencia')) {
            aiContent = "La asistencia promedio de **3° A** es del **88%**. He notado un patrón de inasistencias los viernes (78%). ¿Quieres que redacte un aviso para los padres?"
        } else if (prompt.includes('geometría') || prompt.includes('recurso')) {
            aiContent = "Para **Geometría**, te sugiero el recurso 'Cuerpos Platónicos 3D' disponible en tu banco. Los alumnos de 4° B están mostrando un interés alto en contenido visual este mes."
        } else if (prompt.includes('participación') || prompt.includes('alumnos')) {
            aiContent = "Pedro Rodríguez y Lucas Sánchez han bajado su participación un **15%** esta semana. Recomiendo una actividad de gamificación para reintegrarlos."
        }

        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: aiContent }])
        setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
            className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-surface-subtle/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* AI Header */}
            <div className="p-6 bg-gradient-to-r from-primary-600/20 to-indigo-600/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-900/40">
                       <Bot size={24} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-emerald rounded-full border-4 border-surface-subtle" />
                </div>
                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                     DocenTico <Sparkles size={14} className="text-primary-400" />
                   </h3>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inteligencia Pedagógica</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed relative ${
                    msg.role === 'user' 
                      ? 'bg-primary-600 text-white font-bold rounded-tr-none' 
                      : 'bg-white/5 text-gray-300 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.role === 'assistant' && (
                        <div className="absolute -top-4 -left-1 text-[8px] font-black uppercase tracking-widest text-primary-500 bg-surface px-2 py-0.5 rounded border border-white/5">AI Response</div>
                    )}
                    <p dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<b class="text-white">$1</b>') }} />
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions & Input */}
            <div className="p-6 space-y-4 bg-black/20 border-t border-white/5">
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
                  placeholder="ESCRIBE TU CONSULTA AQUÍ..."
                  className="w-full bg-surface-subtle border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-primary-500/50 transition-all placeholder:text-gray-800"
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
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-accent-rose rounded-full border-4 border-surface flex items-center justify-center"
            >
               <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
        )}
      </motion.button>
    </div>
  )
}
