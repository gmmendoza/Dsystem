import { motion } from 'framer-motion'
import { Sparkles, Bot, Zap, TrendingUp, AlertTriangle, CheckCircle2, FileText, MessageSquare } from 'lucide-react'

/**
 * AIAssistantSection - A premium contextual AI component
 * Displays AI insights, metrics, and actionable recommendations for a specific context (Student/Course).
 * 
 * @param {string} title - Section title (e.g. "Análisis de DocenTico")
 * @param {string} insight - Main AI text insight
 * @param {Array}  metrics - Simple metrics [{ label, value, trend }]
 * @param {Array}  actions - Action buttons [{ label, onClick, icon, primary }]
 */
export default function AIAssistantSection({ title, insight, metrics = [], actions = [] }) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-[2.5rem] shadow-premium group">
      {/* AI Glow Effect */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary-500/20 transition-all duration-1000" />
      
      <div className="p-10 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-600 border border-primary-500/20">
                 <Bot size={24} />
              </div>
              <div>
                 <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">{title || 'Análisis de IA'}</h3>
                 <span className="text-[9px] font-black uppercase tracking-widest text-primary-500">Mente Proactiva DocenTico</span>
              </div>
           </div>
           <div className="flex gap-1.5">
              {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-black/5 dark:bg-white/10 rounded-full" />)}
           </div>
        </div>

        {/* The Insight Text */}
        <div className="bg-surface-subtle dark:bg-white/5 border border-black/5 dark:border-white/5 p-8 rounded-[2rem] relative">
           <Sparkles size={16} className="absolute -top-2 -left-2 text-primary-500 animate-pulse" />
           <p className="text-sm font-medium leading-relaxed italic text-gray-700 dark:text-gray-300">
             &ldquo;{insight || 'Estoy analizando los datos actuales para proporcionarte una visión pedagógica profunda.'}&rdquo;
           </p>
        </div>

        {/* Quick Metrics */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {metrics.map((m, i) => (
               <div key={i} className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{m.label}</span>
                  <div className="flex items-center gap-2">
                     <span className="text-xl font-black italic tracking-tighter">{m.value}</span>
                     {m.trend && (
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${m.trend > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                           {m.trend > 0 ? '+' : ''}{m.trend}%
                        </span>
                     )}
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-4 border-t border-black/5 dark:border-white/5">
             {actions.map((a, i) => (
                <button
                  key={i}
                  onClick={a.onClick}
                  className={`flex-1 min-w-[140px] py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    a.primary 
                      ? 'bg-primary-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-primary-700' 
                      : 'bg-surface-subtle dark:bg-white/5 text-gray-700 dark:text-gray-400 border border-black/5 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                   {a.icon && <a.icon size={14} />} {a.label}
                </button>
             ))}
          </div>
        )}
      </div>
    </div>
  )
}
