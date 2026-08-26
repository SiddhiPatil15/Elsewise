import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const perspectives = [
  { id: 'you', label: 'You', text: 'They don’t respect my vision or understand the effort I put in.' },
  { id: 'friend', label: 'Your Friend', text: 'I didn’t want them to waste time on something that might fail.' },
  { id: 'outsider', label: 'An Outsider', text: 'Two people communicating poorly about a project idea.' },
  { id: 'future', label: '6 Months Later', text: 'That rejection forced a pivot that ultimately made the idea better.' }
]

export function PerspectiveFlip() {
  const [active, setActive] = useState(perspectives[0])

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100/50">
      <h3 className="text-sm font-semibold text-petal-600 tracking-wider uppercase mb-6">Perspective Flip</h3>
      <p className="text-xl text-warm-800 font-display mb-8">
        Situation: “Your friend rejected your idea.”
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {perspectives.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              active.id === p.id 
                ? 'bg-warm-800 text-white shadow-md' 
                : 'bg-warm-50 text-warm-600 hover:bg-warm-100'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative min-h-[100px] bg-blush-50 rounded-2xl p-6 flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-lg text-warm-800 font-medium"
          >
            “{active.text}”
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
