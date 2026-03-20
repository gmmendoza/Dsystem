import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useAI } from '../../context/AIContext'
import {
  LayoutDashboard, BookOpen, CalendarDays, ClipboardList, LogOut,
  Bell, GraduationCap, ChevronRight, User, History, Settings,
  Menu, X, ChevronLeft, Sun, Moon, Users, Search, Zap
} from 'lucide-react'
import AIChat from '../AI/AIChat'
import CommandPalette from './CommandPalette'
import OnboardingModal from '../Onboarding/OnboardingModal'
import NotificationToast from '../Notifications/NotificationToast'

const NAV_GROUPS = [
  {
    label: 'General',
    items: [
      { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/mi-aula',      icon: BookOpen,        label: 'Mis Aulas' },
      { to: '/estudiantes',  icon: Users,           label: 'Estudiantes' },
    ]
  },
  {
    label: 'Herramientas',
    items: [
      { to: '/planificador', icon: ClipboardList,   label: 'Planificador' },
      { to: '/agenda',       icon: CalendarDays,    label: 'Calendario' },
      { to: '/historial',    icon: History,          label: 'Historial' },
    ]
  }
]

const BREADCRUMB_MAP = {
  '/dashboard':    'Dashboard',
  '/mi-aula':      'Mis Aulas',
  '/estudiantes':  'Estudiantes',
  '/planificador': 'Planificador',
  '/agenda':       'Calendario',
  '/historial':    'Historial',
}

export default function Layout() {
  const { user, logout }   = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { unreadCount }    = useAI()
  const location           = useLocation()
  const navigate           = useNavigate()
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [isCollapsed, setIsCollapsed]     = useState(false)
  const [cmdOpen, setCmdOpen]             = useState(false)
  const [scrolled, setScrolled]           = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(o => !o) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const currentLabel = BREADCRUMB_MAP[location.pathname] || ''

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'rgb(var(--color-surface))' }}>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`
          fixed lg:static inset-y-0 left-0 z-[70] flex flex-col flex-shrink-0
          border-r overflow-hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform lg:transition-none duration-200
        `}
        style={{
          background: 'rgb(var(--color-surface-elevated))',
          borderColor: 'rgb(var(--color-border))',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b flex-shrink-0"
             style={{ borderColor: 'rgb(var(--color-border))' }}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-primary">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                <p className="text-[15px] font-bold tracking-tight leading-none" style={{ color: 'rgb(var(--color-text))' }}>DSystem</p>
                <p className="text-[10px] font-semibold mt-0.5 uppercase tracking-widest text-primary-500">Education SaaS</p>
              </motion.div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex btn-ghost p-1.5 rounded-lg"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Search / Command trigger */}
        {!isCollapsed && (
          <div className="px-3 pt-4 pb-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all hover:border-primary-500/30 hover:bg-primary-500/5"
              style={{ background: 'rgb(var(--color-surface-subtle))', borderColor: 'rgb(var(--color-border))' }}
            >
              <Search size={13} style={{ color: 'rgb(var(--color-text-muted))' }} />
              <span className="text-[12px] flex-1" style={{ color: 'rgb(var(--color-text-muted))' }}>Buscar...</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded font-mono border"
                   style={{ borderColor: 'rgb(var(--color-border))', background: 'rgb(var(--color-surface-muted))', color: 'rgb(var(--color-text-muted))' }}>
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-5 overflow-y-auto custom-scrollbar">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              {!isCollapsed && (
                <p className="section-title px-2 mb-2">{group.label}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? 'active' : ''}`
                    }
                    onClick={() => setSidebarOpen(false)}
                    title={isCollapsed ? label : undefined}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {!isCollapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] font-semibold">
                        {label}
                      </motion.span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t flex-shrink-0" style={{ borderColor: 'rgb(var(--color-border))' }}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl"
                 style={{ background: 'rgb(var(--color-surface-subtle))' }}>
              <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white flex-shrink-0">
                <User size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold truncate" style={{ color: 'rgb(var(--color-text))' }}>
                  {user?.username || 'Docente Pro'}
                </p>
                <p className="text-[10px] truncate" style={{ color: 'rgb(var(--color-text-muted))' }}>
                  {user?.rol || 'Premium'}
                </p>
              </div>
              <button onClick={logout} className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-500/10">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center">
                <User size={15} className="text-primary-500" />
              </div>
              <button onClick={logout} className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-500">
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header
          className={`h-16 flex items-center justify-between px-4 md:px-6 border-b flex-shrink-0 z-50 transition-all duration-200 ${scrolled ? 'backdrop-blur-xl shadow-card' : ''}`}
          style={{ borderColor: 'rgb(var(--color-border))', background: scrolled ? 'rgb(var(--color-surface-elevated) / 0.85)' : 'rgb(var(--color-surface-elevated))' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden btn-ghost p-2 rounded-xl"
            >
              <Menu size={18} />
            </button>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[12px]">
              <span style={{ color: 'rgb(var(--color-text-muted))' }}>DSystem</span>
              {currentLabel && (
                <>
                  <ChevronRight size={12} style={{ color: 'rgb(var(--color-text-muted))' }} />
                  <span className="font-semibold" style={{ color: 'rgb(var(--color-text))' }}>{currentLabel}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI quick trigger with badge */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-chat'))}
              className="relative btn-ghost p-2 rounded-xl"
              title="DocenTico IA"
            >
              <Zap size={18} className="text-primary-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button onClick={toggleTheme} className="btn-ghost p-2 rounded-xl" title="Cambiar tema">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden md:flex items-center gap-2 ml-1 pl-3 border-l"
                 style={{ borderColor: 'rgb(var(--color-border))' }}>
              <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <User size={14} />
              </div>
              <div>
                <p className="text-[12px] font-semibold" style={{ color: 'rgb(var(--color-text))' }}>
                  {user?.username || 'Prof. Mendoza'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto p-4 md:p-8 pb-16">
            <div className="page-enter">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Portals */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      <OnboardingModal />
      <AIChat />
      <NotificationToast />
    </div>
  )
}
