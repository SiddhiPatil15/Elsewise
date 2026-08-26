import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { requestAnalysis, ApiError } from '../lib/api'
import { saveToHistory } from '../lib/storage'
import { getPendingDecision, clearPendingDecision } from './NewOpinion'
import { Button } from '../components/ui/Button'

const steps = [
  'Understanding your decision…',
  'Finding hidden assumptions…',
  'Challenging your reasoning…',
  'Exploring alternative paths…',
  'Building your second opinion…',
]

// Decorative floating particles
const particles = [
  { x: '15%', y: '20%', size: 6, delay: 0 },
  { x: '80%', y: '15%', size: 4, delay: 0.8 },
  { x: '70%', y: '75%', size: 8, delay: 1.4 },
  { x: '25%', y: '70%', size: 5, delay: 0.4 },
  { x: '50%', y: '10%', size: 3, delay: 1.1 },
]

const MIN_STEP_MS = 620

export function Analyzing() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const pending = getPendingDecision()
    if (!pending) {
      navigate('/new', { replace: true })
      return
    }

    const stepTimer = setInterval(() => {
      setStepIndex((i) => (i < steps.length - 1 ? i + 1 : i))
    }, MIN_STEP_MS)

    requestAnalysis(pending.decision, pending.context, pending.focusAreas, pending.provider)
      .then((analysis) => {
        saveToHistory(analysis)
        clearPendingDecision()
        navigate(`/results/${analysis.id}`, { replace: true })
      })
      .catch((err) => {
        clearInterval(stepTimer)
        setError(err instanceof ApiError ? err.message : 'Something went wrong generating this analysis.')
      })

    return () => {
      clearInterval(stepTimer)
    }
  }, [navigate])

  if (error) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 text-4xl">✦</div>
        <p className="mb-2 font-display text-xl text-warm-800 ">Analysis failed</p>
        <p className="mb-6 text-sm text-mauve-500 ">{error}</p>
        <div className="flex gap-3">
          <Button onClick={() => window.location.reload()}>Try again</Button>
          <Button variant="outline" onClick={() => navigate('/new')}>
            Edit decision
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-petal-300/40 "
          style={{ left: p.x, top: p.y, width: p.size * 2, height: p.size * 2 }}
          animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3 + i * 0.5, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* )( Logo pulsing */}
      <motion.div
        className="mb-10"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="font-display text-5xl font-bold gradient-text-rose select-none">)(</span>
      </motion.div>

      {/* Step text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="font-display text-xl text-warm-800 sm:text-2xl  mb-8"
        >
          {steps[stepIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-2">
        {steps.map((_, i) => (
          <motion.span
            key={i}
            className="rounded-full"
            animate={{
              width: i === stepIndex ? 24 : 8,
              backgroundColor: i <= stepIndex ? '#EC4899' : '#FECDD7',
            }}
            style={{ height: 8, display: 'block' }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <p className="mt-6 text-xs text-mauve-400/60 ">
        Elsewise is thinking…
      </p>
    </div>
  )
}
