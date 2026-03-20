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
} from 'lucide-react'
import NotificationToast from '../Notifications/NotificationToast'

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/mi-aula',      icon: BookOpen,        label: 'Mi Aula' },
  { to: '/planificador', icon: ClipboardList,   label: 'Planificador' },
  { to: '/agenda',       icon: CalendarDays,    label: 'Calendario' },
]

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-sidebar flex flex-col border-r border-gray-800 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="p-2 bg-primary-600 rounded-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">DSystem</p>
            <p className="text-gray-500 text-xs">Aula Virtual</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.username?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.username || 'Docente'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.rol || 'DOCENTE'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-950 flex-shrink-0">
          <h1 className="text-sm font-semibold text-gray-300">Sistema de Gestión Docente</h1>
          <div className="flex items-center gap-4">
            <NotificationToast />
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
