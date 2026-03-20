import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, LayoutDashboard, BookOpen, Users, CalendarDays,
  ClipboardList, History, X, ArrowRight, Bot, GraduationCap
} from 'lucide-react'

const COMMANDS = [
  { id: 'dashboard',    label: 'Panel Dashboard',   icon: LayoutDashboard, path: '/dashboard',    group: 'Navegar' },
  { id: 'aulas',        label: 'Mis Aulas',          icon: BookOpen,         path: '/mi-aula',      group: 'Navegar' },
  { id: 'estudiantes',  label: 'Estudiantes',        icon: Users,            path: '/estudiantes',  group: 'Navegar' },
  { id: 'planificador', label: 'Planificador Pro',   icon: ClipboardList,    path: '/planificador', group: 'Navegar' },
  { id: 'agenda',       label: 'Calendario',         icon: CalendarDays,     path: '/agenda',       group: 'Navegar' },
  { id: 'historial',    label: 'Historial',          icon: History,           path: '/historial',    group: 'Navegar' },
  { id: 'ai',           label: 'Abrir DocenTico IA', icon: Bot,              path: null,             group: 'IA', special: 'ai' },
  { id: 'nueva-aula',   label: 'Nueva Aula',         icon: GraduationCap,    path: '/mi-aula',      group: 'Acciones' },
]

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  // Focus input when opened
  useEffect(() => {
    if (isOpen) { setQuery(''); setActiveIndex(0); inputRef.current?.focus() }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (!isOpen) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter')     { e.preventDefault(); handleSelect(filtered[activeIndex]) }
      if (e.key === 'Escape')    { onClose() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, filtered, activeIndex])

  const handleSelect = (cmd) => {
    if (!cmd) return
    if (cmd.special === 'ai') {
      window.dispatchEvent(new CustomEvent('toggle-ai-chat'))
    } else if (cmd.path) {
      navigate(cmd.path)
    }
    onClose()
  }

  const groups = [...new Set(filtered.map(c => c.group))]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[201] w-full max-w-md"
          >
            <div className="card-glass shadow-float overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b"
                   style={{ borderColor: 'rgb(var(--color-border))' }}>
                <Search size={16} style={{ color: 'rgb(var(--color-text-muted))' }} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar páginas, acciones..."
                  className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:font-normal"
                  style={{ color: 'rgb(var(--color-text))', caretColor: 'rgb(var(--color-primary))' }}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setActiveIndex(0) }}
                />
                <button onClick={onClose} className="p-1 btn-ghost rounded-lg">
                  <X size={14} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto custom-scrollbar py-2">
                {filtered.length === 0 && (
                  <p className="text-center text-sm py-8" style={{ color: 'rgb(var(--color-text-muted))' }}>
                    Sin resultados para &ldquo;{query}&rdquo;
                  </p>
                )}
                {groups.map(group => (
                  <div key={group}>
                    <p className="section-title px-4 pt-3 pb-1">{group}</p>
                    {filtered.filter(c => c.group === group).map((cmd, i) => {
                      const globalIdx = filtered.indexOf(cmd)
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100 ${globalIdx === activeIndex ? 'bg-primary-500/10' : 'hover:bg-surface-subtle'}`}
                        >
                          <cmd.icon
                            size={16}
                            className={globalIdx === activeIndex ? 'text-primary-500' : ''}
                            style={globalIdx !== activeIndex ? { color: 'rgb(var(--color-text-muted))' } : {}}
                          />
                          <span className={`text-sm font-medium flex-1 ${globalIdx === activeIndex ? 'text-primary-600 dark:text-primary-400' : ''}`}
                                style={globalIdx !== activeIndex ? { color: 'rgb(var(--color-text))' } : {}}>
                            {cmd.label}
                          </span>
                          {globalIdx === activeIndex && <ArrowRight size={14} className="text-primary-400" />}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2.5 border-t flex items-center gap-4"
                   style={{ borderColor: 'rgb(var(--color-border))' }}>
                {[['↑↓', 'Navegar'], ['↵', 'Seleccionar'], ['Esc', 'Cerrar']].map(([key, hint]) => (
                  <span key={key} className="flex items-center gap-1 text-[11px]"
                        style={{ color: 'rgb(var(--color-text-muted))' }}>
                    <kbd className="px-1.5 py-0.5 rounded bg-surface-muted text-[10px] font-mono border"
                         style={{ borderColor: 'rgb(var(--color-border))' }}>{key}</kbd>
                    {hint}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
