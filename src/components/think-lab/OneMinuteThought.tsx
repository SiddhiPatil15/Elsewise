import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const thoughts = [
  {
    id: 1,
    quote: "What if the thing you're avoiding is exactly what you need to understand?",
    reflection: "We often avoid ideas or tasks that challenge our current worldview. Leaning into that discomfort is usually where the most growth happens."
  },
  {
    id: 2,
    quote: "Are you choosing this because you want it — or because it is expected of you?",
    reflection: "External validation is a powerful invisible force. True autonomy means being willing to disappoint others to stay aligned with yourself."
  },
  {
    id: 3,
    quote: "What would you choose if nobody knew about your decision?",
    reflection: "Performative decision-making optimizes for how things look rather than how they feel. Strip away the audience, and your real priorities emerge."
  },
  {
    id: 4,
    quote: "If you say yes to this, what are you implicitly saying no to?",
    reflection: "Every commitment is a rejection of something else. Make sure the invisible 'no' is a price you are willing to pay."
  }
]

export function OneMinuteThought() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const current = thoughts[currentIndex]

  const nextThought = () => {
    setRevealed(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % thoughts.length)
    }, 200)
  }

  return (
    <div className="py-12 border-t border-pink-100 mt-8">
      <h3 className="text-sm font-semibold text-petal-600 tracking-wider uppercase mb-8 text-center">One Minute Thought</h3>
      
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-pink-100/50 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-2xl md:text-3xl font-display text-warm-800 mb-8 italic leading-relaxed">
              «{current.quote}»
            </p>
            
            <div className="min-h-[120px] flex flex-col items-center justify-center">
              {!revealed ? (
                <button
                  onClick={() => setRevealed(true)}
                  className="bg-warm-50 text-warm-700 px-6 py-2 rounded-full font-medium hover:bg-warm-100 transition-colors text-sm"
                >
                  Reveal Perspective
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <p className="text-plum-900 font-medium leading-relaxed">
                    {current.reflection}
                  </p>
                  <button
                    onClick={nextThought}
                    className="text-petal-600 font-medium hover:text-petal-700 transition-colors text-sm"
                  >
                    Next Thought →
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
