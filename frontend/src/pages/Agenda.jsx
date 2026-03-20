import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { planificacionAPI } from '../services/api'
import { Calendar as CalendarIcon, Info } from 'lucide-react'

export default function Agenda() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await planificacionAPI.getAll()
      const formattedEvents = data.map(p => ({
        id: p.id,
        title: p.titulo,
        start: p.fechaInicio,
        end: p.fechaFin,
        extendedProps: {
          contenido: p.contenido,
          objetivos: p.objetivos
        },
        backgroundColor: '#2563eb',
        borderColor: '#1d4ed8'
      }))
      setEvents(formattedEvents)
    }
    fetchPlans()
  }, [])

  const handleEventClick = (info) => {
    alert(`📅 ${info.event.title}\n\n📝 Contenido: ${info.event.extendedProps.contenido}\n🎯 Objetivos: ${info.event.extendedProps.objetivos}`)
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="text-primary-400" /> Agenda Académica
          </h2>
          <p className="text-gray-400 text-sm">Visualiza tus planificaciones y eventos del ciclo.</p>
        </div>
        <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 border border-blue-800 rounded-lg text-blue-300 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Planificaciones
            </div>
        </div>
      </div>

      <div className="card p-4 flex-1 bg-gray-900 border-gray-800 text-gray-200 overflow-hidden">
        <style>{`
          .fc { --fc-border-color: #374151; --fc-button-bg-color: #1e293b; --fc-button-border-color: #334155; --fc-page-bg-color: #0f172a; }
          .fc .fc-toolbar-title { font-size: 1.1rem; font-weight: 700; color: #f3f4f6; }
          .fc-theme-standard td, .fc-theme-standard th { border-color: #1f2937; }
          .fc-daygrid-event { border-radius: 4px; padding: 2px 4px; font-size: 0.8rem; }
          .fc .fc-button-primary:hover { background-color: #334155; border-color: #475569; }
          .fc .fc-button-primary:disabled { background-color: #0f172a; }
          .fc-col-header-cell-cushion { color: #9ca3af; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; padding: 10px 0; }
        `}</style>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth'
          }}
          locale="es"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          editable={true}
          selectable={true}
          dayMaxEvents={true}
        />
      </div>

      <div className="flex items-center gap-2 p-3 bg-gray-800/30 rounded-lg text-gray-500 text-xs border border-gray-800">
        <Info size={14} className="text-primary-400" />
        Haz clic en una planificación para ver los detalles. Puedes arrastrar eventos (demo) para replanificar.
      </div>
    </div>
  )
}
