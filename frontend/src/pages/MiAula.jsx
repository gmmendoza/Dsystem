import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cursoAPI, alumnoAPI } from '../services/api'
import { 
  Plus, 
  BookOpen, 
  Users, 
  ArrowRight, 
  LayoutGrid, 
  Search,
  School,
  Sparkles
} from 'lucide-react'
import { CardSkeleton } from '../components/Common/LoadingSkeleton'
import { Toast } from '../components/Common/Toast'

export default function MiAula() {
  const navigate = useNavigate()
  const [cursos, setCursos] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resCursos, resAlumnos] = await Promise.all([
        cursoAPI.getAll(),
        alumnoAPI.getAll()
      ])
      setCursos(resCursos.data)
      setAlumnos(resAlumnos.data)
    } finally {
      setLoading(false)
    }
  }

  const filteredCursos = cursos.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.nivel.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Estilo SaaS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="px-2 py-0.5 bg-primary-600/20 border border-primary-500/30 rounded-full">
                <span className="text-[8px] font-black uppercase tracking-widest text-primary-400">Classroom Manager</span>
             </div>
             <div className="h-[1px] w-8 bg-gray-800" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">Mis Espacios de Trabajo</span>
          </div>
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">
            Mis <span className="text-primary-500 underline decoration-primary-900">Aulas</span>.
          </h2>
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Selecciona un workspace para gestionar tu curso</p>
        </div>
        
        <button 
          className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-white/5 flex items-center gap-3"
        >
          <Plus size={16} className="text-primary-500" /> Crear Nueva Aula
        </button>
      </div>

      {/* Buscador de Aulas */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-primary-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="BUSCAR AULA O NIVEL..."
          className="w-full bg-[#080808] border border-white/5 rounded-3xl py-6 pl-16 pr-8 outline-none focus:border-primary-500/50 transition-all text-xs font-black uppercase tracking-widest placeholder:text-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid de Aulas (Workspaces) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(3)].map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            {filteredCursos.map(curso => (
              <div 
                key={curso.id} 
                onClick={() => navigate(`/app/aula/${curso.id}`)}
                className="group relative cursor-pointer"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-600/20 to-indigo-600/20 rounded-[2rem] blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 overflow-hidden hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                      {curso.nivel === 'Inicial' ? <Sparkles size={28} /> : <School size={28} />}
                    </div>
                    <div className="px-3 py-1 bg-white/[0.03] rounded-full border border-white/5">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{curso.nivel}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white group-hover:text-primary-400 transition-colors leading-none">
                      {curso.nombre}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider line-clamp-1 italic">
                      {curso.descripcion}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-gray-500">
                        <Users size={12} className="text-primary-500" />
                        <span>{curso.alumnos?.length || 0} Alumnos</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-800" />
                      <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[9px] text-gray-500">
                        <BookOpen size={12} className="text-violet-500" />
                        <span>Workplace Activo</span>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-800 group-hover:text-primary-500 group-hover:translate-x-2 transition-all" />
                  </div>

                  {/* Decoración de fondo */}
                  <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                    <LayoutGrid size={150} />
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State / Add Card */}
            <div className="group border-2 border-dashed border-white/5 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-primary-500/30 hover:bg-primary-500/[0.02] transition-all cursor-pointer min-h-[300px]">
               <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center text-gray-700 group-hover:text-primary-500 transition-colors">
                 <Plus size={32} />
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Nuevo Workspace</p>
                 <p className="text-xs font-bold text-gray-700 uppercase">Haz clic para crear una nueva aula</p>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
