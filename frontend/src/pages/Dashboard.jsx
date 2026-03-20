import { useEffect, useState } from 'react'
import { alumnoAPI, cursoAPI, planificacionAPI } from '../services/api'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2 
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ alumnos: 0, cursos: 0, planificaciones: 0 })
  const [recentPlans, setRecentPlans] = useState([])

  useEffect(() => {
    const fetchData = async () => {
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
      // Mostrar las 3 más próximas (basado en fecha)
      setRecentPlans(plans.data.slice(0, 3))
    }
    fetchData()
  }, [])

  const cards = [
    { label: 'Total Alumnos', value: stats.alumnos, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Cursos Activos', value: stats.cursos, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Planificaciones', value: stats.planificaciones, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">¡Hola de nuevo, Docente!</h2>
          <p className="text-gray-400 text-sm">Aquí tienes un resumen de tu actividad para hoy.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          Nueva Planificación <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="card hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próximas entregas / Planificaciones */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-400" />
              Próximas Planificaciones
            </h3>
            <span className="text-xs text-primary-400 hover:underline cursor-pointer font-medium">Ver todas</span>
          </div>
          <div className="space-y-4">
            {recentPlans.map((plan) => (
              <div key={plan.id} className="flex items-center gap-4 p-3 hover:bg-gray-800/50 rounded-xl transition-colors border border-transparent hover:border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex flex-col items-center justify-center border border-gray-700">
                  <span className="text-[10px] uppercase font-bold text-gray-500 line-clamp-1">
                    {new Date(plan.fechaInicio).toLocaleString('es', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-white leading-none">
                    {new Date(plan.fechaInicio).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">{plan.titulo}</p>
                  <p className="text-xs text-gray-500 truncate">{plan.contenido}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-gray-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Sección de ayuda / tips */}
        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Tip del día</h3>
                <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                    Puedes vincular tus cursos directamente con el calendario para recibir avisos automáticos de tus exámenes y planificaciones.
                </p>
                <button className="bg-white text-primary-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-50 transition-colors shadow-lg">
                    Aprender más
                </button>
            </div>
            <GraduationCap className="absolute -bottom-6 -right-6 w-48 h-48 text-white/10" />
        </div>
      </div>
    </div>
  )
}

function GraduationCap(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )
}
