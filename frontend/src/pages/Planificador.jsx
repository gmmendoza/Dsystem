import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText, 
  Calendar, 
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  Bot,
  Wand2,
  Eye,
  Download,
  Share2,
  Check,
  BrainCircuit,
  Lightbulb,
  Search,
  ChevronRight,
  ChevronDown,
  CloudCheck,
  CloudUpload,
  RefreshCw
} from 'lucide-react'
import { planificacionAPI, cursoAPI } from '../services/api'
import { Toast } from '../components/Common/Toast'

export default function Planificador() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isSmartFilling, setIsSmartFilling] = useState(false)
  const [toast, setToast] = useState(null)
  const [cursos, setCursos] = useState([])
  const [saveStatus, setSaveStatus] = useState('saved') // 'saved', 'saving', 'unsaved'
  const [lastSaved, setLastSaved] = useState(null)
  
  const [formData, setFormData] = useState({
    titulo: '',
    materia: '',
    cursoId: '',
    nivel: 'Primaria',
    tipo: 'Diaria',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    objetivos: [''],
    actividades: [''],
    recursos: [],
    evaluacion: '',
    estado: 'En progreso'
  })

  // Avoid saving on initial load
  const initialMount = useRef(true)

  useEffect(() => {
    fetchCursos()
    const editId = searchParams.get('edit')
    const cursoIdParam = searchParams.get('cursoId')
    const suggested = searchParams.get('suggested')

    if (editId) loadPlan(editId)
    if (cursoIdParam) setFormData(prev => ({ ...prev, cursoId: cursoIdParam }))
    
    if (suggested === 'refuerzo-geometria') {
       handleSmartFill('geometría')
    }
  }, [searchParams])

  // --- AUTOSAVE LOGIC ---
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false
      return
    }

    setSaveStatus('unsaved')
    const timeout = setTimeout(() => {
      handleAutoSave()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [formData])

  const handleAutoSave = async () => {
    if (formData.titulo.length < 3) return
    setSaveStatus('saving')
    try {
      await planificacionAPI.save(formData)
      setSaveStatus('saved')
      setLastSaved(new Date().toLocaleTimeString())
    } catch (err) {
      setSaveStatus('unsaved')
    }
  }

  const fetchCursos = async () => {
    const res = await cursoAPI.getAll()
    setCursos(res.data)
  }

  const loadPlan = async (id) => {
    try {
      const res = await planificacionAPI.getById(id)
      setFormData(res.data)
      setSaveStatus('saved')
    } catch (err) {
      setToast({ message: 'Error al cargar planificación', type: 'error' })
    }
  }

  const handleSmartFill = async (topic = 'general') => {
    setIsSmartFilling(true)
    setToast({ message: 'DocenTico está analizando el currículum...', type: 'info' })
    
    await new Promise(r => setTimeout(r, 2000))
    
    const aiProposal = {
        titulo: topic === 'geometría' ? "Refuerzo: Geometría del Espacio" : "Unidad: " + (formData.materia || "Nuevo Contenido"),
        objetivos: [
            "Identificar propiedades de cuerpos geométricos",
            "Relacionar figuras planas con volúmenes",
            "Resolver desafíos espaciales prácticos"
        ],
        actividades: [
            "Búsqueda de poliedros en el entorno escolar",
            "Modelado de prismas con materiales concretos",
            "Simulación 3D: Rotación y traslación"
        ],
        evaluacion: "Observación sistemática y portfolio de producciones físicas.",
        materia: formData.materia || "Matemática"
    }

    setFormData(prev => ({ ...prev, ...aiProposal }))
    setIsSmartFilling(false)
    setToast({ message: 'Propuesta generada con éxito', type: 'success' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.titulo || !formData.materia || !formData.cursoId) {
      setToast({ message: 'Completa los campos requeridos', type: 'error' })
      return
    }

    setLoading(true)
    try {
      await planificacionAPI.save(formData)
      setToast({ message: 'Cambios guardados permanentemente', type: 'success' })
      setTimeout(() => navigate(`/aula/${formData.cursoId}`), 1000)
    } catch (err) {
      setToast({ message: 'Error al guardar', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const addItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] })
  }

  const removeItem = (field, index) => {
    const list = [...formData[field]]
    list.splice(index, 1)
    setFormData({ ...formData, [field]: list })
  }

  const updateItem = (field, index, value) => {
    const list = [...formData[field]]
    list[index] = value
    setFormData({ ...formData, [field]: list })
  }

  return (
    <div className="min-h-screen pb-32 max-w-[1400px] mx-auto px-6 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── NOTION STYLE HEADER ── */}
      <div className="sticky top-0 z-50 bg-[#0c0c14]/80 backdrop-blur-xl border-b border-white/5 -mx-6 px-6 py-5 mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <button 
             onClick={() => navigate(-1)} 
             className="text-gray-500 hover:text-white transition-colors"
           >
             <ArrowLeft size={22} />
           </button>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                 <FileText size={20} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 leading-none mb-1">Planificador Editor</span>
                 <h1 className="text-xl font-black text-white italic tracking-tight leading-none">
                    {formData.titulo || 'Nueva Planificación'}
                 </h1>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-8">
           {/* Autosave Status Indicator */}
           <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all">
              {saveStatus === 'saving' && (
                 <span className="text-indigo-400 flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin" /> Guardando...
                 </span>
              )}
              {saveStatus === 'saved' && (
                 <span className="text-emerald-500/70 flex items-center gap-2">
                    <CloudCheck size={16} /> {lastSaved ? `Guardado ${lastSaved}` : 'Cambios guardados'}
                 </span>
              )}
              {saveStatus === 'unsaved' && (
                 <span className="text-gray-600 flex items-center gap-2">
                    <CloudUpload size={16} /> Cambios sin guardar
                 </span>
              )}
           </div>

           <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

           <div className="flex items-center gap-3">
              <button 
                onClick={() => handleSmartFill()}
                disabled={isSmartFilling}
                className="btn-secondary py-2.5 px-4 text-[10px] flex items-center gap-2 border-indigo-500/20 text-indigo-400 hover:border-indigo-500/50"
              >
                <Bot size={16} /> {isSmartFilling ? 'Analizando...' : 'Smart Fill IA'}
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary py-2.5 px-6 text-[10px] flex items-center gap-2 shadow-indigo-900/20"
              >
                <Save size={16} /> Publicar Plan
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* ── CENTRAL EDITOR (NOTION STYLE) ── */}
        <div className="lg:col-span-8 space-y-16">
           
           {/* Section 1: Meta */}
           <section className="space-y-10 group">
              <div className="flex items-center gap-4 text-gray-700 group-hover:text-indigo-500/50 transition-colors">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em]">Propiedades</span>
                 <div className="h-[1px] flex-1 bg-white/5" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 block">Título de la Unidad</label>
                    <input 
                       className="w-full bg-transparent border-none p-0 text-3xl font-black text-white placeholder:text-gray-800 outline-none focus:ring-0 italic"
                       value={formData.titulo}
                       onChange={e => setFormData({...formData, titulo: e.target.value})}
                       placeholder="Escribe el título aquí..."
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 block">Materia o Área</label>
                    <input 
                       className="w-full bg-transparent border-none p-0 text-3xl font-black text-indigo-400 placeholder:text-gray-800 outline-none focus:ring-0 italic"
                       value={formData.materia}
                       onChange={e => setFormData({...formData, materia: e.target.value})}
                       placeholder="Ej: Matemática"
                    />
                 </div>
                 
                 <div className="flex items-center gap-6 pt-4">
                    <div className="flex-1 space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-600">Asignar a Aula</label>
                       <select 
                         className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-indigo-500/40"
                         value={formData.cursoId}
                         onChange={e => setFormData({...formData, cursoId: e.target.value})}
                       >
                         <option value="">Seleccionar Workspace</option>
                         {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                       </select>
                    </div>
                    <div className="flex-1 space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-600">Tipo de Plan</label>
                       <select className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-indigo-500/40">
                          <option>Secuencia Didáctica</option>
                          <option>Proyecto ABP</option>
                          <option>Acompañamiento</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-600">Estado de Publicación</label>
                    <div className="flex gap-2">
                       {['Borrador', 'Activa', 'Cerrada'].map(s => (
                          <button 
                            key={s}
                            type="button"
                            onClick={() => setFormData({...formData, estado: s === 'Cerrada' ? 'Finalizada' : s === 'Borrador' ? 'En progreso' : 'Activa'})}
                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                               (s === 'Borrador' && formData.estado === 'En progreso') || (s === 'Cerrada' && formData.estado === 'Finalizada') || (s === 'Activa' && formData.estado === 'Activa')
                               ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40' 
                               : 'bg-white/5 text-gray-700 border-transparent hover:border-white/5'
                            }`}
                          >
                             {s}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </section>

           {/* Section 2: Dinamic Lists */}
           <LayoutGroup>
              <div className="grid grid-cols-1 gap-16">
                 {/* Objetivos */}
                 <section className="space-y-8 min-h-[200px]">
                    <div className="flex items-center justify-between group">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 group-hover:text-indigo-500 transition-colors">01. Objetivos de Aprendizaje</span>
                       <button 
                          type="button" 
                          onClick={() => addItem('objetivos')}
                          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-indigo-500 transition-all border border-white/5"
                       >
                          <Plus size={18} />
                       </button>
                    </div>

                    <div className="space-y-4">
                       <AnimatePresence initial={false}>
                          {formData.objetivos.map((obj, i) => (
                             <motion.div 
                                layout
                                key={`obj-${i}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex gap-6 group items-start"
                             >
                                <span className="pt-4 text-[11px] font-black text-indigo-600/50">{(i+1).toString().padStart(2, '0')}</span>
                                <input 
                                   className="flex-1 bg-white/[0.02] border border-white/5 group-hover:border-white/10 rounded-2xl px-6 py-4 text-xs text-gray-300 outline-none focus:border-indigo-500/40 transition-all font-medium"
                                   value={obj}
                                   onChange={e => updateItem('objetivos', i, e.target.value)}
                                   placeholder="Define un objetivo claro..."
                                />
                                <button type="button" onClick={() => removeItem('objetivos', i)} className="pt-4 text-gray-800 hover:text-red-500 transition-colors">
                                   <Trash2 size={16} />
                                </button>
                             </motion.div>
                          ))}
                       </AnimatePresence>
                    </div>
                 </section>

                 {/* Actividades */}
                 <section className="space-y-8 min-h-[200px]">
                    <div className="flex items-center justify-between group">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 group-hover:text-violet-500 transition-colors">02. Secuencia de Actividades</span>
                       <button 
                          type="button" 
                          onClick={() => addItem('actividades')}
                          className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-violet-500 transition-all border border-white/5"
                       >
                          <Plus size={18} />
                       </button>
                    </div>

                    <div className="space-y-4">
                       <AnimatePresence initial={false}>
                          {formData.actividades.map((act, i) => (
                             <motion.div 
                                layout
                                key={`act-${i}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex gap-6 group items-start"
                             >
                                <span className="pt-4 text-[11px] font-black text-violet-600/50">{(i+1).toString().padStart(2, '0')}</span>
                                <textarea 
                                   className="flex-1 bg-white/[0.02] border border-white/5 group-hover:border-white/10 rounded-2xl px-6 py-4 text-xs text-gray-300 outline-none focus:border-violet-500/40 transition-all font-medium resize-none min-h-[60px]"
                                   rows={1}
                                   value={act}
                                   onChange={e => updateItem('actividades', i, e.target.value)}
                                   placeholder="Describe la actividad..."
                                />
                                <button type="button" onClick={() => removeItem('actividades', i)} className="pt-4 text-gray-800 hover:text-red-500 transition-colors">
                                   <Trash2 size={16} />
                                </button>
                             </motion.div>
                          ))}
                       </AnimatePresence>
                    </div>
                 </section>
              </div>
           </LayoutGroup>

           <section className="space-y-8 pt-10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">03. Criterios de Evaluación</span>
              <textarea 
                 className="w-full bg-surface-subtle/30 border border-white/5 rounded-[2.5rem] p-10 text-xs text-gray-400 outline-none focus:border-indigo-500/40 transition-all font-medium min-h-[160px] resize-none leading-relaxed"
                 value={formData.evaluacion}
                 onChange={e => setFormData({...formData, evaluacion: e.target.value})}
                 placeholder="Escribe aquí los criterios para evaluar esta unidad..."
              />
           </section>
        </div>

        {/* ── STABLE PREVIEW SIDEBAR ── */}
        <div className="lg:col-span-4 lg:block hidden">
           <div className="sticky top-32 space-y-10">
              <div className="bg-indigo-600/5 border border-indigo-500/10 p-10 rounded-[3rem] relative overflow-hidden group">
                 <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                    <BrainCircuit size={180} />
                 </div>
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                       <Sparkles size={18} className="text-indigo-400" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">DocenTico Insight</h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed italic font-medium">
                       "Notamos que las secuencias didácticas con una duración de 10-15 días obtienen mejores tasas de asistencia completa."
                    </p>
                    <div className="pt-2">
                       <button className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-300 transition-colors underline underline-offset-4">
                          Optimizar duración
                       </button>
                    </div>
                 </div>
              </div>

              {/* Document Mockup */}
              <div className="bg-surface-subtle border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
                 <div className="bg-white/5 p-8 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Document Live Preview</span>
                       <div className="flex gap-1.5">
                          {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/10" />)}
                       </div>
                    </div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white truncate">{formData.titulo || 'Untitled'}</h3>
                    <div className="flex gap-2">
                       <span className="px-2 py-1 bg-indigo-600/10 text-indigo-400 text-[8px] font-black uppercase border border-indigo-500/20 rounded">{formData.materia || 'General'}</span>
                    </div>
                 </div>

                 <div className="p-8 flex-1 space-y-8 overflow-y-auto custom-scrollbar grayscale-[0.5] opacity-60">
                    <div className="space-y-4">
                       <div className="h-2 w-1/3 bg-white/10 rounded-full" />
                       <div className="space-y-2">
                          {[1,2,3].map(i => <div key={i} className="h-1.5 w-full bg-white/5 rounded-full" />)}
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                       <div className="space-y-2">
                          {[1,2,3,4].map(i => <div key={i} className="h-1.5 w-full bg-white/5 rounded-full" />)}
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
                    <button className="flex-1 p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-gray-500 transition-all border border-white/5">
                       <Download size={18} />
                    </button>
                    <button className="flex-[2] p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-gray-500 text-[9px] font-black uppercase border border-white/5">
                       Compartir PDF
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
