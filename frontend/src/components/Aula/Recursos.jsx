import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  BookOpen,
  Heart,
  Calendar,
  Layers,
  Info,
  X,
  Mic,
  CheckSquare,
  Clock,
  HardDrive,
  Zap
} from 'lucide-react'
import { recursoAPI } from '../../services/api'

export default function Recursos({ cursoId, setToast }) {
  const [recursos, setRecursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecurso, setSelectedRecurso] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newRecurso, setNewRecurso] = useState({ nombre: '', tipo: 'PDF', descripcion: '', cursoId })
  const [isActionLoading, setIsActionLoading] = useState(false)

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

  const handleToggleFavorite = async (e, id) => {
    e.stopPropagation()
    const res = await recursoAPI.toggleFavorite(id)
    setRecursos(prev => prev.map(r => r.id === id ? res.data : r))
  }

  const handleAddRecurso = async (e) => {
    e.preventDefault()
    const res = await recursoAPI.create({ ...newRecurso, icon: getIconByType(newRecurso.tipo), fecha: new Date().toISOString().split('T')[0] })
    setRecursos([res.data, ...recursos])
    setIsAddModalOpen(false)
    setNewRecurso({ nombre: '', tipo: 'PDF', descripcion: '', cursoId })
  }

  const handleDownload = async (e, r) => {
    e.stopPropagation()
    setIsActionLoading(true)
    if (setToast) setToast({ message: `Iniciando descarga de: ${r.nombre}...`, type: 'info' })
    await new Promise(res => setTimeout(res, 1500))
    if (setToast) setToast({ message: `¡${r.nombre} descargado con éxito!`, type: 'success' })
    setIsActionLoading(false)
  }

  const handleOpenLink = async (e, r) => {
    e.stopPropagation()
    if (setToast) setToast({ message: `Abriendo material interactivo...`, type: 'info' })
    await new Promise(res => setTimeout(res, 800))
    // window.open(r.url, '_blank') // MOCK
    setToast({ message: `Redirigiendo a: ${r.nombre}`, type: 'success' })
  }

  const getIconByType = (tipo) => {
     switch(tipo) {
        case 'PDF': return 'FileText'
        case 'Video': return 'Play'
        case 'Audio': return 'Mic'
        case 'Interactivo': return 'CheckSquare'
        case 'Excel': return 'FileText'
        default: return 'ExternalLink'
     }
  }

  const getIcon = (iconName, size = 20) => {
    switch(iconName) {
      case 'FileText': return <FileText size={size} />
      case 'Play': return <Play size={size} />
      case 'ExternalLink': return <ExternalLink size={size} />
      case 'Mic': return <Mic size={size} />
      case 'CheckSquare': return <CheckSquare size={size} />
      default: return <BookOpen size={size} />
    }
  }

  const filteredRecursos = recursos.filter(r => {
    const matchesFilter = filter === 'Todos' || r.tipo === filter || (filter === 'Favoritos' && r.favorito)
    const matchesSearch = r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || (r.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-3 flex-1 max-w-xl shadow-sm glass-effect">
          <Search size={18} className="text-primary-500" />
          <input 
            type="text" 
            placeholder="Buscar en la biblioteca pedagógica..." 
            className="bg-transparent text-xs font-bold text-slate-800 dark:text-white outline-none w-full placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {['Todos', 'Favoritos', 'PDF', 'Video', 'Audio', 'Interactivo'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border whitespace-nowrap flex items-center gap-2 ${
                filter === t 
                  ? 'bg-primary-600 border-primary-500 text-white shadow-lg scale-105' 
                  : 'bg-white dark:bg-slate-900 border-black/5 dark:border-white/5 text-gray-500 hover:border-primary-500/30'
              }`}
            >
              {t === 'Favoritos' && <Heart size={12} className={filter === 'Favoritos' ? 'fill-white' : ''} />}
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-48 bg-surface-subtle dark:bg-white/5 rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      ) : filteredRecursos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          <AnimatePresence mode="popLayout">
            {filteredRecursos.map(r => (
              <motion.div 
                layout
                key={r.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelectedRecurso(r)}
                className="group bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 p-7 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-primary-500/30 transition-all flex flex-col gap-5 relative overflow-hidden cursor-pointer active:scale-95"
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
                 
                 <div className="flex justify-between items-start relative z-10">
                    <div className="w-14 h-14 bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500 shadow-inner group-hover:scale-110 transition-transform">
                       {getIcon(r.icon, 24)}
                    </div>
                    <button 
                      onClick={(e) => handleToggleFavorite(e, r.id)}
                      className={`p-3 rounded-xl transition-all ${r.favorito ? 'bg-rose-500/10 text-rose-500' : 'bg-surface-subtle dark:bg-slate-950 text-gray-400 hover:text-rose-500'}`}
                    >
                       <Heart size={16} className={r.favorito ? 'fill-rose-500' : ''} />
                    </button>
                 </div>

                 <div className="flex-1 relative z-10 space-y-3">
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full border border-primary-500/10">{r.tipo}</span>
                       <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1"><Calendar size={10} /> {r.fecha}</span>
                    </div>
                    <h4 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 dark:text-white leading-tight group-hover:text-primary-500 transition-colors">{r.nombre}</h4>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                       {r.descripcion || 'Sin descripción disponible.'}
                    </p>
                 </div>

                 <div className="flex items-center gap-3 relative z-10 pt-2">
                    <button 
                      onClick={(e) => r.tipo === 'Enlace' || r.tipo === 'Interactivo' ? handleOpenLink(e, r) : handleDownload(e, r)}
                      disabled={isActionLoading}
                      className="flex-1 h-11 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5 dark:shadow-white/5 disabled:opacity-50"
                    >
                       {isActionLoading ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                       ) : (
                          <>
                            {r.tipo === 'Enlace' || r.tipo === 'Interactivo' ? <ExternalLink size={14} /> : <Download size={14} />}
                            {r.tipo === 'Enlace' || r.tipo === 'Interactivo' ? 'Abrir Material' : 'Descargar'}
                          </>
                       )}
                    </button>
                    <button className="w-11 h-11 bg-surface-subtle dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-2xl text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                       <MoreVertical size={16} />
                    </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* ADD CARD */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="border-2 border-dashed border-black/10 dark:border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-primary-500/30 hover:bg-primary-500/5 hover:text-primary-500 transition-all group scale-100 hover:scale-[1.02] active:scale-95 bg-surface-subtle/20"
          >
             <div className="w-16 h-16 rounded-3xl bg-surface-subtle dark:bg-white/5 flex items-center justify-center group-hover:bg-primary-500/10 group-hover:scale-110 transition-all shadow-sm">
                <Plus size={32} />
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Nuevo Recurso</p>
                <p className="text-[8px] font-bold text-gray-500 uppercase opacity-60">Sube material pedagógico</p>
             </div>
          </button>
        </div>
      ) : (
        <div className="text-center py-32 border-2 border-dashed border-black/5 dark:border-white/10 rounded-[3rem] bg-surface-subtle/20 flex flex-col items-center gap-6">
           <div className="w-20 h-20 bg-surface-subtle dark:bg-white/5 rounded-full flex items-center justify-center text-gray-300">
              <FolderOpen size={48} />
           </div>
           <div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-400 dark:text-slate-600 mb-2">Biblioteca Vacía</h3>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">No hay materiales en "{filter}" que coincidan con tu búsqueda</p>
           </div>
           <button onClick={() => { setFilter('Todos'); setSearchTerm('') }} className="btn-secondary py-2 px-6 text-[8px]">Ver Todos</button>
        </div>
      )}

      {/* PREVIEW MODAL */}
      <AnimatePresence>
         {selectedRecurso && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setSelectedRecurso(null)}
                 className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-black/5 dark:border-white/10"
               >
                  <div className="h-40 bg-primary-600 relative overflow-hidden">
                     <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/20 rounded-full animate-ping duration-[10s]" />
                     </div>
                     <div className="absolute top-8 left-8 flex items-center gap-4 text-white">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center">
                           {getIcon(selectedRecurso.icon, 32)}
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-white text-primary-700 rounded-full">{selectedRecurso.tipo}</span>
                           </div>
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{selectedRecurso.nombre}</h3>
                        </div>
                     </div>
                     <button onClick={() => setSelectedRecurso(null)} className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all"><X size={20} /></button>
                  </div>

                  <div className="p-10 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Info size={14} /> Descripción del Recurso</p>
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">{selectedRecurso.descripcion || 'Este material pedagógico ha sido diseñado para fortalecer los aprendizajes significativos del ciclo lectivo actual.'}</p>
                           </div>
                           
                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Layers size={14} /> Detalles Técnicos</p>
                              <div className="grid grid-cols-2 gap-3">
                                 <div className="p-4 bg-surface-subtle dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Tamaño/Duración</p>
                                    <p className="text-xs font-black uppercase italic flex items-center gap-2"><HardDrive size={12} className="text-primary-500" /> {selectedRecurso.size || selectedRecurso.duration || 'N/A'}</p>
                                 </div>
                                 <div className="p-4 bg-surface-subtle dark:bg-slate-950 rounded-2xl border border-black/5 dark:border-white/5">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Creado en</p>
                                    <p className="text-xs font-black uppercase italic flex items-center gap-2"><Clock size={12} className="text-primary-500" /> {selectedRecurso.fecha}</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="p-6 bg-primary-500/5 dark:bg-primary-500/10 rounded-[2.5rem] border border-primary-500/10 space-y-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 flex items-center gap-2"><Zap size={16} /> Sugerencia DocenTico</p>
                              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                                 Recomiendo usar este recurso en el inicio de la clase para despertar curiosidad e indagación previa.
                              </p>
                              <button 
                                onClick={(e) => selectedRecurso.tipo === 'Enlace' ? handleOpenLink(e, selectedRecurso) : handleDownload(e, selectedRecurso)}
                                className="w-full py-3 bg-primary-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary-900/20 active:scale-95 transition-all"
                              >
                                 Integrar a Clase
                              </button>
                           </div>
                           
                           <div className="flex gap-3">
                              <button 
                                onClick={(e) => selectedRecurso.tipo === 'Enlace' ? handleOpenLink(e, selectedRecurso) : handleDownload(e, selectedRecurso)}
                                className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                              >
                                 {selectedRecurso.tipo === 'Enlace' ? <ExternalLink size={14} /> : <Download size={14} />}
                                 {selectedRecurso.tipo === 'Enlace' ? 'Ir al Enlace' : 'Descargar'}
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* ADD RESOURCE MODAL */}
      <AnimatePresence>
         {isAddModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-black/5 dark:border-white/10"
               >
                  <div className="p-10 space-y-8">
                     <div className="flex justify-between items-center">
                        <div className="space-y-1">
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Subir Recurso</h3>
                           <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Expande tu biblioteca personal</p>
                        </div>
                        <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-surface-subtle dark:hover:bg-white/5 rounded-full transition-all"><X size={20} /></button>
                     </div>

                     <form onSubmit={handleAddRecurso} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Nombre del Material</label>
                           <input 
                             required
                             type="text" 
                             placeholder="Ej: Secuencia de Fracciones..." 
                             className="w-full bg-surface-subtle dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-primary-500 transition-all"
                             value={newRecurso.nombre}
                             onChange={e => setNewRecurso({ ...newRecurso, nombre: e.target.value })}
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Tipo de Archivo</label>
                              <select 
                                className="w-full bg-surface-subtle dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-primary-500 appearance-none transition-all"
                                value={newRecurso.tipo}
                                onChange={e => setNewRecurso({ ...newRecurso, tipo: e.target.value })}
                              >
                                 <option>PDF</option>
                                 <option>Video</option>
                                 <option>Audio</option>
                                 <option>Enlace</option>
                                 <option>Interactivo</option>
                                 <option>Excel</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Categoría</label>
                              <div className="w-full bg-surface-subtle dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-slate-500 flex items-center gap-2">
                                 <BookOpen size={14} /> Principal
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Breve Descripción</label>
                           <textarea 
                             rows="3"
                             placeholder="¿Para qué sirve este material?" 
                             className="w-full bg-surface-subtle dark:bg-slate-950 border border-black/5 dark:border-white/10 rounded-3xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-primary-500 transition-all resize-none"
                             value={newRecurso.descripcion}
                             onChange={e => setNewRecurso({ ...newRecurso, descripcion: e.target.value })}
                           />
                        </div>

                        <div className="pt-4">
                           <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-900/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                              <Plus size={18} /> Crear Recurso Ahora
                           </button>
                        </div>
                     </form>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  )
}
