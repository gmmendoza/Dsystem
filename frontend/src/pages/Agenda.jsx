import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { planificacionAPI } from '../services/api';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  BookOpen, 
  Plus, 
  Search,
  Filter,
  ArrowUpRight,
  Info
} from 'lucide-react';

export default function CalendarioSemanal() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [planificaciones, setPlanificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await planificacionAPI.getAll();
      setPlanificaciones(res.data);
    } finally {
      setLoading(false);
    }
  };

  // Obtener los días de la semana actual (Lunes a Viernes)
  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lunes
    startOfWeek.setDate(diff);
    
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays(currentDate);

  const getPlansForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return planificaciones.filter(p => {
       // Si es semanal, deberíamos chequear si el día cae en el rango
       if (p.tipo === 'Semanal') {
          return dateStr >= p.fechaInicio && dateStr <= p.fechaFin;
       }
       return p.fechaInicio === dateStr;
    });
  };

  const changeWeek = (weeks) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + weeks * 7);
    setCurrentDate(newDate);
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('es', { month: 'long', year: 'numeric' }).toUpperCase();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* ── HEADER CALENDARIO ── */}
      <div className="flex flex-col lg:flex-row justify-between items-center bg-black/40 border border-white/5 p-10 rounded-[3rem] gap-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-primary-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary-900/30 rotate-3">
              <CalendarIcon size={32} />
           </div>
           <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">Calendario <span className="text-primary-500">Semanal</span>.</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mt-2">Visualiza y organiza tus clases con precisión académica</p>
           </div>
        </div>

        <div className="flex items-center gap-6 bg-white/[0.02] p-2 rounded-3xl border border-white/5">
           <button onClick={() => changeWeek(-1)} className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 transition-all"><ChevronLeft size={24} /></button>
           <div className="px-6 text-center min-w-[200px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-1">{formatMonth(currentDate)}</p>
              <p className="text-sm font-black text-white uppercase tracking-tighter">Semana del {weekDays[0].getDate()} al {weekDays[4].getDate()}</p>
           </div>
           <button onClick={() => changeWeek(1)} className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 transition-all"><ChevronRight size={24} /></button>
        </div>

        <button 
          onClick={() => navigate('/planificador')}
          className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10 hover:-translate-y-1"
        >
          + Nueva Planificación
        </button>
      </div>

      {/* ── GRID SEMANAL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
         {weekDays.map((day, idx) => {
           const plans = getPlansForDay(day);
           const isToday = day.toDateString() === new Date().toDateString();
           
           return (
             <div key={idx} className={`flex flex-col min-h-[600px] bg-black/20 border border-white/5 rounded-[2.5rem] overflow-hidden transition-all ${isToday ? 'ring-2 ring-primary-600/50 bg-primary-950/5' : ''}`}>
                
                {/* Cabecera del Día */}
                <div className={`p-6 text-center border-b border-white/5 ${isToday ? 'bg-primary-600/10' : 'bg-white/[0.02]'}`}>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-1">
                      {day.toLocaleDateString('es', { weekday: 'long' })}
                   </p>
                   <p className={`text-3xl font-black italic tracking-tighter ${isToday ? 'text-primary-500' : 'text-white'}`}>
                      {day.getDate()}
                   </p>
                </div>

                {/* Contenido del Día */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                   {plans.length > 0 ? (
                     plans.map(plan => (
                       <div 
                         key={plan.id}
                         onClick={() => navigate(`/planificador?edit=${plan.id}`)}
                         className="group cursor-pointer bg-[#0A0A0A] border border-white/5 hover:border-primary-500/30 p-5 rounded-3xl transition-all hover:-translate-y-1 relative"
                       >
                          <div className="space-y-3 relative z-10">
                             <div className="flex justify-between items-start">
                                <span className="px-2 py-0.5 bg-primary-600/10 text-primary-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-primary-500/20">
                                   {plan.materia}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${plan.estado === 'Activa' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500'}`} />
                             </div>
                             <h4 className="text-xs font-black uppercase italic tracking-tighter text-white leading-tight group-hover:text-primary-400 transition-colors">
                                {plan.titulo}
                             </h4>
                             <div className="flex items-center gap-2 text-[9px] font-bold text-gray-700 uppercase tracking-widest">
                                <Clock size={12} /> {plan.tipo === 'Semanal' ? 'Semanario' : 'Bloque Diario'}
                             </div>
                          </div>
                          <div className="absolute -right-2 -bottom-2 opacity-0 group-hover:opacity-[0.05] transition-opacity">
                             <BookOpen size={60} />
                          </div>
                       </div>
                     ))
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 grayscale">
                        <Plus size={24} className="mb-2" />
                        <p className="text-[8px] font-black uppercase tracking-widest">Sin Clases</p>
                     </div>
                   )}
                </div>
             </div>
           );
         })}
      </div>

      {/* ── FOOTER INFO ── */}
      <div className="flex items-center gap-4 bg-primary-600/5 border border-primary-500/10 p-6 rounded-3xl max-w-2xl">
         <div className="p-3 bg-primary-500/20 rounded-2xl text-primary-500">
            <Info size={20} />
         </div>
         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
            Puedes hacer clic en cualquier clase para editar sus objetivos y actividades. El calendario se sincroniza automáticamente con tus últimos cambios.
         </p>
      </div>

    </div>
  );
}
