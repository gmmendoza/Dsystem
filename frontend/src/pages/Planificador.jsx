import { useState, useEffect } from 'react'
import { 
  Save, Eye, FileUp, Sparkles, Layout, 
  ChevronRight, Calendar, BookOpen, Clock, 
  Trash2, Plus, GripVertical, Settings, 
  Type, Video, Image as ImageIcon, Link2
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { planificacionAPI, cursoAPI } from '../services/api'
import { PLANNING_TEMPLATES } from '../constants/templates'
import PreviewModal from '../components/Modals/PreviewModal'
import { MultimediaBlock, AddBlockButton } from '../components/Editor/EditorBlocks'

export default function Planificador() {
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  
  const [currentStep, setCurrentStep] = useState(1)
  const [title, setTitle] = useState('')
  const [cursoId, setCursoId] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [sections, setSections] = useState([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)

  useEffect(() => {
    fetchCursos()
    if (editId) {
       loadPlan(editId)
    }
  }, [editId])

  const fetchCursos = async () => {
    const res = await cursoAPI.getAll()
    setCursos(res.data)
  }

  const loadPlan = async (id) => {
    setLoading(true)
    try {
      const res = await planificacionAPI.getById(id)
      const plan = res.data
      setEditingPlan(plan)
      setTitle(plan.titulo)
      setCursoId(plan.cursoId)
      setFechaInicio(plan.fechaInicio)
      setFechaFin(plan.fechaFin)
      setSections(plan.secciones || [])
      setCurrentStep(2) // Ir directo al editor
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTemplate = (templateId) => {
    const template = PLANNING_TEMPLATES.find(t => t.id === templateId)
    setSections(template.sections.map((s, idx) => ({
      id: Date.now() + idx,
      label: s.label,
      value: { text: '' },
      type: 'text'
    })))
    setCurrentStep(2)
  }

  const handleUpdateSection = (id, newValue) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, value: newValue } : s))
  }

  const handleAddBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      label: type === 'media' ? 'Recurso Multimedia' : 'Nuevo Bloque de Texto',
      value: type === 'media' ? { url: '', type: 'video' } : { text: '' },
      type
    }
    setSections([...sections, newBlock])
  }

  const handleRemoveBlock = (id) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const handleSave = async () => {
    if (!title || !cursoId) return alert('Por favor completa título y curso')
    
    const payload = {
      titulo: title,
      cursoId: parseInt(cursoId),
      fechaInicio,
      fechaFin,
      secciones: sections,
      lastModified: new Date().toISOString(),
      estado: editingPlan?.estado || 'Activa',
      observaciones: editingPlan?.observaciones || ''
    }

    try {
      if (editingPlan) {
        await planificacionAPI.update(editingPlan.id, payload)
      } else {
        await planificacionAPI.create(payload)
      }
      alert('Planificación guardada con éxito')
    } catch (err) {
      alert('Error al guardar')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* Header Interactivo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
         <div className="space-y-2">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white flex items-center gap-4">
               <Sparkles className="text-primary-500" size={40} />
               Planificador <span className="text-primary-500">Pro</span>
            </h2>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-600">
               {currentStep === 1 ? 'Selecciona una estructura base para comenzar' : 'Editando planificación dinámica'}
            </p>
         </div>

         <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all flex items-center gap-2"
            >
               <Eye size={16} /> Vista Previa
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-900/20 flex items-center gap-2"
            >
               <Save size={16} /> Guardar Cambios
            </button>
         </div>
      </div>

      {currentStep === 1 ? (
        /* PASO 1: SELECCIÓN DE PLANTILLA */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {PLANNING_TEMPLATES.map((template) => (
             <button 
               key={template.id}
               onClick={() => handleSelectTemplate(template.id)}
               className="group relative flex flex-col text-left bg-[#0A0A0A] border border-white/5 hover:border-primary-500/30 rounded-[2.5rem] p-8 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/10 overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                   <Layout size={80} />
                </div>
                <div className="w-14 h-14 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-500 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
                   <template.icon size={28} />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">{template.name}</h3>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed mb-6">{template.description}</p>
                <div className="mt-auto flex items-center gap-2 text-primary-500 text-[10px] font-black uppercase tracking-widest">
                   Empezar ahora <ChevronRight size={14} />
                </div>
             </button>
           ))}
        </div>
      ) : (
        /* MODO EDITOR "NOTION-STYLE" */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
           {/* Sidebar del Editor */}
           <div className="xl:col-span-4 space-y-8">
              <div className="card bg-[#0A0A0A] border-white/5 p-8 space-y-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Título del Proyecto</label>
                     <input 
                       type="text"
                       className="w-full bg-transparent text-2xl font-black uppercase italic tracking-tighter text-white outline-none border-b border-white/5 focus:border-primary-500 transition-all pb-2"
                       placeholder="Ej: Unidad 1: El Universo"
                       value={title}
                       onChange={(e) => setTitle(e.target.value)}
                     />
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Curso Vinculado</label>
                        <select 
                          value={cursoId}
                          onChange={(e) => setCursoId(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-black uppercase outline-none focus:border-primary-500 text-gray-300"
                        >
                          <option value="">Seleccionar curso...</option>
                          {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.nivel})</option>)}
                        </select>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Fecha Inicio</label>
                           <input 
                             type="date" 
                             className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-[10px] font-bold outline-none focus:border-primary-500"
                             value={fechaInicio}
                             onChange={(e) => setFechaInicio(e.target.value)}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Fecha Fin</label>
                           <input 
                             type="date" 
                             className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-[10px] font-bold outline-none focus:border-primary-500"
                             value={fechaFin}
                             onChange={(e) => setFechaFin(e.target.value)}
                           />
                        </div>
                     </div>

                     {/* Agregado: Estado y Observaciones */}
                     <div className="space-y-2 pt-4 border-t border-white/5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Estado Pedagógico</label>
                        <div className="flex gap-2">
                           {['Activa', 'En progreso', 'Finalizada'].map(st => (
                             <button
                               key={st}
                               type="button"
                               onClick={() => setEditingPlan(prev => ({ ...prev, estado: st }))}
                               className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                                 (editingPlan?.estado || 'Activa') === st 
                                 ? 'bg-primary-600/20 border-primary-500 text-primary-400' 
                                 : 'bg-black border-white/5 text-gray-600 hover:border-white/10'
                               }`}
                             >
                               {st}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Observaciones Académicas</label>
                        <textarea 
                          placeholder="Notas sobre el desempeño del grupo..."
                          className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-primary-500 min-h-[80px] resize-none"
                          value={editingPlan?.observaciones || ''}
                          onChange={(e) => setEditingPlan(prev => ({ ...prev, observaciones: e.target.value }))}
                        />
                     </div>
                  </div>

                  {/* Selector de Plantillas (Mini) */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Cambiar Estructura</label>
                     <div className="grid grid-cols-2 gap-2">
                        {PLANNING_TEMPLATES.map(t => (
                          <button 
                            key={t.id}
                            onClick={() => handleSelectTemplate(t.id)}
                            className="bg-black border border-white/5 hover:border-primary-500/50 p-4 rounded-xl text-left transition-all group"
                          >
                             <t.icon size={16} className="text-gray-600 group-hover:text-primary-500 mb-2" />
                             <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">{t.name}</p>
                          </button>
                        ))}
                     </div>
                  </div>
              </div>

              {/* Tips de AI */}
              <div className="p-6 bg-primary-600/10 border border-primary-500/20 rounded-[2rem] flex items-start gap-4">
                 <Sparkles className="text-primary-500 shrink-0" size={20} />
                 <p className="text-[10px] font-bold text-primary-200 leading-relaxed italic uppercase">
                    Carga un video de YouTube para que el sistema genere automáticamente actividades sugeridas basadas en el transcrito.
                 </p>
              </div>
           </div>

           {/* Área Central: El Editor "Canvas" */}
           <div className="xl:col-span-8 space-y-6">
              <div className="card bg-[#050505] border-white/5 min-h-[600px] rounded-[3rem] p-12 relative">
                 <div className="max-w-3xl mx-auto space-y-12">
                   {sections.map((section, index) => (
                     <div key={section.id} className="group relative">
                        <div className="absolute -left-12 top-0 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button className="p-2 hover:bg-white/5 rounded-lg text-gray-700 hover:text-white cursor-grab">
                              <GripVertical size={16} />
                           </button>
                           <button 
                             onClick={() => handleRemoveBlock(section.id)}
                             className="p-2 hover:bg-red-500/10 rounded-lg text-gray-700 hover:text-red-500"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>

                        {section.type === 'media' ? (
                          <MultimediaBlock 
                            id={section.id}
                            label={section.label}
                            value={section.value}
                            onChange={(val) => handleUpdateSection(section.id, val)}
                          />
                        ) : (
                          <div className="space-y-4">
                            <input 
                              type="text"
                              className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 bg-transparent border-none outline-none focus:text-primary-500 transition-colors"
                              value={section.label}
                              onChange={(e) => {
                                 const newSections = [...sections]
                                 newSections[index].label = e.target.value
                                 setSections(newSections)
                              }}
                            />
                            <textarea
                              className="w-full bg-transparent text-gray-300 text-lg leading-relaxed placeholder:text-white/5 border-none outline-none resize-none min-h-[50px]"
                              placeholder="Presiona para escribir..."
                              value={section.value?.text || ''}
                              onChange={(e) => handleUpdateSection(section.id, { text: e.target.value })}
                              onInput={(e) => {
                                 e.target.style.height = 'auto'
                                 e.target.style.height = e.target.scrollHeight + 'px'
                              }}
                            />
                          </div>
                        )}
                     </div>
                   ))}

                   <AddBlockButton onAdd={handleAddBlock} />
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Modal de Vista Previa */}
      <PreviewModal 
         isOpen={isPreviewOpen} 
         onClose={() => setIsPreviewOpen(false)} 
         data={{ titulo: title, fechaInicio, fechaFin, secciones: sections, observaciones: editingPlan?.observaciones }}
         cursoName={cursos.find(c => c.id == cursoId)?.nombre || 'Curso no seleccionado'}
      />
    </div>
  )
}
