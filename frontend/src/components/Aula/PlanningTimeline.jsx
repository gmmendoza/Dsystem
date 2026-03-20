import React from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react'

export default function PlanningTimeline({ planes }) {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  
  // Agrupar planes por semana (simulado para este workspace)
  const currentMonth = new Date().toLocaleString('es', { month: 'long' })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <CalendarIcon className="text-primary-500" size={20} />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Cronograma: {currentMonth} 2026</h3>
         </div>
         <div className="flex gap-2">
            <button className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
            <button className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"><ChevronRight size={16} /></button>
         </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
         {days.map(d => (
           <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-700 py-2 border-b border-white/5">{d}</div>
         ))}
         
         {[...Array(31)].map((_, i) => {
            const dayNum = i + 1
            const hasPlan = planes.some(p => {
                const start = new Date(p.fechaInicio).getDate()
                const end = new Date(p.fechaFin).getDate()
                return dayNum >= start && dayNum <= end
            })
            const matchingPlanes = planes.filter(p => {
                const start = new Date(p.fechaInicio).getDate()
                const end = new Date(p.fechaFin).getDate()
                return dayNum >= start && dayNum <= end
            })

            return (
              <div key={i} className={`min-h-[100px] bg-white/[0.01] border border-white/5 rounded-xl p-2 transition-all ${hasPlan ? 'bg-primary-500/[0.03] border-primary-500/20' : ''}`}>
                 <span className={`text-[10px] font-black ${hasPlan ? 'text-primary-500' : 'text-gray-800'}`}>{dayNum}</span>
                 <div className="mt-2 space-y-1">
                    {matchingPlanes.map(p => (
                      <div key={p.id} className="px-2 py-1 bg-primary-600/20 border border-primary-500/30 rounded text-[7px] font-black uppercase tracking-tighter text-primary-400 truncate">
                         {p.titulo}
                      </div>
                    ))}
                 </div>
              </div>
            )
         })}
      </div>

      <div className="mt-8 flex gap-6 items-center">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Activa</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">En Progreso</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Finalizada</span>
         </div>
      </div>
    </div>
  )
}
