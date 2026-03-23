import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, ArrowUpRight, GraduationCap, AlertTriangle, TrendingUp, X, Save, Plus, Trash2, Edit2, Clipboard, MessageCircle, Brain, Zap as ZapIcon, FileText, CheckCircle2, Flag } from 'lucide-react'
import { alumnoAPI, cursoAPI } from '../services/api'
import { CardSkeleton } from '../components/Common/LoadingSkeleton'
import AIAssistantSection from '../components/AI/AIAssistantSection'
import { useAI } from '../context/AIContext'

export default function Estudiantes() {
  const [alumnos, setAlumnos] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('todos') // todos, riesgo, sobresaliente
  
  // Modal State
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState(null)
  const [saving, setSaving] = useState(false)
  
  // AI Roadmap State
  const { getStudentRoadmap } = useAI()
  const [roadmap, setRoadmap] = useState(null)
  const [loadingRoadmap, setLoadingRoadmap] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resAlumnos, resCursos] = await Promise.all([
        alumnoAPI.getAll(),
        cursoAPI.getAll()
      ])
      setAlumnos(resAlumnos.data)
      setCursos(resCursos.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getCursoNombre = (id) => {
    const curso = cursos.find(c => c.alumnos?.includes(id))
    return curso ? curso.nombre : 'Sin asignar'
  }

  const getPromedio = (notas) => {
    if (!notas || Object.keys(notas).length === 0) return "0.0"
    const values = Object.values(notas)
    return (values.reduce((a, b) => a + (Number(b) || 0), 0) / values.length).toFixed(1)
  }

  const handleOpenDetail = (alumno) => {
    setSelectedAlumno(alumno)
    setEditFormData({
      ...alumno,
      observaciones: alumno.observaciones || '',
      notas: { ...alumno.notas }
    })
    setIsModalOpen(true)
    
    // Auto-fetch roadmap if at risk
    if (alumno.asistencia < 75 || parseFloat(getPromedio(alumno.notas)) < 6) {
      handleFetchRoadmap(alumno)
    } else {
      setRoadmap(null)
    }
  }

  const handleFetchRoadmap = async (alumno) => {
    setLoadingRoadmap(true)
    try {
      const rm = await getStudentRoadmap(alumno)
      setRoadmap(rm)
    } finally {
      setLoadingRoadmap(false)
    }
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    try {
      await alumnoAPI.update(selectedAlumno.id, editFormData)
      await fetchData()
      setIsModalOpen(false)
      setSelectedAlumno(null)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleAddGrade = () => {
    const materia = prompt("Nombre de la materia (ej: Matemática, Lengua):")
    if (materia) {
      const nota = prompt(`Nota para ${materia} (1-10):`)
      if (nota) {
        setEditFormData(prev => ({
          ...prev,
          notas: { ...prev.notas, [materia]: Number(nota) }
        }))
      }
    }
  }

  const handleRemoveGrade = (materia) => {
    const newNotas = { ...editFormData.notas }
    delete newNotas[materia]
    setEditFormData(prev => ({ ...prev, notas: newNotas }))
  }

  const filteredAlumnos = alumnos.filter(a => {
    const fullName = `${a.nombre} ${a.apellido}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || a.dni.includes(searchTerm)
    const promedio = parseFloat(getPromedio(a.notas))
    
    if (filter === 'riesgo') return matchesSearch && (a.asistencia < 75 || promedio < 6)
    if (filter === 'sobresaliente') return matchesSearch && promedio >= 9
    return matchesSearch
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1200px] mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg rotate-3">
              <Users size={16} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 block leading-none">Gestión Académica</span>
              <span className="text-[10px] font-bold text-gray-900 dark:text-gray-400 uppercase tracking-widest leading-none mt-1">Base de Datos Estudiantil</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight">
            Nuestros <span className="text-indigo-500">Estudiantes</span>
          </h2>
        </div>

        <div className="relative group md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            type="text"
            placeholder="BUSCAR NOMBRE O DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-subtle border border-black/5 dark:border-white/5 rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-500/30 transition-all placeholder:text-gray-500"
            style={{ color: 'rgb(var(--color-text))' }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {['todos', 'riesgo', 'sobresaliente'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
              filter === f 
                ? 'bg-indigo-600 text-white border-indigo-500/30 shadow-md' 
                : 'bg-surface-subtle border-black/5 dark:border-white/5 text-gray-500 hover:border-indigo-500/20'
            }`}
          >
            {f === 'todos' ? 'Todos' : f === 'riesgo' ? 'En Riesgo' : 'Sobresalientes'}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAlumnos.map(al => {
              const promedioVal = parseFloat(getPromedio(al.notas))
              const isRiesgo = al.asistencia < 75 || promedioVal < 6

              return (
                <motion.div
                  layout
                  key={al.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onClick={() => handleOpenDetail(al)}
                  className={`group relative bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-6 rounded-2xl hover:border-indigo-500/20 cursor-pointer transition-all shadow-premium overflow-hidden ${isRiesgo ? 'hover:bg-red-500/[0.01]' : 'hover:bg-indigo-500/[0.01]'}`}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${isRiesgo ? 'bg-red-500/80' : 'bg-indigo-600/80'} group-hover:scale-105 transition-transform`}>
                          <GraduationCap size={20} />
                       </div>
                       <div className="flex flex-col items-end gap-0.5">
                          <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Promedio</span>
                          <span className={`text-xl font-black italic ${promedioVal >= 9 ? 'text-primary-500' : promedioVal < 6 ? 'text-red-500' : ''}`}>
                            {promedioVal}
                          </span>
                       </div>
                    </div>

                    <div className="space-y-0.5 mb-6">
                       <h3 className="text-lg font-black uppercase italic tracking-tighter group-hover:text-indigo-500 transition-colors leading-none">
                         {al.nombre} {al.apellido}
                       </h3>
                       <p className="text-[9px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest truncate opacity-70">
                          {getCursoNombre(al.id)}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5 dark:border-white/5 mt-auto">
                       <div className="space-y-0.5">
                           <p className="text-[7px] font-black uppercase tracking-widest text-gray-500">Asistencia</p>
                           <div className="text-xs font-black">{al.asistencia}%</div>
                       </div>
                       <div className="space-y-0.5">
                           <p className="text-[7px] font-black uppercase tracking-widest text-gray-500">Participación</p>
                           <div className="text-xs font-black">{al.participacion}%</div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {isModalOpen && editFormData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-3xl border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
               {/* Modal Header */}
               <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg rotate-2">
                       <GraduationCap size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black uppercase italic tracking-tighter leading-none">{editFormData.nombre} {editFormData.apellido}</h2>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Expediente Académico IA</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <X size={20} />
                  </button>
               </div>

               {/* Modal Content */}
               <div className="p-8 overflow-y-auto custom-scrollbar space-y-10">
                  
                   <AIAssistantSection 
                    title={`Diagnóstico de ${editFormData.nombre}`}
                    insight={(() => {
                        const prom = parseFloat(getPromedio(editFormData.notas))
                        const att = editFormData.asistencia
                        if (prom < 6 && att < 75) return `Rendimiento crítico y baja asistencia (${att}%). Requiere intervención urgente.`
                        if (prom < 6) return `Bajo rendimiento académico (Promedio ${prom}). Se sugiere plan de refuerzo inmediato.`
                        if (att < 75) return `Rendimiento aceptable pero baja asistencia (${att}%). Posible desvinculación.`
                        return `Rendimiento positivo y asistencia estable. Continuar con el seguimiento actual.`
                    })()}
                    metrics={[
                       { label: 'Promedio', value: getPromedio(editFormData.notas) },
                       { label: 'Asistencia', value: `${editFormData.asistencia}%` },
                       { 
                         label: 'Riesgo', 
                         value: (parseFloat(getPromedio(editFormData.notas)) < 6 || editFormData.asistencia < 75) ? 'ALTO' : 'BAJO' 
                       }
                    ]}
                    actions={[
                       { label: 'Generar Reporte', onClick: () => alert('Generado.'), icon: FileText },
                       { label: 'Refuerzo IA', onClick: () => handleFetchRoadmap(editFormData), icon: ZapIcon, primary: true }
                    ]}
                   />

                   {/* AI ROADMAP SECTION */}
                   <AnimatePresence>
                     {loadingRoadmap ? (
                        <div className="flex flex-col items-center py-6 bg-surface-subtle/20 rounded-3xl border border-black/5">
                           <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full mb-3" />
                           <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Trazando Ruta de Nivelación...</p>
                        </div>
                     ) : roadmap && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-[#020617] border border-indigo-500/20 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden group shadow-2xl"
                        >
                           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                              <Brain size={100} className="text-indigo-400" />
                           </div>
                           
                           <div className="relative z-10 space-y-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg rotate-3"><ZapIcon size={20} /></div>
                                 <div>
                                    <h4 className="text-sm font-black uppercase italic tracking-tighter text-white">{roadmap.nombre}</h4>
                                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-400">Plan de Recuperación Asistido</p>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <div className="grid grid-cols-1 gap-4">
                                    {roadmap.etapas.map((etapa, idx) => (
                                       <div key={idx} className="flex gap-4 group/item">
                                          <div className="flex flex-col items-center gap-2">
                                             <div className="w-6 h-6 rounded-full bg-white/5 border border-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">{idx + 1}</div>
                                             {idx < roadmap.etapas.length - 1 && <div className="w-[1px] h-full bg-indigo-500/10" />}
                                          </div>
                                          <div className="pb-4">
                                             <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{etapa.titulo}</h5>
                                             <p className="text-[9px] font-medium text-slate-400 leading-relaxed italic">{etapa.desc}</p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                                 
                                 <div className="p-4 bg-indigo-600 rounded-2xl flex items-center justify-between shadow-xl shadow-indigo-950/40">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white"><Flag size={14} /></div>
                                       <div className="space-y-0.5">
                                          <p className="text-[7px] font-black uppercase tracking-widest text-white/60 leading-none">Próximo Hito</p>
                                          <p className="text-[10px] font-black italic text-white uppercase tracking-tight">{roadmap.proximaMeta}</p>
                                       </div>
                                    </div>
                                    <CheckCircle2 size={18} className="text-white/40" />
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     )}
                   </AnimatePresence>

                  {/* Grades Management */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Rendimiento</h3>
                      <button 
                        onClick={handleAddGrade}
                        className="px-3 py-1.5 bg-indigo-600/5 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/10 hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        <Plus size={12} /> Nueva Nota
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {Object.entries(editFormData.notas).map(([materia, nota]) => (
                         <div key={materia} className="flex items-center justify-between p-4 bg-surface-subtle/40 border border-black/5 dark:border-white/5 rounded-xl group hover:border-primary-500/20 transition-all">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-none">{materia}</span>
                               <span className="text-lg font-black italic tracking-tighter mt-0.5">{nota}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => {
                                   const n = prompt(`Nueva nota:`, nota);
                                   if (n) setEditFormData(prev => ({ ...prev, notas: { ...prev.notas, [materia]: Number(n) } }))
                               }} className="p-1.5 text-gray-400 hover:text-indigo-500"><Edit2 size={12} /></button>
                               <button onClick={() => handleRemoveGrade(materia)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Observations */}
                  <div className="space-y-4">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                       <Clipboard size={14} /> Notas Docentes
                    </h3>
                    <textarea 
                      value={editFormData.observaciones}
                      onChange={(e) => setEditFormData({...editFormData, observaciones: e.target.value})}
                      placeholder="Observaciones..."
                      className="w-full h-32 bg-surface-subtle/30 border border-black/5 dark:border-white/5 rounded-xl p-5 text-xs outline-none focus:border-indigo-500/30 transition-all resize-none"
                    />
                  </div>
               </div>

               {/* Modal Footer */}
               <div className="p-6 bg-surface-subtle/30 border-t border-black/5 dark:border-white/5 flex justify-end gap-3 shrink-0">
                  <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">Cerrar</button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary py-2.5 px-8 text-[9px]"
                  >
                    <Save size={14} /> {saving ? 'Ok...' : 'Guardar Datos'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
