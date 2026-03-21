import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Clock,
  MoreHorizontal,
  FileText,
  Bot,
  ChevronRight,
  TrendingDown,
  Layout,
  BookOpen,
  PieChart,
  MessageSquare
} from 'lucide-react'
import { useAI } from '../context/AIContext'
import { mockDataService } from '../services/mockDataService'
import KPICard from '../components/Dashboard/KPICard'
import { useNavigate } from 'react-router-dom'

/**
 * DASHBOARD PRO: AI AS THE PROTAGONIST
 * Focuses on a Hero Greeting, Actionable AI Cards, and Premium SaaS design.
 */
export default function Dashboard() {
  const { suggestions, dailySummary, refreshSuggestions } = useAI()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ alumnos: 0, cursos: 0, asistencia: '0%', riesgo: 0 })

  useEffect(() => {
    refreshSuggestions()
    const alumnos = mockDataService.getAlumnos()
    const cursos = mockDataService.getCursos()
    const avgAtt = alumnos.length ? (alumnos.reduce((s, a) => s + (Number(a.asistencia) || 0), 0) / alumnos.length).toFixed(1) : 0
    const risk = alumnos.filter(a => (a.asistencia || 0) < 75).length
    
    setStats({ alumnos: alumnos.length, cursos: cursos.length, asistencia: `${avgAtt}%`, riesgo: risk })
  }, [refreshSuggestions])

  const handleApplyRecommendation = (id) => {
    console.log('Applying recommendation:', id)
    // Logic to auto-fix or navigate
  }

  return (
    <div className="space-y-12 pb-24 max-w-[1600px] mx-auto animate-in fade-in duration-1000">
      
      {/* ── SECTION 0: AI HERO ───────────────────────────────────── */}
      <section className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-ai-gradient rounded-[3.5rem] shadow-2xl shadow-indigo-500/20" />
        
        {/* Animated Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10 px-12 py-16 lg:px-20 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-16 text-white">
          <div className="max-w-2xl space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]"
            >
               <Bot size={16} className="text-white" />
               DocenTico Inteligente Activado
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl lg:text-7xl font-black italic tracking-tighter leading-none"
            >
              {dailySummary?.greeting || 'Hola Mendoza'}, <br/>
              <span className="text-white/50">hoy tenés {suggestions.length} prioridades.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/70 font-medium leading-relaxed max-w-[500px]"
            >
              {dailySummary?.status || 'Analicé el rendimiento de tus aulas. Hay 3 alumnos que necesitan refuerzo inmediato.'}
            </motion.p>
            
            <div className="flex flex-wrap gap-5 pt-4">
               <button onClick={() => navigate('/planificador')} className="bg-white text-primary-600 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/10 hover:scale-105 active:scale-95 transition-all">
                  Generar Plan IA
               </button>
               <button onClick={() => navigate('/estudiantes')} className="px-10 py-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-3">
                  Checkeo de Alumnos <ArrowRight size={18} />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:w-[450px]">
             <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 flex flex-col justify-between aspect-square group/tile hover:bg-white/20 transition-all cursor-pointer shadow-lg">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                   <Users size={24} />
                </div>
                <div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Total Alumnos</span>
                   <div className="text-4xl font-black italic">{stats.alumnos}</div>
                </div>
             </div>
             <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 flex flex-col justify-between aspect-square group/tile hover:bg-white/20 transition-all cursor-pointer shadow-lg">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                   <TrendingUp size={24} />
                </div>
                <div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Asistencia</span>
                   <div className="text-4xl font-black italic">{stats.asistencia}</div>
                </div>
             </div>
             <div className="col-span-2 bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                <div className="space-y-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Estado Crítico</span>
                   <div className="text-2xl font-black italic">{stats.riesgo} Alumnos en riesgo</div>
                </div>
                <div className="w-14 h-14 bg-red-500/20 text-red-200 rounded-full flex items-center justify-center animate-pulse">
                   <AlertCircle size={28} />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: AI ACTIONABLE GRID (THE CARDS) ─────────────── */}
      <section className="space-y-10 px-6 lg:px-0">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-2 h-7 bg-primary-600 rounded-full" />
              <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">Recomendaciones del Asistente</h2>
           </div>
           <button onClick={() => navigate('/asistente')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-500 hover:tracking-[0.2em] transition-all">
               Panel de IA Completo <ChevronRight size={14} />
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           <AnimatePresence mode="popLayout">
              {suggestions.map((s, idx) => (
                <motion.div 
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-10 rounded-[3.5rem] shadow-premium hover:shadow-2xl hover:border-primary-500/30 transition-all group flex flex-col justify-between min-h-[460px]"
                >
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                       <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${
                          s.type === 'danger' ? 'bg-red-500/10 text-red-600' :
                          s.type === 'warning' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-primary-500/10 text-primary-600'
                       }`}>
                          {s.type === 'danger' ? <AlertCircle size={28} /> : s.type === 'warning' ? <Zap size={28} /> : <CheckCircle2 size={28} />}
                       </div>
                       <div className="flex gap-1">
                          {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-black/5 dark:bg-white/10" />)}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-2xl font-black italic leading-tight uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                          {s.title}
                       </h3>
                       <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                          {s.message}
                       </p>
                    </div>
                  </div>

                  <div className="pt-10 mt-10 border-t border-black/5 dark:border-white/5 space-y-4">
                     {/* PRIMARY ACTION */}
                     <button 
                       onClick={() => navigate(s.action?.path || '/')}
                       className="w-full bg-primary-600 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                     >
                        <Zap size={16} /> {s.action?.label || 'Atender Ahora'}
                     </button>
                     
                     {/* SECONDARY ACTIONS */}
                     <div className="grid grid-cols-2 gap-4">
                        <button className="bg-surface-subtle dark:bg-white/5 text-gray-700 dark:text-gray-400 py-4 rounded-[1.2rem] font-black text-[9px] uppercase tracking-widest border border-black/5 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                           <FileText size={14} /> Reporte
                        </button>
                        <button 
                          onClick={() => handleApplyRecommendation(s.id)}
                          className="bg-surface-subtle dark:bg-white/5 text-gray-700 dark:text-gray-400 py-4 rounded-[1.2rem] font-black text-[9px] uppercase tracking-widest border border-black/5 dark:border-white/5 hover:border-primary-500/20 hover:text-primary-600 transition-all flex items-center justify-center gap-2"
                        >
                           <Check size={14} /> Aplicar
                        </button>
                     </div>
                  </div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>
      </section>

      {/* ── SECTION 2: METRIC CARDS ROLL ─────────────────────────── */}
      <section className="px-6 lg:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <KPICard 
           label="Planificaciones" 
           value="12" 
           delta="+2" 
           deltaPositive={true} 
           icon={BookOpen} 
           bg="bg-indigo-500/10" 
           color="text-indigo-600" 
         />
         <KPICard 
           label="Rendimiento Prom." 
           value="7.8" 
           delta="+0.4" 
           deltaPositive={true} 
           icon={PieChart} 
           bg="bg-emerald-500/10" 
           color="text-emerald-600" 
         />
         <KPICard 
           label="Mensajes Tutores" 
           value="5" 
           icon={MessageSquare} 
           bg="bg-amber-500/10" 
           color="text-amber-600" 
         />
         <KPICard 
           label="Materias Cubiertas" 
           value="85%" 
           delta="-5%" 
           deltaPositive={false} 
           icon={Layout} 
           bg="bg-violet-500/10" 
           color="text-violet-600" 
         />
      </section>

    </div>
  )
}

function Check({ size, className }) {
   return <CheckCircle2 size={size} className={className} />
}
