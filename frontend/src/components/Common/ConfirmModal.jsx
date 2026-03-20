import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirmar', type = 'danger' }) => {
  if (!isOpen) return null;

  const colors = {
    danger: 'bg-red-600 hover:bg-red-500 shadow-red-900/20',
    primary: 'bg-primary-600 hover:bg-primary-500 shadow-primary-900/20',
    warning: 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20'
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      
      <div className="relative bg-surface border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 transition-colors duration-300">
        <div className="absolute top-0 right-0 p-6">
           <button onClick={onCancel} className="text-gray-600 hover:text-white transition-colors">
              <X size={20} />
           </button>
        </div>
        
        <div className="space-y-6">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary-500/10 text-primary-500'}`}>
              <AlertTriangle size={28} />
           </div>
           
           <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{title}</h3>
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                {message}
              </p>
           </div>
           
           <div className="flex gap-4 pt-4">
              <button 
                onClick={onCancel}
                className="flex-1 py-4 bg-surface-subtle hover:bg-surface-muted text-[10px] font-black uppercase tracking-widest text-gray-500 rounded-xl border border-white/5 transition-all text-center"
              >
                Cancelar
              </button>
              <button 
                onClick={onConfirm}
                className={`flex-1 py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl ${colors[type]}`}
              >
                {confirmText}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
