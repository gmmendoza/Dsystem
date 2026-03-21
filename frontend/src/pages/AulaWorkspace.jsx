import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cursoAPI, planificacionAPI, alumnoAPI } from '../services/api'
import PlanningTimeline from '../components/Aula/PlanningTimeline'
import Asistencia from '../components/Aula/Asistencia'
import { AlumnoModal } from '../components/Aula/AlumnoModal'
import { 
  X,
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
  Zap,
  ArrowUpRight,
  Layout
} from 'lucide-react'
import { CardSkeleton } from '../components/Common/LoadingSkeleton'
import { Toast } from '../components/Common/Toast'
import { ConfirmModal } from '../components/Common/ConfirmModal'
import AIAssistantSection from '../components/AI/AIAssistantSection'

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
  
  const [isAlumnoModalOpen, setIsAlumnoModalOpen] = useState(false)
  const [selectedAlumno, setSelectedAlumno] = useState(null)

  const steps = [
    { title: "Escaneando promedios grupales", icon: Sparkles },
    { title: "Verificando asistencia", icon: Users },
    { title: "Deduciendo brechas pedagógicas", icon: BrainCircuit }
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
        await new Promise(r => setTimeout(r, 1000))
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

  const handleDuplicate = async (planId) => {
    try {
        await planificacionAPI.duplicate(planId)
        setToast({ message: 'Planificación duplicada', type: 'success' })
        fetchWorkspaceData()
    } catch (err) {
        setToast({ message: 'Error al duplicar', type: 'error' })
    }
  }

  const handleSaveAlumno = async (formData) => {
    try {
      if (selectedAlumno) {
        await alumnoAPI.update(selectedAlumno.id, formData)
        setToast({ message: 'Alumno actualizado', type: 'success' })
      } else {
        await alumnoAPI.create(formData)
        setToast({ message: 'Alumno creado', type: 'success' })
      }
      setIsAlumnoModalOpen(false)
      setSelectedAlumno(null)
      fetchWorkspaceData()
    } catch (err) {
      setToast({ message: 'Error', type: 'error' })
    }
  }

  const handleAddSuggestedActivity = () => {
     setToast({ message: 'Actividad de refuerzo sugerida añadida al plan.', type: 'success' })
  }

  if (loading) return <div className="p-10"><CardSkeleton /></div>
  if (!curso) return <div className="p-20 text-center font-black uppercase tracking-widest">Aula no encontrada</div>

  const tabItems = [
    { id: 'planes', label: 'Planes', icon: Calendar },
    { id: 'alumnos', label: 'Alumnos', icon: Users },
    { id: 'asistencia', label: 'Asistencia', icon: UserCheck },
    { id: 'recursos', label: 'Recursos', icon: FolderOpen },
    { id: 'progreso', label: 'IA Análisis', icon: Sparkles }
  ]

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto px-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-6">
        <div className="flex items-center gap-6">
           <button 
             onClick={() => navigate('/mi-aula')}
             className="p-4 bg-surface-subtle hover:bg-surface-muted rounded-[1.5rem] border border-black/5 dark:border-white/5 text-gray-400 hover:text-primary-500 transition-all group shadow-sm"
           >
             <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
           </button>
           <div className="space-y-1">
             <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Aula Workspace</span>
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">{curso.nivel}</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
               {curso.nombre}
             </h2>
           </div>
        </div>

        <button 
          onClick={() => navigate(`/planificador?cursoId=${id}`)}
          className="btn-primary flex items-center gap-3 px-10 py-5"
        >
          <Plus size={20} /> Crear Plan
        </button>
      </div>

      {/* ── TABS ── */}
      <div className="bg-surface-subtle/40 backdrop-blur-3xl border border-black/5 dark:border-white/5 p-1.5 rounded-[2rem] flex items-center gap-1 overflow-x-auto no-scrollbar shadow-premium">
        {tabItems.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative rounded-[1.5rem] ${
              activeTab === tab.id 
                ? 'bg-primary-600 text-white shadow-xl shadow-primary-950/20' 
                : 'text-gray-500 hover:text-primary-500 hover:bg-primary-500/5'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {activeTab === 'planes' && (
              <div className="space-y-10">
                 <PlanningTimeline planes={planes} />
                 <div className="grid grid-cols-1 gap- organic">
                    {planes.map(plan => (
                      <div key={plan.id} className="group bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-10 rounded-[3rem] shadow-premium hover:border-primary-500/30 transition-all flex flex-col md:flex-row md:items-center gap-10">
                         <div className="w-16 h-16 bg-surface-subtle rounded-2xl flex items-center justify-center text-primary-500 group-hover:scale-110 group-hover:bg-primary-500/10 transition-all border border-black/5 dark:border-white/5">
                            {plan.estado === 'Finalizada' ? <CheckCircle2 size={32} /> : <Zap size={32} className="animate-pulse" />}
                         </div>
                         <div className="flex-1">
                            <h4 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-primary-500 transition-colors mb-2">{plan.titulo}</h4>
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                               <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(plan.fechaInicio).toLocaleDateString()}</span>
                               <span className="flex items-center gap-2"><Clock size={14} /> {plan.estado}</span>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button onClick={() => handleDuplicate(plan.id)} className="p-4 bg-surface-subtle hover:bg-primary-500/10 rounded-2xl transition-all border border-black/5 dark:border-white/5 text-gray-500 hover:text-primary-500"><Copy size={20} /></button>
                            <button onClick={() => navigate(`/planificador?edit=${plan.id}`)} className="p-4 bg-primary-600 text-white rounded-2xl transition-all shadow-lg shadow-primary-950/20"><MoreVertical size={20} /></button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'alumnos' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-4">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-500">Docentes a Cargo: {alumnos.length} Alumnos</h3>
                    <button onClick={() => setIsAlumnoModalOpen(true)} className="btn-secondary">Registrar Nuevo</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {alumnos.map(a => (
                      <div key={a.id} className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-black/5 dark:border-white/5 shadow-premium hover:shadow-2xl transition-all group">
                         <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 bg-surface-subtle rounded-2xl flex items-center justify-center text-primary-600 border border-black/5 dark:border-white/5 group-hover:scale-110 transition-transform"><Users size={28} /></div>
                            <span className="text-2xl font-black italic tracking-tighter">{a.asistencia}%</span>
                         </div>
                         <h4 className="text-xl font-black uppercase italic tracking-tighter group-hover:text-primary-500 transition-colors mb-2">{a.nombre} {a.apellido}</h4>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">{a.dni}</p>
                         <button onClick={() => navigate('/estudiantes')} className="w-full py-4 bg-surface-subtle group-hover:bg-primary-500/10 group-hover:text-primary-600 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">Ver Ficha Completa</button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'asistencia' && <Asistencia cursoId={id} alumnos={alumnos} />}

            {activeTab === 'progreso' && (
              <div className="space-y-12">
                 {!showReport && reportLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[500px]">
                       <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border-4 border-primary-500/10 border-t-primary-500 rounded-full mb-10" />
                       <h3 className="text-xl font-black uppercase italic tracking-tighter">{steps[reportStep].title}</h3>
                    </div>
                 ) : showReport ? (
                    <div className="space-y-12">
                       <AIAssistantSection 
                         title="Diagnóstico de Inteligencia del Aula"
                         insight={`He detectado un patrón crítico: el rendimiento en "${curso.nombre}" es un 12% superior cuando las clases inician con actividades interactivas. Sin embargo, hay 3 alumnos con riesgo por inasistencia continuada.`}
                         metrics={[
                            { label: 'Rendimiento Gral.', value: '8.4', trend: 5 },
                            { label: 'Asistencia Prom.', value: '96.8%', trend: 0.5 },
                            { label: 'Alumnos en Riesgo', value: '3', trend: -20 },
                            { label: 'Compromiso IA', value: 'Excelente' }
                         ]}
                         actions={[
                            { label: 'Corregir Actividades', onClick: handleAddSuggestedActivity, icon: Sparkles, primary: true },
                            { label: 'Generar Reporte PDF', onClick: () => alert('Generando...'), icon: FileText },
                            { label: 'Notificar Riesgos', onClick: () => alert('Enviado.'), icon: AlertCircle }
                         ]}
                       />
                       
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-12 rounded-[4rem] shadow-premium">
                              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-10">Desglose de Rendimiento por Área</h4>
                              <div className="space-y-10">
                                 {[
                                   { label: 'Matemática', val: 82, color: 'bg-indigo-500' },
                                   { label: 'Cs. Naturales', val: 94, color: 'bg-emerald-500' },
                                   { label: 'Ciencias Sociales', val: 68, color: 'bg-amber-500' }
                                 ].map(item => (
                                   <div key={item.label} className="space-y-4">
                                      <div className="flex justify-between items-end px-1">
                                         <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                         <span className="text-xl font-black italic">{item.val}%</span>
                                      </div>
                                      <div className="h-3 bg-black/5 dark:bg-white/5 rounded-full p-[2px]">
                                         <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${item.color}`} />
                                      </div>
                                   </div>
                                 ))}
                              </div>
                          </div>
                          
                          <div className="bg-gradient-to-br from-rose-600 to-red-600 p-12 rounded-[4rem] text-white shadow-2xl shadow-rose-950/20 relative overflow-hidden flex flex-col justify-between">
                              <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12"><Bot size={300} /></div>
                              <div className="relative z-10">
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-6 font-display">Intervención Urgente</h4>
                                 <h3 className="text-3xl font-black italic tracking-tighter leading-tight mb-8">Atención necesaria para Alumnos en Riesgo.</h3>
                                 <button onClick={() => alert('WhatsApp Enviado')} className="w-full py-5 bg-white text-rose-600 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-gray-100 transition-all active:scale-95">Contactar Tutores</button>
                              </div>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[4rem] bg-surface-subtle/30 text-center gap-8">
                       <div className="w-24 h-24 bg-primary-600/10 rounded-3xl flex items-center justify-center text-primary-500 shadow-xl"><Bot size={48} /></div>
                       <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Activa DocenTico Pro</h3>
                       <button onClick={generateReport} className="btn-primary">⚡ Iniciar Simulación de IA</button>
                    </div>
                 )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ConfirmModal isOpen={confirm.open} {...confirm} onCancel={() => setConfirm({ ...confirm, open: false })} />
      <AlumnoModal isOpen={isAlumnoModalOpen} onClose={() => { setIsAlumnoModalOpen(false); setSelectedAlumno(null); }} onSave={handleSaveAlumno} alumno={selectedAlumno} />
    </div>
  )
}
