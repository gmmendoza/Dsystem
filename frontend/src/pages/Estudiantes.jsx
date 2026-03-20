import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, ArrowUpRight, GraduationCap, AlertTriangle, TrendingUp } from 'lucide-react'
import { alumnoAPI, cursoAPI } from '../services/api'
import { CardSkeleton } from '../components/Common/LoadingSkeleton'

export default function Estudiantes() {
  const [alumnos, setAlumnos] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('todos') // todos, riesgo, sobresaliente

  useEffect(() => {
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
    fetchData()
  }, [])

  const getCursoNombre = (id) => {
    const curso = cursos.find(c => c.alumnos?.includes(id))
    return curso ? curso.nombre : 'Sin asignar'
  }

  const getPromedio = (notas) => {
    if (!notas) return 0
    const values = Object.values(notas)
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
  }

  const filteredAlumnos = alumnos.filter(a => {
    const matchesSearch = `${a.nombre} ${a.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) || a.dni.includes(searchTerm)
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
              const promedio = parseFloat(getPromedio(al.notas))
              const isRiesgo = al.asistencia < 75 || promedio < 6

              return (
                <motion.div
                  layout
                  key={al.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative bg-surface-subtle/40 backdrop-blur-xl border border-black/5 dark:border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all shadow-xl overflow-hidden ${isRiesgo ? 'hover:bg-red-500/[0.02]' : 'hover:bg-indigo-500/[0.02]'}`}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${isRiesgo ? 'bg-red-500/80 shadow-red-900/20' : 'bg-indigo-600/80 shadow-indigo-900/20'} group-hover:scale-110 transition-transform`}>
                          <GraduationCap size={24} />
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Promedio</span>
                          <span className={`text-2xl font-black italic ${promedio >= 9 ? 'text-indigo-500' : promedio < 6 ? 'text-red-500' : 'text-white'}`}>
                            {promedio}
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
                        {promedio >= 9 && (
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
    </div>
  )
}
