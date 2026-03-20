import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { X, Bell } from 'lucide-react'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

export default function NotificationToast() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] })

    socket.on('connect', () => {
      console.log('[Socket] Conectado al servidor de notificaciones')
    })

    socket.on('nueva-notificacion', (data) => {
      const notif = { id: Date.now(), ...data }
      setNotifications((prev) => [notif, ...prev].slice(0, 5))

      // Auto-dismiss después de 5 segundos
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id))
      }, 5000)
    })

    socket.on('examen-manana', (data) => {
      const notif = { id: Date.now(), tipo: 'warning', ...data }
      setNotifications((prev) => [notif, ...prev].slice(0, 5))
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id))
      }, 7000)
    })

    return () => socket.disconnect()
  }, [])

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
              ? 'bg-yellow-900/90 border-yellow-700 text-yellow-100'
              : 'bg-gray-900/95 border-gray-700 text-gray-100'
            }`}
        >
          <Bell className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-400" />
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
