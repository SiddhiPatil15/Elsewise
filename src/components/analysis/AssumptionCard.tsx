import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Assumption } from '../../types/analysis'

export function AssumptionCard({ assumption, index }: { assumption: Assumption; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-lg border border-ink-800/12 bg-cream-50  ">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left sm:px-6"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[15px] font-medium text-ink-900 ">{assumption.text}</p>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-ink-800/10 ">
              <motion.div
                className="h-full rounded-full bg-wine-500 "
                initial={{ width: 0 }}
                whileInView={{ width: `${assumption.confidence}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 + index * 0.05 }}
              />
            </div>
            <span className="font-mono text-xs text-ink-400 ">
              {assumption.confidence}% confidence this is an assumption you're making
            </span>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`mt-1 shrink-0 text-ink-400 transition-transform duration-200  ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <p className="border-t border-ink-800/10 px-5 pb-5 pt-3 text-[14px] leading-relaxed text-ink-500 sm:px-6  ">
              {assumption.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
