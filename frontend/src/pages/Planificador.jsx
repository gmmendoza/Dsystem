import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { planificacionAPI, cursoAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { 
  ClipboardList, Save, Trash2, Plus, 
  ArrowLeft, Loader2, Calendar, Target, 
  FileText, CheckCircle, Search, Filter, BookOpen
} from 'lucide-react'
import { FormSkeleton, CardSkeleton } from '../components/Common/LoadingSkeleton'
import { Toast } from '../components/Common/Toast'

export default function Planificador() {
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

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

  const onSubmit = async (formData) => {
    setSaving(true)
    try {
      // En un sistema real, el docenteId vendría del token/contexto
      const dataToSave = { ...formData, docenteId: 1, lastModified: new Date().toISOString() }
      if (editingId) {
        await planificacionAPI.update(editingId, dataToSave)
        setToast({ message: 'Planificación actualizada', type: 'success' })
      } else {
        await planificacionAPI.create(dataToSave)
        setToast({ message: 'Nueva unidad guardada', type: 'success' })
      }
      reset()
      setEditingId(null)
      fetchData()
    } catch (err) {
      setToast({ message: 'Error al guardar', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (p) => {
    setEditingId(p.id)
    setValue('titulo', p.titulo)
    setValue('cursoId', p.cursoId)
    setValue('contenido', p.contenido)
    setValue('objetivos', p.objetivos)
    setValue('fechaInicio', p.fechaInicio)
    setValue('fechaFin', p.fechaFin)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (confirm('¿Deseas eliminar esta planificación de forma permanente?')) {
      await planificacionAPI.delete(id)
      setToast({ message: 'Unidad eliminada', type: 'success' })
      fetchData()
    }
  }

  const filteredPlans = plans.filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.contenido.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCursoName = (id) => cursos.find(c => c.id === Number(id))?.nombre || 'General'

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
            <ClipboardList className="text-primary-500 w-10 h-10" /> 
            Planificador <span className="text-primary-600">Pro</span>
          </h2>
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">Gestión de Unidades Didácticas y Objetivos</p>
        </div>
        {editingId && (
            <button 
              onClick={() => { setEditingId(null); reset(); }} 
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest border border-white/5 rounded-xl transition-all flex items-center gap-2"
            >
                <ArrowLeft size={14} /> Salir del modo edición
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* FORMULARIO DE EDICIÓN / CREACIÓN */}
        <div className="xl:col-span-5">
           <div className="sticky top-6">
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition" />
                <div className="relative card bg-[#080808] border-white/5 p-8 shadow-2xl">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Título de la Unidad</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
                        <input 
                          {...register('titulo', { required: 'El título es obligatorio' })}
                          className={`w-full bg-white/[0.02] border ${errors.titulo ? 'border-red-500' : 'border-white/5'} focus:border-primary-500 rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-sm font-bold placeholder:text-gray-700 uppercase`}
                          placeholder="Ej: Análisis Geopolítico"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Vincular a Curso</label>
                      <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
                        <select 
                          {...register('cursoId', { required: 'Selecciona un curso' })}
                          className="w-full bg-white/[0.02] border border-white/5 focus:border-primary-500 rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-sm font-bold uppercase appearance-none"
                        >
                          <option value="" className="bg-gray-950">Seleccionar...</option>
                          {cursos.map(c => <option key={c.id} value={c.id} className="bg-gray-950">{c.nombre} ({c.nivel})</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Inicio</label>
                        <input 
                          type="date"
                          {...register('fechaInicio', { required: true })}
                          className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 focus:border-primary-500 outline-none transition-all text-xs font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fin</label>
                        <input 
                          type="date"
                          {...register('fechaFin', { required: true })}
                          className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 focus:border-primary-500 outline-none transition-all text-xs font-bold" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Contenidos Centrales</label>
                      <textarea 
                        {...register('contenido', { required: true })}
                        rows="4"
                        className="w-full bg-white/[0.02] border border-white/5 focus:border-primary-500 rounded-xl py-4 px-4 outline-none transition-all text-sm h-32 resize-none" 
                        placeholder="Define los temas clave..."
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Metas de Aprendizaje</label>
                      <div className="relative">
                        <Target className="absolute left-4 top-4 text-gray-700" size={18} />
                        <textarea 
                          {...register('objetivos', { required: true })}
                          rows="3"
                          className="w-full bg-white/[0.02] border border-white/5 focus:border-primary-500 rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-sm h-24 resize-none" 
                          placeholder="¿Qué deben lograr?"
                        ></textarea>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={saving}
                      className="w-full group bg-primary-600 hover:bg-primary-500 py-5 rounded-2xl transition-all shadow-xl shadow-primary-900/20 flex items-center justify-center gap-3"
                    >
                      {saving ? <Loader2 className="animate-spin" /> : editingId ? <Save size={20} /> : <Plus size={20} />}
                      <span className="font-black uppercase tracking-widest text-sm">
                        {editingId ? 'Actualizar Registro' : 'Lanzar Planificación'}
                      </span>
                    </button>
                  </form>
                </div>
             </div>
           </div>
        </div>

        {/* LISTADO Y BÚSQUEDA */}
        <div className="xl:col-span-7 space-y-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="BUSCAR PLANIFICACIONES..." 
              className="w-full bg-white/[0.02] border border-white/5 focus:border-primary-500 focus:bg-white/[0.05] rounded-2xl py-5 pl-12 pr-4 outline-none transition-all text-sm uppercase font-black tracking-widest"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
            ) : filteredPlans.map(p => (
              <div key={p.id} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-white/5 to-white/[0.01] rounded-2xl blur-sm" />
                <div className="relative card bg-black/40 border-white/5 hover:border-white/10 p-6 space-y-5 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded">
                        {getCursoName(p.cursoId)}
                      </span>
                      <h4 className="text-lg font-black uppercase italic tracking-tighter text-white leading-tight">{p.titulo}</h4>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(p)} className="p-2 text-gray-700 hover:text-primary-400 hover:bg-white/5 rounded-lg transition-colors">
                        <Save size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-700 hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide line-clamp-3 leading-relaxed">
                    {p.contenido}
                  </p>

                  <div className="flex items-center gap-6 pt-5 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <Calendar className="text-gray-700" size={14} />
                       <div className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                          {p.fechaInicio}
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <CheckCircle className="text-gray-700" size={14} />
                       <div className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                          {p.fechaFin}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!loading && filteredPlans.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                 <ClipboardList className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                 <p className="text-gray-600 font-black uppercase tracking-widest text-xs">No se encontraron registros</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
