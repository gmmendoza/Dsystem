import { useEffect, useState } from 'react'
import { alumnoAPI, cursoAPI } from '../services/api'
import { Search, Plus, UserPlus, BookOpen, User, GraduationCap } from 'lucide-react'

export default function MiAula() {
  const [alumnos, setAlumnos] = useState([])
  const [cursos, setCursos] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const [resAlumnos, resCursos] = await Promise.all([
        alumnoAPI.getAll(),
        cursoAPI.getAll()
      ])
      setAlumnos(resAlumnos.data)
      setCursos(resCursos.data)
    }
    fetchData()
  }, [])

  const filteredAlumnos = alumnos.filter(a => 
    `${a.nombre} ${a.apellido}`.toLowerCase().includes(search.toLowerCase()) || 
    a.dni.includes(search)
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Mi Aula</h2>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <UserPlus className="w-4 h-4" /> Nuevo Alumno
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Crear Curso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Alumnos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o DNI..." 
              className="input-field pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase border-b border-gray-800">
                    <th className="px-4 py-3 font-semibold">Alumno</th>
                    <th className="px-4 py-3 font-semibold">DNI</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredAlumnos.map(a => (
                    <tr key={a.id} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="px-4 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-primary-400 group-hover:bg-primary-900/20 transition-colors">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-200">{a.nombre} {a.apellido}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400 font-mono">{a.dni}</td>
                      <td className="px-4 py-4 text-sm text-gray-400">{a.email}</td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-primary-400 hover:text-primary-300 text-xs font-semibold">Ver Ficha</button>
                      </td>
                    </tr>
                  ))}
                  {filteredAlumnos.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-sm italic">
                        No se encontraron alumnos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mis Cursos */}
        <div className="space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary-400" /> Mis Cursos
          </h3>
          {cursos.map(curso => (
            <div key={curso.id} className="card p-4 hover:border-primary-500/50 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <span className="badge bg-primary-900/30 text-primary-400 border border-primary-800/50">{curso.nivel}</span>
                <span className="text-[10px] text-gray-500 font-mono">ID: {curso.id}</span>
              </div>
              <p className="font-bold text-gray-100 group-hover:text-primary-400 transition-colors">{curso.nombre}</p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{curso.descripcion}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-500">
                  <GraduationCap size={14} />
                  <span className="text-xs font-medium">{curso.alumnos?.length || 0} alumnos</span>
                </div>
                <button className="text-xs text-primary-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Gestionar →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
