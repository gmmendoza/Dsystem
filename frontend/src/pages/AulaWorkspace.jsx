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
  UserCheck,
  Bot,
  Sparkles,
  Check,
  TrendingDown,
  TrendingUp,
  BrainCircuit,
  Lightbulb
} from 'lucide-react'
import { CardSkeleton, TableSkeleton } from '../components/Common/LoadingSkeleton'
import { Toast } from '../components/Common/Toast'
import { ConfirmModal } from '../components/Common/ConfirmModal'

export default function AulaWorkspace() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [curso, setCurso] = useState(null)
  const [planes, setPlanes] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('planes')
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null, title: '', message: '' })
  
  // IA and Reports State
  const [reportLoading, setReportLoading] = useState(false)
  const [reportStep, setReportStep] = useState(0)
  const [showReport, setShowReport] = useState(false)
  const [showAISuggestion, setShowAISuggestion] = useState(true)
  const [recursoFilter, setRecursoFilter] = useState('todos')

  const steps = [
    { title: "Analizando actividades recientes", icon: Sparkles },
    { title: "Revisando asistencia del grupo", icon: Users },
    { title: "Generando conclusiones inteligentes", icon: BrainCircuit }
  ]

  useEffect(() => {
    fetchWorkspaceData()
  }, [id])

  useEffect(() => {
    if (activeTab === 'progreso' && !showReport && !reportLoading) {
      generateReport()
    }
  }, [activeTab])

  const generateReport = async () => {
    setReportLoading(true)
    for (let i = 0; i < steps.length; i++) {
        setReportStep(i)
        await new Promise(r => setTimeout(r, 1500))
    }
    setReportLoading(false)
    setShowReport(true)
  }

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

  const handleDeletePlan = (planId) => {
    setConfirm({
      open: true,
      title: '¿Eliminar Planificación?',
      message: 'Esta acción no se puede deshacer. Se borrarán todos los datos asociados.',
      onConfirm: async () => {
        try {
          await planificacionAPI.delete(planId)
          setToast({ message: 'Planificación eliminada con éxito', type: 'success' })
          fetchWorkspaceData()
        } catch (err) {
          setToast({ message: 'Error al eliminar', type: 'error' })
        }
        setConfirm({ ...confirm, open: false })
      }
    })
  }

  const handleUploadRecurso = async () => {
    setToast({ message: 'Subiendo recurso al banco...', type: 'info' })
    const mockRecurso = {
        titulo: 'Nuevo material pedagógico',
        tipo: 'image',
        url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800'
    }
    try {
        await cursoAPI.addRecurso(id, mockRecurso)
        setToast({ message: '¡Recurso agregado correctamente!', type: 'success' })
        fetchWorkspaceData()
    } catch (err) {
        setToast({ message: 'Error al subir recurso', type: 'error' })
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

  const handleVerRecursos = () => {
    setActiveTab('recursos')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddSuggestedActivity = () => {
    setToast({ message: 'Actividad sugerida añadida a tu planificación actual', type: 'success' })
    setShowAISuggestion(false)
  }

  const handleIgnoreSuggestion = () => {
    setShowAISuggestion(false)
    setToast({ message: 'Sugerencia descartada', type: 'info' })
  }

  const handleDetailedReport = () => {
    setToast({ message: 'Generando PDF del reporte detallado...', type: 'info' })
    setTimeout(() => {
        setToast({ message: 'Reporte descargado con éxito', type: 'success' })
    }, 2000)
  }

  const handleUseResource = (titulo) => {
    setToast({ message: `"${titulo}" vinculado a la planificación seleccionada`, type: 'success' })
  }

  if (loading) return <div className="p-10"><CardSkeleton /></div>
  if (!curso) return <div className="text-white">Aula no encontrada</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 md:px-0">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => navigate('/mi-aula')}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-gray-400 hover:text-white transition-all flex-shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
               <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-primary-500">Nivel {curso.nivel}</span>
               <div className="w-1 h-1 rounded-full bg-gray-800" />
               <span className="hidden sm:inline text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">ID: {curso.id}</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-white truncate">
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
      <div className="border-b border-white/5 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-[1px]">
        {[
          { id: 'planes', label: 'Planes', icon: Calendar },
          { id: 'alumnos', label: 'Alumnos', icon: Users },
          { id: 'asistencia', label: 'Asistencia', icon: UserCheck },
          { id: 'recursos', label: 'Recursos', icon: FolderOpen },
          { id: 'progreso', label: 'Análisis', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-primary-500' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            <tab.icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
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
               <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-6 bg-white/[0.01]">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-700">
                    <FileText size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-black uppercase italic text-gray-400">¿Empezamos con la primera?</p>
                    <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Organizá tu aula creando tu primer plan docente.</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/planificador?cursoId=${id}`)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-white rounded-xl border border-white/5 transition-all"
                  >
                    + Crear Planificación
                  </button>
               </div>
             ) : (
                planes.map(plan => (
                  <div key={plan.id} className="group flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 bg-[#080808] border border-white/5 hover:border-white/10 p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] transition-all relative">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-black border border-white/5 rounded-xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                       {plan.estado === 'Finalizada' ? <CheckCircle2 size={20} className="md:w-6 md:h-6" /> : <Clock size={20} className="md:w-6 md:h-6" />}
                     </div>
                     
                     <div className="flex-1 min-w-0">
                       <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                          <h4 className="text-sm md:text-base font-black uppercase italic tracking-tighter text-white truncate">
                            {plan.titulo}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest border ${getStatusColor(plan.estado)}`}>
                            {plan.estado}
                          </span>
                       </div>
                       <div className="flex flex-wrap items-center gap-y-1 gap-x-3 md:gap-x-4 text-[8px] md:text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Calendar size={10} className="md:w-3 md:h-3" /> {new Date(plan.fechaInicio).toLocaleDateString('es')}</span>
                          <div className="hidden md:block w-1 h-1 rounded-full bg-gray-800" />
                          <span className="flex items-center gap-1"><Clock size={10} className="md:w-3 md:h-3" /> {new Date(plan.lastModified).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center mt-2 sm:mt-0">
                       <button 
                         onClick={() => handleDuplicate(plan.id)}
                         className="p-2 md:p-3 bg-white/[0.03] hover:bg-white/10 text-gray-500 hover:text-primary-500 rounded-xl transition-all border border-white/5"
                         title="Duplicar"
                       >
                         <Copy size={14} className="md:w-4 md:h-4" />
                       </button>
                       <button 
                         onClick={() => navigate(`/planificador?edit=${plan.id}`)}
                         className="p-2 md:p-3 bg-white/[0.03] hover:bg-white/10 text-gray-500 hover:text-white rounded-xl transition-all border border-white/5"
                         title="Editar"
                       >
                         <MoreVertical size={14} className="md:w-4 md:h-4" />
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
          <div className="space-y-8">
             <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                   {['todos', 'image', 'video'].map(f => (
                     <button
                       key={f}
                       onClick={() => setRecursoFilter(f)}
                       className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                         recursoFilter === f ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-gray-500 hover:text-gray-300'
                       }`}
                     >
                       {f === 'todos' ? 'Todos' : f === 'image' ? 'Imágenes' : 'Videos'}
                     </button>
                   ))}
                </div>
                <div className="h-[1px] flex-1 bg-white/5" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div 
                  onClick={handleUploadRecurso}
                  className="group border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-primary-500/30 hover:bg-primary-500/[0.02] transition-all cursor-pointer min-h-[200px]"
                >
                   <Plus size={24} className="text-gray-700 group-hover:text-primary-500 transition-colors" />
                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">Nuevo Recurso</p>
                </div>

                {curso.recursos?.filter(r => recursoFilter === 'todos' || r.tipo === recursoFilter).map(recurso => (
                  <div key={recurso.id} className="group bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all shadow-xl hover:shadow-primary-900/10">
                    <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                       {recurso.tipo === 'video' ? (
                          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer">
                             <Play size={20} fill="currentColor" />
                          </div>
                       ) : (
                          <img src={recurso.url} alt={recurso.titulo} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                       )}
                       <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                          {recurso.tipo === 'video' ? <Play size={10} className="text-red-500" /> : <ImageIcon size={10} className="text-blue-500" />}
                       </div>
                    </div>
                    <div className="p-4 flex justify-between items-center bg-gradient-to-b from-transparent to-black/50">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white truncate">{recurso.titulo}</p>
                       <button 
                         onClick={() => handleUseResource(recurso.titulo)}
                         className="p-2 bg-white/5 hover:bg-primary-500/20 text-gray-500 hover:text-primary-500 rounded-lg transition-all border border-white/5"
                       >
                          <Copy size={16} title="Usar en Plan" />
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'progreso' && (
          <div className="container mx-auto space-y-12">
             {/* Charts Section */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card bg-[#080808] border-white/5 p-8 space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <h4 className="text-sm font-black uppercase italic text-white">Efectividad de Clases</h4>
                         <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Cumplimiento de objetivos por unidad</p>
                      </div>
                      <div className="flex gap-2">
                         <div className="flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                            <TrendingUp size={10} className="text-primary-500" />
                            <span className="text-[8px] font-black uppercase text-primary-500 tracking-widest">+12%</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="relative h-64 flex items-end justify-between px-4 sm:px-10 gap-2 sm:gap-6">
                      {[65, 85, 45, 92, 78].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                           <div className="relative w-full">
                              <div 
                                className={`w-full bg-gradient-to-t rounded-t-2xl transition-all duration-1000 group-hover:brightness-125 cursor-pointer relative ${
                                  i === 3 ? 'from-violet-600/20 to-violet-500' : 'from-primary-600/20 to-primary-500'
                                }`}
                                style={{ height: showReport ? `${h}%` : '0px' }}
                              >
                                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                   {h}%
                                 </span>
                              </div>
                           </div>
                           <span className="text-[8px] font-bold text-gray-700 uppercase tracking-tighter">Sem 0{i+1}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Metrics Summary */}
                <div className="space-y-4">
                  {[
                    { label: 'Participación', value: '88%', trend: '+5%', color: 'text-green-500' },
                    { label: 'Asistencia', value: '94%', trend: 'Estable', color: 'text-blue-500' },
                    { label: 'Tareas', value: '72%', trend: '-2%', color: 'text-orange-500' }
                  ].map((m, i) => (
                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-2">
                       <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{m.label}</span>
                       <div className="flex items-end justify-between">
                          <span className="text-2xl font-black italic text-white tracking-tighter">{m.value}</span>
                          <span className={`text-[8px] font-black uppercase tracking-widest ${m.color}`}>{m.trend}</span>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
             
             {/* AI and Report Section */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AI Suggestions Card */}
                   {showAISuggestion && (
                   <div className="card bg-[#080808] border-white/5 p-8 flex flex-col gap-8 hover:border-primary-500/20 transition-all group relative overflow-hidden animate-in fade-in slide-in-from-left duration-700">
                      <div className="absolute top-0 right-0 p-8 text-primary-500/10 -rotate-12 group-hover:scale-110 transition-transform">
                         <Bot size={120} />
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-900/30">
                           <Bot size={24} />
                         </div>
                         <div className="space-y-1">
                           <h4 className="text-sm font-black uppercase italic text-white">Sugerencia de la IA</h4>
                           <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">Basado en las últimas actividades y resultados...</p>
                         </div>
                      </div>

                      <div className="space-y-4 relative z-10">
                         <p className="text-sm font-bold text-gray-300 leading-relaxed">
                           Detectamos que algunos estudiantes están teniendo dificultades con la <span className="text-primary-400">tabla del 4</span>. 
                         </p>
                         
                         <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                               <Lightbulb size={12} className="text-yellow-500" /> Te recomendamos:
                            </p>
                            <ul className="space-y-2">
                               {['Usar tarjetas visuales digitales', 'Incorporar juegos de repetición rítmica', 'Trabajar en grupos pequeños dirigidos'].map((rec, i) => (
                                 <li key={i} className="flex items-center gap-3 text-xs text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                                    {rec}
                                 </li>
                               ))}
                            </ul>
                         </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-auto">
                         <button 
                           onClick={handleVerRecursos}
                           className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                         >
                           Ver Recursos
                         </button>
                         <button 
                           onClick={handleAddSuggestedActivity}
                           className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border border-white/5"
                         >
                           Añadir Actividad
                         </button>
                         <button 
                           onClick={handleIgnoreSuggestion}
                           className="px-4 py-2 text-gray-600 hover:text-red-400 text-[9px] font-black uppercase tracking-widest transition-all"
                         >
                           Ignorar
                         </button>
                      </div>
                   </div>
                   )}

                {/* Weekly Report Card */}
                <div className="card bg-[#080808] border-white/5 p-8 flex flex-col gap-8 relative overflow-hidden">
                   {!showReport ? (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-[300px]">
                         <div className="relative">
                            <div className="w-20 h-20 border-2 border-primary-500/20 rounded-full" />
                            <div className="absolute inset-0 border-t-2 border-primary-500 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center text-primary-500">
                               {steps[reportStep]?.icon && (() => {
                                  const StepIcon = steps[reportStep].icon;
                                  return <StepIcon size={28} className="animate-pulse" />;
                               })()}
                            </div>
                         </div>
                         <div className="space-y-4 w-full max-w-[250px]">
                            {steps.map((s, i) => (
                              <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${i > reportStep ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                                 <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                                   i < reportStep ? 'bg-green-500 border-green-500 text-white' : 'border-white/10 text-gray-700'
                                 }`}>
                                    {i < reportStep ? <Check size={12} /> : i === reportStep ? <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-ping" /> : null}
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.title}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                   ) : (
                      <div className="flex flex-col h-full gap-8 animate-in fade-in zoom-in-95 duration-700">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-900/30">
                              <BarChart3 size={24} />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-black uppercase italic text-white">Reporte Semanal</h4>
                              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Semana del {new Date().toLocaleDateString('es', { day: '2-digit', month: 'short' })}</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-3 gap-4">
                            {[
                               { val: planes.length, label: 'Planes' },
                               { val: Math.round(planes.length * 0.8), label: 'Clases' },
                               { val: 1, label: 'Eval' }
                            ].map((st, i) => (
                               <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-center">
                                  <p className="text-xl font-black italic text-white">{st.val}</p>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">{st.label}</p>
                               </div>
                            ))}
                         </div>

                         <div className="space-y-4">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Observaciones Clave</h5>
                            <div className="space-y-3">
                               {[
                                 { text: 'Buen nivel de participación grupal en Matemática.', color: 'text-green-400' },
                                 { text: 'Dificultades persistentes en la tabla del 4.', color: 'text-orange-400' }
                               ].map((obs, i) => (
                                 <div key={i} className="flex gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${obs.color.replace('text', 'bg')}`} />
                                    <p className={`text-xs font-bold ${obs.color}`}>{obs.text}</p>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="flex gap-3 mt-auto">
                            <button 
                              onClick={handleDetailedReport}
                              className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-violet-900/20"
                            >
                              Ver Reporte Detallado
                            </button>
                            <button 
                              onClick={handleDetailedReport}
                              className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all"
                            >
                               <FileText size={16} />
                            </button>
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={confirm.open} 
        {...confirm} 
        onCancel={() => setConfirm({ ...confirm, open: false })} 
      />
    </div>
  )
}
