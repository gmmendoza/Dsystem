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
  RefreshCw,
  Users,
  Flag,
  MousePointer2
} from 'lucide-react'
import { planificacionAPI, cursoAPI } from '../services/api'
import { Toast } from '../components/Common/Toast'
import { useAI } from '../context/AIContext'

export default function Planificador() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isSmartFilling, setIsSmartFilling] = useState(false)
  const [toast, setToast] = useState(null)
  const [cursos, setCursos] = useState([])
  const [saveStatus, setSaveStatus] = useState('saved') // 'saved', 'saving', 'unsaved'
  const [lastSaved, setLastSaved] = useState(null)
  const [aiStatus, setAiStatus] = useState(null) // 'analyzing', 'connecting', 'synthesizing'
  const { generateSmartFill, refineContent } = useAI()
  const [refiningIdx, setRefiningIdx] = useState({ field: null, index: null })
  
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
       // Automatic Smart Fill trigger for specific suggestions
       setTimeout(() => {
          if (formData.materia && formData.titulo) handleSmartFill()
       }, 500)
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

  const handleSmartFill = async () => {
    if (!formData.materia || !formData.titulo) {
       setToast({ message: 'Escribe al menos un título y materia para que la IA tenga contexto.', type: 'info' })
       return
    }

    setIsSmartFilling(true)
    setAiStatus('analyzing')
    setToast({ message: 'DocenTico está analizando el currículum...', type: 'info' })
    
    try {
      // Step 1: Analyzing
      await new Promise(r => setTimeout(r, 1200))
      setAiStatus('connecting')
      
      // Step 2: Generating real content
      const proposal = await generateSmartFill(formData.materia, formData.titulo)
      
      if (!proposal) throw new Error('AI returned null')
      
      setAiStatus('synthesizing')
      await new Promise(r => setTimeout(r, 1000))

      setFormData(prev => ({ 
        ...prev, 
        ...proposal,
        objetivos: proposal.objetivos?.length ? proposal.objetivos : prev.objetivos,
        actividades: proposal.actividades?.length ? proposal.actividades : prev.actividades
      }))
      
      setToast({ message: 'Propuesta pedagógica generada con éxito', type: 'success' })
    } catch (err) {
      console.error(err)
      setToast({ message: 'Error al conectar con la IA. Usando borrador local.', type: 'error' })
      // Fallback
      setFormData(prev => ({
        ...prev,
        objetivos: [`Explorar fundamentos de ${prev.materia}`, `Aplicar casos prácticos de ${prev.titulo}`],
        actividades: [`Debate inicial sobre ${prev.titulo}`, `Resolución de problemas en clase`]
      }))
    } finally {
      setIsSmartFilling(false)
      setAiStatus(null)
    }
  }

  const handleDownloadPDF = () => {
    setToast({ message: 'Generando PDF profesional...', type: 'info' })
    setTimeout(() => {
      window.print()
      setToast({ message: 'PDF listo para guardar', type: 'success' })
    }, 1000)
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setToast({ message: 'Enlace copiado al portapapeles', type: 'success' })
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!formData.titulo || !formData.materia || !formData.cursoId) {
      setToast({ message: 'Completa los campos requeridos (Título, Materia y Aula)', type: 'error' })
      return
    }

    setLoading(true)
    try {
      await planificacionAPI.save(formData)
      setToast({ message: 'Planificación guardada con éxito', type: 'success' })
      setSaveStatus('saved')
      setLastSaved(new Date().toLocaleTimeString())
      // Redirigir solo si es un plan nuevo
      if (!searchParams.get('edit')) {
        setTimeout(() => navigate(`/aula/${formData.cursoId}`), 1500)
      }
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
    if (list.length > 1) {
      list.splice(index, 1)
      setFormData({ ...formData, [field]: list })
    }
  }

  const updateItem = (field, index, value) => {
    const list = [...formData[field]]
    list[index] = value
    setFormData({ ...formData, [field]: list })
  }

  const handleRefine = async (field, index, mode) => {
    const original = formData[field][index]
    if (!original) return
    
    setRefiningIdx({ field, index })
    try {
      const refined = await refineContent(original, mode)
      updateItem(field, index, refined)
      setToast({ message: `Contenido refinado: ${mode}`, type: 'success' })
    } finally {
      setRefiningIdx(null)
    }
  }

  return (
    <div className="min-h-screen pb-32 max-w-[1400px] mx-auto px-6 animate-in fade-in duration-700">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── premium global gradient ── */}
      <div className="fixed inset-0 bg-gradient-to-tr from-primary-950/20 via-transparent to-violet-950/10 pointer-events-none -z-10" />

      {/* ── NOTION STYLE HEADER ── */}
      <div className="sticky top-0 z-50 bg-surface/40 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 -mx-6 px-6 py-5 mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <button 
             onClick={() => navigate(-1)} 
             className="text-gray-500 hover:text-primary-500 transition-colors p-2 hover:bg-primary-500/5 rounded-lg"
           >
             <ArrowLeft size={22} />
           </button>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                 <FileText size={20} />
              </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 leading-none mb-1">Editor de Planificación</span>
                  <h1 className="text-xl font-black italic tracking-tight leading-none">
                     {formData.titulo || 'Nueva Planificación'}
                  </h1>
               </div>
           </div>
        </div>

        <div className="flex items-center gap-8">
           {/* Autosave Status Indicator */}
           <div className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all">
               {saveStatus === 'saving' && (
                  <span className="text-primary-500 flex items-center gap-2">
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
                 onClick={handleSmartFill}
                 disabled={isSmartFilling}
                 className={`btn-secondary py-2.5 px-4 text-[10px] flex items-center gap-2 border-primary-500/20 text-primary-600 dark:text-primary-400 hover:border-primary-500/50 group ${isSmartFilling ? 'animate-pulse' : ''}`}
               >
                 <Bot size={16} className={`${isSmartFilling ? 'animate-spin' : 'group-hover:scale-110'} transition-all`} /> 
                 {isSmartFilling ? (
                    aiStatus === 'analyzing' ? 'Analizando...' :
                    aiStatus === 'connecting' ? 'Conectando...' :
                    'Sintetizando...'
                 ) : 'Smart Fill IA'}
               </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary py-2.5 px-6 text-[10px] flex items-center gap-2 shadow-indigo-900/20 transition-all active:scale-95"
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
               <div className="flex items-center gap-4 text-gray-400 dark:text-gray-700 group-hover:text-primary-500 transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Propiedades Generales</span>
                  <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/5" />
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-600 block">Título de la Unidad</label>
                    <input 
                       className="w-full bg-transparent border-none p-0 text-3xl font-black placeholder:text-gray-600 dark:placeholder:text-gray-400 outline-none focus:ring-0 italic"
                       style={{ color: 'rgb(var(--color-text))' }}
                       value={formData.titulo}
                       onChange={e => setFormData({...formData, titulo: e.target.value})}
                       placeholder="ESCRIBE EL TÍTULO AQUÍ..."
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-600 block">Materia o Área</label>
                    <input 
                       className="w-full bg-transparent border-none p-0 text-3xl font-black text-indigo-600 dark:text-indigo-400 placeholder:text-gray-800 dark:placeholder:text-gray-700 outline-none focus:ring-0 italic"
                       value={formData.materia}
                       onChange={e => setFormData({...formData, materia: e.target.value})}
                       placeholder="EJ: MATEMÁTICA"
                    />
                 </div>
                 
                 <div className="flex items-center gap-6 pt-4">
                    <div className="flex-1 space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-600">Asignar a Aula</label>
                       <select 
                         className="w-full bg-surface-subtle border border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary-500/40"
                         style={{ color: 'rgb(var(--color-text))' }}
                         value={formData.cursoId}
                         onChange={e => setFormData({...formData, cursoId: e.target.value})}
                       >
                         <option value="">Seleccionar Aula</option>
                         {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                       </select>
                    </div>
                    <div className="flex-1 space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-600">Tipo de Plan</label>
                       <select 
                        className="w-full bg-surface-subtle border border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary-500/40"
                        style={{ color: 'rgb(var(--color-text))' }}
                        value={formData.tipo}
                        onChange={e => setFormData({...formData, tipo: e.target.value})}
                       >
                          <option value="Diaria">Diaria / Secuencia</option>
                          <option value="Semanal">Semanal</option>
                          <option value="Mensual">Mensual / Unidad</option>
                          <option value="Anual">Proyecto ABP</option>
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
                                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/40 shadow-sm' 
                                : 'bg-surface-subtle text-gray-500 border-black/5 dark:border-white/5 hover:border-black/10'
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
                          className="w-10 h-10 bg-white/5 hover:bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-500 transition-all border border-white/5 hover:border-indigo-500/40"
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
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex gap-6 group items-start"
                             >
                                 <span className="pt-4 text-[11px] font-black text-primary-500/50">{(i+1).toString().padStart(2, '0')}</span>
                                 <input 
                                    className="flex-1 bg-surface-subtle border border-black/5 dark:border-white/5 group-hover:border-black/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-primary-500/40 transition-all font-medium focus:bg-surface-muted shadow-sm"
                                    style={{ color: 'rgb(var(--color-text))' }}
                                    value={obj}
                                    onChange={e => updateItem('objetivos', i, e.target.value)}
                                    placeholder="Define un objetivo claro..."
                                 />
                                 <button type="button" onClick={() => removeItem('objetivos', i)} className="pt-4 text-gray-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 size={16} />
                                 </button>
                                 <div className="flex flex-col gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => handleRefine('objetivos', i, 'simplify')} title="Simplificar" className="p-1 hover:text-primary-500"><Zap size={14} /></button>
                                    <button onClick={() => handleRefine('objetivos', i, 'inclusion')} title="Hacer Inclusivo" className="p-1 hover:text-primary-500"><Users size={14} /></button>
                                 </div>
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
                          className="w-10 h-10 bg-white/5 hover:bg-violet-600/20 rounded-xl flex items-center justify-center text-violet-500 transition-all border border-white/5 hover:border-violet-500/40"
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
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex gap-6 group items-start"
                             >
                                 <span className="pt-4 text-[11px] font-black text-violet-600/50">{(i+1).toString().padStart(2, '0')}</span>
                                 <textarea 
                                    className="flex-1 bg-surface-subtle border border-black/5 dark:border-white/5 group-hover:border-black/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-violet-500/40 transition-all font-medium resize-none min-h-[80px] focus:bg-surface-muted shadow-sm"
                                    style={{ color: 'rgb(var(--color-text))' }}
                                    value={act}
                                    onChange={e => updateItem('actividades', i, e.target.value)}
                                    placeholder="Describe la actividad..."
                                 />
                                 <button type="button" onClick={() => removeItem('actividades', i)} className="pt-4 text-gray-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 size={16} />
                                 </button>
                                 <div className="flex flex-col gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => handleRefine('actividades', i, 'gamify')} title="Gamificar" className="p-1 hover:text-violet-500"><Sparkles size={14} /></button>
                                    <button onClick={() => handleRefine('actividades', i, 'inclusion')} title="Hacer Inclusiva" className="p-1 hover:text-violet-500"><Users size={14} /></button>
                                 </div>
                              </motion.div>
                          ))}
                       </AnimatePresence>
                    </div>
                 </section>
              </div>
           </LayoutGroup>

            <section className="space-y-8 pt-10">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 dark:text-gray-700">03. Criterios de Evaluación</span>
               <textarea 
                  className="w-full bg-surface-subtle border border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 text-xs outline-none focus:border-primary-500/40 transition-all font-medium min-h-[160px] resize-none leading-relaxed focus:bg-surface-muted shadow-sm"
                 style={{ color: 'rgb(var(--color-text))' }}
                 value={formData.evaluacion}
                 onChange={e => setFormData({...formData, evaluacion: e.target.value})}
                 placeholder="Escribe aquí los criterios para evaluar esta unidad..."
              />
           </section>
        </div>

        {/* ── STABLE PREVIEW SIDEBAR ── */}
        <div className="lg:col-span-4 lg:block hidden">
           <div className="sticky top-32 space-y-10">
               <div className="bg-gradient-to-br from-primary-600/10 to-violet-600/10 border border-primary-500/10 p-10 rounded-[3rem] relative overflow-hidden group shadow-xl">
                  <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                     <BrainCircuit size={180} />
                  </div>
                 <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-3">
                        <Sparkles size={18} className="text-primary-600 dark:text-primary-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">DocenTico Insight</h4>
                     </div>
                     <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic font-medium">
                        &quot;Notamos que las secuencias didácticas con una duración de 10-15 días obtienen mejores tasas de cierre completo en {formData.materia || 'esta materia'}.&quot;
                     </p>
                     <div className="pt-2">
                        <button onClick={() => setFormData({...formData, tipo: 'Quincenal'})} className="text-[9px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-400 transition-colors underline underline-offset-4 decoration-primary-500/30">
                           Aplicar sugerencia
                        </button>
                     </div>
                 </div>
              </div>

               {/* Document Mockup (REAL TIME PREVIEW) */}
               <div className="bg-surface-subtle border border-black/5 dark:border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col min-h-[650px] group/doc">
                  <div className="bg-surface-muted/50 dark:bg-white/5 p-8 space-y-4 border-b border-black/5 dark:border-white/5">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Vista Previa Real</span>
                       <div className="flex gap-1.5 opacity-30">
                          {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/20" />)}
                       </div>
                    </div>
                    <h3 className="line-clamp-2 text-xl font-black italic uppercase tracking-tighter">
                        {formData.titulo || 'Sin título'}
                    </h3>
                     <div className="flex gap-2">
                        <span className="px-2 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[8px] font-black uppercase border border-primary-500/20 rounded">
                            {formData.materia || 'Materia General'}
                        </span>
                        <span className="px-2 py-1 bg-surface-muted/50 dark:bg-white/5 text-gray-500 text-[8px] font-black uppercase border border-black/5 dark:border-white/10 rounded">
                            {formData.tipo || 'Secuencia'}
                        </span>
                     </div>
                  </div>

                  <div className="p-10 flex-1 space-y-10 overflow-y-auto custom-scrollbar max-h-[400px]">
                     {/* Objetivos Preview */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-1 h-3 bg-primary-500 rounded-full" />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-white/40">Objetivos</span>
                        </div>
                       <div className="space-y-3">
                          {formData.objetivos.filter(o => o.trim()).length > 0 ? (
                             formData.objetivos.filter(o => o.trim()).map((obj, i) => (
                                 <div key={i} className="flex gap-3 items-start animate-in slide-in-from-left-2 duration-300">
                                    <div className="w-1 h-1 rounded-full bg-primary-500/40 mt-1.5" />
                                    <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-normal font-medium">{obj}</p>
                                 </div>
                             ))
                          ) : (
                             <div className="space-y-2 opacity-10">
                                <div className="h-1.5 w-full bg-white/10 rounded-full" />
                                <div className="h-1.5 w-4/5 bg-white/10 rounded-full" />
                             </div>
                          )}
                       </div>
                     </div>

                     {/* Actividades Preview */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-1 h-3 bg-violet-500 rounded-full" />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-white/40">Secuencia</span>
                        </div>
                       <div className="space-y-3">
                          {formData.actividades.filter(a => a.trim()).length > 0 ? (
                             formData.actividades.filter(a => a.trim()).map((act, i) => (
                                 <div key={i} className="bg-surface-subtle dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4 rounded-xl animate-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-normal font-medium">{act}</p>
                                 </div>
                             ))
                          ) : (
                             <div className="space-y-2 opacity-10">
                                <div className="h-1.5 w-full bg-white/10 rounded-full" />
                                <div className="h-1.5 w-full bg-white/10 rounded-full" />
                             </div>
                          )}
                       </div>
                     </div>
                  </div>

                  <div className="p-8 bg-surface-muted/50 dark:bg-white/5 border-t border-black/5 dark:border-white/5 flex gap-4">
                     <button 
                         onClick={handleDownloadPDF}
                         className="flex-1 p-4 bg-surface-subtle dark:bg-white/5 hover:bg-primary-500/10 rounded-2xl flex items-center justify-center text-gray-500 hover:text-primary-500 transition-all border border-black/5 dark:border-white/5 shadow-inner"
                     >
                        <Download size={18} />
                     </button>
                     <button 
                         onClick={handleShare}
                         className="flex-[2] p-4 bg-surface-subtle dark:bg-white/5 hover:bg-primary-500/10 rounded-2xl flex items-center justify-center text-gray-500 hover:text-primary-500 text-[9px] font-black uppercase border border-black/5 dark:border-white/5 shadow-inner"
                     >
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
