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
  ChevronRight,
  Trophy,
  Target,
  Zap,
  Star
} from 'lucide-react'
import { CardSkeleton } from '../components/Common/LoadingSkeleton'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ alumnos: 0, cursos: 0, planificaciones: 0, inicial: 0, primaria: 0 })
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
        
        const inicialCount = plans.data.filter(p => 
           p.secciones?.some(s => s.id === 'sala') || 
           (cursos.data.find(c => c.id === Number(p.cursoId))?.nivel === 'Inicial')
        ).length;

        setStats({
          alumnos: alumnos.data.length,
          cursos: cursos.data.length,
          planificaciones: plans.data.length,
          inicial: inicialCount,
          primaria: plans.data.length - inicialCount
        })

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
    { label: 'Impacto total Alumnos', value: stats.alumnos, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: 'Activos' },
    { label: 'Proyectos Inicial', value: stats.inicial, icon: Star, color: 'text-orange-400', bg: 'bg-orange-400/10', trend: 'Lúdico' },
    { label: 'Proyectos Primaria', value: stats.primaria, icon: Target, color: 'text-primary-500', bg: 'bg-primary-500/10', trend: 'Académico' },
  ]

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* SaaS Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="px-2 py-0.5 bg-primary-600/20 border border-primary-500/30 rounded-full">
                <span className="text-[8px] font-black uppercase tracking-widest text-primary-400">Platinum SaaS Tier</span>
             </div>
             <div className="h-[1px] w-8 bg-gray-800" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">Dashboard de Gestión</span>
          </div>
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">
            Panel <span className="text-gray-500 underline decoration-gray-900">Estratégico</span>.
          </h2>
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Analizando tu progreso pedagógico del ciclo 2026</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/app/planificador')}
            className="group px-10 py-5 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all shadow-2xl shadow-primary-900/30 flex items-center gap-3"
          >
            Nuevo Proyecto <Sparkles size={16} className="text-primary-300" />
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          [...Array(3)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          cards.map((card, i) => (
            <div key={i} className="group relative bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden hover:border-white/10 transition-all">
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-4 rounded-2xl ${card.bg} border border-white/5`}>
                    <card.icon className={`w-8 h-8 ${card.color}`} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] rounded-full border border-white/5">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{card.trend}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-1">{card.label}</p>
                  <p className="text-5xl font-black italic tracking-tighter text-white">{card.value}</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500">
                   <card.icon size={120} />
                </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Recent Activity SaaS Style */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 flex items-center gap-3">
              <Zap className="text-primary-500" size={18} />
               Historial de Producción
            </h3>
          </div>

          <div className="space-y-4">
             {loading ? (
               [...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />)
             ) : (
               recentPlans.map((plan) => (
                <div key={plan.id} className="group bg-[#0A0A0A] border border-white/5 hover:border-white/10 p-6 rounded-3xl flex items-center gap-6 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex flex-col items-center justify-center group-hover:border-primary-500/30 transition-colors">
                    <span className="text-[8px] font-black uppercase text-gray-700">MOD</span>
                    <span className="text-lg font-black italic tracking-tighter text-gray-400">
                      {new Date(plan.lastModified || plan.fechaInicio).getDate()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black uppercase italic tracking-tighter text-white truncate mb-1">
                      {plan.titulo}
                    </h4>
                    <div className="flex items-center gap-4">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-primary-500">Sync Correcta</span>
                       <div className="w-1 h-1 rounded-full bg-gray-800" />
                       <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">
                          Editado {new Date(plan.lastModified).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/app/planificador')}
                    className="p-3 bg-white/[0.02] hover:bg-primary-500/10 text-gray-700 hover:text-primary-500 rounded-xl transition-all border border-transparent hover:border-primary-500/20"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </div>
               ))
             )}
          </div>
        </div>

        {/* Gamification / Badges Card */}
        <div className="xl:col-span-4 space-y-6">
           <div className="card bg-gradient-to-br from-[#080808] to-black border-white/5 p-8 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Trophy size={80} />
              </div>
              <div className="space-y-2 relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-500">Logros Académicos</h4>
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Nivel: Maestro Senior</h3>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                       <span>Progreso de Ciclo</span>
                       <span>75%</span>
                    </div>
                    <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                       <div className="h-full bg-primary-600 w-3/4 rounded-full" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center space-y-2 hover:bg-white/[0.04] transition-colors">
                       <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto text-primary-500">
                          <CheckCircle2 size={18} />
                       </div>
                       <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 leading-tight">Planificador Serial</p>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center space-y-2 opacity-50 grayscale">
                       <div className="w-10 h-10 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto text-violet-500">
                          <Users size={18} />
                       </div>
                       <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 leading-tight">Mentor de Grupo</p>
                    </div>
                 </div>
              </div>

              <button className="w-full py-4 bg-white/[0.03] hover:bg-white/10 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 transition-all">
                 Ver todos los logros
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}

function Sparkles(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  )
}
