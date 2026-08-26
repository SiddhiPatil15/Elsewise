import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Perspective } from '../../types/analysis'

export function PerspectiveCard({ perspective }: { perspective: Perspective }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-lg border border-ink-800/12 ">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div>
          <p className="text-[15px] font-medium text-ink-900 ">{perspective.label}</p>
          <p className="mt-0.5 text-sm italic text-ink-500 ">"{perspective.prompt}"</p>
        </div>
        <ChevronDown
          size={17}
          className={`shrink-0 text-ink-400 transition-transform duration-200  ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="border-t border-ink-800/10 px-5 pb-5 pt-3 text-[14px] leading-relaxed text-ink-600  ">
              {perspective.analysis}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
