import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Play, 
  ExternalLink, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Download,
  Trash2,
  BookOpen
} from 'lucide-react'
import { recursoAPI } from '../../services/api'

export default function Recursos({ cursoId }) {
  const [recursos, setRecursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRecursos()
  }, [cursoId])

  const fetchRecursos = async () => {
    setLoading(true)
    try {
      const res = await recursoAPI.getByCursoId(cursoId)
      setRecursos(res.data)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'FileText': return <FileText size={20} />
      case 'Play': return <Play size={20} />
      case 'ExternalLink': return <ExternalLink size={20} />
      default: return <BookOpen size={20} />
    }
  }

  const filteredRecursos = recursos.filter(r => {
    const matchesFilter = filter === 'Todos' || r.tipo === filter
    const matchesSearch = r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-2.5 flex-1 max-w-md shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar materiales..." 
            className="bg-transparent text-xs font-bold text-slate-800 dark:text-white outline-none w-full placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['Todos', 'PDF', 'Video', 'Enlace', 'Excel'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${
                filter === t 
                  ? 'bg-primary-600 border-primary-500 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 border-black/5 dark:border-white/5 text-gray-500 hover:border-primary-500/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-40 bg-surface-subtle dark:bg-white/5 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredRecursos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecursos.map(r => (
            <div key={r.id} className="group bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 p-6 rounded-[2rem] shadow-sm hover:border-primary-500/30 transition-all flex items-start gap-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary-500/10 transition-colors" />
               
               <div className="w-12 h-12 bg-surface-subtle dark:bg-slate-950 border border-black/5 dark:border-white/5 rounded-2xl flex items-center justify-center text-primary-500 shadow-inner group-hover:scale-110 transition-transform">
                  {getIcon(r.icon)}
               </div>

               <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-[7px] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded-md border border-primary-500/10">{r.tipo}</span>
                  </div>
                  <h4 className="text-sm font-black uppercase italic tracking-tighter text-slate-800 dark:text-white truncate mb-4">{r.nombre}</h4>
                  
                  <div className="flex items-center gap-2">
                     <button className="flex-1 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[8px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        {r.tipo === 'Enlace' ? <ExternalLink size={10} /> : <Download size={10} />}
                        {r.tipo === 'Enlace' ? 'Abrir' : 'Bajar'}
                     </button>
                     <button className="p-2 bg-surface-subtle dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-xl text-gray-500 hover:text-rose-500 transition-colors">
                        <Trash2 size={12} />
                     </button>
                  </div>
               </div>
            </div>
          ))}

          {/* ADD CARD */}
          <button className="border-2 border-dashed border-black/5 dark:border-white/5 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-primary-500/30 hover:text-primary-500 transition-all group">
             <div className="w-10 h-10 rounded-full bg-surface-subtle dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={20} />
             </div>
             <span className="text-[9px] font-black uppercase tracking-widest">Añadir Recurso</span>
          </button>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-black/5 dark:border-white/10 rounded-[2rem] bg-surface-subtle/20">
           <FolderOpen size={40} className="text-gray-300 mx-auto mb-4" />
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No hay recursos en esta categoría</p>
        </div>
      )}
    </div>
  )
}
