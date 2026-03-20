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
  Lightbulb,
  Tag,
  Layers,
  SortDesc,
  Filter,
  Eye,
  MessageSquare,
  AlertTriangle
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
  const [recursoFilter, setRecursoFilter] = useState({ materia: 'todas', nivel: 'todos', tipo: 'todos' })
  const [recursoSort, setRecursoSort] = useState('recientes')

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
          <div className="space-y-8 animate-in fade-in duration-500">
             {/* IA Suggestions for Resources */}
             <div className="bg-primary-500/5 border border-primary-500/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-primary-500/10 group-hover:scale-110 transition-transform duration-700">
                   <Sparkles size={120} />
                </div>
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-900/40 shrink-0">
                   <BrainCircuit size={32} />
                </div>
                <div className="space-y-1 flex-1">
                   <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-2">Recomendación IA</h3>
                   <p className="text-xs text-gray-400 max-w-2xl">Hemos analizado tu última planificación de <span className="text-primary-400 font-bold">"Funciones Lineales"</span>. Este recurso de nuestra biblioteca global tiene un 95% de coincidencia con tus objetivos actuales:</p>
                </div>
                <div className="flex gap-3 shrink-0">
                   <button className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all">Ver Recurso</button>
                   <button className="px-5 py-2.5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/20">Agregar al Plan</button>
                </div>
             </div>

             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#080808] border border-white/5 p-4 rounded-2xl">
                <div className="flex flex-wrap gap-4">
                   <div className="space-y-2">
                      <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest ml-1">Materia</p>
                      <select 
                        value={recursoFilter.materia}
                        onChange={(e) => setRecursoFilter({...recursoFilter, materia: e.target.value})}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary-500 transition-all min-w-[150px]"
                      >
                         <option value="todas">Todas las materias</option>
                         <option value="Matemática">Matemática</option>
                         <option value="Ciencias Naturales">Ciencias Naturales</option>
                         <option value="Ciencias Sociales">Ciencias Sociales</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest ml-1">Tipo</p>
                      <select 
                        value={recursoFilter.tipo}
                        onChange={(e) => setRecursoFilter({...recursoFilter, tipo: e.target.value})}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-primary-500 transition-all"
                      >
                         <option value="todos">Todos</option>
                         <option value="image">Imágenes</option>
                         <option value="video">Videos</option>
                         <option value="pdf">PDFs</option>
                      </select>
                   </div>
                </div>

                <div className="flex items-center gap-3 self-end">
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ordenar por:</p>
                   <button 
                     onClick={() => setRecursoSort(recursoSort === 'populares' ? 'recientes' : 'populares')}
                     className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-gray-400 hover:text-white"
                   >
                      <SortDesc size={18} className={recursoSort === 'populares' ? 'text-primary-500' : ''} />
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div 
                  onClick={handleUploadRecurso}
                  className="group border-2 border-dashed border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 hover:border-primary-500/30 hover:bg-primary-500/[0.02] transition-all cursor-pointer min-h-[300px]"
                >
                   <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus size={28} className="text-gray-700 group-hover:text-primary-500" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Nuevo Material</p>
                </div>

                {curso.recursos?.filter(r => {
                  if (recursoFilter.materia !== 'todas' && r.materia !== recursoFilter.materia) return false;
                  if (recursoFilter.tipo !== 'todos' && r.tipo !== recursoFilter.tipo) return false;
                  return true;
                }).sort((a, b) => {
                   if (recursoSort === 'populares') return b.usageCount - a.usageCount;
                   return (a.recent ? -1 : 1);
                }).map(recurso => (
                  <div key={recurso.id} className="group bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden hover:border-primary-500/30 transition-all shadow-2xl hover:shadow-primary-900/10 flex flex-col">
                    <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                       {recurso.tipo === 'video' ? (
                          <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer relative z-10">
                             <Play size={24} fill="currentColor" />
                          </div>
                       ) : (
                          <img src={recurso.url} alt={recurso.titulo} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                       )}
                       <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-tighter text-primary-400">{recurso.materia}</span>
                          <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-tighter text-gray-400">{recurso.tipo}</span>
                       </div>
                    </div>
                    
                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                       <div className="space-y-1">
                          <h4 className="text-sm font-black uppercase text-white truncate">{recurso.titulo}</h4>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Nivel: {recurso.nivel}</p>
                       </div>
                       
                       <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-700 flex items-center gap-2">
                             <Layers size={10} /> Usado en:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                             {recurso.usedIn?.map((plan, i) => (
                               <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[8px] text-gray-500 border border-white/5">{plan}</span>
                             ))}
                          </div>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                          <div className="flex gap-2">
                             <button onClick={() => handleUseResource(recurso.titulo)} title="Usar en Plan" className="p-2 bg-white/5 hover:bg-primary-500/20 text-gray-600 hover:text-primary-500 rounded-xl transition-all"><Copy size={14} /></button>
                             <button title="Editar" className="p-2 bg-white/5 hover:bg-white/10 text-gray-600 hover:text-white rounded-xl transition-all"><FileText size={14} /></button>
                             <button title="Eliminar" className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-600 hover:text-red-500 rounded-xl transition-all"><Trash2 size={14} /></button>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-700 flex items-center gap-1.5">
                             <Eye size={12} /> {recurso.usageCount} usos
                          </span>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'progreso' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             {!showReport && reportLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-[400px] bg-[#080808] border border-white/5 rounded-3xl">
                   <div className="relative">
                      <div className="w-24 h-24 border-4 border-primary-500/10 rounded-full" />
                      <div className="absolute inset-0 border-t-4 border-primary-500 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-primary-500">
                         {(() => {
                            const Icon = steps[reportStep].icon;
                            return <Icon size={32} className="animate-pulse" />;
                         })()}
                      </div>
                   </div>
                   <div className="space-y-6 w-full max-w-[300px]">
                      <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Procesando Inteligencia Académica...</p>
                      <div className="space-y-3">
                         {steps.map((s, i) => (
                            <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${i > reportStep ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                               <div className={`w-6 h-6 rounded-xl flex items-center justify-center border-2 ${
                                 i < reportStep ? 'bg-green-500 border-green-500 text-white' : i === reportStep ? 'border-primary-500 text-primary-500' : 'border-white/10 text-gray-800'
                               }`}>
                                  {i < reportStep ? <Check size={14} /> : <span className="text-[10px] font-black">{i + 1}</span>}
                               </div>
                               <span className={`text-xs font-bold ${i === reportStep ? 'text-white' : 'text-gray-500'}`}>{s.title}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             ) : showReport ? (
                <div className="space-y-8">
                   {/* ── HEADER DE INSIGHTS ── */}
                   <div className="flex items-center gap-4 mb-2">
                       <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-900/20">
                          <Sparkles size={24} />
                       </div>
                       <div>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Insights Automáticos</h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Análisis predictivo basado en el desempeño real del grupo</p>
                       </div>
                   </div>

                   {/* ── GRID DE INSIGHTS ── */}
                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                      
                      {/* CARD 1: ACCIÓN RECOMENDADA (DESTACADA) */}
                      <div className="xl:col-span-1 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-primary-900/40 group">
                         <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
                            <Bot size={200} />
                         </div>
                         <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-start">
                               <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                  <Lightbulb size={24} className="text-white" />
                               </div>
                               <span className="px-3 py-1 bg-black/20 backdrop-blur-md text-[8px] font-black uppercase tracking-widest rounded-full border border-white/10">Bajo rendimiento detectado</span>
                            </div>
                            <div className="space-y-3">
                               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Acción Recomendada</h4>
                               <h3 className="text-xl font-black italic leading-tight">¿Quieres crear una planificación de refuerzo para Geometría?</h3>
                            </div>
                         </div>
                         <div className="space-y-3 relative z-10 mt-10">
                            <button 
                               onClick={() => navigate(`/planificador?cursoId=${id}&suggested=refuerzo-geometria`)}
                               className="w-full py-4 bg-white text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all shadow-xl active:scale-95"
                            >
                               Crear Planificación
                            </button>
                            <button 
                               onClick={() => setToast({ message: 'Buscando recursos de Geometría en la biblioteca...', type: 'info' })}
                               className="w-full py-4 bg-black/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black/20 transition-all border border-white/20 backdrop-blur-sm"
                            >
                               Ver sugerencias de material
                            </button>
                         </div>
                      </div>

                      {/* CARD 2: RENDIMIENTO ACADÉMICO */}
                      <div className="bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-6 hover:border-primary-500/20 transition-all">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                               <div className="p-3 bg-white/5 rounded-2xl text-primary-500"><BarChart3 size={20} /></div>
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Rendimiento Académico</h4>
                            </div>
                            <div className="flex items-center gap-1 text-green-500">
                               <TrendingUp size={14} />
                               <span className="text-[10px] font-black">+12% vs mes ant.</span>
                            </div>
                         </div>
                         
                         <div className="flex-1 flex flex-col justify-between gap-4 mt-2">
                            {[
                               { label: 'MAT', val: 85, color: 'bg-primary-500' },
                               { label: 'LEN', val: 78, color: 'bg-primary-400' },
                               { label: 'GEO', val: 52, color: 'bg-orange-500', alert: true },
                               { label: 'CIE', val: 91, color: 'bg-green-500' },
                               { label: 'HIS', val: 73, color: 'bg-primary-300' }
                            ].map(item => (
                               <div key={item.label} className="space-y-1.5">
                                  <div className="flex justify-between items-end">
                                     <span className="text-[9px] font-black text-gray-600">{item.label}</span>
                                     <span className={`text-[10px] font-black ${item.alert ? 'text-orange-500' : 'text-gray-400'}`}>{item.val}%</span>
                                  </div>
                                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                     <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${item.color} ${item.alert ? 'shadow-[0_0_10px_rgba(249,115,22,0.3)]' : ''}`}
                                        style={{ width: `${item.val}%` }} 
                                     />
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      {/* CARD 3: ASISTENCIA PROMEDIO */}
                      <div className="bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between hover:border-primary-500/20 transition-all">
                         <div className="space-y-8">
                            <div className="flex justify-between items-center">
                               <div className="flex items-center gap-3">
                                  <div className="p-3 bg-white/5 rounded-2xl text-primary-500"><Users size={20} /></div>
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Asistencia Promedio</h4>
                               </div>
                            </div>
                            
                            <div className="space-y-1">
                               <div className="flex items-baseline gap-2">
                                  <h2 className="text-6xl font-black italic tracking-tighter text-white">94.5%</h2>
                                  <div className="flex items-center gap-1 text-green-500 text-[10px] font-black">
                                     <TrendingUp size={12} />
                                     +3.2%
                                  </div>
                               </div>
                               <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Promedio general del curso</span>
                            </div>
                         </div>

                         <div className="mt-8 space-y-4">
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                               <div className="h-full bg-gradient-to-r from-primary-600 to-green-500 rounded-full w-[94.5%]" />
                            </div>
                            <div className="flex justify-between text-[8px] font-black uppercase text-gray-500">
                               <span>Objetivo: 90%</span>
                               <span className="text-green-500">¡Superado!</span>
                            </div>
                         </div>
                      </div>

                      {/* CARD 4: TEMAS CON MAYOR DIFICULTAD */}
                      <div className="bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-6 hover:border-red-500/10 transition-all">
                         <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500"><AlertTriangle size={20} /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Temas con Mayor Dificultad</h4>
                         </div>

                         <div className="space-y-4">
                            {[
                               { t: 'Geometría del espacio', p: 42, color: 'bg-red-500' },
                               { t: 'Ecuaciones trigonométricas', p: 58, color: 'bg-orange-500' },
                               { t: 'Comprensión lectora', p: 63, color: 'bg-amber-500' }
                            ].map((item, i) => (
                               <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 group/item">
                                  <div className="flex justify-between items-center">
                                     <p className="text-[11px] font-black text-white italic truncate pr-2">{item.t}</p>
                                     <span className="text-[10px] font-black text-gray-500">{item.p}%</span>
                                  </div>
                                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                     <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.p}%` }} />
                                  </div>
                                  <button 
                                     onClick={() => setToast({ message: `Abriendo ejercicios de ${item.t}...`, type: 'info' })}
                                     className="w-full py-2 bg-white/5 hover:bg-white/10 text-[8px] font-black uppercase tracking-widest text-gray-500 hover:text-white rounded-lg transition-all opacity-0 group-hover/item:opacity-100"
                                  >
                                     Ver ejercicios
                                  </button>
                               </div>
                            ))}
                         </div>
                      </div>

                   </div>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center p-20 bg-[#080808] border border-white/5 rounded-3xl text-center space-y-6">
                   <div className="w-20 h-20 bg-primary-600/10 rounded-full flex items-center justify-center text-primary-500">
                      <BarChart3 size={40} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase italic text-white">Reporte Semanal de Inteligencia Académica</h3>
                      <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">Analizaremos el progreso del grupo, asistencia y áreas de mejora basadas en el último período de actividades.</p>
                   </div>
                   <button 
                     onClick={generateReport}
                     className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-primary-900/30 flex items-center gap-3"
                   >
                     🚀 Generar Reporte de Análisis
                   </button>
                </div>
             )}
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
