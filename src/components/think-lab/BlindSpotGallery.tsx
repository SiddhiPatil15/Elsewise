import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const blindSpots = [
  {
    id: 1,
    premise: "You optimized for price.",
    counter: "But ignored the cost of your time.",
    question: "Is saving money costing you hours you can't get back?"
  },
  {
    id: 2,
    premise: "You compared two options.",
    counter: "But forgot there could be a third.",
    question: "What would you do if neither of your current options were available?"
  },
  {
    id: 3,
    premise: "You focused on what you gain.",
    counter: "But forgot what you give up.",
    question: "What is the hidden opportunity cost of saying yes to this?"
  },
  {
    id: 4,
    premise: "You planned for success.",
    counter: "But never considered what happens if it fails.",
    question: "If this completely fails, how will you recover?"
  }
]

export function BlindSpotGallery() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="py-8">
      <h3 className="text-sm font-semibold text-petal-600 tracking-wider uppercase mb-8">Blind Spot Gallery</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blindSpots.map((spot) => (
          <motion.div
            key={spot.id}
            layout
            onClick={() => setExpandedId(expandedId === spot.id ? null : spot.id)}
            className="cursor-pointer bg-white rounded-3xl p-6 shadow-sm border border-pink-100/50 hover:shadow-md transition-shadow"
          >
            <motion.p layout className="text-lg text-warm-800 font-medium">
              {spot.premise}
            </motion.p>
            
            <AnimatePresence>
              {expandedId === spot.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-pink-100">
                    <p className="text-petal-600 font-medium mb-3">{spot.counter}</p>
                    <p className="text-sm text-mauve-500 italic">Think about this: {spot.question}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
