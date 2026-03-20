import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { alumnoAPI, cursoAPI } from '../services/api'
import { Search, Plus, UserPlus, BookOpen, User, GraduationCap, Trash2, Edit2, X, Loader2 } from 'lucide-react'
import { TableSkeleton, CardSkeleton } from '../components/Common/LoadingSkeleton'
import { Toast } from '../components/Common/Toast'

export default function MiAula() {
  const [alumnos, setAlumnos] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalType, setModalType] = useState(null) // 'alumno' | 'curso'
  const [editingItem, setEditingItem] = useState(null)
  const [toast, setToast] = useState(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

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
    } finally {
      setLoading(false)
    }
  }

  const onAlumnoSubmit = async (data) => {
    try {
      if (editingItem) {
        await alumnoAPI.update(editingItem.id, data)
        setToast({ message: 'Alumno actualizado', type: 'success' })
      } else {
        await alumnoAPI.create(data)
        setToast({ message: 'Alumno creado con éxito', type: 'success' })
      }
      setModalType(null)
      setEditingItem(null)
      reset()
      fetchData()
    } catch (err) {
      setToast({ message: 'Error al procesar', type: 'error' })
    }
  }

  const handleDeleteAlumno = async (id) => {
    if (confirm('¿Estás seguro de eliminar este alumno?')) {
      await alumnoAPI.delete(id)
      setToast({ message: 'Alumno eliminado', type: 'success' })
      fetchData()
    }
  }

  const openEditAlumno = (alumno) => {
    setEditingItem(alumno)
    setModalType('alumno')
    setValue('nombre', alumno.nombre)
    setValue('apellido', alumno.apellido)
    setValue('dni', alumno.dni)
    setValue('email', alumno.email)
  }

  const onCourseSubmit = async (data) => {
    try {
      if (editingItem) {
        await cursoAPI.update(editingItem.id, data)
        setToast({ message: 'Curso actualizado', type: 'success' })
      } else {
        await cursoAPI.create(data)
        setToast({ message: 'Curso creado con éxito', type: 'success' })
      }
      setModalType(null)
      setEditingItem(null)
      reset()
      fetchData()
    } catch (err) {
      setToast({ message: 'Error al procesar curso', type: 'error' })
    }
  }

  const handleDeleteCurso = async (id) => {
    if (confirm('¿Estás seguro de eliminar este curso? Se perderán las vinculaciones.')) {
      await cursoAPI.delete(id)
      setToast({ message: 'Curso eliminado', type: 'success' })
      fetchData()
    }
  }

  const openEditCurso = (e, curso) => {
    e.stopPropagation()
    setEditingItem(curso)
    setModalType('curso')
    setValue('nombre', curso.nombre)
    setValue('nivel', curso.nivel)
    setValue('descripcion', curso.descripcion)
  }

  const filteredAlumnos = alumnos.filter(a => 
    `${a.nombre} ${a.apellido} ${a.email}`.toLowerCase().includes(search.toLowerCase()) || 
    a.dni.includes(search)
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Mi Aula</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Gestión de alumnos y comisiones</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setModalType('alumno'); setEditingItem(null); reset(); }}
            className="group px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-black uppercase tracking-widest border border-white/5 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-primary-500" /> Nuevo Alumno
          </button>
          <button 
            onClick={() => { setModalType('curso'); setEditingItem(null); reset(); }}
            className="group px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-primary-900/20"
          >
            <Plus className="w-4 h-4" /> Crear Curso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Alumnos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="BUSCAR POR NOMBRE, DNI O EMAIL..." 
              className="w-full bg-white/[0.02] border border-white/5 focus:border-primary-500 focus:bg-white/[0.05] rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-sm uppercase font-bold tracking-wider placeholder:text-gray-700" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="card overflow-hidden bg-black/40 border-white/5">
            {loading ? (
              <div className="p-6"><TableSkeleton rows={6} /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-600 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
                      <th className="px-6 py-4">Estudiante</th>
                      <th className="px-6 py-4">Identificación</th>
                      <th className="px-6 py-4">Contacto</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAlumnos.map(a => (
                      <tr key={a.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-900 border border-white/5 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase italic text-gray-200 tracking-tight">{a.nombre} {a.apellido}</p>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">ID: {a.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400 font-black tracking-widest">{a.dni}</td>
                        <td className="px-6 py-4 text-xs text-gray-500 font-medium">{a.email}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEditAlumno(a)}
                              className="p-2 hover:bg-primary-900/20 text-gray-500 hover:text-primary-400 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteAlumno(a.id)}
                              className="p-2 hover:bg-red-900/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Mis Cursos */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" /> Mis Cursos Activos
          </h3>
          {loading ? (
            <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>
          ) : (
            <div className="space-y-4">
              {cursos.map(curso => (
                <div key={curso.id} className="group relative">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600/20 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                   <div className="relative bg-gray-950 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 text-gray-400 rounded border border-white/5">{curso.nivel}</span>
                      <div className="flex gap-2">
                        <Edit2 size={14} onClick={(e) => openEditCurso(e, curso)} className="text-gray-700 hover:text-primary-500 transition-colors" />
                        <Trash2 size={14} onClick={(e) => { e.stopPropagation(); handleDeleteCurso(curso.id); }} className="text-gray-700 hover:text-red-500 transition-colors" />
                      </div>
                    </div>
                    <p className="text-lg font-black uppercase italic text-white tracking-tighter group-hover:text-primary-400 transition-colors">{curso.nombre}</p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500">
                        <GraduationCap size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{curso.alumnos?.length || 0} ESTUDIANTES</span>
                      </div>
                      <ArrowRight size={16} className="text-gray-800 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Alumno */}
      {modalType === 'alumno' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="font-black uppercase italic tracking-tighter text-xl">
                {editingItem ? 'Editar Estudiante' : 'Nuevo Estudiante'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit(onAlumnoSubmit)} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nombre</label>
                  <input 
                    {...register("nombre", { required: true })}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 focus:border-primary-500 outline-none transition-all text-sm uppercase font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Apellido</label>
                  <input 
                    {...register("apellido", { required: true })}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 focus:border-primary-500 outline-none transition-all text-sm uppercase font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Documento (DNI)</label>
                <input 
                  {...register("dni", { required: true })}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 focus:border-primary-500 outline-none transition-all text-sm font-mono"
                  placeholder="Ej: 38444999"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email Académico</label>
                <input 
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 focus:border-primary-500 outline-none transition-all text-sm"
                  placeholder="estudiante@dsystem.edu"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-3 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-900/20"
                >
                  {editingItem ? 'Guardar Cambios' : 'Registrar Alumno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Curso */}
      {modalType === 'curso' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="font-black uppercase italic tracking-tighter text-xl">
                {editingItem ? 'Editar Curso' : 'Nuevo Curso Académico'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit(onCourseSubmit)} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nombre del Curso</label>
                <input 
                  {...register("nombre", { required: true })}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 focus:border-primary-500 outline-none transition-all text-sm uppercase font-bold"
                  placeholder="Ej: Programación II"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nivel / Año</label>
                <select 
                  {...register("nivel", { required: true })}
                  className="w-full bg-gray-900 border border-white/5 rounded-xl py-3 px-4 focus:border-primary-500 outline-none transition-all text-sm font-bold uppercase"
                >
                  <option value="1º AÑO">1º AÑO</option>
                  <option value="2º AÑO">2º AÑO</option>
                  <option value="3º AÑO">3º AÑO</option>
                  <option value="4º AÑO">4º AÑO</option>
                  <option value="5º AÑO">5º AÑO</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Descripción Corta</label>
                <textarea 
                  {...register("descripcion")}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 focus:border-primary-500 outline-none transition-all text-sm h-24 resize-none"
                  placeholder="Detalles sobre el curso..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-3 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-900/20"
                >
                  {editingItem ? 'Actualizar Curso' : 'Crear Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
