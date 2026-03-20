import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { cursoAPI, planificacionAPI, alumnoAPI } from '../services/api'
import PlanningTimeline from '../components/Aula/PlanningTimeline'
import Asistencia from '../components/Aula/Asistencia'
import { 
  ChevronLeft, 
  Calendar, 
  Users, 
  FolderOpen, 
  BarChart3, 
  Plus, 
  Copy, 
  MoreVertical,
  Trash2,
  ExternalLink,
  Play,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react'
import { CardSkeleton, TableSkeleton } from '../components/Common/LoadingSkeleton'
import { Toast } from '../components/Common/Toast'

export default function AulaWorkspace() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [curso, setCurso] = useState(null)
  const [planes, setPlanes] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('planes')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchWorkspaceData()
  }, [id])

  const fetchWorkspaceData = async () => {
    setLoading(true)
    try {
      const [resCurso, resPlanes, resAlumnos] = await Promise.all([
        cursoAPI.getById(id),
        planificacionAPI.getByCursoId(id),
        alumnoAPI.getAll()
      ])
      setCurso(resCurso.data)
      setPlanes(resPlanes.data)
      
      const cursoAlumnos = resAlumnos.data.filter(a => resCurso.data.alumnos?.includes(a.id))
      setAlumnos(cursoAlumnos)
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async (planId) => {
    try {
        await planificacionAPI.duplicate(planId)
        setToast({ message: 'Planificación duplicada correctamente', type: 'success' })
        fetchWorkspaceData()
    } catch (err) {
        setToast({ message: 'Error al duplicar', type: 'error' })
    }
  }

  const getStatusColor = (estado) => {
    switch (estado) {
        case 'Finalizada': return 'text-green-500 bg-green-500/10 border-green-500/20'
        case 'Activa': return 'text-primary-500 bg-primary-500/10 border-primary-500/20'
        default: return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    }
  }

  if (loading) return <div className="p-10"><CardSkeleton /></div>
  if (!curso) return <div className="text-white">Aula no encontrada</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/mi-aula')}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-gray-400 hover:text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-500">{curso.nivel}</span>
               <div className="w-1 h-1 rounded-full bg-gray-800" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">ID: {curso.id}</span>
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
              {curso.nombre}
            </h2>
          </div>
        </div>

        <div className="flex gap-3">
           <button 
             onClick={() => navigate(`/planificador?cursoId=${id}`)}
             className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-900/20 flex items-center gap-2"
           >
             <Plus size={16} /> Nueva Planificación
           </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="border-b border-white/5 flex gap-8">
        {[
          { id: 'planes', label: 'Planificaciones', icon: Calendar },
          { id: 'alumnos', label: 'Alumnos', icon: Users },
          { id: 'asistencia', label: 'Asistencia', icon: UserCheck },
          { id: 'recursos', label: 'Banco de Recursos', icon: FolderOpen },
          { id: 'progreso', label: 'Análisis de Progreso', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-primary-500' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-8">
        {activeTab === 'planes' && (
          <div className="space-y-12">
             <PlanningTimeline planes={planes} />
             
             <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Listado de Planificaciones</h3>
                   <div className="h-[1px] flex-1 bg-white/5 mx-6" />
                </div>
             {planes.length === 0 ? (
               <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-700">No hay planificaciones en esta aula</p>
               </div>
             ) : (
               planes.map(plan => (
                 <div key={plan.id} className="group flex items-center gap-6 bg-[#080808] border border-white/5 hover:border-white/10 p-6 rounded-[1.5rem] transition-all">
                    <div className="w-12 h-12 bg-black border border-white/5 rounded-xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                      {plan.estado === 'Finalizada' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                         <h4 className="text-base font-black uppercase italic tracking-tighter text-white truncate">
                           {plan.titulo}
                         </h4>
                         <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(plan.estado)}`}>
                           {plan.estado}
                         </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                         <span>{new Date(plan.fechaInicio).toLocaleDateString('es')} — {new Date(plan.fechaFin).toLocaleDateString('es')}</span>
                         <div className="w-1 h-1 rounded-full bg-gray-800" />
                         <span>Ult. Modif: {new Date(plan.lastModified).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => handleDuplicate(plan.id)}
                         className="p-3 bg-white/[0.03] hover:bg-white/10 text-gray-500 hover:text-primary-500 rounded-xl transition-all border border-white/5"
                         title="Duplicar"
                       >
                         <Copy size={16} />
                       </button>
                       <button 
                         onClick={() => navigate(`/planificador?edit=${plan.id}`)}
                         className="p-3 bg-white/[0.03] hover:bg-white/10 text-gray-500 hover:text-white rounded-xl transition-all border border-white/5"
                         title="Editar"
                       >
                         <MoreVertical size={16} />
                       </button>
                    </div>
                 </div>
               ))
             )}
            </div>
          </div>
        )}

        {activeTab === 'alumnos' && (
          <div className="card overflow-hidden bg-black/40 border-white/5">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-600 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
                      <th className="px-6 py-4">Estudiante</th>
                      <th className="px-6 py-4">DNI</th>
                      <th className="px-6 py-4">Estado Académico</th>
                      <th className="px-6 py-4 text-right">Ficha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {alumnos.map(a => (
                      <tr key={a.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-900 border border-white/5 flex items-center justify-center text-primary-500">
                            <Users size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase italic text-gray-200 tracking-tight">{a.nombre} {a.apellido}</p>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{a.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400 font-black tracking-widest">{a.dni}</td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest rounded border border-green-500/20">Regular</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 hover:bg-primary-900/20 text-gray-500 hover:text-primary-400 rounded-lg transition-colors">
                             <ExternalLink size={16} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {activeTab === 'asistencia' && (
          <Asistencia cursoId={id} alumnos={alumnos} />
        )}

        {activeTab === 'recursos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="group border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-primary-500/30 hover:bg-primary-500/[0.02] transition-all cursor-pointer min-h-[200px]">
                <Plus size={24} className="text-gray-700 group-hover:text-primary-500 transition-colors" />
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">Nuevo Recurso</p>
             </div>

             {curso.recursos?.map(recurso => (
               <div key={recurso.id} className="group bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all shadow-xl">
                 <div className="aspect-video bg-black flex items-center justify-center relative">
                    {recurso.tipo === 'video' ? (
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer">
                         <Play size={20} fill="currentColor" />
                      </div>
                    ) : (
                      <img src={recurso.url} alt={recurso.titulo} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                       {recurso.tipo === 'video' ? <Play size={10} className="text-red-500" /> : <ImageIcon size={10} className="text-blue-500" />}
                    </div>
                 </div>
                 <div className="p-4 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white truncate">{recurso.titulo}</p>
                    <button className="text-gray-700 hover:text-primary-500 transition-colors">
                       <Copy size={16} title="Usar en Plan" />
                    </button>
                 </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'progreso' && (
          <div className="container mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card bg-[#080808] border-white/5 p-8 space-y-6">
                   <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600">Efectividad de Clases</h4>
                   <div className="relative h-64 flex items-end justify-center gap-4">
                      <div className="w-12 bg-primary-600/20 rounded-t-lg border-t-2 border-primary-500 h-[60%]" />
                      <div className="w-12 bg-primary-600/40 rounded-t-lg border-t-2 border-primary-500 h-[80%]" />
                      <div className="w-12 bg-primary-600 rounded-t-lg border-t-2 border-primary-500 h-[40%]" />
                      <div className="w-12 bg-violet-600 rounded-t-lg border-t-2 border-violet-500 h-[95%]" />
                   </div>
                   <p className="text-[10px] font-bold text-gray-500 text-center uppercase tracking-widest italic">Análisis basado en checklist de cumplimiento</p>
                </div>
                
                <div className="space-y-6">
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] flex items-center gap-6">
                      <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20">
                         <AlertCircle size={24} />
                      </div>
                      <div>
                         <p className="text-sm font-black uppercase italic text-white leading-tight">Sugerencia de la IA</p>
                         <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                           El grupo muestra déficit en la tabla del 4. Considera reforzar con recursos visuales.
                         </p>
                      </div>
                   </div>
                   
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] flex items-center gap-6 opacity-50 grayscale">
                      <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-500 border border-violet-500/20">
                         <FileText size={24} />
                      </div>
                      <div>
                         <p className="text-sm font-black uppercase italic text-white leading-tight">Reporte Semanal</p>
                         <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1"> Generando resumen de actividades para directivos... </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
