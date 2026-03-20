import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { alumnoAPI, cursoAPI, planificacionAPI } from '../services/api'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Activity,
  GraduationCap as GradIcon,
  ChevronRight
} from 'lucide-react'
import { CardSkeleton } from '../components/Common/LoadingSkeleton'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ alumnos: 0, cursos: 0, planificaciones: 0 })
  const [recentPlans, setRecentPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [alumnos, cursos, plans] = await Promise.all([
          alumnoAPI.getAll(),
          cursoAPI.getAll(),
          planificacionAPI.getAll()
        ])
        setStats({
          alumnos: alumnos.data.length,
          cursos: cursos.data.length,
          planificaciones: plans.data.length
        })
        // Ordenar por fecha y tomar las 4 más recientes
        const sorted = plans.data.sort((a, b) => new Date(b.lastModified || b.fechaInicio) - new Date(a.lastModified || a.fechaInicio))
        setRecentPlans(sorted.slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const cards = [
    { label: 'Estudiantes', value: stats.alumnos, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%' },
    { label: 'Cursos Activos', value: stats.cursos, icon: BookOpen, color: 'text-primary-500', bg: 'bg-primary-500/10', trend: 'Estable' },
    { label: 'Planificaciones', value: stats.planificaciones, icon: Calendar, color: 'text-violet-500', bg: 'bg-violet-500/10', trend: '+5' },
  ]

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-[1px] w-12 bg-primary-600" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Panel General</span>
          </div>
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">
            Hola, <span className="text-gray-500">Docente</span>.
          </h2>
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Resumen ejecutivo de tu ecosistema académico</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/app/planificador')}
            className="group px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-900/20 flex items-center gap-3"
          >
            Nueva Planificación <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          [...Array(3)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          cards.map((card, i) => (
            <div key={i} className="group relative">
               <div className="absolute -inset-0.5 bg-gradient-to-br from-white/10 to-transparent rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
               <div className="relative card bg-[#080808] border-white/5 p-8 overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-4 rounded-2xl ${card.bg} border border-white/5`}>
                    <card.icon className={`w-8 h-8 ${card.color}`} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] rounded-full border border-white/5">
                    <TrendingUp size={12} className="text-primary-500" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{card.trend}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-1">{card.label}</p>
                  <p className="text-5xl font-black italic tracking-tighter text-white">{card.value}</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500">
                   <card.icon size={120} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Recent Activity List */}
        <div className="xl:col-span-12 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
              <Activity className="text-primary-500" size={18} />
              Últimos Movimientos
            </h3>
            <button 
              onClick={() => navigate('/app/planificador')}
              className="text-[9px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-400 flex items-center gap-2"
            >
              Gestionar todo <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             {loading ? (
               [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />)
             ) : (
               recentPlans.map((plan) => (
                <div key={plan.id} className="group relative bg-[#080808]/50 border border-white/5 hover:border-white/10 p-5 rounded-2xl flex items-center gap-6 transition-all hover:bg-white/[0.02]">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex flex-col items-center justify-center group-hover:border-primary-500/30 transition-colors">
                    <span className="text-[9px] font-black uppercase tracking-tighter text-gray-600">
                      {new Date(plan.fechaInicio).toLocaleString('es', { month: 'short' }).toUpperCase()}
                    </span>
                    <span className="text-2xl font-black italic tracking-tighter text-primary-500 leading-none">
                      {new Date(plan.fechaInicio).getDate()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black uppercase italic tracking-tighter text-white truncate mb-1">
                      {plan.titulo}
                    </p>
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-1">
                         <Clock size={10} /> {new Date(plan.lastModified || plan.fechaInicio).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                       </span>
                       <span className="w-1 h-1 rounded-full bg-gray-800" />
                       <span className="text-[9px] font-bold uppercase tracking-widest text-primary-600">Actualizado</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end gap-2 pr-2">
                    <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                       <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Clase</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-800 group-hover:text-primary-500 transition-colors" />
                </div>
               ))
             )}
             {!loading && recentPlans.length === 0 && (
               <div className="col-span-full py-10 border border-dashed border-white/5 rounded-2xl text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">No hay actividad reciente</p>
               </div>
             )}
          </div>
        </div>

        {/* Global Strategy / Promotion Card */}
        <div className="xl:col-span-12">
           <div className="relative group rounded-[2.5rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-900 opacity-90 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              
              <div className="relative p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-6 max-w-2xl">
                   <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Académico Premium</span>
                   </div>
                   <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-tight">
                     Optimiza tu <span className="text-primary-300 underline decoration-primary-400">estrategia didáctica</span> con reportes avanzados.
                   </h3>
                   <p className="text-sm font-bold text-primary-100 uppercase tracking-wide leading-relaxed opacity-80">
                      Utiliza el módulo de reportes para analizar el progreso de tus comisiones y ajustar tus planificaciones en tiempo real.
                   </p>
                   <button className="px-10 py-5 bg-white text-primary-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-50 transition-all shadow-2xl flex items-center gap-3">
                      Exportar Analíticas <ArrowUpRight size={18} />
                   </button>
                </div>
                
                <div className="hidden lg:block relative">
                   <div className="w-64 h-64 bg-white/10 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                   <GradIcon className="w-64 h-64 text-white/10 relative z-10 rotate-12" strokeWidth={1} />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
