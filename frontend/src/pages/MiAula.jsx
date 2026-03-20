import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cursoAPI, alumnoAPI, planificacionAPI } from '../services/api'
import { 
  Plus, 
  BookOpen, 
  Users, 
  ArrowRight, 
  LayoutGrid, 
  Search,
  School,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  GraduationCap,
  Settings,
  Edit2
} from 'lucide-react'
import { CardSkeleton } from '../components/Common/LoadingSkeleton'
import { Toast } from '../components/Common/Toast'
import CursoModal from '../components/Aulas/CursoModal'

export default function MiAula() {
  const navigate = useNavigate()
  const [cursos, setCursos] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCurso, setEditingCurso] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resCursos, resAlumnos, resPlanes] = await Promise.all([
        cursoAPI.getAll(),
        alumnoAPI.getAll(),
        planificacionAPI.getAll()
      ])
      setCursos(resCursos.data)
      setAlumnos(resAlumnos.data)
      setPlanes(resPlanes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCurso = async (data) => {
    try {
      if (editingCurso) {
        await cursoAPI.update(editingCurso.id, data)
        setToast({ message: 'Workspace actualizado con éxito', type: 'success' })
      } else {
        await cursoAPI.create(data)
        setToast({ message: 'Nuevo Workspace creado con éxito', type: 'success' })
      }
      setIsModalOpen(false)
      setEditingCurso(null)
      fetchData()
    } catch (err) {
      setToast({ message: 'Error al procesar la solicitud', type: 'error' })
    }
  }

  const filteredCursos = cursos.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.nivel.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    { label: 'Estudiantes', value: alumnos.length, icon: Users, color: 'text-primary-500', bg: 'bg-primary-500/10' },
    { label: 'Planificaciones', value: planes.length, icon: BookOpen, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Aulas Activas', value: cursos.length, icon: GraduationCap, color: 'text-accent-emerald', bg: 'bg-accent-emerald/10' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── SECCIÓN DE ESTADÍSTICAS RÁPIDAS (COMMAND CENTER) ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, i) => (
          <div key={i} className="card bg-surface-subtle/40 border-black/5 dark:border-white/5 p-6 flex items-center justify-between group overflow-hidden relative shadow-sm hover:shadow-md transition-all">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
               <stat.icon size={120} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
              <h3 className="text-3xl font-black italic flex items-baseline gap-2">
                 {loading ? '--' : stat.value}
                 <span className="text-[10px] text-green-500 font-black">+12%</span>
              </h3>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-lg transition-transform group-hover:rotate-12`}>
               <stat.icon size={24} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── HEADER Y BÚSQUEDA ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
             <h2 className="text-4xl font-black uppercase italic tracking-tighter">
               Mis <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-500">Workspaces</span>
             </h2>
          </div>
          
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-primary-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="BUSCAR AULA O NIVEL..."
              className="w-full bg-surface-subtle/50 border border-black/5 dark:border-white/5 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-primary-500/50 transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <button 
          onClick={() => { setEditingCurso(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-3 self-start md:self-end"
        >
          <Plus size={18} /> Nuevo Workspace
        </button>
      </div>

      {/* ── GRID DE AULAS (WORKSPACES) ── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {loading ? (
          [...Array(3)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            {filteredCursos.map(curso => (
              <motion.div 
                key={curso.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/aula/${curso.id}`)}
                className="group relative cursor-pointer"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-primary-600/10 to-indigo-900/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="relative bg-surface-subtle/80 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 overflow-hidden hover:border-primary-500/40 transition-all shadow-xl">
                  
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-16 h-16 bg-surface-subtle border border-black/5 dark:border-white/5 rounded-[1.25rem] flex items-center justify-center text-primary-500 group-hover:rotate-6 transition-transform relative">
                       <div className="absolute inset-0 bg-primary-500/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                       {curso.nivel === 'Inicial' ? <Sparkles size={32} /> : <School size={32} />}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingCurso(curso); setIsModalOpen(true); }}
                            className="p-2 bg-surface hover:bg-primary-600/20 rounded-lg border border-black/5 dark:border-white/5 text-gray-900 hover:text-primary-500 transition-all shadow-sm"
                          >
                             <Edit2 size={12} />
                          </button>
                          <span className="px-3 py-1 bg-primary-500/20 text-primary-700 dark:text-primary-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-primary-500/20">
                             {curso.nivel}
                          </span>
                       </div>
                       <div className="flex items-center gap-1 text-[8px] font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">
                          <Clock size={10} className="text-primary-500" /> {curso.horario || '08:00 AM'}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors leading-none">
                      {curso.nombre}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-800 dark:text-gray-400 uppercase tracking-widest leading-relaxed line-clamp-2 italic opacity-80">
                      {curso.descripcion}
                    </p>
                  </div>

                  <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-900 dark:text-gray-500 uppercase mb-1 opacity-60">Alumnado</span>
                        <div className="flex flex-items-center gap-1.5 font-black uppercase tracking-widest text-[10px] text-gray-900 dark:text-gray-100">
                          <Users size={14} className="text-primary-500" />
                          <span>{curso.alumnos?.length || 0}</span>
                        </div>
                      </div>
                      <div className="w-[1px] h-6 bg-black/5 dark:bg-white/5" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-900 dark:text-gray-500 uppercase mb-1 opacity-60">Estado</span>
                        <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px] text-green-500">
                          <Zap size={14} />
                          <span>Live</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-surface-subtle dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-700 group-hover:bg-primary-600 group-hover:text-white transition-all border border-black/5 dark:border-white/5 shadow-sm">
                       <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Decoración de fondo */}
                  <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none rotate-12">
                    <LayoutGrid size={200} />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Empty State / Add Card */}
               <motion.div 
              variants={itemVariants}
              onClick={() => { setEditingCurso(null); setIsModalOpen(true); }}
              className="group border-2 border-dashed border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center gap-6 hover:border-primary-500/30 hover:bg-primary-500/[0.02] transition-all cursor-pointer min-h-[400px]"
            >
               <div className="w-20 h-20 bg-white/[0.03] rounded-3xl flex items-center justify-center text-gray-800 group-hover:text-primary-500 group-hover:bg-primary-500/10 transition-all">
                 <Plus size={40} />
               </div>
               <div className="space-y-2">
                 <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-800 dark:text-gray-400">Nuevo Espacio de Trabajo</p>
                 <p className="text-[10px] font-bold text-gray-900 dark:text-gray-500 uppercase tracking-widest">Digitaliza un nuevo aula <br/> con ayuda de DocenTico</p>
               </div>
            </motion.div>
          </>
        )}
      </motion.div>

      <CursoModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCurso(null); }}
        onSave={handleSaveCurso}
        curso={editingCurso}
      />
    </div>
  )
}
