import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { planificacionAPI } from '../services/api';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Agenda() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await planificacionAPI.getAll();
      const formattedEvents = res.data.map(p => ({
        id: p.id,
        title: p.titulo,
        start: p.fechaInicio,
        end: p.fechaFin || p.fechaInicio,
        extendedProps: { ...p },
        backgroundColor: p.tipo === 'Semanal' ? '#4f46e5' : '#2563eb', // Indigo para semanal, Blue para diaria
        borderColor: 'transparent'
      }));
      setEvents(formattedEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info) => {
    const id = info.event.id;
    navigate(`/planificador?edit=${id}`);
  };

  const handleDateClick = (info) => {
    navigate(`/planificador?date=${info.dateStr}`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* ── HEADER CALENDARIO ── */}
      <div className="flex flex-col lg:flex-row justify-between items-center bg-black/40 border border-white/5 p-10 rounded-[3rem] gap-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-900/30 rotate-3">
              <CalendarIcon size={32} />
           </div>
           <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Mi <span className="text-blue-500">Agenda</span>.</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mt-2">Sincronización profesional de planificaciones</p>
           </div>
        </div>

        <button 
          onClick={() => navigate('/planificador')}
          className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10 hover:-translate-y-1"
        >
          + Nueva Planificación
        </button>
      </div>

      {/* ── FULLCALENDAR COMPONENT ── */}
      <div className="bg-black/20 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
        <style>{`
          .fc { --fc-border-color: rgba(255,255,255,0.05); color: white; font-family: 'Inter', sans-serif; }
          .fc-header-toolbar { margin-bottom: 2rem !important; }
          .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 900 !important; text-transform: uppercase; letter-spacing: -0.05em; font-style: italic; }
          .fc-button-primary { background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; font-size: 10px !important; font-weight: 900 !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; border-radius: 12px !important; padding: 0.75rem 1.25rem !important; }
          .fc-button-active { background: #2563eb !important; border-color: #2563eb !important; }
          .fc-daygrid-day { transition: background 0.2s; }
          .fc-daygrid-day:hover { background: rgba(255,255,255,0.02); }
          .fc-daygrid-day-number { font-size: 11px; font-weight: 900; color: #4b5563; padding: 10px !important; }
          .fc-day-today { background: rgba(37, 99, 235, 0.05) !important; }
          .fc-event { border-radius: 8px !important; padding: 4px 8px !important; font-size: 10px !important; font-weight: 700 !important; cursor: pointer; transition: transform 0.2s; }
          .fc-event:hover { transform: translateY(-1px); filter: brightness(1.2); }
          .fc-col-header-cell { padding: 15px 0 !important; background: rgba(255,255,255,0.01); }
          .fc-col-header-cell-cushion { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #4b5563; }
        `}</style>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale={esLocale}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          aspectRatio={1.8}
        />
      </div>

      {/* ── FOOTER INFO ── */}
      <div className="flex items-center gap-4 bg-blue-600/5 border border-blue-500/10 p-6 rounded-3xl max-w-2xl">
         <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-500">
            <Info size={20} />
         </div>
         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
            Las fechas se sincronizan con tus planificaciones guardadas. Los planes diarios aparecen en azul y los semanales en índigo. Haz clic en cualquier evento para editar.
         </p>
      </div>

    </div>
  );
}
