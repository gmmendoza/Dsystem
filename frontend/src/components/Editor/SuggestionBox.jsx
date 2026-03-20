import React from 'react';
import { Sparkles, Lightbulb, Zap } from 'lucide-react';

const SUGGESTIONS = {
  Matemática: [
    "Incluir ejercicios de resolución de problemas reales.",
    "Usar gráficos visuales para demostrar funciones.",
    "Proponer un desafío de cálculo mental al inicio."
  ],
  Lengua: [
    "Fomentar la lectura en voz alta y comprensión crítica.",
    "Realizar un debate grupal sobre el tema central.",
    "Incorporar un momento de escritura creativa."
  ],
  Inicial: [
    "Integrar canciones infantiles relacionadas al tema.",
    "Priorizar el movimiento corporal y el juego libre.",
    "Usar materiales táctiles (masa, pinturas, bloques)."
  ]
};

export default function SuggestionBox({ subject, level }) {
  const suggestions = level === 'Inicial' ? SUGGESTIONS.Inicial : (SUGGESTIONS[subject] || []);

  if (suggestions.length === 0) return null;

  return (
    <div className="p-8 bg-primary-600/5 border border-primary-500/10 rounded-[2.5rem] space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center text-primary-500">
           <Lightbulb size={20} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-400">Asistente DSystem</h4>
          <p className="text-[9px] font-bold text-gray-600 uppercase">Sugerencias pedagógicas</p>
        </div>
      </div>

      <div className="space-y-4">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-4 group">
            <div className="mt-1 text-primary-600 group-hover:text-primary-400 transition-colors">
              <Zap size={14} />
            </div>
            <p className="text-[11px] font-bold text-gray-400 leading-relaxed group-hover:text-white transition-colors">{s}</p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-primary-500/10">
         <p className="text-[9px] font-black italic text-primary-700 uppercase">Personalizado para: {level === 'Inicial' ? 'Nivel Inicial' : subject}</p>
      </div>
    </div>
  );
}
