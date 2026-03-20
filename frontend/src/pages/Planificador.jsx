import { useState, useEffect, useRef } from 'react'
import { 
  Save, Eye, FileUp, Sparkles, Layout, 
  ChevronRight, Calendar, BookOpen, Clock, 
  Trash2, Plus, GripVertical, Settings, 
  Type, Video, Image as ImageIcon, Link2,
  CheckCircle, Globe, Zap, History, Loader2,
  X, ChevronLeft, Layers
} from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { planificacionAPI, cursoAPI } from '../services/api'
import PreviewModal from '../components/Modals/PreviewModal'
import ActivityList from '../components/Editor/ActivityList'
import SuggestionBox from '../components/Editor/SuggestionBox'
import { MultimediaBlock } from '../components/Editor/EditorBlocks'

// Datos de ejemplo para el sistema
const examplePlanning = {
  title: "Funciones lineales",
  subject: "Matemática",
  level: "Primaria",
  type: "Diaria",
  objectives: ["Comprender el concepto de pendiente", "Interpretar gráficos"],
  activities: ["Explicación teórica inicial", "Resolución de ejercicios en el pizarrón", "Trabajo grupal de refuerzo"],
  resources: [
    { type: "image", url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800", title: "Gráfico de Funciones" },
    { type: "video", url: "https://www.youtube.com/watch?v=kYbe_2xVezM", title: "Explicación Pendiente" }
  ],
  evaluation: "Resolución de problemas prácticos y revisión de carpetas.",
  date: "2026-03-20"
};

export default function Planificador() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const editId = searchParams.get('edit')
  
  // Estados de Configuración
  const [level, setLevel] = useState('Primaria') // Primaria | Inicial
  const [type, setType] = useState('Diaria') // Diaria | Semanal
  
  // Estados de Contenido
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [cursoId, setCursoId] = useState('')
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0])
  const [fechaFin, setFechaFin] = useState('')
  const [objectives, setObjectives] = useState([])
  const [activities, setActivities] = useState([])
  const [weeklyActivities, setWeeklyActivities] = useState({
    Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: []
  })
  const [resources, setResources] = useState([])
  const [evaluation, setEvaluation] = useState('')
  
  // UI States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [historicalPlans, setHistoricalPlans] = useState([])
  const [aulaRecursos, setAulaRecursos] = useState([])

  useEffect(() => {
    const cid = searchParams.get('cursoId')
    fetchCursos()
    fetchHistory()
    if (editId) {
       loadPlan(editId)
    } else if (cid) {
       setCursoId(cid)
       // Buscamos el curso para setear el nivel automáticamente
       const c = cursos.find(curr => curr.id === Number(cid))
       if (c) setLevel(c.nivel)
    } else {
       loadExample()
    }
  }, [editId, searchParams, cursos.length])

  // Simulación de auto-guardado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || activities.length > 0) {
        setAutoSaving(true)
        setTimeout(() => setAutoSaving(false), 2000)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [title, activities, objectives, resources, evaluation])

  const fetchCursos = async () => {
    const res = await cursoAPI.getAll()
    setCursos(res.data)
    
    // Si tenemos cursoId, cargar sus recursos
    const cid = searchParams.get('cursoId') || cursoId
    if (cid) {
       const c = res.data.find(curr => curr.id === Number(cid))
       if (c) setAulaRecursos(c.recursos || [])
    }
  }

  const fetchHistory = async () => {
    const res = await planificacionAPI.getAll()
    setHistoricalPlans(res.data.slice(0, 5)) // Solo los últimos 5
  }

  const loadExample = () => {
    setTitle(examplePlanning.title)
    setSubject(examplePlanning.subject)
    setLevel(examplePlanning.level)
    setType(examplePlanning.type)
    setObjectives(examplePlanning.objectives)
    setActivities(examplePlanning.activities)
    setResources(examplePlanning.resources)
    setEvaluation(examplePlanning.evaluation)
  }

  const loadPlan = async (id) => {
    setLoading(true)
    try {
      const res = await planificacionAPI.getById(id)
      const p = res.data
      setTitle(p.titulo)
      setCursoId(p.cursoId)
      setFechaInicio(p.fechaInicio)
      setFechaFin(p.fechaFin)
      setSubject(p.materia || '')
      setLevel(p.nivel || 'Primaria')
      setType(p.tipo || 'Diaria')
      setObjectives(p.objetivos || [])
      setActivities(p.actividades || [])
      setResources(p.recursos || [])
      setEvaluation(p.evaluacion || '')
      if (p.semanal) setWeeklyActivities(p.semanal)
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = (plan) => {
    setTitle(`${plan.titulo} (Copia)`)
    setSubject(plan.materia || '')
    setObjectives(plan.objetivos || [])
    setActivities(plan.actividades || [])
    setResources(plan.recursos || [])
    setIsHistoryOpen(false)
  }

  const addResource = (resType) => {
    const newRes = { 
      id: Date.now(), 
      type: resType, 
      url: '', 
      title: resType === 'video' ? 'Nuevo Video' : 'Nueva Imagen' 
    }
    setResources([...resources, newRes])
  }

  const handleSave = async () => {
    if (!title) return alert('Por favor ingresa un título')
    setLoading(true)
    const payload = {
      titulo: title,
      materia: subject,
      cursoId: parseInt(cursoId),
      nivel: level,
      tipo: type,
      fechaInicio,
      fechaFin,
      objetivos: objectives,
      actividades: activities,
      recursos: resources,
      evaluacion: evaluation,
      semanal: type === 'Semanal' ? weeklyActivities : null,
      lastModified: new Date().toISOString()
    }

    try {
      if (editId) await planificacionAPI.update(editId, payload)
      else await planificacionAPI.create(payload)
      alert('¡Planificación guardada con éxito!')
      navigate('/historial')
    } catch (err) {
      alert('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !title) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-primary-500" size={40} /></div>

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* ── HEADER DE ACCIÓN ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sticky top-0 z-30 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/20 rotate-3">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Planificador <span className="text-primary-500">Pro</span></h2>
            <div className="flex items-center gap-3">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full transition-all ${autoSaving ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-600'}`}>
                {autoSaving ? '✔ Guardado automáticamente' : 'Autoguardado activo'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all flex items-center gap-2"
          >
            <History size={16} /> Historial
          </button>
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all flex items-center gap-2"
          >
            <Eye size={16} /> Vista Previa
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-900/40 flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Guardar Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* ── CANVAS CENTRAL ── */}
        <div className="xl:col-span-8 space-y-10">
          
          {/* SELECTORES DE MODO */}
          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 bg-black border border-white/5 p-2 rounded-2xl flex gap-2">
                <button 
                  onClick={() => setLevel('Primaria')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${level === 'Primaria' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-300'}`}
                >
                  Nivel Primario
                </button>
                <button 
                  onClick={() => setLevel('Inicial')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${level === 'Inicial' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-300'}`}
                >
                  Nivel Inicial
                </button>
             </div>
             <div className="flex-1 bg-black border border-white/5 p-2 rounded-2xl flex gap-2">
                <button 
                  onClick={() => setType('Diaria')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'Diaria' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-300'}`}
                >
                  Plan Diario
                </button>
                <button 
                  onClick={() => setType('Semanal')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'Semanal' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-300'}`}
                >
                  Plan Semanal
                </button>
             </div>
          </div>

          {/* CARD: INFORMACIÓN GENERAL */}
          <section className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <div className="flex items-center gap-4 text-primary-500 mb-2">
               <BookOpen size={20} />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Información General</h3>
            </div>
            
            <div className="space-y-6">
              <input 
                type="text"
                placeholder="TÍTULO DE LA PLANIFICACIÓN..."
                className="w-full bg-transparent text-4xl font-black uppercase italic tracking-tighter text-white outline-none border-b-2 border-white/5 focus:border-primary-500 transition-all pb-4 placeholder:text-gray-900"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 px-1">Materia / Área</label>
                  <input 
                    type="text"
                    placeholder="Ej: Matemática, Plástica..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-primary-500 transition-all"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 px-1">Aula / Curso</label>
                  <select 
                    value={cursoId}
                    onChange={(e) => setCursoId(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-2xl p-4 text-sm font-bold text-gray-300 outline-none focus:border-primary-500 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#0F0F0F] text-gray-400">Seleccionar el Aula...</option>
                    {cursos.map(c => <option key={c.id} value={c.id} className="bg-[#0F0F0F] text-white">{c.nombre}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* CARD: OBJETIVOS */}
          <section className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <div className="flex items-center gap-4 text-indigo-500 mb-2">
               <Zap size={20} />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">{level === 'Inicial' ? 'Propósitos Docentes' : 'Objetivos de Aprendizaje'}</h3>
            </div>
            <ActivityList 
              activities={objectives} 
              onChange={setObjectives} 
              label={level === 'Inicial' ? "Propósitos" : "Objetivos específicos"} 
            />
          </section>

          {/* CARD: ACTIVIDADES */}
          {type === 'Diaria' ? (
            <section className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in-95 duration-500">
              <div className="flex items-center gap-4 text-orange-500 mb-2">
                 <Layers size={20} />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">{level === 'Inicial' ? 'Actividades Lúdicas' : 'Secuencia Didáctica'}</h3>
              </div>
              <ActivityList activities={activities} onChange={setActivities} />
            </section>
          ) : (
            /* MODO SEMANAL */
            <section className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 space-y-10 animate-in zoom-in-95 duration-500">
               <div className="flex items-center gap-4 text-orange-500 mb-2">
                 <Calendar size={20} />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Cronograma Semanal</h3>
              </div>
              <div className="space-y-8">
                {Object.keys(weeklyActivities).map(day => (
                  <div key={day} className="space-y-4">
                    <div className="flex items-center gap-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">{day}</h4>
                       <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    <ActivityList 
                      activities={weeklyActivities[day]} 
                      onChange={(newActs) => setWeeklyActivities({...weeklyActivities, [day]: newActs})} 
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CARD: RECURSOS MULTIMEDIA */}
          <section className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 text-violet-500">
                 <Video size={20} />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Recursos Multimedia</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => addResource('image')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-400 transition-all border border-white/5"
                >
                  <ImageIcon size={14} /> + Imagen
                </button>
                <button 
                  onClick={() => addResource('video')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-400 transition-all border border-white/5"
                >
                  <Video size={14} /> + Video
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {resources.map(res => (
                <MultimediaBlock 
                  key={res.id}
                  id={res.id}
                  value={res}
                  onChange={(id, newVal) => setResources(prev => prev.map(r => r.id === id ? {...r, ...newVal} : r))}
                  onRemove={(id) => setResources(prev => prev.filter(r => r.id !== id))}
                />
              ))}
              {resources.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-700">No hay recursos agregados aún</p>
                </div>
              )}
            </div>
          </section>

          {/* CARD: EVALUACIÓN */}
          <section className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 space-y-6">
            <div className="flex items-center gap-4 text-green-500 mb-2">
               <CheckCircle size={20} />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Evaluación / Cierre</h3>
            </div>
            <textarea 
               value={evaluation}
               onChange={(e) => setEvaluation(e.target.value)}
               placeholder="Describa cómo evaluará los conocimientos adquiridos..."
               className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-sm font-medium text-gray-300 outline-none focus:border-green-500 transition-all min-h-[150px] resize-none"
            />
          </section>

        </div>

        {/* ── SIDEBAR DE SOPORTE ── */}
        <aside className="xl:col-span-4 space-y-10">
          
          {/* AI SUGGESTIONS */}
          <SuggestionBox subject={subject} level={level} />

          {/* BANCO DE RECURSOS DEL AULA */}
          {aulaRecursos.length > 0 && (
            <div className="card bg-[#0A0A0A] border-white/5 p-8 space-y-6 rounded-[2rem]">
               <div className="flex items-center gap-3 mb-2">
                  <Globe size={18} className="text-primary-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Banco del Aula</h4>
               </div>
               <div className="grid grid-cols-2 gap-3">
                  {aulaRecursos.map(rec => (
                    <div 
                      key={rec.id} 
                      onClick={() => setResources([...resources, { type: rec.tipo || 'image', url: rec.url, title: rec.titulo }])}
                      className="aspect-square bg-white/5 rounded-xl border border-white/5 hover:border-primary-500/50 transition-all cursor-pointer overflow-hidden group relative"
                    >
                       <img src={rec.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                       <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                          <Plus size={20} className="text-white" />
                       </div>
                    </div>
                  ))}
               </div>
               <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest text-center">Haz clic para añadir a la planificación</p>
            </div>
          )}

          {/* ACCIONES DE CONFIGURACIÓN */}
          <div className="card bg-[#0A0A0A] border-white/5 p-8 space-y-6 rounded-[2rem]">
             <div className="flex items-center gap-3">
                <Settings size={18} className="text-gray-500" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Configuración del Documento</h4>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Habilitar comentarios</span>
                   <div className="w-10 h-5 bg-white/5 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-gray-700 rounded-full" /></div>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Compartir con directivos</span>
                   <div className="w-10 h-5 bg-primary-600/20 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-primary-500 rounded-full" /></div>
                </div>
             </div>
          </div>
        </aside>
      </div>

      {/* DRAWER DE HISTORIAL */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)} />
          <aside className="relative w-full max-w-md bg-[#080808] border-l border-white/10 p-10 shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Planificaciones <span className="text-primary-500">Anteriores</span></h3>
               <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              {historicalPlans.map(plan => (
                <div key={plan.id} className="group bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-primary-500/30 transition-all">
                   <h4 className="text-sm font-black uppercase text-white mb-1">{plan.titulo}</h4>
                   <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">{new Date(plan.fechaInicio).toLocaleDateString()}</p>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => loadPlan(plan.id)}
                       className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                     >
                       Ver Detalles
                     </button>
                     <button 
                       onClick={() => handleDuplicate(plan)}
                       className="px-4 py-3 bg-primary-600/10 hover:bg-primary-600 text-primary-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                     >
                        Duplicar
                     </button>
                   </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* ── MODAL DE VISTA PREVIA ── */}
      <PreviewModal 
         isOpen={isPreviewOpen} 
         onClose={() => setIsPreviewOpen(false)} 
         data={{ 
           titulo: title, 
           materia: subject,
           nivel: level,
           tipo: type,
           objetivos: objectives,
           actividades: activities,
           semanal: weeklyActivities,
           recursos: resources,
           evaluacion: evaluation
         }}
         cursoName={cursos.find(c => c.id == cursoId)?.nombre || 'Curso no seleccionado'}
      />
    </div>
  )
}
