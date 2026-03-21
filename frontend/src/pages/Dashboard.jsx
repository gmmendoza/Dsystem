import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  BookOpen,
  PieChart,
  MessageSquare,
  Trophy,
  Activity,
  ChevronRight,
  Bot
} from 'lucide-react'
import { useAI } from '../context/AIContext'
import { mockDataService } from '../services/mockDataService'
import KPICard from '../components/Dashboard/KPICard'

export default function Dashboard() {
  const { suggestions, dailySummary, refreshSuggestions } = useAI()
  const navigate = useNavigate()
  const [cursos, setCursos] = useState([])
  const [recentPlans, setRecentPlans] = useState([])
  const [stats, setStats] = useState({ alumnos: 0, cursos: 0, asistencia: '0%', riesgo: 0 })

  useEffect(() => {
    refreshSuggestions()
    const allAlumnos = mockDataService.getAlumnos()
    const allCursos = mockDataService.getCursos()
    const allPlanes = mockDataService.getPlanes ? mockDataService.getPlanes() : []
    
    const avgAtt = allAlumnos.length ? (allAlumnos.reduce((s, a) => s + (Number(a.asistencia) || 0), 0) / allAlumnos.length).toFixed(1) : 0
    const riskCount = allAlumnos.filter(a => (a.asistencia || 0) < 75).length
    
    setStats({ 
      alumnos: allAlumnos.length, 
      cursos: allCursos.length, 
      asistencia: `${avgAtt}%`, 
      riesgo: riskCount 
    })
    setCursos(allCursos.slice(0, 4))
    setRecentPlans(allPlanes.slice(0, 3))
  }, [refreshSuggestions])

  return (
    <div className="space-y-8 pb-20 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* ── TOP HEADER / GREETING ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Sistema Activo</span>
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
            {dailySummary?.greeting || 'Hola, Prof. Mendoza'}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-surface-subtle dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                 <Bot size={16} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">DocenTico Pro</span>
                 <span className="text-[10px] font-bold text-primary-500">IA Analizando...</span>
              </div>
           </div>
           <button 
             onClick={() => navigate('/planificador')}
             className="btn-primary"
           >
             <Plus size={16} /> Nuevo Plan
           </button>
        </div>
      </header>

      {/* ── KPI GRID ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard 
           label="Estudiantes" 
           value={stats.alumnos} 
           delta="+3" 
           deltaPositive={true} 
           icon={Users} 
           bg="bg-indigo-500/10" 
           color="text-indigo-600" 
         />
         <KPICard 
           label="Asistencia Prom." 
           value={stats.asistencia} 
           delta="+0.8%" 
           deltaPositive={true} 
           icon={TrendingUp} 
           bg="bg-emerald-500/10" 
           color="text-emerald-600" 
         />
         <KPICard 
           label="Alertas IA" 
           value={stats.riesgo} 
           delta="Crítico" 
           deltaPositive={false} 
           icon={AlertCircle} 
           bg="bg-red-500/10" 
           color="text-red-600" 
         />
         <KPICard 
           label="Cursos Activos" 
           value={stats.cursos} 
           icon={BookOpen} 
           bg="bg-amber-500/10" 
           color="text-amber-600" 
         />
      </section>

      {/* ── MAIN CONTENT: 2 COLUMNS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-10">
          
          {/* MIS AULAS GRID */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
                 <Layout size={16} className="text-primary-500" /> Mis Aulas <span className="text-gray-300">/</span> {cursos.length}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {cursos.map(curso => (
                 <div 
                   key={curso.id}
                   onClick={() => navigate(`/aula/${curso.id}`)}
                   className="group relative bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-6 rounded-2xl shadow-premium hover:border-primary-500/30 transition-all cursor-pointer overflow-hidden"
                 >
                    <div className="relative z-10 space-y-4">
                       <div className="flex justify-between items-start">
                          <div className="w-10 h-10 bg-surface-subtle dark:bg-white/5 rounded-xl flex items-center justify-center text-primary-600">
                             <TrendingUp size={18} />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{curso.nivel}</span>
                       </div>
                       <h4 className="text-lg font-black italic uppercase tracking-tight group-hover:text-primary-500 transition-colors leading-none">{curso.nombre}</h4>
                       <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-500 pt-4 border-t border-black/5 dark:border-white/5">
                          <span>{curso.alumnos?.length || 0} Alumnos</span>
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* RECENT PLANS */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
                 <Clock size={16} className="text-amber-500" /> Historial Reciente
              </h3>
            </div>
            <div className="space-y-3">
               {recentPlans.length > 0 ? recentPlans.map(plan => (
                 <div key={plan.id} className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-xl hover:border-primary-500/20 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-surface-subtle dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                          <FileText size={18} />
                       </div>
                       <div>
                          <p className="text-sm font-bold uppercase tracking-tight leading-none mb-1">{plan.titulo}</p>
                          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{plan.materia} • {new Date(plan.lastModified).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <button onClick={() => navigate(`/planificador?edit=${plan.id}`)} className="p-2 text-gray-400 hover:text-primary-500"><ArrowRight size={18} /></button>
                 </div>
               )) : (
                 <div className="text-center py-10 bg-surface-subtle/30 border border-dashed border-black/5 dark:border-white/5 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sin planes recientes</p>
                 </div>
               )}
            </div>
          </section>
        </div>

        {/* ── SIDEBAR: AI INSIGHTS & PROGRESS ── */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* DOCENTICO INSIGHT CARD */}
          <div className="bg-ai-gradient p-8 rounded-3xl shadow-xl shadow-indigo-600/20 text-white relative overflow-hidden group">
             <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                <Bot size={200} />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2">
                   <Sparkles size={16} className="text-indigo-200" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-white/70">Mente Artificial DocenTico</h4>
                </div>
                <p className="text-[13px] font-bold italic leading-relaxed">
                   &quot;He detectado que el rendimiento en Matemática subió un 5% después de la última secuencia didáctica.&quot;
                </p>
                <button onClick={() => navigate('/estudiantes')} className="w-full py-3 bg-white text-primary-600 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                   Ver Análisis Completo
                </button>
             </div>
          </div>

          {/* PROGRESS MODULE */}
          <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-8 rounded-3xl shadow-premium space-y-6">
             <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <Trophy size={16} className="text-amber-500" /> Progreso Maestro
                </h4>
                <span className="text-[10px] font-black text-primary-500 italic">Nivel 4</span>
             </div>
             
             <div className="space-y-3 pt-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                   <span className="text-gray-400">Currículum Cubierto</span>
                   <span>72%</span>
                </div>
                <div className="h-2 bg-surface-subtle dark:bg-white/5 rounded-full p-[1px] border border-black/5 dark:border-white/5">
                   <div className="h-full bg-primary-600 w-[72%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-subtle dark:bg-white/5 p-4 rounded-xl text-center space-y-1 border border-black/5 dark:border-white/5">
                   <div className="text-xl font-black italic tracking-tighter">18</div>
                   <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Tareas Done</p>
                </div>
                <div className="bg-surface-subtle dark:bg-white/5 p-4 rounded-xl text-center space-y-1 border border-black/5 dark:border-white/5">
                   <div className="text-xl font-black italic tracking-tighter">8.4</div>
                   <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Prom. Trim.</p>
                </div>
             </div>
          </div>

          {/* RISK ALERTS */}
          <div className="bg-red-500/[0.03] border border-red-500/10 p-8 rounded-3xl space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Activity size={16} className="text-red-500" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest">Alertas de Riesgo</h4>
                </div>
                <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-red-500/20">
                   {stats.riesgo} Alertas
                </span>
             </div>
             <div className="space-y-2">
                {suggestions.filter(s => s.type === 'danger').slice(0, 2).map((s, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 border border-black/5 dark:border-white/5 rounded-xl group/item">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 text-[10px] font-black">
                            {s.title.charAt(0)}
                         </div>
                         <div className="max-w-[120px]">
                            <p className="text-[10px] font-black uppercase tracking-tight truncate">{s.title}</p>
                            <p className="text-[8px] font-bold text-gray-500 uppercase truncate">IA Alert</p>
                         </div>
                      </div>
                      <button onClick={() => navigate(s.action?.path || '/')} className="p-2 text-gray-400 group-hover/item:text-red-500 transition-colors">
                         <ChevronRight size={14} />
                      </button>
                   </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
