import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { planificacionAPI } from '../services/api'
import { Calendar as CalendarIcon, Info, X, MapPin, Clock, FileText } from 'lucide-react'

export default function Agenda() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  const fetchPlans = async () => {
    const { data } = await planificacionAPI.getAll()
    const formattedEvents = data.map(p => ({
      id: p.id,
      title: p.titulo,
      start: p.fechaInicio,
      end: p.fechaFin,
      extendedProps: {
        contenido: p.contenido,
        objetivos: p.objetivos,
        cursoId: p.cursoId
      },
      backgroundColor: '#2563eb',
      borderColor: '#1d4ed8'
    }))
    setEvents(formattedEvents)
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleEventClick = (info) => {
    setSelectedEvent({
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      ...info.event.extendedProps
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
            <CalendarIcon className="text-primary-500 w-10 h-10" /> 
            Agenda <span className="text-primary-600">Dinámica</span>
          </h2>
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">Cronograma de actividades y planificaciones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">
        {/* Calendar Card */}
        <div className="xl:col-span-8 group relative bg-[#080808] border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden">
          <style>{`
            .fc { font-family: 'Inter', sans-serif; --fc-border-color: rgba(255,255,255,0.05); --fc-button-bg-color: transparent; --fc-button-border-color: rgba(255,255,255,0.1); --fc-page-bg-color: transparent; }
            .fc .fc-toolbar-title { font-size: 1.2rem; font-weight: 900; text-transform: uppercase; font-style: italic; letter-spacing: -0.05em; color: white; }
            .fc .fc-button-primary { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); text-transform: uppercase; font-size: 0.6rem; font-weight: 900; letter-spacing: 0.1em; color: #9ca3af; transition: all 0.2s; }
            .fc .fc-button-primary:hover { background: rgba(37, 99, 235, 0.1); color: #3b82f6; border-color: rgba(59, 130, 246, 0.3); }
            .fc .fc-button-primary:not(:disabled).fc-button-active { background: #2563eb; color: white; border-color: #2563eb; }
            .fc-theme-standard td, .fc-theme-standard th { border-color: rgba(255,255,255,0.03); }
            .fc-day-today { background: rgba(37, 99, 235, 0.05) !important; }
            .fc-daygrid-event { border-radius: 8px; padding: 4px 8px; font-weight: 800; text-transform: uppercase; font-size: 0.65rem; border: none !important; }
            .fc-col-header-cell-cushion { color: #4b5563; text-transform: uppercase; font-size: 0.6rem; font-weight: 900; letter-spacing: 0.2em; padding: 15px 0; }
            .fc-list-event { background: transparent !important; }
            .fc-list-event-title b { display: none; }
            .fc-list-event-title a { color: #f3f4f6 !important; font-weight: 800; text-transform: uppercase; font-size: 0.7rem; }
            .fc-list-day-cushion { background: rgba(255,255,255,0.02) !important; text-transform: uppercase; font-size: 0.7rem; font-weight: 900; }
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
            height="100%"
            editable={true}
            selectable={true}
            dayMaxEvents={true}
          />
        </div>

        {/* Sidebar Info */}
        <div className="xl:col-span-4 space-y-6">
          {selectedEvent ? (
            <div className="card bg-primary-600/10 border-primary-500/20 p-8 space-y-8 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                  <button onClick={() => setSelectedEvent(null)} className="text-primary-500/50 hover:text-primary-400">
                    <X size={20} />
                  </button>
               </div>
               
               <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Detalles del Evento</span>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-tight">
                    {selectedEvent.title}
                  </h3>
               </div>

               <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-400">
                        <Clock size={18} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Cronograma</p>
                        <p className="text-sm font-bold text-gray-200">Desde: {selectedEvent.start}</p>
                        <p className="text-sm font-bold text-gray-200">Hasta: {selectedEvent.end}</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-400">
                        <FileText size={18} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Contenidos</p>
                        <p className="text-xs text-gray-400 uppercase font-medium leading-relaxed mt-1">
                          {selectedEvent.contenido}
                        </p>
                     </div>
                  </div>

                  <div className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-2">
                     <p className="text-[9px] font-black uppercase tracking-widest text-primary-500">Objetivo Central</p>
                     <p className="text-sm italic font-bold text-white">
                       "{selectedEvent.objetivos}"
                     </p>
                  </div>
               </div>

               <button className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-primary-900/20">
                  Editar Planificación
               </button>
            </div>
          ) : (
            <div className="card bg-black/40 border-white/5 p-10 flex flex-col items-center justify-center text-center space-y-6 h-full border-dashed border-2">
               <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/5">
                  <Info size={40} className="text-gray-800" />
               </div>
               <div className="space-y-2">
                 <p className="text-xs font-black uppercase tracking-widest text-gray-500">Panel de Información</p>
                 <p className="text-sm text-gray-700 font-bold uppercase tracking-tight">Selecciona un evento del calendario para ver los detalles estratégicos.</p>
               </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-primary-600/10 rounded-2xl text-primary-500">
               <Info size={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              Las fechas marcadas en azul corresponden a tus planificaciones activas en Mi Aula.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
