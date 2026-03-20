import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  ChevronDown
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

  useEffect(() => {
    fetchCursos()
    const editId = searchParams.get('edit')
    const cursoIdParam = searchParams.get('cursoId')
    const suggested = searchParams.get('suggested')

    if (editId) loadPlan(editId)
    if (cursoIdParam) setFormData(prev => ({ ...prev, cursoId: cursoIdParam }))
    
    // AI Suggestion handling
    if (suggested === 'refuerzo-geometria') {
       handleSmartFill('geometría')
    }
  }, [searchParams])

  const fetchCursos = async () => {
    const res = await cursoAPI.getAll()
    setCursos(res.data)
  }

  const loadPlan = async (id) => {
    try {
      const res = await planificacionAPI.getById(id)
      setFormData(res.data)
    } catch (err) {
      setToast({ message: 'Error al cargar planificación', type: 'error' })
    }
  }

  const handleSmartFill = async (topic = 'general') => {
    setIsSmartFilling(true)
    setToast({ message: 'DocenTico está redactando tu propuesta...', type: 'info' })
    
    await new Promise(r => setTimeout(r, 2500))
    
    const aiProposal = {
        titulo: topic === 'geometría' ? "Refuerzo: Geometría del Espacio y Cuerpos" : "Nueva Unidad: " + (formData.materia || "Contenido Curricular"),
        objetivos: [
            "Identificar propiedades de cuerpos geométricos",
            "Relacionar figuras planas con volúmenes",
            "Resolver situaciones problemáticas espaciales"
        ],
        actividades: [
            "Reconocimiento de figuras en el entorno real",
            "Construcción de poliedros con materiales reciclados",
            "Uso de simulador 3D para rotación de cuerpos"
        ],
        evaluacion: "Rúbrica de observación directa y resolución de cuestionario visual.",
        materia: formData.materia || "Matemática"
    }

    setFormData(prev => ({
        ...prev,
        ...aiProposal
    }))
    
    setIsSmartFilling(false)
    setToast({ message: '¡Planificación generada con éxito!', type: 'success' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.titulo || !formData.materia || !formData.cursoId) {
      setToast({ message: 'Completa los campos obligatorios (*)', type: 'error' })
      return
    }

    setLoading(true)
    try {
      await planificacionAPI.save(formData)
      setToast({ message: 'Planificación guardada con éxito', type: 'success' })
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
    <div className="flex flex-col xl:flex-row gap-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Editor Form ── */}
      <div className="flex-1 space-y-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button 
                  onClick={() => navigate(-1)} 
                  className="p-3 bg-surface-subtle hover:bg-surface-muted rounded-2xl border border-white/5 text-gray-400 hover:text-white transition-all flex-shrink-0 group"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary-500">Planificador Editor</span>
                      <div className="w-1 h-1 rounded-full bg-gray-800" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">v2.0 Beta</span>
                   </div>
                   <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                     {searchParams.get('edit') ? 'Editar' : 'Nuevo'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-500">Documento</span>
                   </h2>
                </div>
            </div>

            <button 
              onClick={() => handleSmartFill()}
              disabled={isSmartFilling}
              className={`p-4 rounded-2xl border flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all shadow-xl ${
                isSmartFilling 
                ? 'bg-primary-600 animate-pulse text-white border-primary-500' 
                : 'bg-primary-600/10 hover:bg-primary-600 text-primary-400 hover:text-white border-primary-500/30'
              }`}
            >
              {isSmartFilling ? <BrainCircuit size={18} /> : <Wand2 size={18} />}
              {isSmartFilling ? 'DocenTico escribe...' : 'Smart Fill IA'}
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Main Info Card */}
          <div className="card bg-surface-subtle/50 border-white/5 space-y-8 p-10 rounded-[3rem]">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                 <label className="label">Título de la Secuencia *</label>
                 <input 
                   className="input-field" 
                   value={formData.titulo}
                   onChange={e => setFormData({...formData, titulo: e.target.value})}
                   placeholder="Ej: Exploración Geométrica"
                 />
               </div>
               <div className="space-y-3">
                 <label className="label">Materia / Área *</label>
                 <input 
                   className="input-field" 
                   value={formData.materia}
                   onChange={e => setFormData({...formData, materia: e.target.value})}
                   placeholder="Ej: Matemática"
                 />
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-3">
                 <label className="label">Clase / Workspace *</label>
                 <select 
                   className="input-field"
                   value={formData.cursoId}
                   onChange={e => setFormData({...formData, cursoId: e.target.value})}
                 >
                   <option value="">Seleccionar Aula</option>
                   {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                 </select>
               </div>
               <div className="space-y-3">
                 <label className="label">Periodicidad</label>
                 <select 
                   className="input-field"
                   value={formData.tipo}
                   onChange={e => setFormData({...formData, tipo: e.target.value})}
                 >
                   <option>Diaria</option>
                   <option>Semanal</option>
                   <option>Mensual</option>
                 </select>
               </div>
               <div className="space-y-3">
                 <label className="label">Estado del Plan</label>
                 <div className="flex gap-2">
                    {['En progreso', 'Activa', 'Finalizada'].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormData({...formData, estado: st})}
                        className={`flex-1 py-3 px-1 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${
                          formData.estado === st 
                          ? 'bg-primary-600/20 text-primary-400 border-primary-500/40' 
                          : 'bg-white/5 text-gray-600 border-transparent hover:border-white/5'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                 </div>
               </div>
             </div>
          </div>

          {/* Dinamic Lists (Objetivos & Actividades) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="card bg-surface-subtle/30 border-white/5 p-10 rounded-[3rem] space-y-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-500 flex items-center gap-3">
                      <Target className="w-4 h-4 text-primary-400" /> Objetivos
                   </h3>
                   <button type="button" onClick={() => addItem('objetivos')} className="p-2 bg-primary-600/10 hover:bg-primary-600 text-primary-400 hover:text-white rounded-lg transition-all border border-primary-500/20">
                      <Plus size={16} />
                   </button>
                </div>
                <div className="space-y-4">
                  {formData.objetivos.map((obj, i) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="flex gap-3 group">
                       <input 
                         className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-gray-300 outline-none focus:border-primary-500/40 transition-all"
                         value={obj}
                         onChange={e => updateItem('objetivos', i, e.target.value)}
                         placeholder={`Objetivo ${i+1}`}
                       />
                       <button type="button" onClick={() => removeItem('objetivos', i)} className="p-3 text-gray-800 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </motion.div>
                  ))}
                </div>
             </div>

             <div className="card bg-surface-subtle/30 border-white/5 p-10 rounded-[3rem] space-y-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-violet-500 flex items-center gap-3">
                      <Layers className="w-4 h-4 text-violet-400" /> Secuencia Didáctica
                   </h3>
                   <button type="button" onClick={() => addItem('actividades')} className="p-2 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white rounded-lg transition-all border border-violet-500/20">
                      <Plus size={16} />
                   </button>
                </div>
                <div className="space-y-4">
                  {formData.actividades.map((act, i) => (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} key={i} className="flex gap-3 group">
                       <input 
                         className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-xs text-gray-300 outline-none focus:border-violet-500/40 transition-all"
                         value={act}
                         onChange={e => updateItem('actividades', i, e.target.value)}
                         placeholder={`Actividad ${i+1}`}
                       />
                       <button type="button" onClick={() => removeItem('actividades', i)} className="p-3 text-gray-800 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </motion.div>
                  ))}
                </div>
             </div>
          </div>

          <div className="card bg-surface-subtle/50 border-white/5 p-10 rounded-[3rem] space-y-6">
             <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">Evaluación y Criterios</h3>
             <textarea 
               className="input-field min-h-[120px] resize-none"
               value={formData.evaluacion}
               onChange={e => setFormData({...formData, evaluacion: e.target.value})}
               placeholder="Describe cómo se evaluará el aprendizaje..."
             />
          </div>

          <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
             <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="btn-secondary"
             >
                Descartar Cambios
             </button>
             <button 
                type="submit" 
                disabled={loading}
                className="btn-primary flex items-center gap-3 min-w-[200px] justify-center"
             >
                {loading ? <Clock className="animate-spin" size={20} /> : <Save size={20} />}
                {loading ? 'Sincronizando...' : 'Guardar Plan Final'}
             </button>
          </div>
        </form>
      </div>

      {/* ── Document Preview (Lateral) ── */}
      <div className="hidden xl:block w-96 space-y-8">
         <div className="sticky top-10 space-y-8">
            <div className="card bg-primary-600/5 border border-primary-500/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute -right-6 -bottom-6 text-primary-500/10 group-hover:scale-125 transition-transform duration-1000">
                  <Bot size={150} />
               </div>
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 text-primary-400">
                     <Lightbulb size={20} />
                     <h4 className="text-[10px] font-black uppercase tracking-widest">Tip de DocenTico</h4>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium italic">
                    "Las planificaciones con más de 3 actividades prácticas tienen un 25% más de compromiso estudiantil."
                  </p>
               </div>
            </div>

            <div className="bg-surface-subtle/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
               <div className="p-8 border-b border-white/5 space-y-4 bg-white/[0.02]">
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">Document Preview</span>
                     <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                     </div>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white truncate">{formData.titulo || 'Sin Título'}</h3>
                  <div className="flex flex-wrap gap-2">
                     <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-black uppercase tracking-widest text-gray-500 border border-white/5">{formData.materia || 'Materia'}</span>
                     <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-black uppercase tracking-widest text-gray-500 border border-white/5">{formData.tipo}</span>
                  </div>
               </div>
               
               <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-8">
                  <div className="space-y-4">
                     <h5 className="text-[9px] font-black uppercase tracking-widest text-primary-500 flex items-center gap-2">
                        <Zap size={12} /> Objetivos del Curso
                     </h5>
                     <div className="space-y-3">
                        {formData.objetivos.map((obj, i) => obj && (
                          <div key={i} className="flex gap-3 text-xs text-gray-400 group">
                             <span className="text-primary-600 font-black shrink-0">0{i+1}</span>
                             <p className="leading-relaxed">{obj}</p>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h5 className="text-[9px] font-black uppercase tracking-widest text-violet-500 flex items-center gap-2">
                        <Layers size={12} /> Hoja de Ruta
                     </h5>
                     <div className="space-y-3">
                        {formData.actividades.map((act, i) => act && (
                          <div key={i} className="flex gap-3 text-xs text-gray-400 border-l-2 border-white/5 pl-4 hover:border-violet-500/30 transition-all">
                             <p className="leading-relaxed">{act}</p>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-black/40 border-t border-white/5 flex gap-3">
                   <button onClick={() => setToast({ message: 'Exportando PDF...', type: 'info' })} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white rounded-xl transition-all border border-white/5">
                      <Download size={14} /> PDF
                   </button>
                   <button onClick={() => setToast({ message: 'Preparando link compartido...', type: 'info' })} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white rounded-xl transition-all border border-white/5">
                      <Share2 size={14} /> Link
                   </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function Target({ className }) { return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
