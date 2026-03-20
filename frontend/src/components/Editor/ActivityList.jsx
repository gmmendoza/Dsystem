import React from 'react';
import { Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';

export default function ActivityList({ activities, onChange, label = "Actividades" }) {
  const addActivity = () => {
    onChange([...activities, ""]);
  };

  const updateActivity = (index, value) => {
    const newActivities = [...activities];
    newActivities[index] = value;
    onChange(newActivities);
  };

  const removeActivity = (index) => {
    onChange(activities.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">{label}</label>
        <span className="text-[9px] font-bold text-gray-500 uppercase">{activities.length} PASOS</span>
      </div>
      
      <div className="space-y-3">
        {activities.map((act, index) => (
          <div key={index} className="group flex items-center gap-3 bg-white/[0.02] border border-white/5 hover:border-white/10 p-4 rounded-2xl transition-all">
            <div className="text-gray-800 group-hover:text-primary-500">
               <CheckCircle2 size={16} />
            </div>
            <input 
              type="text"
              value={act}
              onChange={(e) => updateActivity(index, e.target.value)}
              placeholder="Describa la actividad..."
              className="flex-1 bg-transparent text-sm font-medium text-gray-300 outline-none placeholder:text-gray-800"
            />
            <button 
              onClick={() => removeActivity(index)}
              className="opacity-0 group-hover:opacity-100 p-2 text-gray-700 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={addActivity}
        className="w-full py-4 border-2 border-dashed border-white/5 hover:border-primary-500/30 hover:bg-primary-500/5 rounded-2xl flex items-center justify-center gap-3 text-gray-700 hover:text-primary-500 transition-all group mt-4"
      >
        <Plus size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-primary-500">Agregar actividad</span>
      </button>
    </div>
  );
}
