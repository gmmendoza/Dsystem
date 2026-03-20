import { useState, useEffect, useRef } from 'react'
import { planificacionAPI, cursoAPI } from '../services/api'
import { PLANNING_TEMPLATES } from '../constants/templates'
import { 
  ClipboardList, Plus, ArrowLeft, Loader2, 
  FileText, Search, Trash2, LayoutGrid, 
  ArrowRight, CheckCircle2, Cloud, Eye, 
  ChevronDown, Sparkles
} from 'lucide-react'
import { FormSkeleton, CardSkeleton } from '../components/Common/LoadingSkeleton'
import { Toast } from '../components/Common/Toast'
import { EditorBlock, AddBlockButton } from '../components/Editor/EditorBlocks'
import PreviewModal from '../components/Modals/PreviewModal'

export default function Planificador() {
  const [plans, setPlans] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [title, setTitle] = useState('')
  const [cursoId, setCursoId] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [sections, setSections] = useState([])
  const [toast, setToast] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved') // 'saved', 'saving', 'error'

  const fetchData = async () => {
    setLoading(true)
    try {
      const [{ data: pData }, { data: cData }] = await Promise.all([
        planificacionAPI.getAll(),
        cursoAPI.getAll()
      ])
      setPlans(pData)
      setCursos(cData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Simulación de auto-guardado
  useEffect(() => {
    if (editingPlan || currentTemplate) {
      const timer = setTimeout(() => {
        if (title.length > 3) setAutoSaveStatus('saved')
      }, 2000)
      return () => {
        setAutoSaveStatus('saving')
        clearTimeout(timer)
      }
    }
  }, [title, sections, cursoId])

  const handleSelectTemplate = (template) => {
    setCurrentTemplate(template)
    setSections(template.secciones.map(s => ({ ...s, value: '' })))
    setTitle('')
    setCursoId('')
    setEditingPlan(null)
  }

  const handleBlockChange = (id, value) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, value } : s))
  }

  const handleRemoveBlock = (id) => {
    setSections(prev => prev.filter(s => s.id !== id))
  }

  const handleAddCustomBlock = () => {
    const newBlock = { 
      id: `custom-${Date.now()}`, 
      label: 'Bloque Personalizado', 
      placeholder: 'Escribe aquí...', 
      value: '' 
    }
    setSections([...sections, newBlock])
  }

  const handleSave = async () => {
    if (!title || !cursoId) {
      setToast({ message: 'Título y Curso son obligatorios', type: 'error' })
      return
    }
    setSaving(true)
    try {
      const data = { 
        titulo: title, 
        cursoId, 
        fechaInicio, 
        fechaFin, 
        secciones: sections,
        lastModified: new Date().toISOString()
      }
      
      if (editingPlan) {
        await planificacionAPI.update(editingPlan.id, data)
        setToast({ message: 'Planificación actualizada', type: 'success' })
      } else {
        await planificacionAPI.create(data)
        setToast({ message: 'Nueva planificación guardada', type: 'success' })
      }
      resetForm()
      fetchData()
    } catch (err) {
      setToast({ message: 'Error al guardar', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (p) => {
    setEditingPlan(p)
    setCurrentTemplate(true) // Activa la vista de editor
    setTitle(p.titulo)
    setCursoId(p.cursoId)
    setFechaInicio(p.fechaInicio)
    setFechaFin(p.fechaFin)
    setSections(p.secciones || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar planificación?')) {
      await planificacionAPI.delete(id)
      setToast({ message: 'Eliminado con éxito', type: 'success' })
      fetchData()
    }
  }

  const resetForm = () => {
    setEditingPlan(null)
    setCurrentTemplate(null)
    setTitle('')
    setSections([])
    setCursoId('')
  }

  const filteredPlans = plans.filter(p => p.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
  const getCursoName = (id) => cursos.find(c => c.id === Number(id))?.nombre || 'General'

  const isInicial = currentTemplate?.nivel === 'Inicial'
  const theme = {
    accent: isInicial ? 'text-orange-500' : 'text-primary-500',
    bgAccent: isInicial ? 'bg-orange-500/10' : 'bg-primary-500/10',
    btn: isInicial ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20' : 'bg-primary-600 hover:bg-primary-500 shadow-primary-900/20',
    dot: isInicial ? 'bg-orange-500' : 'bg-primary-500'
  }

  return (
    <div className={`space-y-10 animate-in fade-in duration-700 pb-32 ${isInicial ? 'theme-inicial' : ''}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        data={{ titulo: title, fechaInicio, fechaFin, secciones: sections }}
        cursoName={getCursoName(cursoId)}
      />

      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
            <ClipboardList className={`${theme.accent} w-10 h-10`} /> 
            Planner <span className={theme.accent}>SaaS</span>
          </h2>
          <div className="flex items-center gap-3">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
              {currentTemplate ? `Modo Editor Activo (${currentTemplate.nivel})` : 'Gestión de Documentos'}
            </p>
            {currentTemplate && (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-white/[0.03] rounded-full border border-white/5">
                 <Cloud size={10} className={autoSaveStatus === 'saving' ? `animate-pulse ${theme.accent}` : 'text-gray-600'} />
                 <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                   {autoSaveStatus === 'saving' ? 'Guardando...' : 'Cambios guardados'}
                 </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          {currentTemplate ? (
            <>
              <button 
                onClick={() => setIsPreviewOpen(true)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 border border-white/5"
              >
                <Eye size={16} /> Vista Previa
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className={`px-8 py-3 ${theme.btn} text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl transition-all flex items-center gap-2`}
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                Guardar Documento
              </button>
              <button 
                onClick={resetForm}
                className="p-3 bg-white/5 text-gray-500 hover:text-white rounded-xl transition-colors"
                title="Cerrar Editor"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
               <button 
                onClick={() => handleSelectTemplate(PLANNING_TEMPLATES[0])}
                className="relative px-8 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center gap-3"
              >
                <Plus size={18} className="text-primary-500" /> Nuevo Proyecto Docente
              </button>
            </div>
          )}
        </div>
      </div>

      {!currentTemplate ? (
        /* LISTADO Y BÚSQUEDA (VISTA PRINCIPAL) */
        <div className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filtros Tags */}
              <div className="lg:col-span-1 space-y-6">
                 <div className="card bg-white/[0.02] border-white/5 p-6 space-y-6">
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4 flex items-center gap-2">
                         <Search size={14} /> Filtro Rápido
                       </h4>
                       <input 
                         type="text" 
                         className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-bold uppercase outline-none focus:border-primary-500 transition-all"
                         placeholder="Buscar por título..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4 flex items-center gap-2">
                         <Filter size={14} /> Nivel Académico
                       </h4>
                       <div className="space-y-2">
                          {['Todos', 'Primaria', 'Inicial', 'Proyecto'].map(tag => (
                            <button key={tag} className="w-full text-left px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-white/5 hover:text-white transition-all">
                               {tag}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Sugerencia SaaS */}
                 <div className="bg-primary-600/10 border border-primary-500/20 p-6 rounded-2xl space-y-3">
                    <Sparkles className="text-primary-500" size={20} />
                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Sugerencia Pro</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      ¿Sabías que puedes duplicar planificaciones anteriores para editarlas como una base nueva?
                    </p>
                 </div>
              </div>

              {/* Grid de Planificaciones */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loading ? (
                    [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
                  ) : filteredPlans.map(p => (
                    <div key={p.id} className="group relative bg-[#080808] border border-white/5 hover:border-primary-500/30 p-8 rounded-[2rem] transition-all hover:-translate-y-1">
                       <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-white/[0.03] rounded-2xl group-hover:bg-primary-500/10 transition-colors">
                             <FileText className="text-gray-700 group-hover:text-primary-500 transition-colors" />
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleEdit(p)} className="p-2 text-gray-500 hover:text-white bg-black/40 rounded-xl">
                               <FileText size={16} />
                             </button>
                             <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-500 hover:text-red-500 bg-black/40 rounded-xl">
                               <Trash2 size={16} />
                             </button>
                          </div>
                       </div>
                       
                       <div className="space-y-2 mb-8">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-600">
                             {getCursoName(p.cursoId)}
                          </span>
                          <h4 className="text-xl font-black uppercase italic tracking-tighter text-white leading-tight">
                            {p.titulo}
                          </h4>
                       </div>

                       <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex items-center gap-2 text-gray-600">
                             <Clock size={14} />
                             <span className="text-[9px] font-black uppercase tracking-widest">
                               {new Date(p.lastModified).toLocaleDateString()}
                             </span>
                          </div>
                          <button 
                            onClick={() => handleEdit(p)}
                            className="text-[9px] font-black uppercase tracking-widest text-primary-500 flex items-center gap-2"
                          >
                             Editar documento <ArrowRight size={14} />
                          </button>
                       </div>
                    </div>
                  ))}
                  {!loading && filteredPlans.length === 0 && (
                    <div className="col-span-full py-20 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[3rem] text-center">
                       <LayoutGrid size={48} className="mx-auto text-gray-800 mb-6" />
                       <h3 className="text-gray-500 font-black uppercase tracking-widest text-xs">No tienes planificaciones aún</h3>
                       <button 
                         onClick={() => handleSelectTemplate(PLANNING_TEMPLATES[0])}
                         className="mt-6 text-primary-500 font-black uppercase tracking-widest text-[10px] hover:underline"
                       >
                         Empieza creando una desde cero
                       </button>
                    </div>
                  )}
                </div>
              </div>
           </div>
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
                 </div>

                 {/* Selector de Plantillas (Mini) */}
                 <div className="pt-6 border-t border-white/5 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Cambiar Estructura</label>
                    <div className="grid grid-cols-2 gap-2">
                       {PLANNING_TEMPLATES.map(t => (
                         <button 
                           key={t.id}
                           onClick={() => handleSelectTemplate(t)}
                           className={`p-3 rounded-xl border text-[9px] font-black uppercase tracking-tighter flex flex-col items-center gap-1 transition-all ${
                             currentTemplate?.id === t.id ? 'bg-primary-600/10 border-primary-500 text-primary-500' : 'bg-black border-white/5 text-gray-600 hover:border-white/20'
                           }`}
                         >
                            <span className="text-xl">{t.icon}</span>
                            {t.nombre.split(' ')[1]}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/20 to-primary-900/10 p-8 rounded-3xl border border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Sparkles size={20} className="text-primary-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 leading-tight">Asistente Inteligente</p>
                 </div>
                 <p className="text-xs text-gray-400 font-medium leading-relaxed">
                   Basándonos en tu selección de <strong>{currentTemplate?.nombre}</strong>, te sugerimos enfocarte en 
                   actividades {currentTemplate?.nivel === 'Inicial' ? 'lúdicas y sensoriales.' : 'de investigación y debate.'}
                 </p>
              </div>
           </div>

           {/* Área Central del Editor */}
           <div className="xl:col-span-8 space-y-6">
              <div className="space-y-6 max-w-3xl">
                 {sections.map((section, index) => (
                   <EditorBlock 
                     key={section.id}
                     {...section}
                     onChange={handleBlockChange}
                     onRemove={handleRemoveBlock}
                     isRemovable={sections.length > 2}
                   />
                 ))}
                 
                 <AddBlockButton onClick={handleAddCustomBlock} />
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
