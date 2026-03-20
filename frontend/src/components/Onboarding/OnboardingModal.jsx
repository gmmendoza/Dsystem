import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, GraduationCap, Users, Bot, ArrowRight, X, Check
} from 'lucide-react'

const STEPS = [
  {
    icon: Sparkles,
    title: '¡Bienvenido a DSystem!',
    subtitle: 'Tu plataforma SaaS para educadores modernos',
    description: 'DSystem te ayuda a gestionar tus aulas, estudiantes, planificaciones y obtener insights de IA para mejorar el rendimiento académico. Todo en un solo lugar.',
    cta: 'Siguiente',
  },
  {
    icon: GraduationCap,
    title: 'Crea tu primera Aula',
    subtitle: 'Organizá a tus estudiantes',
    description: 'Las Aulas son tus espacios de trabajo. Cada aula tiene sus propios estudiantes, horario y planificaciones. Podés crear tantas como necesites.',
    cta: 'Siguiente',
    action: '/mi-aula',
    actionLabel: 'Ir a Mis Aulas',
  },
  {
    icon: Bot,
    title: 'Conocé a DocenTico',
    subtitle: 'Tu asistente de IA educativa',
    description: 'DocenTico analiza tus datos en tiempo real y te da sugerencias proactivas: identifica alumnos en riesgo, detecta patrones y genera reportes automáticos.',
    cta: 'Empezar',
  },
]

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const done = localStorage.getItem('dsystem_onboarding_done')
    if (!done) setVisible(true)
  }, [])

  const handleClose = () => {
    localStorage.setItem('dsystem_onboarding_done', '1')
    setVisible(false)
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      handleClose()
    }
  }

  const current = STEPS[step]
  const Icon = current.icon

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md card shadow-float overflow-hidden relative"
            >
              {/* Skip button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 btn-ghost p-2 rounded-xl z-10"
              >
                <X size={16} />
              </button>

              {/* Decorative gradient */}
              <div className="absolute inset-0 opacity-30 pointer-events-none bg-gradient-mesh" />

              <div className="relative z-10 p-8">
                {/* Step indicators */}
                <div className="flex gap-2 mb-8">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'bg-primary-500 flex-[2]' : i < step ? 'bg-primary-300 dark:bg-primary-700 flex-1' : 'bg-surface-muted flex-1'}`}
                    />
                  ))}
                </div>

                {/* Icon */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center border border-primary-500/20">
                      <Icon className="text-primary-500" size={32} />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="text-center space-y-2 mb-8"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary-500">
                      {current.subtitle}
                    </p>
                    <h2 className="text-xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>
                      {current.title}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--color-text-muted))' }}>
                      {current.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button onClick={handleNext} className="btn-primary w-full justify-center">
                    {step === STEPS.length - 1 ? (
                      <><Check size={16} /> {current.cta}</>
                    ) : (
                      <>{current.cta} <ArrowRight size={16} /></>
                    )}
                  </button>
                  {current.action && (
                    <button
                      onClick={() => { navigate(current.action); handleClose() }}
                      className="btn-secondary w-full justify-center"
                    >
                      {current.actionLabel}
                    </button>
                  )}
                  {step < STEPS.length - 1 && (
                    <button onClick={handleClose} className="text-[12px] text-center w-full py-1"
                            style={{ color: 'rgb(var(--color-text-muted))' }}>
                      Saltar introducción
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
