import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-950/90 border-emerald-500 text-emerald-400',
    error: 'bg-red-950/90 border-red-500 text-red-400',
    info: 'bg-primary-950/90 border-primary-500 text-primary-400'
  };

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 border rounded-xl shadow-2xl backdrop-blur-md animate-slide-up z-[100] ${styles[type]}`}>
      {type === 'success' && <CheckCircle size={18} />}
      {type === 'error' && <XCircle size={18} />}
      <span className="text-sm font-bold uppercase tracking-tight">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
};
