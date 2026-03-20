import React, { useState, useEffect } from 'react'
import { 
  Folder, FolderOpen, ChevronRight, Search, 
  Calendar, FileText, Filter, MoreHorizontal,
  Clock, Download
} from 'lucide-react'
import { planificacionAPI } from '../services/api'

export default function Historial() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedYears, setExpandedYears] = useState(['2026'])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await planificacionAPI.getAll()
      setPlanes(res.data)
    } finally {
      setLoading(false)
    }
  }

  // Agrupar por Año > Mes
  const organizedData = planes.reduce((acc, plan) => {
    const date = new Date(plan.fechaInicio)
    const year = date.getFullYear().toString()
    const month = date.toLocaleString('es', { month: 'long' })

    if (!acc[year]) acc[year] = {}
    if (!acc[year][month]) acc[year][month] = []
    acc[year][month].push(plan)
    return acc
  }, {})

  const toggleYear = (year) => {
    setExpandedYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Archivo <span className="text-primary-500">Histórico</span></h2>
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Repositorio central de planificaciones por ciclo lectivo</p>
        </div>

        <div className="flex items-center gap-4 bg-black border border-white/10 rounded-2xl px-6 py-3 min-w-[300px]">
           <Search size={18} className="text-gray-600" />
           <input 
             type="text" 
             placeholder="Buscar en el archivo..." 
             className="bg-transparent text-xs font-bold text-white outline-none w-full"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Sidebar de Navegación de Carpetas */}
         <div className="lg:col-span-3 space-y-6">
            <div className="card bg-black/40 border-white/5 p-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Explorador</h3>
               <div className="space-y-4">
                  {Object.keys(organizedData).sort().reverse().map(year => (
                    <div key={year} className="space-y-2">
                       <button 
                         onClick={() => toggleYear(year)}
                         className="flex items-center gap-3 w-full text-left group"
                       >
                          {expandedYears.includes(year) ? <FolderOpen size={16} className="text-primary-500" /> : <Folder size={16} className="text-gray-700" />}
                          <span className={`text-[11px] font-black uppercase tracking-widest ${expandedYears.includes(year) ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>Ciclo {year}</span>
                       </button>
                       
                       {expandedYears.includes(year) && (
                         <div className="pl-6 space-y-2 border-l border-white/5 ml-2 mt-2">
                            {Object.keys(organizedData[year]).map(month => (
                              <button key={month} className="block text-[10px] font-bold text-gray-600 hover:text-primary-400 uppercase tracking-widest transition-colors">
                                 {month} ({organizedData[year][month].length})
                              </button>
                            ))}
                         </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Vista de Documentos */}
         <div className="lg:col-span-9 space-y-8">
            {Object.keys(organizedData).map(year => (
               expandedYears.includes(year) && Object.keys(organizedData[year]).map(month => (
                 <div key={`${year}-${month}`} className="space-y-4">
                    <div className="flex items-center gap-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500">{month} {year}</h4>
                       <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {organizedData[year][month].filter(p => p.titulo.toLowerCase().includes(searchTerm.toLowerCase())).map(plan => (
                         <div key={plan.id} className="group bg-[#080808] border border-white/5 hover:border-white/10 p-6 rounded-[2rem] transition-all flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-gray-700 group-hover:text-white transition-colors">
                               <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <h5 className="text-sm font-black uppercase italic tracking-tighter text-white truncate mb-1">{plan.titulo}</h5>
                               <div className="flex items-center gap-3 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                                  <span>ID: {plan.id}</span>
                                  <div className="w-1 h-1 rounded-full bg-gray-900" />
                                  <span>{plan.estado}</span>
                               </div>
                            </div>
                            <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 rounded-lg text-gray-500 hover:text-primary-500">
                               <Download size={14} />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
               ))
            ))}
         </div>
      </div>
    </div>
  )
}
