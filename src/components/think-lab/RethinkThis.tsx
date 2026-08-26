import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const statements = [
  {
    id: 1,
    belief: "More options always lead to better decisions.",
    rethink: "More options often lead to decision paralysis and buyer's remorse. Sometimes, artificially limiting your choices is the best way to move forward."
  },
  {
    id: 2,
    belief: "Being busy means being productive.",
    rethink: "Activity is not achievement. You can spend all day doing things that don't matter while avoiding the one thing that does."
  },
  {
    id: 3,
    belief: "The safest choice is always the smartest.",
    rethink: "Playing it too safe carries its own massive risk: the risk of stagnation. Sometimes the 'safe' route is just the most crowded one."
  },
  {
    id: 4,
    belief: "Failure is always a bad outcome.",
    rethink: "Failure is just data. It tells you exactly what doesn't work, which is often the prerequisite for finding what does."
  }
]

export function RethinkThis() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const toggleReveal = (id: number) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="py-12 my-8 border-y border-pink-100">
      <h3 className="text-sm font-semibold text-petal-600 tracking-wider uppercase mb-10 text-center">Rethink This</h3>
      
      <div className="flex flex-col gap-16 max-w-2xl mx-auto">
        {statements.map((item) => (
          <div key={item.id} className="text-center group">
            <AnimatePresence mode="wait">
              {!revealed[item.id] ? (
                <motion.div
                  key="belief"
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)', y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <h4 className="text-2xl md:text-3xl font-display text-warm-800 mb-6 leading-relaxed">
                    “{item.belief}”
                  </h4>
                  <button
                    onClick={() => toggleReveal(item.id)}
                    className="text-petal-600 font-medium hover:text-petal-700 transition-colors inline-flex items-center gap-2"
                  >
                    → Rethink it
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="rethink"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p className="text-xl md:text-2xl font-medium text-plum-900 mb-6 leading-relaxed">
                    {item.rethink}
                  </p>
                  <button
                    onClick={() => toggleReveal(item.id)}
                    className="text-mauve-400 text-sm hover:text-mauve-600 transition-colors"
                  >
                    Show original belief
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
