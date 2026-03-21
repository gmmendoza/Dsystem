import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * KPI metric card - Premium Version
 */
export default function KPICard({ label, value, delta, deltaPositive, icon: Icon, color, bg, href, subtitle }) {
  const navigate = useNavigate()

  const DeltaIcon = deltaPositive === true ? TrendingUp : deltaPositive === false ? TrendingDown : Minus
  const deltaColor = deltaPositive === true ? 'text-emerald-500' : deltaPositive === false ? 'text-red-500' : 'text-slate-400'

  return (
    <motion.div
      whileHover={href ? { y: -4, scale: 1.02 } : { y: -2 }}
      onClick={href ? () => navigate(href) : undefined}
      className={`bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-10 rounded-[3rem] shadow-premium transition-all duration-300 ${href ? 'cursor-pointer active:scale-95' : ''}`}
    >
      <div className="flex items-start justify-between mb-8">
        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${bg || 'bg-primary-500/10'}`}>
          {Icon && <Icon className={`${color || 'text-primary-500'}`} size={24} />}
        </div>
        {delta && (
          <div className={`flex items-center gap-1.5 px-3 py-1 bg-surface-subtle dark:bg-white/5 rounded-full text-[10px] font-black ${deltaColor}`}>
            <DeltaIcon size={12} />
            <span>{delta}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-4xl font-black italic tracking-tighter" style={{ color: 'rgb(var(--color-text))' }}>
          {value}
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgb(var(--color-text-muted))' }}>
          {label}
        </div>
      </div>
      
      {subtitle && (
        <p className="text-[11px] mt-4 font-medium italic opacity-60">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
