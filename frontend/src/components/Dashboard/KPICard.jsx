import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * KPI metric card
 * @param {string}   label   - Metric label
 * @param {string}   value   - Main value
 * @param {string}   delta   - e.g. "+12%" or "-3%"
 * @param {boolean}  deltaPositive - null = neutral
 * @param {Component} icon   - Lucide icon
 * @param {string}   color   - Tailwind text color class for icon
 * @param {string}   bg      - Tailwind bg class for icon container
 * @param {string}   href    - Optional navigation link
 * @param {string}   subtitle - Optional subtitle
 */
export default function KPICard({ label, value, delta, deltaPositive, icon: Icon, color, bg, href, subtitle }) {
  const navigate = useNavigate()

  const DeltaIcon = deltaPositive === true
    ? TrendingUp
    : deltaPositive === false
      ? TrendingDown
      : Minus

  const deltaColor = deltaPositive === true
    ? 'text-emerald-500'
    : deltaPositive === false
      ? 'text-red-500'
      : 'text-slate-400'

  return (
    <motion.div
      whileHover={href ? { y: -2, boxShadow: '0 8px 30px -4px rgb(0 0 0 / 0.12)' } : {}}
      onClick={href ? () => navigate(href) : undefined}
      className={`card p-6 flex flex-col gap-4 ${href ? 'cursor-pointer' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10  flex items-center justify-center rounded-xl ${bg || 'bg-primary-500/10'}`}>
          {Icon && <Icon className={`${color || 'text-primary-500'}`} size={20} />}
        </div>
        {delta && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold ${deltaColor}`}>
            <DeltaIcon size={13} />
            <span>{delta}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold tracking-tight" style={{ color: 'rgb(var(--color-text))' }}>
          {value}
        </p>
        <p className="text-[12px] font-semibold mt-0.5" style={{ color: 'rgb(var(--color-text-muted))' }}>
          {label}
        </p>
        {subtitle && (
          <p className="text-[11px] mt-1" style={{ color: 'rgb(var(--color-text-muted))' }}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  )
}
