import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot, X, Send, User, Sparkles, MessageSquare, Zap,
  RotateCcw, ArrowRight, ThumbsUp, ThumbsDown, Copy,
  AlertTriangle, Info, CheckCircle2, ChevronDown
} from 'lucide-react'
import { useAI } from '../../context/AIContext'
import { useNavigate } from 'react-router-dom'

const QUICK_PROMPTS = [
  '¿Cómo va la asistencia esta semana?',
  'Alumnos en riesgo académico',
  'Dame un resumen de la semana',
  'Sugerí un plan de refuerzo',
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-primary-500" />
      </div>
      <div className="card px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary-400"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, delay, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SuggestionCard({ s, onAction }) {
  const icons = { warning: AlertTriangle, danger: AlertTriangle, info: Info, success: CheckCircle2 }
  const colors = {
    warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    danger:  'text-red-500 bg-red-500/10 border-red-500/20',
    info:    'text-primary-500 bg-primary-500/10 border-primary-500/20',
    success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  }
  const Icon = icons[s.type] || Info

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 space-y-3"
    >
      <div className="flex items-start gap-3">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 border ${colors[s.type]}`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold" style={{ color: 'rgb(var(--color-text))' }}>{s.title}</p>
          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'rgb(var(--color-text-muted))' }}>{s.message}</p>
        </div>
      </div>
      {s.action && (
        <button
          onClick={() => onAction(s.action.path)}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold py-2 rounded-lg bg-surface-subtle hover:bg-primary-500/10 hover:text-primary-500 border transition-all duration-150"
          style={{ borderColor: 'rgb(var(--color-border))' }}
        >
          {s.action.label} <ArrowRight size={12} />
        </button>
      )}
    </motion.div>
  )
}

export default function AIChat() {
  const { suggestions, unreadCount, callAI } = useAI()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState('chat') // 'chat' | 'suggestions'
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant',
      content: '¡Hola, Prof. Mendoza! 👋 Soy **DocenTico**, tu asistente de IA educativa.\n\nAnalizo tus aulas en tiempo real y puedo ayudarte a identificar alumnos en riesgo, generar reportes y sugerir estrategias pedagógicas.\n\n¿En qué te ayudo hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

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
    const history = messages.filter(m => m.role !== 'system')

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)

    // Placeholder for streaming
    const aiId = Date.now() + 1
    setMessages(prev => [...prev, { id: aiId, role: 'assistant', content: '', streaming: true }])

    let accumulated = ''
    await callAI(content, history, (chunk, full) => {
      accumulated = full
      setMessages(prev => prev.map(m => m.id === aiId ? { ...m, content: full } : m))
    })

    // Finalize message (streaming done)
    setMessages(prev => prev.map(m =>
      m.id === aiId ? { ...m, content: accumulated || m.content, streaming: false, canCopy: true } : m
    ))
    setIsStreaming(false)
  }, [input, messages, isStreaming, callAI])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const renderMarkdown = (text) => {
    return (text || '').toString()
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3">
      {/* ── Chat Panel ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="w-[360px] card-glass shadow-float overflow-hidden flex flex-col"
            style={{ maxHeight: isMinimized ? '56px' : '560px', transition: 'max-height 0.25s ease' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
                 style={{ borderColor: 'rgb(var(--color-border))' }}>
              <div className="w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold" style={{ color: 'rgb(var(--color-text))' }}>DocenTico</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <p className="text-[11px]" style={{ color: 'rgb(var(--color-text-muted))' }}>Asistente IA Activo</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(m => !m)} className="btn-ghost p-1.5 rounded-lg">
                  <ChevronDown size={14} className={`transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                </button>
                <button onClick={() => setIsOpen(false)} className="btn-ghost p-1.5 rounded-lg">
                  <X size={14} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Tabs */}
                <div className="flex border-b flex-shrink-0" style={{ borderColor: 'rgb(var(--color-border))' }}>
                  {[
                    { id: 'chat', label: 'Chat', icon: MessageSquare },
                    { id: 'suggestions', label: 'Sugerencias', icon: Sparkles, count: unreadCount },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold transition-all border-b-2 ${tab === t.id ? 'border-primary-500 text-primary-500' : 'border-transparent'}`}
                      style={tab !== t.id ? { color: 'rgb(var(--color-text-muted))' } : {}}
                    >
                      <t.icon size={13} />
                      {t.label}
                      {t.count > 0 && (
                        <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {t.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* ── Chat Tab ─────────────────────────────────── */}
                {tab === 'chat' && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                      {messages.map(msg => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                          {/* Avatar */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border ${
                            msg.role === 'user'
                              ? 'bg-primary-600 border-primary-500'
                              : 'bg-primary-500/10 border-primary-500/20'
                          }`}>
                            {msg.role === 'user'
                              ? <User size={13} className="text-white" />
                              : <Bot size={13} className="text-primary-500" />
                            }
                          </div>
                          {/* Bubble */}
                          <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[12px] leading-relaxed font-medium ${
                            msg.role === 'user'
                              ? 'bg-primary-600 text-white rounded-br-sm'
                              : 'card rounded-bl-sm'
                          }`}
                               style={msg.role !== 'user' ? { color: 'rgb(var(--color-text))' } : {}}>
                            {msg.role === 'assistant' ? (
                              <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                            ) : msg.content}
                            {msg.streaming && (
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                className="inline-block w-0.5 h-3.5 bg-primary-400 ml-0.5 rounded-sm align-middle"
                              />
                            )}
                            {/* Copy button for AI messages */}
                            {msg.canCopy && !msg.streaming && (
                              <button
                                onClick={() => navigator.clipboard.writeText(msg.content)}
                                className="mt-2 flex items-center gap-1 text-[10px] opacity-50 hover:opacity-100 transition-opacity"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                              >
                                <Copy size={10} /> Copiar
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}

                      {isStreaming && messages[messages.length - 1]?.content === '' && <TypingIndicator />}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Quick prompts */}
                    {messages.length <= 1 && (
                      <div className="px-4 pb-2 flex flex-wrap gap-2">
                        {QUICK_PROMPTS.map(p => (
                          <button
                            key={p}
                            onClick={() => handleSend(p)}
                            className="text-[11px] font-medium px-3 py-1.5 rounded-full border bg-surface-subtle hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-500 transition-all"
                            style={{ borderColor: 'rgb(var(--color-border))', color: 'rgb(var(--color-text-muted))' }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t flex-shrink-0" style={{ borderColor: 'rgb(var(--color-border))' }}>
                      <div className="flex items-center gap-2">
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="Preguntale a DocenTico..."
                          className="input-field flex-1 py-2 text-[12px]"
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          disabled={isStreaming}
                        />
                        <button
                          onClick={() => handleSend()}
                          disabled={!input.trim() || isStreaming}
                          className="btn-primary p-2.5 rounded-xl disabled:opacity-40"
                        >
                          <Send size={15} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Suggestions Tab ────────────────────────── */}
                {tab === 'suggestions' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {suggestions.length === 0 ? (
                      <div className="text-center py-10 text-sm" style={{ color: 'rgb(var(--color-text-muted))' }}>
                        ✅ No hay sugerencias pendientes.
                      </div>
                    ) : (
                      suggestions.map(s => (
                        <SuggestionCard
                          key={s.id}
                          s={s}
                          onAction={path => { navigate(path); setIsOpen(false) }}
                        />
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ──────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(o => !o)}
        className="relative w-14 h-14 bg-primary-600 hover:bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-float border border-primary-500/30 transition-colors"
        style={{ boxShadow: isOpen ? '0 0 0 0 transparent' : '0 8px 32px -4px rgb(99 102 241 / 0.45)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'x' : 'bot'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <X size={22} /> : <Bot size={22} />}
          </motion.div>
        </AnimatePresence>

        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-surface"
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>
    </div>
  )
}
