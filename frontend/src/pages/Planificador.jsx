import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { planificacionAPI, cursoAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { ClipboardList, Save, Trash2, Plus, ArrowLeft, Loader2 } from 'lucide-react'

export default function Planificador() {
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const loadPlans = async () => {
    const { data } = await planificacionAPI.getAll()
    setPlans(data)
  }

  useEffect(() => { loadPlans() }, [])

  const onSubmit = async (formData) => {
    setLoading(true)
    try {
      const dataToSave = { ...formData, docenteId: 1 } // Mock docenteId
      if (editingId) {
        await planificacionAPI.update(editingId, dataToSave)
      } else {
        await planificacionAPI.create(dataToSave)
      }
      reset()
      setEditingId(null)
      loadPlans()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (p) => {
    setEditingId(p.id)
    setValue('titulo', p.titulo)
    setValue('contenido', p.contenido)
    setValue('objetivos', p.objetivos)
    setValue('fechaInicio', p.fechaInicio)
    setValue('fechaFin', p.fechaFin)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta planificación?')) {
      await planificacionAPI.delete(id)
      loadPlans()
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ClipboardList className="text-primary-400" /> Planificador de Clases
        </h2>
        {editingId && (
            <button onClick={() => { setEditingId(null); reset(); }} className="btn-secondary text-xs flex items-center gap-2">
                <ArrowLeft size={14} /> Cancelar Edición
            </button>
        )}
      </div>

      {/* Formulario */}
      <div className="card bg-gray-900 border-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Título de la Unidad</label>
              <input 
                {...register('titulo', { required: 'El título es obligatorio' })}
                className="input-field" 
                placeholder="Ej: Álgebra Lineal - Introducción"
              />
              {errors.titulo && <p className="error-msg">{errors.titulo.message}</p>}
            </div>

            <div>
              <label className="label">Fecha Inicio</label>
              <input 
                type="date"
                {...register('fechaInicio', { required: 'Fecha requerida' })}
                className="input-field" 
              />
              {errors.fechaInicio && <p className="error-msg">{errors.fechaInicio.message}</p>}
            </div>

            <div>
              <label className="label">Fecha Fin</label>
              <input 
                type="date"
                {...register('fechaFin', { required: 'Fecha requerida' })}
                className="input-field" 
              />
              {errors.fechaFin && <p className="error-msg">{errors.fechaFin.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="label">Contenido Temático</label>
              <textarea 
                {...register('contenido', { required: 'El contenido es obligatorio' })}
                rows="3"
                className="input-field resize-none" 
                placeholder="Describe los temas a tratar..."
              ></textarea>
              {errors.contenido && <p className="error-msg">{errors.contenido.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="label">Objetivos de Aprendizaje</label>
              <textarea 
                {...register('objetivos', { required: 'Los objetivos son obligatorios' })}
                rows="2"
                className="input-field resize-none" 
                placeholder="¿Qué lograrán los alumnos?"
              ></textarea>
              {errors.objetivos && <p className="error-msg">{errors.objetivos.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-8 py-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : editingId ? <Save size={18} /> : <Plus size={18} />}
              {editingId ? 'Actualizar Planificación' : 'Guardar Nueva Planificación'}
            </button>
          </div>
        </form>
      </div>

      {/* Listado de Planificaciones Existentes */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-400 text-sm uppercase tracking-widest px-1">Historial de Planificaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map(p => (
            <div key={p.id} className="card p-5 group flex flex-col h-full hover:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-primary-400" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="p-2 text-gray-500 hover:text-primary-400 hover:bg-gray-800 rounded-lg transition-all">
                    <Save size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h4 className="font-bold text-white mb-2">{p.titulo}</h4>
              <p className="text-xs text-gray-500 line-clamp-2 flex-grow mb-4">{p.contenido}</p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                <div className="text-[10px] text-gray-400">
                    <p className="uppercase font-bold text-gray-600">Inicio</p>
                    <p>{p.fechaInicio}</p>
                </div>
                <div className="text-[10px] text-gray-400">
                    <p className="uppercase font-bold text-gray-600">Fin</p>
                    <p>{p.fechaFin}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
