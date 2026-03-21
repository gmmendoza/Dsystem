import { motion } from 'framer-motion'
import { Bot, Sparkles, TrendingUp, ArrowRight, Zap, Target } from 'lucide-react'

/**
 * Scaled Down & Refined AIAssistantSection
 * Premium but compact contextual analysis.
 */
export default function AIAssistantSection({ title, insight, metrics = [], actions = [] }) {
  return (
    <div className="card-premium p-6 relative overflow-hidden group">
      {/* Subtle AI BG Effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/5 rounded-full blur-[60px] -mr-20 -mt-20 group-hover:bg-primary-600/10 transition-colors duration-700" />
      
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600/10 border border-primary-500/20 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 leading-none mb-1">DocenTico Insight</h3>
              <p className="text-sm font-black uppercase italic tracking-tighter text-gray-900 dark:text-gray-100">{title}</p>
            </div>
          </div>
          <Sparkles size={16} className="text-primary-400 animate-pulse" />
        </div>

        {/* Insight content */}
        <div className="bg-surface-subtle dark:bg-white/5 border border-black/5 dark:border-white/5 p-5 rounded-2xl">
          <p className="text-[12px] font-medium leading-relaxed italic opacity-80 decoration-primary-500/20">
            &quot;{insight}&quot;
          </p>
        </div>

        {/* Metrics Row (Small) */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="space-y-0.5">
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">{m.label}</span>
                <div className="flex items-center gap-1.5">
                   <span className="text-lg font-black italic tracking-tighter">{m.value}</span>
                   {m.trend && (
                     <span className={`text-[8px] font-black ${m.trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                       {m.trend > 0 ? '+' : ''}{m.trend}%
                     </span>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {actions.map((act, i) => (
              <button
                key={i}
                onClick={act.onClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  act.primary 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-950/20 hover:scale-[1.03]' 
                    : 'bg-surface-subtle dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-surface-muted'
                }`}
              >
                {act.icon && <act.icon size={13} />}
                {act.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
