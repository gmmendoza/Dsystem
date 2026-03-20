import { NavLink, Outlet } from 'react-router-dom'
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
  History // Usando History en lugar de Archive por si acaso
} from 'lucide-react'
import NotificationToast from '../Notifications/NotificationToast'

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/mi-aula',      icon: BookOpen,        label: 'Mi Aula' },
  { to: '/planificador', icon: ClipboardList,   label: 'Planificador' },
  { to: '/agenda',       icon: CalendarDays,    label: 'Calendario' },
  { to: '/historial',    icon: History,         label: 'Historial' },
]

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-gray-200 font-sans">
      {/* ── Sidebar ── */}
      <aside className="w-72 bg-[#080808] flex flex-col border-r border-white/5 flex-shrink-0 z-20">
        {/* Logo Section */}
        <div className="flex items-center gap-4 px-8 py-10">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-900/20 rotate-3 group-hover:rotate-0 transition-transform">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">DSystem.</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Gestión Docente</p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 pb-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">Principal</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-4 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-4">
                {Icon && <Icon size={20} className="transition-transform group-hover:scale-110" />}
                <span className="text-xs font-black uppercase tracking-widest">{label}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-blue-600 flex items-center justify-center text-white font-black text-sm border-2 border-white/10">
              {user?.username?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black uppercase italic tracking-tighter text-white truncate">{user?.username || 'Docente'}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 truncate">{user?.rol || 'DOCENTE'}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center justify-center gap-3 w-full py-4 bg-red-950/10 hover:bg-red-950/30 text-red-500/70 hover:text-red-400 border border-red-900/20 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={16} />
            Cerrar Sesión Segura
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full -z-10" />
        
        <header className="h-20 flex items-center justify-between px-10 border-b border-white/5 bg-black/40 backdrop-blur-md flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
             <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
               Panel de Control <span className="text-gray-700 mx-2">/</span> Académico
             </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <NotificationToast />
            <button className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-600 rounded-full border-2 border-black" />
            </button>
            <div className="h-8 w-[1px] bg-white/5 mx-2" />
            <div className="w-10 h-10 rounded-xl bg-gray-900 border border-white/5 flex items-center justify-center text-gray-600 cursor-pointer hover:border-primary-500 transition-colors">
              <User size={20} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
