import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cursoAPI, planificacionAPI, alumnoAPI } from '../services/api'
import PlanningTimeline from '../components/Aula/PlanningTimeline'
import Asistencia from '../components/Aula/Asistencia'
import Recursos from '../components/Aula/Recursos'
import { AlumnoModal } from '../components/Aula/AlumnoModal'
import { useAI } from '../context/AIContext'
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
  Layout,
  BookOpen
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
  const { suggestSolution, getWeeklyStrategy } = useAI()
  const [aiSolution, setAiSolution] = useState(null)
  const [weeklyStrategy, setWeeklyStrategy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('planes')
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null, title: '', message: '' })
  
  const [reportLoading, setReportLoading] = useState(false)
  const [reportStep, setReportStep] = useState(0)
  const [showReport, setShowReport] = useState(false)
  
  const [isAlumnoModalOpen, setIsAlumnoModalOpen] = useState(false)
  const [selectedAlumno, setSelectedAlumno] = useState(null)

  const steps = [
    { title: "Analizando asistencia", icon: Users },
    { title: "Verificando contenidos", icon: BookOpen },
    { title: "Deduciendo brechas", icon: BrainCircuit }
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
        await new Promise(r => setTimeout(r, 800))
    }
    setReportLoading(false)
    setShowReport(true)
    
    // Fetch deep strategy
    const strategy = await getWeeklyStrategy(curso.nombre, alumnos)
    setWeeklyStrategy(strategy)
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
        setToast({ message: 'Plan duplicado', type: 'success' })
        fetchWorkspaceData()
    } catch (err) {
        setToast({ message: 'Error', type: 'error' })
    }
  }

  if (loading) return <div className="p-10"><CardSkeleton /></div>
  if (!curso) return <div className="p-20 text-center font-black uppercase tracking-widest opacity-30 text-xs">Aula no encontrada</div>

  const tabItems = [
    { id: 'planes', label: 'Planes', icon: Calendar },
    { id: 'alumnos', label: 'Alumnos', icon: Users },
    { id: 'asistencia', label: 'Asistencia', icon: UserCheck },
    { id: 'recursos', label: 'Recursos', icon: FolderOpen },
    { id: 'progreso', label: 'Análisis IA', icon: Sparkles }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1400px] mx-auto px-4 lg:px-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => navigate('/mi-aula')}
             className="p-3 bg-surface-subtle hover:bg-surface-muted rounded-xl border border-black/5 dark:border-white/5 text-gray-400 transition-all"
           >
             <ChevronLeft size={20} />
           </button>
           <div className="space-y-0.5">
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary-500">Aula Workspace</span>
                <span className="text-gray-300">/</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{curso.nivel}</span>
             </div>
             <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
               {curso.nombre}
             </h2>
           </div>
        </div>

        <button 
          onClick={() => navigate(`/planificador?cursoId=${id}`)}
          className="btn-primary py-3 px-8 text-[9px]"
        >
          <Plus size={16} /> Crear Plan
        </button>
      </div>

      {/* TABS COMPACT */}
      <div className="p-1 bg-surface-subtle dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl flex items-center overflow-x-auto no-scrollbar shadow-sm lg:max-w-max">
        {tabItems.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-xl ${
              activeTab === tab.id 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'text-gray-500 hover:text-primary-500 hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'planes' && (
              <div className="space-y-6">
                 <PlanningTimeline planes={planes} />
                 <div className="grid grid-cols-1 gap-3">
                    {planes.map(plan => (
                      <div key={plan.id} className="group bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-6 rounded-2xl shadow-sm hover:border-primary-500/20 transition-all flex flex-col md:flex-row md:items-center gap-6">
                         <div className="w-12 h-12 bg-surface-subtle dark:bg-white/5 rounded-xl flex items-center justify-center text-primary-500">
                            {plan.estado === 'Finalizada' ? <CheckCircle2 size={24} /> : <Zap size={24} />}
                         </div>
                         <div className="flex-1">
                            <h4 className="text-lg font-black uppercase italic tracking-tighter group-hover:text-primary-500 transition-colors mb-1">{plan.titulo}</h4>
                            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-500">
                               <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(plan.fechaInicio).toLocaleDateString()}</span>
                               <span className="flex items-center gap-1.5"><Clock size={12} /> {plan.estado}</span>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => handleDuplicate(plan.id)} className="p-3 bg-surface-subtle dark:bg-white/5 hover:bg-primary-500/10 rounded-xl transition-all border border-black/5 dark:border-white/5 text-gray-400 hover:text-primary-500"><Copy size={16} /></button>
                            <button onClick={() => navigate(`/planificador?edit=${plan.id}`)} className="p-3 bg-primary-600 text-white rounded-xl transition-all shadow-md"><MoreVertical size={16} /></button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'alumnos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Total: {alumnos.length} Estudiantes</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alumnos.map(a => (
                      <div key={a.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hover:border-primary-500/20 transition-all group">
                         <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-surface-subtle dark:bg-white/5 rounded-xl flex items-center justify-center text-primary-600"><Users size={20} /></div>
                            <span className="text-xl font-black italic">{a.asistencia}%</span>
                         </div>
                         <h4 className="text-base font-black uppercase italic tracking-tighter mb-4">{a.nombre} {a.apellido}</h4>
                         <button onClick={() => navigate('/estudiantes')} className="w-full py-2.5 bg-surface-subtle dark:bg-white/5 group-hover:bg-primary-600 group-hover:text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">Ver Más</button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'asistencia' && <Asistencia cursoId={id} alumnos={alumnos} />}
            {activeTab === 'recursos' && <Recursos cursoId={id} setToast={setToast} />}

            {activeTab === 'progreso' && (
              <div className="space-y-8">
                 {!showReport && reportLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-surface-subtle/20 rounded-3xl border border-black/5 dark:border-white/5">
                       <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-2 border-primary-500/10 border-t-primary-500 rounded-full mb-4" />
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{steps[reportStep].title}</h3>
                    </div>
                 ) : showReport ? (
                    <div className="space-y-8">
                       <AIAssistantSection 
                         title="Estado de Inteligencia de Aula"
                         insight={`Análisis finalizado: ${alumnos.filter(a => (Object.values(a.notas || {}).reduce((s,v)=>s+v,0)/Object.values(a.notas || {}).length) < 6).length} alumnos en riesgo académico detectados en ${curso.nombre}.`}
                         metrics={[
                            { label: 'Rendimiento', value: (alumnos.reduce((acc, al) => acc + parseFloat(Object.values(al.notas || {}).reduce((s,v)=>s+v,0)/Object.values(al.notas || {}).length || 0), 0) / alumnos.length || 0).toFixed(1), trend: 5 },
                            { label: 'Asistencia', value: `${(alumnos.reduce((acc, al) => acc + (al.asistencia || 0), 0) / alumnos.length || 0).toFixed(1)}%` },
                            { label: 'Riesgo', value: `${alumnos.filter(a => a.asistencia < 75 || (Object.values(a.notas || {}).reduce((s,v)=>s+v,0)/Object.values(a.notas || {}).length) < 6).length} Alumnos`, trend: -20 }
                         ]}
                         actions={[
                            { 
                              label: 'Sugerir Actividad', 
                              onClick: async () => {
                                const sol = await suggestSolution('actividad', { nombre: curso.nombre });
                                setAiSolution(sol);
                              }, 
                              icon: Sparkles, 
                              primary: true 
                            },
                            { label: 'Exportar Reporte', onClick: () => alert('Exportando'), icon: FileText }
                         ]}
                       />

                       {/* IA GENERATED SOLUTION */}
                       <AnimatePresence>
                          {aiSolution && (
                             <motion.div 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: 'auto' }}
                               exit={{ opacity: 0, height: 0 }}
                               className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-[2rem] space-y-4 overflow-hidden shadow-sm"
                             >
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500"><Zap size={16} /></div>
                                      <h4 className="text-sm font-black uppercase italic tracking-tighter text-indigo-600 dark:text-indigo-400">{aiSolution.titulo}</h4>
                                   </div>
                                   <button onClick={() => setAiSolution(null)} className="text-gray-400 hover:text-indigo-500 transition-colors"><X size={16} /></button>
                                </div>
                                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-indigo-500 pl-4">{aiSolution.descripcion}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                   <div className="space-y-3">
                                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Pasos Sugeridos</p>
                                      <ul className="space-y-2">
                                         {aiSolution.pasos.map((p, i) => (
                                            <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                               <span className="w-5 h-5 bg-indigo-500/10 rounded-full flex items-center justify-center text-[8px] text-indigo-500 shrink-0">{i+1}</span>
                                               <span className="pt-0.5">{p}</span>
                                            </li>
                                         ))}
                                      </ul>
                                   </div>
                                   <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-black/5 dark:border-white/10 flex flex-col justify-between">
                                      <div>
                                         <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-4">Material Vinculado</p>
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500"><FileText size={18} /></div>
                                            <div>
                                               <p className="text-[10px] font-black uppercase tracking-tight text-slate-800 dark:text-white">{aiSolution.recursoRelacionado.nombre}</p>
                                               <p className="text-[8px] font-bold text-slate-500 uppercase">{aiSolution.recursoRelacionado.tipo}</p>
                                            </div>
                                         </div>
                                      </div>
                                      <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest mt-4 shadow-lg shadow-indigo-900/20 hover:scale-[1.02] transition-all">Usar este Recurso</button>
                                   </div>
                                </div>
                             </motion.div>
                          )}
                       </AnimatePresence>

                        {/* WEEKLY STRATEGY CARD */}
                        <AnimatePresence>
                           {weeklyStrategy && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                              >
                                 <div className="lg:col-span-2 bg-[#020617] border border-primary-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                                       <BrainCircuit size={120} className="text-primary-500" />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                       <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg rotate-3"><Bot size={20} /></div>
                                          <div>
                                             <h4 className="text-sm font-black uppercase italic tracking-tighter text-white">Estrategia Semanal DocenTico</h4>
                                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary-500/70">Co-Piloto Institucional</p>
                                          </div>
                                       </div>
                                       
                                       <div className="space-y-4">
                                          <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Foco Pedagógico</p>
                                             <h5 className="text-xl font-black italic tracking-tight text-white">{weeklyStrategy.estrategia}</h5>
                                          </div>
                                          
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div className="space-y-3">
                                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Plan de Acción</p>
                                                <ul className="space-y-2">
                                                   {weeklyStrategy.plan.map((item, idx) => (
                                                      <li key={idx} className="flex gap-3 text-[10px] font-bold text-slate-300">
                                                         <CheckCircle2 size={12} className="text-primary-500 shrink-0 mt-0.5" />
                                                         {item}
                                                      </li>
                                                   ))}
                                                </ul>
                                             </div>
                                             <div className="p-5 bg-primary-600 rounded-2xl flex flex-col justify-between shadow-xl shadow-primary-950/40">
                                                <div className="space-y-1">
                                                   <p className="text-[8px] font-black uppercase tracking-widest text-white/60">Impacto Estimado</p>
                                                   <p className="text-lg font-black italic leading-none text-white">{weeklyStrategy.impacto}</p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                                   <Sparkles size={14} className="text-white/80" />
                                                   <p className="text-[9px] font-bold italic text-white/90">{weeklyStrategy.consejito}</p>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 
                                 <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between shadow-sm">
                                    <div className="space-y-4">
                                       <div className="w-12 h-12 bg-surface-subtle dark:bg-white/5 rounded-2xl flex items-center justify-center text-primary-600"><TrendingUp size={24} /></div>
                                       <h4 className="text-lg font-black uppercase italic tracking-tighter">Sincronizar Recursos</h4>
                                       <p className="text-[10px] font-medium text-slate-500 leading-relaxed">DocenTico sugiere asignar el material "Geometría Dinámica" a los alumnos en riesgo para cerrar la brecha conceptual esta semana.</p>
                                    </div>
                                    <button className="w-full py-3.5 bg-primary-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary-950/20 active:scale-95 transition-all mt-6">Asignar Automáticamente</button>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                        
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 p-6 rounded-3xl shadow-sm">
                              <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">Métricas por Materia</h4>
                              <div className="space-y-5">
                                 {[
                                   { label: 'Matemática', val: 82, color: 'bg-indigo-500' },
                                   { label: 'Ciencias Naturales', val: 94, color: 'bg-emerald-500' }
                                 ].map(item => (
                                   <div key={item.label} className="space-y-1.5">
                                      <div className="flex justify-between items-end">
                                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">{item.label}</span>
                                         <span className="text-sm font-black italic text-slate-900 dark:text-white">{item.val}%</span>
                                      </div>
                                      <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full p-[0.5px]">
                                         <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${item.color}`} />
                                      </div>
                                   </div>
                                 ))}
                              </div>
                          </div>
                          
                          <div className="bg-rose-600 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                              <div className="relative z-10">
                                 <h4 className="text-[7px] font-black uppercase tracking-widest text-white/50 mb-3">Intervención Requerida</h4>
                                 <h3 className="text-lg font-black italic tracking-tighter leading-tight mb-5">Contactar tutores por bajo rendimiento detectado.</h3>
                                 <button onClick={() => alert('Mensaje enviado')} className="w-full py-3 bg-white text-rose-600 rounded-2xl font-black text-[8px] uppercase tracking-widest active:scale-95 transition-all">Notificar Ahora</button>
                              </div>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-black/5 dark:border-white/10 rounded-[32px] bg-surface-subtle/30 text-center gap-5">
                       <Bot size={32} className="text-primary-500/50" />
                       <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-400 dark:text-slate-500">Analizar mi Aula</h3>
                       <button onClick={generateReport} className="btn-primary py-2 px-6 text-[8px] tracking-[0.2em]">⚡ Iniciar Análisis IA</button>
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

// Mock handlers to keep it functional
const handleSaveAlumno = () => {}
