import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Hash, Mail, Phone, Book, Save, AlertCircle } from 'lucide-react'

export function AlumnoModal({ isOpen, onClose, onSave, alumno = null }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    notas: ''
  })

  useEffect(() => {
    if (alumno) {
      setFormData({
        nombre: alumno.nombre || '',
        apellido: alumno.apellido || '',
        dni: alumno.dni || '',
        email: alumno.email || '',
        telefono: alumno.telefono || '',
        notas: alumno.notas || ''
      })
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        telefono: '',
        notas: ''
      })
    }
  }, [alumno, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.nombre || !formData.apellido || !formData.dni) return
    onSave(formData)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0c0c14] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-primary-600/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-600/20 rounded-2xl flex items-center justify-center text-primary-500 border border-primary-500/20">
                  <User size={24} />
                </div>
                <div>
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                     {alumno ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                   </h3>
                   <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest italic">Expediente Académico Pro</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all border border-white/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Nombre</label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-[11px] font-bold text-white outline-none focus:border-primary-500/50 transition-all"
                      placeholder="Ej: Juan"
                      value={formData.nombre}
                      onChange={e => setFormData({...formData, nombre: e.target.value})}
                    />
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Apellido</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-[11px] font-bold text-white outline-none focus:border-primary-500/50 transition-all"
                    placeholder="Ej: Pérez"
                    value={formData.apellido}
                    onChange={e => setFormData({...formData, apellido: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">DNI / Documento</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-[11px] font-bold text-white outline-none focus:border-primary-500/50 transition-all"
                    placeholder="Número de documento..."
                    value={formData.dni}
                    onChange={e => setFormData({...formData, dni: e.target.value})}
                  />
                  <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">E-mail</label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-[11px] font-bold text-white outline-none focus:border-primary-500/50 transition-all"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Teléfono</label>
                  <div className="relative">
                    <input
                      type="tel"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-[11px] font-bold text-white outline-none focus:border-primary-500/50 transition-all"
                      placeholder="+54 9..."
                      value={formData.telefono}
                      onChange={e => setFormData({...formData, telefono: e.target.value})}
                    />
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Observaciones</label>
                <textarea
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-4 text-[11px] font-bold text-white outline-none focus:border-primary-500/50 transition-all min-h-[100px] resize-none"
                  placeholder="Datos relevantes, diagnósticos, historial..."
                  value={formData.notas}
                  onChange={e => setFormData({...formData, notas: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all rounded-2xl border border-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[1.5] py-4 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest transition-all rounded-2xl shadow-xl shadow-primary-900/20 flex items-center justify-center gap-2"
                >
                  <Save size={16} /> {alumno ? 'Guardar Cambios' : 'Registrar Estudiante'}
                </button>
              </div>
            </form>

            <div className="px-8 pb-8 flex items-center gap-3 opacity-30 grayscale pointer-events-none">
                <AlertCircle size={14} />
                <span className="text-[8px] font-black uppercase tracking-widest">Los datos serán procesados por DocenTico IA para insights académicos</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
