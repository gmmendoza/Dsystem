import { useState } from 'react'
import { X, Bell } from 'lucide-react'

export default function NotificationToast() {
  const [notifications, setNotifications] = useState([])

  // Lógica de sockets eliminada para Modo Demo
  // Se pueden añadir notificaciones manuales aquí para pruebas si es necesario

  const dismiss = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm animate-in slide-in-from-right
            ${n.tipo === 'warning'
              ? 'bg-amber-600/90 border-amber-700 text-white'
              : 'bg-surface-subtle/95 border-white/10 transition-colors duration-300'
            }`} style={n.tipo !== 'warning' ? { color: 'rgb(var(--color-text))' } : {}}
        >
          <Bell className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
          <div className="flex-1">
            {n.titulo && <p className="font-semibold">{n.titulo}</p>}
            <p className="text-gray-300 text-xs mt-0.5">{n.mensaje}</p>
          </div>
          <button onClick={() => dismiss(n.id)} className="text-gray-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
