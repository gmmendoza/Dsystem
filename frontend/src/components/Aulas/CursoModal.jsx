import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, School, Sparkles, LayoutGrid, Info } from 'lucide-react'

export default function CursoModal({ isOpen, onClose, onSave, curso = null }) {
  const [formData, setFormData] = useState({
    nombre: '',
    nivel: 'Primaria',
    descripcion: '',
    horario: '08:00 AM'
  })

  useEffect(() => {
    if (curso) {
      setFormData({
        nombre: curso.nombre || '',
        nivel: curso.nivel || 'Primaria',
        descripcion: curso.descripcion || '',
        horario: curso.horario || '08:00 AM'
      })
    } else {
      setFormData({
        nombre: '',
        nivel: 'Primaria',
        descripcion: '',
        horario: '08:00 AM'
      })
    }
  }, [curso, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-surface border border-black/5 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-surface-subtle/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-900/20">
                  <School size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white">
                    {curso ? 'Editar Workspace' : 'Nuevo Workspace'}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-800 dark:text-gray-500 uppercase tracking-widest">
                    Configuración del Aula Virtual
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-gray-800 dark:text-gray-500 hover:text-primary-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-600 block px-1">Nombre del Aula</label>
                <div className="relative">
                  <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800 dark:text-gray-500" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full bg-surface-subtle border border-black/10 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary-500/50 transition-all placeholder:text-gray-700 dark:placeholder:text-gray-500"
                    placeholder="EJ: 3° A - TURNO MAÑANA"
                    style={{ color: 'rgb(var(--color-text))' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-600 block px-1">Nivel Educativo</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Inicial', 'Primaria', 'Secundaria', 'Terciario'].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFormData({ ...formData, nivel: n })}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        formData.nivel === n
                          ? 'bg-primary-600 text-white border-primary-500/50 shadow-lg shadow-primary-900/20'
                          : 'bg-surface-subtle border-black/10 dark:border-white/5 text-gray-900 dark:text-gray-500 hover:border-primary-500/30'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-600 block px-1">Horario / Turno</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.horario}
                    onChange={e => setFormData({ ...formData, horario: e.target.value })}
                    className="w-full bg-surface-subtle border border-black/10 dark:border-white/5 rounded-2xl py-4 px-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary-500/50 transition-all placeholder:text-gray-700 dark:placeholder:text-gray-500"
                    placeholder="EJ: 08:00 AM - 12:00 PM"
                    style={{ color: 'rgb(var(--color-text))' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-600 block px-1">Descripción corta</label>
                <div className="relative">
                  <Info className="absolute left-4 top-4 text-gray-800 dark:text-gray-500" size={18} />
                  <textarea
                    value={formData.descripcion}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-surface-subtle border border-black/10 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-bold outline-none focus:border-primary-500/50 transition-all min-h-[100px] resize-none placeholder:text-gray-700 dark:placeholder:text-gray-500"
                    placeholder="Describe brevemente los objetivos del aula..."
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-surface-subtle text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-black/5 dark:border-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[2] btn-primary flex items-center justify-center gap-3"
                >
                  <Sparkles size={18} /> {curso ? 'Guardar Cambios' : 'Crear Workspace'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
