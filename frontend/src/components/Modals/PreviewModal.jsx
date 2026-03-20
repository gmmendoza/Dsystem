import { useState } from 'react';
import { 
  X, Printer, Download, FileText, 
  Calendar, User, BookOpen, Target, CheckCircle2 
} from 'lucide-react';

export default function PreviewModal({ isOpen, onClose, data, cursoName }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl h-full max-h-screen flex flex-col rounded-3xl overflow-hidden shadow-2xl">
        {/* Modal Header (Controls) */}
        <div className="flex items-center justify-between p-6 bg-gray-50 border-b border-gray-100 no-print">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                <FileText size={20} />
             </div>
             <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Vista Previa de Documento</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Formato listo para impresión</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handlePrint}
               className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
             >
                <Printer size={16} /> Imprimir / PDF
             </button>
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
             </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto p-12 sm:p-20 bg-white text-gray-900 font-serif print:p-0">
          <div className="max-w-[800px] mx-auto space-y-12">
            {/* Institution Header */}
            <div className="text-center space-y-4 pb-12 border-b-2 border-gray-900">
               <h1 className="text-4xl font-black uppercase tracking-tighter italic">DSystem Academic</h1>
               <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                  <span>Ciclo Lectivo 2026</span>
                  <span>Reporte de Planificación</span>
               </div>
            </div>

            {/* Meta Data Grid */}
            <div className="grid grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Materia / Unidad</p>
                    <p className="text-xl font-bold uppercase">{data.titulo}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Curso / Nivel</p>
                    <p className="text-lg font-bold">{cursoName}</p>
                  </div>
               </div>
               <div className="space-y-6 text-right">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Periodo</p>
                    <p className="text-md font-bold uppercase tracking-tight">{data.fechaInicio} ─ {data.fechaFin}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Docente Responsable</p>
                    <p className="text-md font-bold uppercase">G. Mendoza</p>
                  </div>
               </div>
            </div>

            {/* Dynamic Sections */}
            <div className="space-y-12 pt-10">
               {data.secciones?.map((s, i) => (
                 <div key={i} className="space-y-4">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={18} className="text-gray-900" />
                       <h4 className="text-xs font-black uppercase tracking-[0.3em] border-b border-gray-100 flex-1 pb-1">{s.label}</h4>
                    </div>
                    {s.type === 'media' ? (
                      <div className="pl-8 space-y-4">
                         {s.value?.type === 'video' ? (
                           <div className="aspect-video bg-black rounded-xl overflow-hidden border border-gray-100 max-w-xl">
                              <iframe 
                                className="w-full h-full"
                                src={s.value?.url?.replace('watch?v=', 'embed/')} 
                                title="YouTube content" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                              />
                           </div>
                         ) : (
                           <div className="rounded-xl overflow-hidden border border-gray-100 max-w-xl">
                             <img src={s.value?.url} alt="Recurso" className="w-full h-auto" />
                           </div>
                         )}
                         <p className="text-[10px] italic text-gray-400">Recurso multimedia vinculado: {s.value?.url}</p>
                      </div>
                    ) : (
                      <p className="text-md leading-relaxed whitespace-pre-wrap pl-8 text-gray-800">
                        {s.value?.text || 'Sin contenido especificado.'}
                      </p>
                    )}
                 </div>
               ))}
            </div>

            {/* Footer */}
            <div className="pt-20 mt-20 border-t border-gray-100 flex justify-between items-end opacity-20">
               <p className="text-[9px] font-bold">Documento generado via DSystem SaaS Platform</p>
               <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest">Firma Autorizada</p>
                  <div className="w-40 h-[1px] bg-black mt-4" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .rounded-3xl { border-radius: 0 !important; }
          .shadow-2xl { shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
