import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Annotation {
  label: string
  text: string
  tone: 'support' | 'missing' | 'assumption'
  anchor: number // approximate character position to align near, 0-100 (%)
}

const question = 'Should I leave my internship to focus on college?'

const annotations: Annotation[] = [
  {
    label: 'Supports',
    text: 'Your GPA has measurably dropped — a concrete, trackable signal.',
    tone: 'support',
    anchor: 12,
  },
  {
    label: 'Assumption',
    text: 'That free time converts directly into better grades.',
    tone: 'assumption',
    anchor: 55,
  },
  {
    label: 'Missing',
    text: 'What you\u2019d actually do with the freed-up hours.',
    tone: 'missing',
    anchor: 82,
  },
]

const toneStyles: Record<Annotation['tone'], string> = {
  support: 'border-moss-600/40 text-moss-600 ',
  missing: 'border-rust-500/40 text-rust-600 ',
  assumption: 'border-wine-500/40 text-wine-600 ',
}

export function MarginAnnotationDemo() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible >= annotations.length) return
    const t = setTimeout(() => setVisible((v) => v + 1), 850)
    return () => clearTimeout(t)
  }, [visible])

  return (
    <div className="rounded-lg border border-ink-800/12 bg-cream-100/50 p-6 sm:p-8  ">
      <p className="mb-6 font-mono text-xs uppercase tracking-wider text-ink-400 ">
        A decision, being read
      </p>
      <p className="mb-8 font-display text-2xl leading-snug text-ink-900 sm:text-[26px] ">
        "{question}"
      </p>
      <div className="space-y-3">
        <AnimatePresence>
          {annotations.slice(0, visible).map((note) => (
            <motion.div
              key={note.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`flex items-start gap-3 border-l-2 py-1 pl-4 ${toneStyles[note.tone]}`}
            >
              <span className="mt-0.5 shrink-0 font-mono text-[11px] font-medium uppercase tracking-wide">
                {note.label}
              </span>
              <span className="text-sm leading-relaxed text-ink-700 ">{note.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
