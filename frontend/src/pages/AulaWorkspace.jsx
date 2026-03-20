import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cursoAPI, planificacionAPI, alumnoAPI } from '../services/api'
import PlanningTimeline from '../components/Aula/PlanningTimeline'
import Asistencia from '../components/Aula/Asistencia'
import { AlumnoModal } from '../components/Aula/AlumnoModal'
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
  AlertTriangle,
  Zap,
  ArrowUpRight
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

  // Student CRUD State
  const [isAlumnoModalOpen, setIsAlumnoModalOpen] = useState(false)
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  
  // Resource Preview State
  const [previewResource, setPreviewResource] = useState(null)

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
        await new Promise(r => setTimeout(r, 1200))
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

  const handleDeleteAlumno = (alumnoId) => {
    setConfirm({
      open: true,
      title: '¿Eliminar Estudiante?',
      message: '¿Estás seguro de que deseas eliminar este estudiante del aula? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          await alumnoAPI.delete(alumnoId)
          setToast({ message: 'Estudiante eliminado con éxito', type: 'success' })
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


  const handleSaveAlumno = async (formData) => {
    try {
      if (selectedAlumno) {
        await alumnoAPI.update(selectedAlumno.id, formData)
        setToast({ message: 'Estudiante actualizado con éxito', type: 'success' })
      } else {
        await alumnoAPI.create(formData)
        setToast({ message: 'Estudiante registrado correctamente', type: 'success' })
      }
      setIsAlumnoModalOpen(false)
      setSelectedAlumno(null)
      fetchWorkspaceData()
    } catch (err) {
      setToast({ message: 'Error al procesar el registro', type: 'error' })
    }
  }

  const handleEditAlumno = (a) => {
    setSelectedAlumno(a)
    setIsAlumnoModalOpen(true)
  }

  const handleAddSuggestedActivity = async () => {
    if (planes.length === 0) {
      setToast({ message: 'Crea una planificación primero para añadir la actividad', type: 'error' })
      return
    }

    const firstPlan = planes[0]
    const newActivity = {
      id: Date.now(),
      titulo: 'Exploración 3D: Célula Animal',
      tipo: 'Interactivo',
      duracion: '40 min',
      completado: false
    }

    const updatedPlan = {
      ...firstPlan,
      actividades: [...(firstPlan.actividades || []), newActivity]
    }

    try {
      await planificacionAPI.save(updatedPlan)
      setToast({ message: '¡IA: Actividad "Célula Animal 3D" añadida a tu secuencia!', type: 'success' })
      fetchWorkspaceData()
    } catch (err) {
      setToast({ message: 'Error al vincular actividad', type: 'error' })
    }
  }

  const handleUseResource = (titulo) => {
    setToast({ message: `"${titulo}" vinculado a la planificación seleccionada`, type: 'success' })
  }

  if (loading) return <div className="p-10"><CardSkeleton /></div>
  if (!curso) return <div className="text-white p-20 text-center font-black uppercase tracking-widest">Aula no encontrada</div>

  const tabItems = [
    { id: 'planes', label: 'Planes', icon: Calendar },
    { id: 'alumnos', label: 'Alumnos', icon: Users },
    { id: 'asistencia', label: 'Asistencia', icon: UserCheck },
    { id: 'recursos', label: 'Recursos', icon: FolderOpen },
    { id: 'progreso', label: 'Análisis Pro', icon: BarChart3 }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Workspace Header SaaS Style ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 md:px-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/mi-aula')}
            className="p-3 bg-surface-subtle hover:bg-surface-muted rounded-2xl border border-white/5 text-gray-400 hover:text-white transition-all flex-shrink-0 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-500">Workspace Activo</span>
               <div className="w-1 h-1 rounded-full bg-gray-800" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Nivel {curso.nivel}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
              {curso.nombre}
            </h2>
          </div>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={() => navigate(`/planificador?cursoId=${id}`)}
             className="btn-primary flex items-center gap-3"
           >
             <Plus size={18} /> Nueva Planificación
           </button>
        </div>
      </div>

      {/* ── Tabs Navigation SaaS ── */}
      <div className="bg-surface-subtle/30 backdrop-blur-md border-b border-white/5 p-1 rounded-2xl flex gap-1 overflow-x-auto no-scrollbar shadow-inner">
        {tabItems.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap rounded-xl ${
              activeTab === tab.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Content Area with Framer Motion ── */}
      <div className="mt-10 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeTab === 'planes' && (
              <div className="space-y-12">
                 <PlanningTimeline planes={planes} />
                 
                 <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Secuencia de Actividades</h3>
                       <div className="h-[1px] flex-1 bg-white/5 mx-8" />
                    </div>
                    
                 {planes.length === 0 ? (
                   <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-6 bg-surface-subtle/20 grayscale hover:grayscale-0 transition-all">
                       <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-gray-700">
                         <FileText size={36} />
                       </div>
                       <div className="space-y-2">
                         <p className="text-md font-black uppercase italic text-gray-400 tracking-tight">Comienza tu secuencia académica</p>
                         <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Aún no hay planificaciones cargadas en este aula.</p>
                       </div>
                       <button 
                         onClick={() => navigate(`/planificador?cursoId=${id}`)}
                         className="btn-secondary"
                       >
                         + Crear Primera Plan
                       </button>
                   </div>
                 ) : (
                    planes.map(plan => (
                      <div key={plan.id} className="group flex flex-col sm:flex-row sm:items-center gap-6 bg-surface-subtle/40 border border-white/5 hover:border-primary-500/30 p-8 rounded-[2rem] transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight size={20} className="text-gray-700" />
                         </div>
                         
                         <div className="w-14 h-14 bg-surface-muted rounded-2xl flex items-center justify-center text-primary-500 group-hover:scale-110 group-hover:bg-primary-500/10 transition-all border border-white/5">
                           {plan.estado === 'Finalizada' ? <CheckCircle2 size={24} /> : <Zap size={24} className="animate-pulse" />}
                         </div>
                         
                         <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                               <h4 className="text-lg font-black uppercase italic tracking-tighter text-white group-hover:text-primary-300 transition-colors">
                                 {plan.titulo}
                               </h4>
                               <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                                 plan.estado === 'Finalizada' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-primary-500/20 text-primary-400 bg-primary-500/5'
                               }`}>
                                 {plan.estado}
                               </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                               <span className="flex items-center gap-2"><Calendar size={14} className="text-primary-600" /> {new Date(plan.fechaInicio).toLocaleDateString('es', { day: 'numeric', month: 'long' })}</span>
                               <span className="flex items-center gap-2"><Clock size={14} className="text-indigo-600" /> {new Date(plan.lastModified).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}hs</span>
                            </div>
                         </div>

                         <div className="flex items-center gap-3 mt-4 sm:mt-0">
                            <button 
                              onClick={() => handleDuplicate(plan.id)}
                              className="p-3 bg-white/5 hover:bg-primary-500/10 text-gray-500 hover:text-primary-500 rounded-xl transition-all border border-white/5"
                              title="Duplicar"
                            >
                              <Copy size={18} />
                            </button>
                            <button 
                              onClick={() => navigate(`/planificador?edit=${plan.id}`)}
                              className="p-3 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded-xl transition-all border border-white/5"
                              title="Ver / Editar"
                            >
                              <MoreVertical size={18} />
                            </button>
                         </div>
                      </div>
                    ))
                 )}
                 </div>
              </div>
            )}

            {activeTab === 'alumnos' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                   <div className="space-y-1">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Gestión de Estudiantes</h3>
                      <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">{alumnos.length} registrados en el aula</p>
                   </div>
                   <button 
                     onClick={() => { setSelectedAlumno(null); setIsAlumnoModalOpen(true); }}
                     className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-900/20 flex items-center gap-3"
                   >
                     <Plus size={16} /> Registrar Alumno
                   </button>
                </div>

                <div className="card bg-surface-subtle/20 border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-600 text-[10px] uppercase font-black tracking-[0.3em] border-b border-white/5">
                          <th className="px-8 py-6">Estudiante</th>
                          <th className="px-8 py-6">Estado Académico</th>
                          <th className="px-8 py-6">IA Insights</th>
                          <th className="px-8 py-6 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {alumnos.map(a => (
                          <tr key={a.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-6 flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-white/5 flex items-center justify-center text-primary-500 shadow-lg group-hover:scale-110 transition-transform">
                                <Users size={20} />
                              </div>
                              <div>
                                <p className="text-md font-black uppercase italic text-white tracking-tight leading-none mb-1">{a.nombre} {a.apellido}</p>
                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{a.dni}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="space-y-1.5 min-w-[120px]">
                                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                     <span className="text-gray-500">Asistencia</span>
                                     <span className={(a.asistencia || 0) > 90 ? 'text-green-500' : 'text-orange-500'}>{a.asistencia ?? 100}%</span>
                                  </div>
                                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                     <div className={`h-full rounded-full ${(a.asistencia || 0) > 90 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${a.asistencia ?? 100}%` }} />
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex flex-wrap gap-2">
                                  {a.asistencia < 85 && (
                                     <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[8px] font-black uppercase tracking-widest rounded border border-red-500/20 flex items-center gap-1.5">
                                        <AlertTriangle size={10} /> Riesgo por faltas
                                     </span>
                                  )}
                                  {a.participacion > 90 && (
                                     <span className="px-2 py-1 bg-primary-500/10 text-primary-400 text-[8px] font-black uppercase tracking-widest rounded border border-primary-500/20 flex items-center gap-1.5">
                                        <Sparkles size={10} /> Alta Participación
                                     </span>
                                  )}
                                  {a.asistencia >= 85 && a.participacion <= 90 && (
                                     <span className="px-2 py-1 bg-white/5 text-gray-500 text-[8px] font-black uppercase tracking-widest rounded border border-white/5">Sin alertas</span>
                                  )}
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex justify-end gap-2">
                                 <button 
                                   onClick={() => handleEditAlumno(a)}
                                   className="p-3 bg-white/5 hover:bg-primary-600/20 hover:text-primary-400 text-gray-500 rounded-xl transition-all border border-white/5"
                                   title="Editar Alumno"
                                 >
                                   <ExternalLink size={16} />
                                 </button>
                                 <button 
                                   onClick={() => handleDeleteAlumno(a.id)}
                                   className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-gray-500 rounded-xl transition-all border border-white/5"
                                   title="Eliminar del Aula"
                                 >
                                   <Trash2 size={16} />
                                 </button>
                               </div>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'asistencia' && (
              <Asistencia cursoId={id} alumnos={alumnos} />
            )}

            {activeTab === 'recursos' && (
              <div className="space-y-10">
                 <div className="bg-primary-600/5 border border-primary-500/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 text-primary-500/10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                       <Zap size={200} />
                    </div>
                    <div className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary-900/40 shrink-0 rotate-3">
                       <BrainCircuit size={40} />
                    </div>
                    <div className="space-y-3 flex-1 relative z-10">
                       <h3 className="text-2xl font-black uppercase italic text-white flex items-center gap-3 tracking-tighter">Sugerencia IA de Hoy</h3>
                       <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
                         Basado en tu planificación de <span className="text-primary-400 font-bold uppercase tracking-widest">"Célula Animal"</span>, hemos encontrado una visualización 3D interactiva que mejorará la retención visual en un 40%.
                       </p>
                    </div>
                    <div className="flex gap-4 shrink-0 relative z-10">
                       <button 
                         type="button"
                         onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           setPreviewResource({
                             titulo: 'Célula Animal 3D',
                             tipo: 'Modelo Interactivo',
                             url: 'https://images.unsplash.com/photo-1544333346-633ca58682cd?q=80&w=1200' 
                           });
                         }} 
                         className="btn-secondary"
                       >
                         Previsualizar
                       </button>
                       <button type="button" onClick={handleAddSuggestedActivity} className="btn-primary">Añadir al Plan</button>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-subtle/50 border border-white/5 p-6 rounded-[2rem]">
                    <div className="flex flex-wrap gap-6 font-display">
                       <div className="space-y-2">
                          <p className="label ml-0">Especialidad</p>
                          <select 
                            value={recursoFilter.materia}
                            onChange={(e) => setRecursoFilter({...recursoFilter, materia: e.target.value})}
                            className="bg-surface-subtle border border-white/10 rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:ring-1 focus:ring-primary-500 transition-all min-w-[180px]"
                          >
                             <option value="todas">Todos los Campos</option>
                             <option value="Matemática">Matemática</option>
                             <option value="Ciencias Naturales">Cs. Naturales</option>
                             <option value="Ciencias Sociales">Cs. Sociales</option>
                          </select>
                       </div>
                    </div>

                    <button 
                       onClick={handleUploadRecurso}
                       className="p-4 bg-primary-600/10 hover:bg-primary-600 border border-primary-500/30 text-primary-400 hover:text-white rounded-2xl transition-all flex items-center gap-3 font-black uppercase tracking-widest text-[10px]"
                    >
                       <Plus size={20} /> Nuevo Material
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {curso.recursos?.filter(r => {
                      if (recursoFilter.materia !== 'todas' && r.materia !== recursoFilter.materia) return false;
                      if (recursoFilter.tipo !== 'todos' && r.tipo !== recursoFilter.tipo) return false;
                      return true;
                    }).map(recurso => (
                      <div key={recurso.id} className="group bg-surface-subtle/50 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary-500/40 transition-all shadow-2xl flex flex-col hover:translate-y-[-8px] duration-500">
                        <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                           {recurso.tipo === 'video' ? (
                              <div onClick={() => setToast({ message: `Streaming: ${recurso.titulo}`, type: 'info' })} className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer z-10 border-4 border-white/10">
                                 <Play size={28} fill="currentColor" />
                              </div>
                           ) : (
                              <img src={recurso.url} alt={recurso.titulo} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0" />
                           )}
                           <div className="absolute bottom-4 left-4 flex gap-2">
                              <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest text-primary-400 border border-white/10">{recurso.materia}</span>
                           </div>
                        </div>
                        
                        <div className="p-8 space-y-6 flex-1 flex flex-col">
                           <div className="space-y-1">
                              <h4 className="text-lg font-black uppercase italic text-white truncate leading-tight tracking-tight">{recurso.titulo}</h4>
                              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">{recurso.tipo} • Nivel {recurso.nivel}</p>
                           </div>
                           
                           <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                              <div className="flex gap-2">
                                 <button onClick={() => handleUseResource(recurso.titulo)} title="Usar en Plan" className="p-2.5 bg-primary-600/10 hover:bg-primary-600 text-primary-400 hover:text-white rounded-xl transition-all border border-primary-500/20"><Copy size={16} /></button>
                                 <button onClick={() => setToast({ message: `Editando: ${recurso.titulo}`, type: 'info' })} className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded-xl transition-all border border-white/5"><FileText size={16} /></button>
                                 <button onClick={() => setToast({ message: `Eliminado (Demo)`, type: 'error' })} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl transition-all border border-white/5"><Trash2 size={16} /></button>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black text-gray-700 uppercase">
                                 <Eye size={14} /> {recurso.usageCount || 0}
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'progreso' && (
              <div className="space-y-10 pb-10">
                 {!showReport && reportLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[500px] bg-surface-subtle/40 border border-white/5 rounded-[3rem] p-20 text-center gap-10">
                       <div className="relative">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-32 h-32 border-4 border-primary-500/10 border-t-primary-500 rounded-full" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-primary-500">
                             {(() => {
                                const Icon = steps[reportStep].icon;
                                return <Icon size={40} className="animate-pulse" />;
                             })()}
                          </div>
                       </div>
                       <div className="space-y-6 max-w-md">
                          <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">IA: Procesando Insights de Rendimiento</h3>
                          <div className="flex flex-col gap-4">
                             {steps.map((s, i) => (
                                <div key={i} className={`flex items-center gap-4 transition-all duration-700 ${i > reportStep ? 'opacity-20' : 'opacity-100'}`}>
                                   <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 ${
                                     i < reportStep ? 'bg-green-500 border-green-500 text-white' : i === reportStep ? 'border-primary-500 text-primary-500' : 'border-white/10 text-gray-800'
                                   }`}>
                                      {i < reportStep ? <Check size={16} /> : <span className="text-xs font-black">{i + 1}</span>}
                                   </div>
                                   <span className={`text-sm font-black uppercase tracking-widest ${i === reportStep ? 'text-primary-400' : 'text-gray-600'}`}>{s.title}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 ) : showReport ? (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                       <div className="flex items-center gap-6 mb-4">
                           <div className="w-16 h-16 bg-primary-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary-900/40 rotate-3">
                              <Sparkles size={32} />
                           </div>
                           <div>
                              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Análisis de Inteligencia <span className="text-primary-500">Pro</span></h3>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Predicción de éxito grupal e individual • Última actualización: Hoy</p>
                           </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                          {/* CARD 1: ACCIÓN RECOMENDADA */}
                          <div className="xl:col-span-1 bg-gradient-to-br from-primary-600 to-indigo-800 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-primary-950/50 group">
                             <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                                <Bot size={250} />
                             </div>
                             <div className="space-y-8 relative z-10">
                                <div className="flex justify-between items-start">
                                   <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                      <Zap size={28} className="text-white fill-white" />
                                   </div>
                                   <span className="px-4 py-1.5 bg-black/30 backdrop-blur-md text-[9px] font-black uppercase tracking-widest rounded-full border border-white/10">Insight de hoy</span>
                                </div>
                                <div className="space-y-4">
                                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-70">Sugerencia Proactiva</h4>
                                   <h3 className="text-2xl font-black italic leading-tight tracking-tighter">¿Iniciar plan de refuerzo en Geometría 3D?</h3>
                                </div>
                             </div>
                             <div className="space-y-4 relative z-10 mt-12">
                                <button 
                                   onClick={() => navigate(`/planificador?cursoId=${id}&suggested=refuerzo-geometria`)}
                                   className="w-full py-5 bg-white text-indigo-700 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-100 transition-all shadow-2xl active:scale-95"
                                >
                                   Generar Plan Ahora
                                </button>
                             </div>
                          </div>

                          {/* CARD 2: RENDIMIENTO */}
                          <div className="bg-surface-subtle/50 border border-white/5 p-10 rounded-[3rem] flex flex-col gap-8 hover:border-primary-500/30 transition-all shadow-xl">
                             <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                   <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Métricas Académicas</h4>
                                   <p className="text-2xl font-black text-white italic">+14.2%</p>
                                </div>
                                <div className="p-4 bg-primary-600/10 rounded-2xl text-primary-500"><TrendingUp size={24} /></div>
                             </div>
                             
                             <div className="space-y-5">
                                {[
                                   { label: 'Matemática', val: 82, color: 'bg-primary-500' },
                                   { label: 'Naturales', val: 94, color: 'bg-indigo-500' },
                                   { label: 'Sociales', val: 68, color: 'bg-accent-rose', alert: true },
                                ].map(item => (
                                   <div key={item.label} className="space-y-2">
                                      <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-widest">
                                         <span className="text-gray-600">{item.label}</span>
                                         <span className={item.alert ? 'text-accent-rose' : 'text-white'}>{item.val}%</span>
                                      </div>
                                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                         <div className={`h-full rounded-full transition-all duration-1000 ${item.color}`} style={{ width: `${item.val}%` }} />
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>

                          {/* CARD 3: ASISTENCIA PROMEDIO */}
                          <div className="bg-surface-subtle/50 border border-white/5 p-10 rounded-[3rem] flex flex-col justify-between hover:border-primary-500/30 transition-all shadow-xl">
                             <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                   <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-500"><Users size={20} /></div>
                                   <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Attendance Rate</h4>
                                </div>
                                <div className="space-y-1">
                                   <h2 className="text-6xl font-black italic tracking-tighter text-white">96.8%</h2>
                                   <p className="text-[9px] font-black uppercase tracking-widest text-accent-emerald flex items-center gap-2 underline">
                                      <TrendingUp size={12} /> Máximo histórico
                                   </p>
                                </div>
                             </div>
                             <div className="mt-10 h-3 bg-white/5 rounded-full p-[2px] border border-white/5">
                                <div className="h-full bg-gradient-to-r from-primary-600 to-indigo-500 rounded-full w-[96.8%]" />
                             </div>
                          </div>

                          {/* CARD 4: ALERTAS */}
                          <div className="bg-surface-subtle/50 border border-white/5 p-10 rounded-[3rem] flex flex-col gap-6 hover:border-accent-rose/20 transition-all shadow-xl">
                             <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent-rose/10 rounded-xl text-accent-rose"><AlertTriangle size={20} /></div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Alertas de Atención</h4>
                             </div>
                             <div className="space-y-4">
                                {[
                                   { t: 'Ortografía G/J', a: 6 },
                                   { t: 'Fracciones Mixtas', a: 4 },
                                   { t: 'Inasistencias Lun.', a: 3 }
                                ].map((alert, i) => (
                                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                      <p className="text-[11px] font-black text-white italic truncate">{alert.t}</p>
                                      <span className="text-[9px] font-black text-accent-rose px-2 py-1 bg-accent-rose/10 rounded-lg">{alert.a}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center p-24 bg-surface-subtle/40 border border-white/5 rounded-[4rem] text-center space-y-8 grayscale hover:grayscale-0 transition-all duration-1000">
                       <div className="w-24 h-24 bg-primary-600/10 rounded-[2rem] flex items-center justify-center text-primary-500 shadow-xl border border-primary-500/20">
                          <BarChart3 size={48} />
                       </div>
                       <div className="space-y-3">
                          <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none">Intelligence Hub</h3>
                          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed font-medium">Analiza métricas avanzadas, comportamiento del grupo y recibe sugerencias proactivas de DocenTico.</p>
                       </div>
                       <button onClick={generateReport} className="btn-primary flex items-center gap-4">
                         🚀 Activar Análisis de Inteligencia
                       </button>
                    </div>
                 )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ConfirmModal 
        isOpen={confirm.open} 
        {...confirm} 
        onCancel={() => setConfirm({ ...confirm, open: false })} 
      />

      <AlumnoModal 
        isOpen={isAlumnoModalOpen}
        onClose={() => { setIsAlumnoModalOpen(false); setSelectedAlumno(null); }}
        onSave={handleSaveAlumno}
        alumno={selectedAlumno}
      />

      {/* Resource Preview Modal */}
      <AnimatePresence>
        {previewResource && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPreviewResource(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-surface-subtle border border-white/10 rounded-[2.5rem] overflow-hidden max-w-4xl w-full shadow-2xl"
            >
              <div className="aspect-video bg-black relative group">
                <img src={previewResource.url} className="w-full h-full object-cover opacity-80" alt="Preview" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-2xl animate-pulse">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewResource(null)}
                  className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-black backdrop-blur-md rounded-2xl text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">{previewResource.titulo}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-500">{previewResource.tipo}</p>
                  </div>
                  <button 
                    onClick={() => { handleAddSuggestedActivity(); setPreviewResource(null); }}
                    className="btn-primary px-10"
                  >
                    Vincular al Plan
                  </button>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed uppercase font-bold tracking-tight">
                  Este recurso permitirá observar las organelas citoplasmáticas en tiempo real. 
                  IA de DocenTico estima una mejora sustancial en la comprensión del tema.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
