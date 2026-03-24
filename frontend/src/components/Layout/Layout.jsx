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
        animate={{ 
          width: isCollapsed ? 80 : 260,
          height: 'calc(100vh - 24px)',
          margin: '12px 12px 12px 12px'
        }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className={`
          fixed lg:static inset-y-0 left-0 z-[70] flex flex-col flex-shrink-0
          overflow-hidden rounded-[32px] border border-black/5 dark:border-white/10 
          bg-surface-elevated shadow-premium
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-all lg:transition-none duration-300
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-5 py-5 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-9 h-9 bg-ai-gradient rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-primary ai-shimmer"
            >
              <GraduationCap className="w-4 h-4 text-white" />
            </motion.div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="overflow-hidden"
              >
                <p className="text-[14px] font-black tracking-tight leading-none text-slate-900 dark:text-white">
                  DSystem
                </p>
                <p className="text-[8px] font-bold mt-1 uppercase tracking-[0.2em] text-primary-500 opacity-80">
                  Sistema Educativo
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Search / Command trigger */}
        {!isCollapsed && (
          <div className="px-4 mb-6">
            <button
              onClick={() => setCmdOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-black/5 dark:border-white/10 bg-surface-subtle text-left transition-all hover:border-primary-500/30 hover:bg-primary-500/5 group shadow-sm"
            >
              <Search size={14} className="text-slate-400 dark:text-slate-500 transition-colors group-hover:text-primary-500" />
              <span className="text-[13px] flex-1 font-medium text-slate-500 dark:text-slate-400">Búsqueda rápida...</span>
              <kbd className="text-[10px] px-2 py-1 rounded-lg font-mono border border-black/10 dark:border-white/10 bg-surface-muted text-slate-400 dark:text-slate-500 shadow-sm group-hover:border-primary-500/20 group-hover:bg-primary-500/10 transition-all">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto custom-scrollbar">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              {!isCollapsed && (
                <p className="text-[10px] font-black uppercase tracking-[0.2em] px-3 mb-3 text-slate-400/60 dark:text-slate-500/60">{group.label}</p>
              )}
              <div className="space-y-1.5">
                {group.items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 group
                       ${isActive 
                         ? 'bg-primary-500/10 text-primary-600 shadow-sm' 
                         : 'hover:bg-primary-500/5 text-slate-500 hover:text-primary-500'}`
                    }
                    onClick={() => setSidebarOpen(false)}
                    title={isCollapsed ? label : undefined}
                  >
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300
                      ${isCollapsed ? 'w-10 h-10' : ''}
                    `}>
                      <Icon size={isCollapsed ? 20 : 18} />
                    </div>
                    {!isCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-[14px] font-semibold flex-1"
                      >
                        {label}
                      </motion.span>
                    )}
                    {!isCollapsed && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="text-primary-400" />
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 flex-shrink-0">
          {!isCollapsed ? (
            <div className="glass-effect rounded-[24px] p-1 shadow-sm">
              <div className="flex items-center gap-3 p-2 rounded-2xl group transition-all hover:bg-white/50 dark:hover:bg-black/20">
                <div className="w-10 h-10 rounded-xl bg-ai-gradient flex items-center justify-center text-white flex-shrink-0 shadow-glow-primary overflow-hidden relative">
                  <User size={20} />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold truncate leading-tight text-slate-900 dark:text-white">
                    {user?.username || 'Admin'}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-400 dark:text-slate-500">
                    {user?.rol || 'Docente'}
                  </p>
                </div>
                <button 
                  onClick={logout} 
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-2xl bg-ai-gradient flex items-center justify-center text-white shadow-glow-primary cursor-pointer"
              >
                <User size={22} />
              </motion.div>
              <button onClick={logout} className="w-10 h-10 flex items-center justify-center rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header
          className={`h-22 flex items-center justify-between px-6 md:px-10 flex-shrink-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl border-b border-black/5 dark:border-white/5 bg-surface-elevated/80' : 'bg-transparent'}`}
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-11 h-11 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm"
            >
              <Menu size={20} />
            </button>

            {/* Collapse toggle for desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-2xl border border-black/5 dark:border-white/10 bg-surface-elevated hover:bg-surface-subtle transition-all shadow-sm"
            >
              <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
                <ChevronLeft size={18} />
              </motion.div>
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-4 text-[13px]">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow-primary animate-pulse" />
              <span className="font-bold tracking-tight text-slate-400 dark:text-slate-500 italic">DSystem</span>
              {currentLabel && (
                <>
                  <ChevronRight size={14} className="text-slate-300 dark:text-slate-700" />
                  <span className="font-black tracking-tighter text-[17px] uppercase italic text-slate-900 dark:text-white">{currentLabel}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="w-10 h-10 flex items-center justify-center rounded-2xl border border-black/5 hover:bg-black/5 dark:border-white/5 dark:hover:bg-white/5 transition-all"
              title="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>

            {/* AI quick trigger */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-chat'))}
              className="relative w-10 h-10 flex items-center justify-center bg-ai-gradient rounded-2xl text-white shadow-glow-primary hover:scale-105 transition-all ai-shimmer"
              title="DocenTico IA"
            >
              <Zap size={18} fill="currentColor" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification trigger (placeholder or actual if implemented) */}
            <button className="w-10 h-10 flex items-center justify-center rounded-2xl border border-black/5 hover:bg-black/5 dark:border-white/5 dark:hover:bg-white/5 transition-all">
              <Bell size={18} style={{ color: 'rgb(var(--color-text))' }} />
            </button>
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
