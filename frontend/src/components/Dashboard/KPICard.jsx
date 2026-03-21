import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * KPI metric card - Scaled Down Version
 */
export default function KPICard({ label, value, delta, deltaPositive, icon: Icon, color, bg, href, subtitle }) {
  const navigate = useNavigate()

  const DeltaIcon = deltaPositive === true ? TrendingUp : deltaPositive === false ? TrendingDown : Minus
  const deltaColor = deltaPositive === true ? 'text-emerald-500' : deltaPositive === false ? 'text-red-500' : 'text-slate-400'

  return (
    <motion.div
      whileHover={href ? { y: -2, scale: 1.01 } : { y: -1 }}
      onClick={href ? () => navigate(href) : undefined}
      className={`bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 p-6 rounded-2xl shadow-premium transition-all duration-300 ${href ? 'cursor-pointer active:scale-98' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${bg || 'bg-primary-500/10'}`}>
          {Icon && <Icon className={`${color || 'text-primary-500'}`} size={18} />}
        </div>
        {delta && (
          <div className={`flex items-center gap-1 px-2 py-0.5 bg-surface-subtle dark:bg-white/5 rounded-full text-[9px] font-bold ${deltaColor}`}>
            <DeltaIcon size={10} />
            <span>{delta}</span>
          </div>
        )}
      </div>

      <div className="space-y-0.5">
        <div className="text-2xl font-black italic tracking-tighter" style={{ color: 'rgb(var(--color-text))' }}>
          {value}
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest opacity-60" style={{ color: 'rgb(var(--color-text-muted))' }}>
          {label}
        </div>
      </div>
      
      {subtitle && (
        <p className="text-[10px] mt-2 font-medium italic opacity-50">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
