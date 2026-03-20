import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, ArrowUpRight, GraduationCap, AlertTriangle, TrendingUp, X, Save, Plus, Trash2, Edit2, Clipboard } from 'lucide-react'
import { alumnoAPI, cursoAPI } from '../services/api'
import { CardSkeleton } from '../components/Common/LoadingSkeleton'

export default function Estudiantes() {
  const [alumnos, setAlumnos] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('todos') // todos, riesgo, sobresaliente
  
  // Modal State
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resAlumnos, resCursos] = await Promise.all([
        alumnoAPI.getAll(),
        cursoAPI.getAll()
      ])
      setAlumnos(resAlumnos.data)
      setCursos(resCursos.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getCursoNombre = (id) => {
    const curso = cursos.find(c => c.alumnos?.includes(id))
    return curso ? curso.nombre : 'Sin asignar'
  }

  const getPromedio = (notas) => {
    if (!notas || Object.keys(notas).length === 0) return "0.0"
    const values = Object.values(notas)
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
  }

  const handleOpenDetail = (alumno) => {
    setSelectedAlumno(alumno)
    setEditFormData({
      ...alumno,
      observaciones: alumno.observaciones || '',
      notas: { ...alumno.notas }
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    try {
      await alumnoAPI.update(selectedAlumno.id, editFormData)
      await fetchData()
      setIsModalOpen(false)
      setSelectedAlumno(null)
    } catch (err) {
      console.error(err)
      alert("Error al guardar los datos del alumno.")
    } finally {
      setSaving(false)
    }
  }

  const handleAddGrade = () => {
    const materia = prompt("Nombre de la materia (ej: Matemática, Lengua):")
    if (materia) {
      const nota = prompt(`Nota para ${materia} (1-10):`)
      if (nota) {
        setEditFormData(prev => ({
          ...prev,
          notas: { ...prev.notas, [materia]: Number(nota) }
        }))
      }
    }
  }

  const handleRemoveGrade = (materia) => {
    const newNotas = { ...editFormData.notas }
    delete newNotas[materia]
    setEditFormData(prev => ({ ...prev, notas: newNotas }))
  }

  const filteredAlumnos = alumnos.filter(a => {
    const fullName = `${a.nombre} ${a.apellido}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || a.dni.includes(searchTerm)
    const promedio = parseFloat(getPromedio(a.notas))
    
    if (filter === 'riesgo') return matchesSearch && (a.asistencia < 75 || promedio < 6)
    if (filter === 'sobresaliente') return matchesSearch && promedio >= 9
    return matchesSearch
  })

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-900/20 rotate-3">
              <Users size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-800 dark:text-gray-400 block">Gestión Maestra</span>
              <span className="text-[9px] font-bold text-gray-900 dark:text-gray-200 uppercase tracking-widest leading-none">Base de Datos de Estudiantes</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight">
            Nuestros <span className="text-indigo-500">Estudiantes</span>.
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="BUSCAR POR NOMBRE O DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-subtle border border-black/10 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-black uppercase tracking-widest outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700 dark:placeholder:text-gray-500"
              style={{ color: 'rgb(var(--color-text))' }}
            />
          </div>
        </div>
      </div>

      {/* Filters & Stats */}
      <div className="flex flex-wrap items-center gap-4">
        {['todos', 'riesgo', 'sobresaliente'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              filter === f 
                ? 'bg-indigo-600 text-white border-indigo-500/50 shadow-lg shadow-indigo-900/20' 
                : 'bg-surface-subtle border-black/5 dark:border-white/5 text-gray-500 hover:border-indigo-500/30'
            }`}
          >
            {f === 'todos' ? 'Todos' : f === 'riesgo' ? 'En Riesgo' : 'Sobresalientes'}
          </button>
        ))}
        <div className="h-6 w-[1px] bg-black/5 dark:bg-white/5 mx-2" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Resultados: {filteredAlumnos.length}
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAlumnos.map(al => {
              const promedioVal = parseFloat(getPromedio(al.notas))
              const isRiesgo = al.asistencia < 75 || promedioVal < 6

              return (
                <motion.div
                  layout
                  key={al.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => handleOpenDetail(al)}
                  className={`group relative bg-surface-subtle/40 backdrop-blur-xl border border-black/5 dark:border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/30 cursor-pointer transition-all shadow-xl overflow-hidden ${isRiesgo ? 'hover:bg-red-500/[0.02]' : 'hover:bg-indigo-500/[0.02]'}`}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${isRiesgo ? 'bg-red-500/80 shadow-red-900/20' : 'bg-indigo-600/80 shadow-indigo-900/20'} group-hover:scale-110 transition-transform`}>
                          <GraduationCap size={24} />
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Promedio</span>
                          <span className={`text-2xl font-black italic ${promedioVal >= 9 ? 'text-primary-500' : promedioVal < 6 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                            {promedioVal}
                          </span>
                       </div>
                    </div>

                    <div className="space-y-1 mb-8">
                       <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors leading-none">
                         {al.nombre} {al.apellido}
                       </h3>
                       <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest truncate opacity-80">
                          {getCursoNombre(al.id)}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-black/10 dark:border-white/5 mt-auto">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-600">Asistencia</p>
                          <div className="flex items-center gap-2">
                             <div className="flex-1 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${al.asistencia >= 90 ? 'bg-primary-500' : al.asistencia < 75 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${al.asistencia}%` }} />
                             </div>
                             <span className="text-[9px] font-black text-gray-900 dark:text-white">{al.asistencia}%</span>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-600">Participación</p>
                          <div className="flex items-center gap-2">
                             <div className="flex-1 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${al.participacion}%` }} />
                             </div>
                             <span className="text-[9px] font-black text-gray-900 dark:text-white">{al.participacion}%</span>
                          </div>
                       </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {isRiesgo && (
                          <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[8px] font-black uppercase tracking-widest rounded border border-red-500/20 flex items-center gap-1">
                            <AlertTriangle size={10} /> Alerta
                          </span>
                        )}
                        {promedioVal >= 9 && (
                          <span className="px-2 py-1 bg-primary-500/10 text-primary-400 text-[8px] font-black uppercase tracking-widest rounded border border-primary-500/20 flex items-center gap-1">
                            <TrendingUp size={10} /> Excelente
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Bg decoration */}
                  <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 pointer-events-none rotate-12">
                     <Users size={180} />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {filteredAlumnos.length === 0 && !loading && (
        <div className="py-32 text-center space-y-6">
           <div className="w-20 h-20 bg-surface-subtle rounded-3xl flex items-center justify-center mx-auto text-gray-500">
              <Search size={40} />
           </div>
           <p className="text-xl font-black uppercase italic tracking-tighter text-gray-500">No se encontraron estudiantes</p>
        </div>
      )}

      {/* Student Detail Modal */}
      <AnimatePresence>
        {isModalOpen && editFormData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
               {/* Modal Header */}
               <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-surface-subtle/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Ficha del Estudiante</h2>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Edición Pedagógica y de Datos</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
               </div>

               {/* Modal Content */}
               <div className="p-8 overflow-y-auto custom-scrollbar space-y-10">
                  {/* Basic Data */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Datos Personales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1">Nombre</label>
                          <input 
                            type="text" 
                            value={editFormData.nombre}
                            onChange={(e) => setEditFormData({...editFormData, nombre: e.target.value})}
                            className="w-full bg-surface-subtle border border-white/5 rounded-xl p-4 text-[11px] font-bold text-white outline-none focus:border-indigo-500 transition-all uppercase"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1">Apellido</label>
                          <input 
                            type="text" 
                            value={editFormData.apellido}
                            onChange={(e) => setEditFormData({...editFormData, apellido: e.target.value})}
                            className="w-full bg-surface-subtle border border-white/5 rounded-xl p-4 text-[11px] font-bold text-white outline-none focus:border-indigo-500 transition-all uppercase"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1">DNI</label>
                          <input 
                            type="text" 
                            value={editFormData.dni}
                            onChange={(e) => setEditFormData({...editFormData, dni: e.target.value})}
                            className="w-full bg-surface-subtle border border-white/5 rounded-xl p-4 text-[11px] font-bold text-white outline-none focus:border-indigo-500 transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-1">Email Institucional</label>
                          <input 
                            type="email" 
                            value={editFormData.email}
                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                            className="w-full bg-surface-subtle border border-white/5 rounded-xl p-4 text-[11px] font-bold text-white outline-none focus:border-indigo-500 transition-all"
                          />
                       </div>
                    </div>
                  </div>

                  {/* Grades Management */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Rendimiento Académico</h3>
                      <button 
                        onClick={handleAddGrade}
                        className="flex items-center gap-2 px-3 py-1 bg-indigo-600/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        <Plus size={12} /> Añadir Nota
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {Object.entries(editFormData.notas).map(([materia, nota]) => (
                         <div key={materia} className="flex items-center justify-between p-4 bg-surface-subtle/40 border border-white/5 rounded-2xl group">
                            <div className="flex flex-col">
                               <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none">{materia}</span>
                               <span className="text-xl font-black italic tracking-tighter text-white mt-1">{nota}</span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => {
                                   const n = prompt(`Nueva nota para ${materia}:`, nota)
                                   if (n) setEditFormData(prev => ({ ...prev, notas: { ...prev.notas, [materia]: Number(n) } }))
                                 }}
                                 className="p-2 text-gray-500 hover:text-indigo-400 transition-colors"
                               >
                                 <Edit2 size={14} />
                               </button>
                               <button 
                                 onClick={() => handleRemoveGrade(materia)}
                                 className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                               >
                                 <Trash2 size={14} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Observations */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 flex items-center gap-2">
                       <Clipboard size={14} /> Observaciones Pedagógicas
                    </h3>
                    <textarea 
                      value={editFormData.observaciones}
                      onChange={(e) => setEditFormData({...editFormData, observaciones: e.target.value})}
                      placeholder="Escribe notas sobre el comportamiento, progreso o necesidades especiales del alumno..."
                      className="w-full h-40 bg-surface-subtle border border-white/5 rounded-2xl p-6 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all resize-none custom-scrollbar"
                    />
                  </div>
               </div>

               {/* Modal Footer */}
               <div className="p-6 bg-surface-subtle border-t border-white/5 flex justify-end gap-4 shrink-0">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                  >
                    Descartar
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-900/40 flex items-center gap-3 disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : (<><Save size={16} /> Guardar Cambios</>)}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
