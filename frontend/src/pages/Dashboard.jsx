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
  Star,
  Plus,
  ArrowRight,
  Layers,
  LayoutDashboard
} from 'lucide-react'
import { CardSkeleton } from '../components/Common/LoadingSkeleton'

export default function Panel() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ alumnos: 0, cursos: 0, planificaciones: 0, inicial: 0, primaria: 0 })
  const [cursos, setCursos] = useState([])
  const [recentPlans, setRecentPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [alumnos, resCursos, plans] = await Promise.all([
          alumnoAPI.getAll(),
          cursoAPI.getAll(),
          planificacionAPI.getAll()
        ])
        
        setCursos(resCursos.data)
        
        const inicialCount = plans.data.filter(p => 
           p.nivel === 'Inicial' || 
           (resCursos.data.find(c => c.id === Number(p.cursoId))?.nivel === 'Inicial')
        ).length;

        setStats({
          alumnos: alumnos.data.length,
          cursos: resCursos.data.length,
          planificaciones: plans.data.length,
          inicial: inicialCount,
          primaria: plans.data.length - inicialCount
        })

        const sorted = plans.data.sort((a, b) => new Date(b.lastModified || b.fechaInicio) - new Date(a.lastModified || a.fechaInicio))
        setRecentPlans(sorted.slice(0, 3))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Impacto en Alumnos', value: stats.alumnos, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Proyectos Inicial', value: stats.inicial, icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Proyectos Primaria', value: stats.primaria, icon: Target, color: 'text-primary-500', bg: 'bg-primary-500/10' },
  ]

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      
      {/* ── HEADER PANEL ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary-900/20 rotate-3">
                <LayoutDashboard size={20} />
             </div>
             <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 block">DSystem Academic v2.5</span>
                <span className="text-[9px] font-bold text-gray-800 uppercase tracking-widest leading-none">Actualizado hoy a las {new Date().toLocaleTimeString('es', {hour: '2-digit', minute:'2-digit'})}</span>
             </div>
          </div>
          <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-tight">
             Panel del <br /> <span className="text-primary-500">Docente</span>.
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest max-w-xl">
             Bienvenido, Prof. Mendoza. Aquí tienes el resumen de tu ciclo lectivo 2026.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/planificador')}
            className="group px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-primary-900/40 flex items-center gap-3 hover:-translate-y-1"
          >
            + Nueva Planificación
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* ── SECCIÓN IZQUIERDA: RESUMEN Y AULAS ── */}
        <div className="xl:col-span-8 space-y-12">
          
          {/* STATS RAPIDAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => <CardSkeleton key={i} />)
            ) : (
              statCards.map((card, i) => (
                <div key={i} className="group relative bg-black/40 border border-white/5 p-6 rounded-3xl overflow-hidden hover:border-white/10 transition-all hover:bg-black/60">
                    <div className="flex justify-between items-start mb-8">
                      <div className={`p-4 rounded-xl ${card.bg} border border-white/5`}>
                        <card.icon className={card.color} size={24} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 mb-1">{card.label}</p>
                      <p className="text-4xl font-black italic tracking-tighter text-white">{card.value}</p>
                    </div>
                </div>
              ))
            )}
          </div>

          {/* MIS AULAS (WORKSPACE BROWSER) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 flex items-center gap-3">
                  <Layers className="text-primary-500" size={16} /> Mis Aulas Activas
               </h3>
               <button onClick={() => navigate('/mi-aula')} className="text-[9px] font-black uppercase tracking-widest text-primary-500 hover:text-white transition-all">Ver todas</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {loading ? (
                 [...Array(2)].map((_, i) => <div key={i} className="h-44 bg-white/5 rounded-3xl animate-pulse" />)
               ) : (
                 cursos.map(curso => (
                   <div 
                     key={curso.id} 
                     onClick={() => navigate(`/aula/${curso.id}`)}
                     className="group cursor-pointer bg-[#0A0A0A] border border-white/5 hover:border-primary-500/20 p-8 rounded-[2.5rem] transition-all relative overflow-hidden active:scale-95 hover:bg-primary-950/5"
                   >
                     <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 bg-white/5 text-[8px] font-black uppercase tracking-widest text-gray-500 rounded-full border border-white/5">{curso.nivel}</span>
                           <div className="h-[1px] w-4 bg-gray-800" />
                           <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">{curso.alumnos?.length || 0} Alumnos</span>
                        </div>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white group-hover:text-primary-500 transition-colors">{curso.nombre}</h4>
                        <div className="flex items-center gap-2 text-primary-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                           Entrar al Aula <ArrowRight size={14} />
                        </div>
                     </div>
                     <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700">
                        <GradIcon size={120} />
                     </div>
                   </div>
                 ))
               )}
            </div>
          </section>

          {/* HISTORIAL RECIENTE */}
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 flex items-center gap-3">
                  <Clock className="text-amber-500" size={16} /> Editado recientemente
               </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               {recentPlans.map(plan => (
                 <div 
                   key={plan.id}
                   onClick={() => navigate(`/planificador?edit=${plan.id}`)}
                   className="group bg-black/40 border border-white/5 hover:border-white/10 p-6 rounded-3xl flex items-center gap-6 transition-all cursor-pointer"
                 >
                    <div className="w-12 h-12 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-gray-700 group-hover:text-amber-500 transition-colors">
                       <BookOpen size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-black uppercase italic tracking-tighter text-white truncate">{plan.titulo}</h4>
                       <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">{plan.materia}</span>
                          <div className="w-1 h-1 rounded-full bg-gray-900" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-800">Sincronizado {new Date(plan.lastModified).toLocaleDateString()}</span>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-800 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                 </div>
               ))}
            </div>
          </section>

        </div>

        {/* ── SECCIÓN DERECHA: PROGRESO Y LOGROS ── */}
        <div className="xl:col-span-4 space-y-10">
          
          {/* TARJETA DE PROGRESO */}
          <div className="bg-gradient-to-br from-[#0A0A0A] to-black border border-white/5 p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
                <Trophy size={100} />
             </div>
             
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-500">Estado del Ciclo</p>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">Prof. Experto</h3>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-600">Planificación Anual</span>
                      <span className="text-primary-500">85%</span>
                   </div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                      <div className="h-full bg-primary-600 w-[85%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center space-y-2">
                      <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto">
                         <CheckCircle2 size={18} />
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 leading-tight">12 Clases Hoy</p>
                   </div>
                   <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center space-y-2">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto">
                         <TrendingUp size={18} />
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 leading-tight">Alta Fidelidad</p>
                   </div>
                </div>
             </div>

             <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500 transition-all">
                Ver reporte detallado
             </button>
          </div>

          {/* NOTIFICACIONES / TIPS */}
          <div className="bg-primary-600/5 border border-primary-500/10 p-8 rounded-[2rem] space-y-6">
             <div className="flex items-center gap-3">
                <Zap size={18} className="text-primary-500" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Tip Pedagógico</h4>
             </div>
             <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">
                El Nivel Inicial responde mejor a la repetición rítmica. Prueba usar la misma canción de cierre durante toda la semana.
             </p>
          </div>

        </div>

      </div>
    </div>
  )
}
