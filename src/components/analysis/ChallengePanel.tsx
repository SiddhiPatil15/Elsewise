import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Challenge } from '../../types/analysis'
import { Button } from '../ui/Button'

const rows: { key: keyof Challenge; label: string }[] = [
  { key: 'strongestArgument', label: 'Your strongest argument' },
  { key: 'strongestCounterargument', label: 'Strongest counterargument' },
  { key: 'evidenceThatWouldChangeDecision', label: 'What evidence would change the decision?' },
  { key: 'likelyUnderestimate', label: 'What are you most likely underestimating?' },
]

export function ChallengePanel({ challenge }: { challenge: Challenge }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="rounded-lg border border-ink-800/12 bg-cream-100/60 p-6  ">
      {!revealed ? (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-ink-600 ">
            See a rigorous, structured challenge to the case you've built.
          </p>
          <Button variant="outline" onClick={() => setRevealed(true)}>
            Try to Prove Me Wrong
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-5">
            {rows.map((row, i) => (
              <motion.div
                key={row.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09, duration: 0.35 }}
              >
                <p className="mb-1 font-mono text-xs uppercase tracking-wider text-ink-400 ">
                  {row.label}
                </p>
                <p className="text-[15px] leading-relaxed text-ink-800 ">{challenge[row.key]}</p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
