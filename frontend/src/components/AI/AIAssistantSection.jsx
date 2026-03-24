import { motion } from 'framer-motion'
import { Bot, Sparkles, TrendingUp, ArrowRight, Zap, Target } from 'lucide-react'

/**
 * Scaled Down & Refined AIAssistantSection
 * Premium but compact contextual analysis.
 */
export default function AIAssistantSection({ title, insight, metrics = [], actions = [] }) {
  return (
    <div className="card-premium p-5 relative overflow-hidden group">
      {/* Subtle AI BG Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-primary-600/10 transition-colors duration-700" />
      
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600/10 border border-primary-500/20 rounded-lg flex items-center justify-center text-primary-600 shadow-sm">
              <Bot size={15} />
            </div>
            <div>
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-500 leading-none mb-1">DocenTico AI</h3>
              <p className="text-[13px] font-black uppercase italic tracking-tighter text-slate-900 dark:text-white leading-none">{title}</p>
            </div>
          </div>
          <Sparkles size={14} className="text-primary-400 animate-pulse" />
        </div>

        {/* Insight content */}
        <div className="bg-surface-subtle dark:bg-slate-950/50 border border-black/5 dark:border-white/10 p-4 rounded-xl">
          <p className="text-[11px] font-medium leading-relaxed italic text-slate-600 dark:text-slate-400">
            &quot;{insight}&quot;
          </p>
        </div>

        {/* Metrics Row (Small) */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
            {metrics.map((m, i) => (
              <div key={i} className="space-y-0">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{m.label}</span>
                <div className="flex items-center gap-1.5">
                   <span className="text-base font-black italic tracking-tighter text-slate-900 dark:text-white">{m.value}</span>
                   {m.trend && (
                     <span className={`text-[8px] font-black ${m.trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                       {m.trend > 0 ? '↑' : '↓'}{Math.abs(m.trend)}%
                     </span>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-black/5 dark:border-white/5 mt-2">
            {actions.map((act, i) => (
              <button
                key={i}
                onClick={act.onClick}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                  act.primary 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-950/20 hover:scale-[1.02]' 
                    : 'bg-surface-subtle dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-surface-muted dark:text-slate-300'
                }`}
              >
                {act.icon && <act.icon size={12} />}
                {act.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
