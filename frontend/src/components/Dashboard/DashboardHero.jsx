import { motion } from 'framer-motion'
import { Sparkles, Zap, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DashboardHero({ summary }) {
  const navigate = useNavigate()
  const { topInsight } = summary

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
      {/* Main AI Proactive Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-8 bg-gradient-to-br from-primary-600 to-indigo-800 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl group min-h-[400px] flex flex-col justify-between"
      >
        <div className="absolute -right-20 -bottom-20 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
          <Sparkles size={400} />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                  <Zap size={28} className="fill-white" />
               </div>
               <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 block">Insight de Inteligencia</span>
                  <p className="text-xl font-black italic tracking-tighter capitalize">{summary.greeting}</p>
               </div>
            </div>
            <span className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest">Sugerencia AI</span>
          </div>

          <div className="max-w-2xl space-y-6">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.9] group-hover:translate-x-2 transition-transform duration-500">
              {topInsight.title}: <br/>
              <span className="text-primary-300">{topInsight.message.split('.')[0]}</span>
            </h2>
            <p className="text-primary-100/70 text-sm font-bold uppercase tracking-widest">
              DocenTico analizó {summary.stats.attendanceAvg} de asistencia y detectó esta acción prioritaria.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-4 mt-12">
           <button 
             onClick={() => navigate(topInsight.actionPath)}
             className="px-8 py-5 bg-white text-primary-700 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-100 transition-all shadow-2xl flex items-center gap-3 active:scale-95"
           >
             {topInsight.actionLabel} <ArrowRight size={16} />
           </button>
           <button className="px-8 py-5 bg-white/10 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/20 transition-all border border-white/10 active:scale-95">
             Ignorar por ahora
           </button>
        </div>
      </motion.div>

      {/* Daily Summary Side Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-4 bg-surface-subtle border border-black/5 dark:border-white/5 p-10 rounded-[3rem] flex flex-col justify-between shadow-xl relative overflow-hidden"
      >
        <div className="space-y-8 relative z-10">
           <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                 <TrendingUp size={20} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Resumen del Día</h4>
           </div>
           
           <div className="space-y-4">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-400 leading-relaxed uppercase tracking-tight">
                {summary.status}
              </p>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[18px] font-black italic">{summary.stats.attendanceAvg}</p>
                 <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Asistencia</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[18px] font-black italic">{summary.stats.activePlans}</p>
                 <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">Planes Activos</p>
              </div>
           </div>
        </div>

        <button 
          onClick={() => navigate('/estudiantes?filter=risk')}
          className="w-full py-4 mt-8 bg-surface-muted text-gray-800 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-black/5 dark:border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-3"
        >
          <AlertTriangle size={16} /> Ver Alumnos en Riesgo
        </button>
      </motion.div>
    </div>
  )
}
