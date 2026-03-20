import React from 'react';
import { Trash2, GripVertical, Plus } from 'lucide-react';

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
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-gray-200 placeholder:text-gray-800 text-sm font-medium leading-relaxed outline-none resize-none min-h-[100px] border-none"
      />
    </div>
  );
};

export const AddBlockButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-4 border-2 border-dashed border-white/5 hover:border-primary-500/20 hover:bg-primary-500/5 rounded-2xl flex items-center justify-center gap-3 text-gray-700 hover:text-primary-500 transition-all group"
  >
    <Plus size={18} className="group-hover:scale-125 transition-transform" />
    <span className="text-[10px] font-black uppercase tracking-widest">Añadir bloque personalizado</span>
  </button>
);
