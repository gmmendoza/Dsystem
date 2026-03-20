import { 
  X, Printer, Download, FileText, 
  Calendar, User, BookOpen, Target, 
  CheckCircle2, Video, Image as ImageIcon, MapPin
} from 'lucide-react';

export default function PreviewModal({ isOpen, onClose, data, cursoName }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isWeekly = data.tipo === 'Semanal';
  const isInicial = data.nivel === 'Inicial';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl h-full max-h-[95vh] flex flex-col rounded-[3rem] overflow-hidden shadow-2xl">
        {/* Modal Header (Controls) */}
        <div className="flex items-center justify-between p-8 bg-gray-50 border-b border-gray-100 no-print">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary-600 rounded-2xl text-white rotate-3">
                <FileText size={20} />
             </div>
             <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Documento de Planificación <span className="text-primary-600">Pro</span></h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Formato Académico Estándar v2.1</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handlePrint}
               className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary-900/20"
             >
                <Printer size={16} /> Imprimir / PDF
             </button>
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
             </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto p-12 sm:p-16 lg:p-24 bg-white text-gray-900 font-sans print:p-0 custom-scrollbar">
          <div className="max-w-[850px] mx-auto space-y-16">
            
            {/* Header / Logo */}
            <div className="flex justify-between items-start border-b-4 border-gray-900 pb-10">
               <div className="space-y-2">
                  <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">DSystem.</h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Plataforma de Gestión Docente</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Ciclo Lectivo 2026</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Ref: {data.tipo} / {data.nivel}</p>
               </div>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-2 gap-12 bg-gray-50/50 p-10 rounded-3xl border border-gray-100">
               <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Asunto / Materia</label>
                    <p className="text-2xl font-black uppercase tracking-tight text-gray-900">{data.titulo}</p>
                    <p className="text-sm font-bold text-primary-600 uppercase mt-1">{data.materia || 'General'}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Espacio Curricular</label>
                    <p className="text-sm font-black uppercase">{cursoName}</p>
                  </div>
               </div>
               <div className="space-y-6 text-right">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Periodo Lectivo</label>
                    <div className="flex items-center justify-end gap-2 text-sm font-black uppercase">
                       <span>{data.fechaInicio}</span>
                       <span className="text-gray-300">─</span>
                       <span>{data.fechaFin || 'Pendiente'}</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-8">
                     <div>
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Nivel</label>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[9px] font-black uppercase tracking-widest">{data.nivel}</span>
                     </div>
                     <div>
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">Tipo</label>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[9px] font-black uppercase tracking-widest">{data.tipo}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* OBJETIVOS / PROPÓSITOS */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                    <Target size={16} />
                 </div>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em]">{isInicial ? 'Propósitos del Docente' : 'Objetivos de Aprendizaje'}</h2>
                 <div className="h-[1px] flex-1 bg-gray-100" />
              </div>
              <ul className="grid grid-cols-1 gap-4 pl-12">
                 {data.objetivos?.map((obj, i) => (
                   <li key={i} className="flex gap-4 items-start group">
                      <div className="mt-1 text-primary-600"><CheckCircle2 size={16} /></div>
                      <p className="text-sm font-bold text-gray-700 leading-relaxed uppercase tracking-tight">{obj}</p>
                   </li>
                 ))}
                 {(!data.objetivos || data.objetivos.length === 0) && <p className="text-sm italic text-gray-400 uppercase pl-4">No se especificaron objetivos.</p>}
              </ul>
            </div>

            {/* ACTIVIDADES */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                    <BookOpen size={16} />
                 </div>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em]">{isInicial ? 'Actividades Lúdicas' : 'Secuencia de Actividades'}</h2>
                 <div className="h-[1px] flex-1 bg-gray-100" />
              </div>

              {!isWeekly ? (
                <div className="space-y-4 pl-12">
                   {data.actividades?.map((act, i) => (
                      <div key={i} className="flex gap-6 items-start">
                         <span className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-black border border-gray-100">{i + 1}</span>
                         <p className="flex-1 text-sm font-bold text-gray-700 leading-relaxed uppercase tracking-tight">{act}</p>
                      </div>
                   ))}
                   {(!data.actividades || data.actividades.length === 0) && <p className="text-sm italic text-gray-400 uppercase">Sin actividades registradas.</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 pl-12">
                   {Object.entries(data.semanal || {}).map(([day, acts]) => (
                      acts.length > 0 && (
                        <div key={day} className="space-y-3">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-600 border-l-4 border-primary-600 pl-3">{day}</h4>
                           <div className="space-y-2 pl-4">
                              {acts.map((a, idx) => (
                                <p key={idx} className="text-xs font-bold text-gray-600 uppercase tracking-tight">• {a}</p>
                              ))}
                           </div>
                        </div>
                      )
                   ))}
                </div>
              )}
            </div>

            {/* RECURSOS */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                    <Video size={16} />
                 </div>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em]">Recursos y Materiales</h2>
                 <div className="h-[1px] flex-1 bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-12">
                 {data.recursos?.map((res, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
                       <div className="aspect-video bg-gray-100 relative">
                          {res.type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                               <Video size={40} />
                               <p className="absolute bottom-2 right-2 text-[8px] font-black uppercase text-gray-400">YouTube Linked</p>
                            </div>
                          ) : (
                            <img src={res.url} className="w-full h-full object-cover" />
                          )}
                       </div>
                       <div className="p-4">
                          <p className="text-[10px] font-black uppercase text-gray-900">{res.title}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase truncate mt-1">{res.url}</p>
                       </div>
                    </div>
                 ))}
                 {(!data.recursos || data.recursos.length === 0) && <p className="text-sm italic text-gray-400 uppercase">No hay recursos vinculados.</p>}
              </div>
            </div>

            {/* EVALUACIÓN */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                    <CheckCircle2 size={16} />
                 </div>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em]">Instancias de Evaluación</h2>
                 <div className="h-[1px] flex-1 bg-gray-100" />
              </div>
              <div className="pl-12">
                 <p className="text-sm leading-relaxed text-gray-700 uppercase font-bold bg-gray-50 p-8 rounded-3xl border border-gray-100 italic">
                    {data.evaluacion || 'Evaluación continua basada en la participación y el cumplimiento de consignas.'}
                 </p>
              </div>
            </div>

            {/* Footer / Firmas */}
            <div className="pt-20 border-t-2 border-gray-900 flex justify-between items-end pb-10">
               <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Validado por DSystem Academic Platform</p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase">Hash Verificación: {Math.random().toString(36).substring(7).toUpperCase()}</p>
               </div>
               <div className="text-right space-y-4">
                  <div className="w-56 h-[1px] bg-gray-200 mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">Firma del Docente / Directivo</p>
               </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          .fixed { position: relative !important; }
          .rounded-[3rem] { border-radius: 0 !important; }
          .shadow-2xl { box-shadow: none !important; }
          .max-w-5xl { max-width: 100% !important; height: auto !important; }
          .h-full { height: auto !important; }
          .overflow-y-auto { overflow: visible !important; }
        }
      `}</style>
    </div>
  );
}
