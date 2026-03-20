import { motion } from 'framer-motion'

/**
 * Generic Empty State component.
 * @param {string}   icon        - Lucide icon component
 * @param {string}   title       - Main heading
 * @param {string}   description - Supporting text
 * @param {string}   ctaLabel    - CTA button label
 * @param {function} onCta       - CTA click handler
 * @param {string}   variant     - 'default' | 'compact'
 */
export default function EmptyState({ icon: Icon, title, description, ctaLabel, onCta, variant = 'default' }) {
  const isCompact = variant === 'compact'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center ${isCompact ? 'py-10 px-6' : 'py-20 px-8'}`}
    >
      {/* Icon */}
      <div className={`relative mb-5 ${isCompact ? 'w-12 h-12' : 'w-16 h-16'}`}>
        <div className="absolute inset-0 bg-primary-500/10 rounded-2xl blur-xl" />
        <div className={`relative flex items-center justify-center w-full h-full bg-surface-elevated border rounded-2xl shadow-card ${isCompact ? '' : ''}`}
          style={{ borderColor: 'rgb(var(--color-border))' }}>
          {Icon && <Icon className="text-primary-500" size={isCompact ? 20 : 28} />}
        </div>
      </div>

      {/* Text */}
      <h3 className={`font-bold mb-2 ${isCompact ? 'text-sm' : 'text-base'}`}
          style={{ color: 'rgb(var(--color-text))' }}>
        {title}
      </h3>
      {description && (
        <p className={`max-w-xs leading-relaxed mb-6 ${isCompact ? 'text-xs' : 'text-sm'}`}
           style={{ color: 'rgb(var(--color-text-muted))' }}>
          {description}
        </p>
      )}

      {/* CTA */}
      {ctaLabel && onCta && (
        <button onClick={onCta} className="btn-primary text-sm">
          {ctaLabel}
        </button>
      )}
    </motion.div>
  )
}
