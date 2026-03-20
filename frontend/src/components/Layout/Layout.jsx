import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardList,
  LogOut,
  Bell,
  GraduationCap,
  ChevronRight,
  User,
  History,
  Settings,
  Menu,
  X,
  ChevronLeft,
  Sparkles,
  Search,
  Zap,
  Sun,
  Moon
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import NotificationToast from '../Notifications/NotificationToast'
import AIChat from '../AI/AIChat'

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Panel Dashboard' },
  { to: '/mi-aula',      icon: BookOpen,        label: 'Mis Aulas' },
  { to: '/estudiantes',  icon: Users,           label: 'Estudiantes' },
  { to: '/planificador', icon: ClipboardList,   label: 'Planificador Pro' },
  { to: '/agenda',       icon: CalendarDays,    label: 'Calendario' },
  { to: '/historial',    icon: History,         label: 'Historial' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [headerToast, setHeaderToast] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setHeaderToast(`Buscando "${searchQuery}" en todo el sistema...`)
      setTimeout(() => setHeaderToast(null), 3000)
    }
  }

  const handleHeaderAction = (action) => {
    const messages = {
       notifications: 'No tienes nuevas notificaciones por el momento.',
       settings: 'Abriendo configuración del sistema DocenTico...',
       zap: '¡Modo IA Boost activado! El rendimiento de las sugerencias ha mejorado.'
    }
    setHeaderToast(messages[action])
    setTimeout(() => setHeaderToast(null), 3000)
  }

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '88px' }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface font-sans selection:bg-primary-500/30 transition-colors duration-300">
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside 
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        className={`
          fixed lg:static inset-y-0 left-0 bg-surface-subtle/80 lg:bg-surface-subtle/40 backdrop-blur-xl flex flex-col border-r border-black/5 dark:border-white/5 flex-shrink-0 z-[70] 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform lg:transition-none duration-300
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20 shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="whitespace-nowrap"
              >
                <h2 className="text-xl font-black italic uppercase tracking-tighter">DSystem<span className="text-primary-500">.</span></h2>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">Education SaaS</p>
              </motion.div>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 bg-surface-subtle hover:bg-surface-muted rounded-lg text-gray-500 hover:text-primary-500 transition-colors border border-black/5 dark:border-white/5"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-4 overflow-y-auto custom-scrollbar pt-6">
          {!isCollapsed && <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-gray-700">Explorar</p>}
          <div className="space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group relative ${
                    isActive 
                      ? 'bg-primary-600/10 text-primary-500 dark:text-primary-400 border border-primary-500/20 shadow-sm' 
                      : 'text-gray-900 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <Icon size={20} className="shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
                {location.pathname === to && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"
                  />
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className={`p-4 mt-auto border-t border-white/5 bg-white/[0.01]`}>
          {!isCollapsed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-black text-sm shadow-inner group cursor-pointer overflow-hidden">
                   <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-tighter truncate">{user?.username || 'Docente Pro'}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600 truncate">{user?.rol || 'Premium Plan'}</p>
                  </div>
                </div>
                <button onClick={logout} className="p-2 text-gray-600 hover:text-red-400 transition-colors">
                   <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-500 border border-primary-500/20">
                  <User size={20} />
               </div>
               <button onClick={logout} className="p-2 text-gray-700 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
               </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <header className={`h-20 flex items-center justify-between px-6 md:px-10 border-b border-black/5 dark:border-white/5 sticky top-0 transition-all duration-300 z-50 ${scrolled ? 'bg-surface/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
          <div className="flex items-center gap-6">
             <button 
               onClick={() => setSidebarOpen(true)}
               className="lg:hidden p-3 text-gray-500 hover:text-primary-500 bg-surface-subtle rounded-xl border border-black/5 dark:border-white/10"
             >
               <Menu size={20} />
             </button>
             
             {/* Search Bar SaaS Style */}
             <div className="hidden md:flex items-center gap-3 bg-surface-subtle border border-black/10 dark:border-white/5 px-4 py-2.5 rounded-xl w-80 group focus-within:border-primary-500/50 transition-all shadow-sm">
                <Search size={16} className="text-gray-900 dark:text-gray-500 group-focus-within:text-primary-500" />
                <input 
                  type="text" 
                  placeholder="BUSCAR RECURSOS, AULAS..." 
                  className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest placeholder:text-gray-800 dark:placeholder:text-gray-500 w-full"
                  style={{ color: 'rgb(var(--color-text))' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <span className="text-[10px] px-1.5 py-0.5 bg-surface-muted rounded border border-black/10 dark:border-white/10 text-gray-900 dark:text-gray-400 font-black">⌘K</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">

            <button 
              onClick={() => handleHeaderAction('notifications')}
              className="relative w-11 h-11 flex items-center justify-center text-gray-900 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 hover:bg-surface-subtle rounded-xl border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all"
            >
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-primary-500 rounded-full border-2 border-surface animate-pulse" />
            </button>
            
            <button 
              onClick={toggleTheme}
              className="w-11 h-11 flex items-center justify-center text-gray-900 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 hover:bg-surface-subtle rounded-xl border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-all"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="h-8 w-[1px] bg-black/5 dark:bg-white/5 mx-1" />
            
            <div 
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-chat'))}
              className="w-10 h-10 rounded-xl bg-surface-subtle border border-black/5 dark:border-white/10 flex items-center justify-center text-primary-500 dark:text-primary-400 shadow-lg cursor-pointer hover:border-primary-500 transition-all active:scale-95"
            >
               <Zap size={20} />
            </div>
          </div>
        </header>

        <AnimatePresence>
          {headerToast && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-surface-subtle/90 border border-primary-500/30 text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3"
              style={{ color: 'rgb(var(--color-text))' }}
            >
               <Sparkles className="text-primary-500" size={16} />
               {headerToast}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full space-y-8 pb-10">
            <Outlet />
          </div>
        </main>
        
        {/* AI Assistant Chat */}
        <AIChat />
        <NotificationToast />
      </div>
    </div>
  )
}
