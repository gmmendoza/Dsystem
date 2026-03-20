import React from 'react';
import { Trash2, GripVertical, Plus, Image as ImageIcon, Video, Link, X } from 'lucide-react';

export const EditorBlock = ({ 
  id, 
  label, 
  value, 
  placeholder, 
  onChange, 
  onRemove, 
  isRemovable = true 
}) => {
  return (
    <div className="group relative bg-[#0A0A0A] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all animate-in slide-in-from-left-4 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing text-gray-700 hover:text-gray-400 p-1">
            <GripVertical size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-primary-500 transition-colors">
            {label}
          </span>
        </div>
        
        {isRemovable && (
          <button 
            onClick={() => onRemove(id)}
            className="opacity-0 group-hover:opacity-100 p-2 text-gray-700 hover:text-red-500 hover:bg-black/40 rounded-lg transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(id, { ...value, text: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-transparent text-gray-200 placeholder:text-gray-800 text-sm font-medium leading-relaxed outline-none resize-none min-h-[100px] border-none"
      />
    </div>
  );
};

export const MultimediaBlock = ({ 
    id, 
    label, 
    value, 
    onChange, 
    onRemove 
}) => {
    const isVideo = value?.type === 'video';
    const url = value?.url || '';

    return (
        <div className="group relative bg-[#0A0A0A] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all animate-in slide-in-from-left-4 duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="cursor-grab text-gray-700 p-1"><GripVertical size={16} /></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">
                        {label || (isVideo ? 'Video Embed' : 'Imagen de Recurso')}
                    </span>
                </div>
                <button onClick={() => onRemove(id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-700 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="space-y-4">
                {!url ? (
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder={isVideo ? "URL de YouTube (ej: https://www.youtube.com/watch?v=...)" : "URL de la imagen..."}
                            className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-primary-500"
                            onBlur={(e) => onChange(id, { ...value, url: e.target.value })}
                        />
                    </div>
                ) : (
                    <div className="relative rounded-xl overflow-hidden border border-white/5 bg-black aspect-video max-w-2xl mx-auto">
                        {isVideo ? (
                            <iframe 
                                className="w-full h-full"
                                src={url.replace('watch?v=', 'embed/')} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            />
                        ) : (
                            <img src={url} alt="Recurso" className="w-full h-full object-contain" />
                        )}
                        <button 
                            onClick={() => onChange(id, { ...value, url: '' })}
                            className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AddBlockButton = ({ onAddText, onAddMedia }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <button
        onClick={onAddText}
        className="py-4 border-2 border-dashed border-white/5 hover:border-primary-500/20 hover:bg-primary-500/5 rounded-2xl flex items-center justify-center gap-3 text-gray-700 hover:text-primary-500 transition-all group"
    >
        <Plus size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest">Añadir texto libre</span>
    </button>
    <button
        onClick={onAddMedia}
        className="py-4 border-2 border-dashed border-white/5 hover:border-violet-500/20 hover:bg-violet-500/5 rounded-2xl flex items-center justify-center gap-3 text-gray-700 hover:text-violet-500 transition-all group"
    >
        <Link size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest">Añadir recurso multimedia</span>
    </button>
  </div>
);
