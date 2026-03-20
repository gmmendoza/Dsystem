import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Save,
  Loader2,
  Users
} from 'lucide-react';
import { Toast } from '../Common/Toast';

export default function Asistencia({ cursoId, alumnos }) {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [registros, setRegistros] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAsistencia();
  }, [fecha, cursoId]);

  const fetchAsistencia = async () => {
    setLoading(true);
    try {
      const res = await asistenciaAPI.get(cursoId, fecha);
      setRegistros(res.data || {});
    } finally {
      setLoading(false);
    }
  };

  const toggleAsistencia = (alumnoId) => {
    const current = registros[alumnoId] || 'P'; // P: Presente, A: Ausente
    setRegistros({
      ...registros,
      [alumnoId]: current === 'P' ? 'A' : 'P'
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await asistenciaAPI.save(cursoId, fecha, registros);
      setToast({ message: '¡Asistencia guardada correctamente!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Error al guardar asistencia', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const changeDate = (days) => {
    const current = new Date(fecha);
    current.setDate(current.getDate() + days);
    setFecha(current.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* ── HEADER ASISTENCIA ── */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-black/40 border border-white/5 p-8 rounded-[2rem] gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Users size={24} />
           </div>
           <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Registro de Asistencia</h3>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Gestiona el presente de tus alumnos</p>
           </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
           <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white/10 rounded-xl text-gray-500 transition-all"><ChevronLeft size={20} /></button>
           <div className="flex items-center gap-3 px-4">
              <CalendarIcon size={16} className="text-primary-500" />
              <input 
                type="date" 
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white outline-none border-none cursor-pointer"
              />
           </div>
           <button onClick={() => changeDate(1)} className="p-2 hover:bg-white/10 rounded-xl text-gray-500 transition-all"><ChevronRight size={20} /></button>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Guardar Asistencia
        </button>
      </div>

      {/* ── LISTA DE ALUMNOS ── */}
      <div className="card bg-black/20 border-white/5 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
             <Loader2 size={40} className="animate-spin text-primary-500" />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Cargando lista...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-600 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5 bg-white/[0.02]">
                    <th className="px-8 py-5">Estudiante</th>
                    <th className="px-8 py-5 text-center">Estado</th>
                    <th className="px-8 py-5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {alumnos.map(a => (
                    <tr key={a.id} className="hover:bg-white/[0.01] transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-gray-900 border border-white/10 flex items-center justify-center text-primary-500 text-xs font-black">
                                {a.nombre.charAt(0)}{a.apellido.charAt(0)}
                             </div>
                             <div>
                                <p className="text-sm font-black uppercase italic text-white tracking-tight">{a.nombre} {a.apellido}</p>
                                <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">DNI: {a.dni}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex justify-center">
                             <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${registros[a.id] === 'A' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                                {registros[a.id] === 'A' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                                <span className="text-[8px] font-black uppercase tracking-widest">{registros[a.id] === 'A' ? 'Ausente' : 'Presente'}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => toggleAsistencia(a.id)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                              registros[a.id] === 'A' 
                              ? 'bg-green-600/10 text-green-500 border-green-500/20 hover:bg-green-600 hover:text-white' 
                              : 'bg-red-600/10 text-red-500 border-red-500/20 hover:bg-red-600 hover:text-white'
                            }`}
                          >
                            {registros[a.id] === 'A' ? 'Marcar Presente' : 'Marcar Ausente'}
                          </button>
                       </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

    </div>
  );
}
