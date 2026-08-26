import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const debates = [
  {
    id: 1,
    question: "Is stability better than passion?",
    sideA: {
      label: "Yes, stability is better.",
      argument: "Passion is fleeting and unreliable. Stability provides a foundation that allows you to build a secure life, reduce stress, and pursue hobbies without the pressure of monetizing them."
    },
    sideB: {
      label: "No, passion is better.",
      argument: "Without passion, stability becomes a cage. Human beings need purpose and drive to feel fulfilled, and sacrificing passion for safety often leads to long-term regret."
    }
  },
  {
    id: 2,
    question: "Is working hard better than working smart?",
    sideA: {
      label: "Hard work wins.",
      argument: "Working smart is often an excuse to avoid effort. True excellence requires undeniable volume and grit that simply cannot be bypassed by finding 'clever' shortcuts."
    },
    sideB: {
      label: "Smart work wins.",
      argument: "Effort without direction is wasted energy. Working smart means maximizing leverage so that your hard work actually translates into disproportionate results."
    }
  },
  {
    id: 3,
    question: "Is having more choices actually better?",
    sideA: {
      label: "More choices = Freedom.",
      argument: "Options empower us. Having more choices means you are more likely to find the exact fit for your specific needs, rather than settling for a compromise."
    },
    sideB: {
      label: "More choices = Paralysis.",
      argument: "Excessive options overwhelm the brain, leading to decision fatigue, anxiety, and buyer's remorse, because you always wonder if the other choices were better."
    }
  }
]

export function TwoSides() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const current = debates[currentIndex]

  const nextDebate = () => {
    setRevealed(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % debates.length)
    }, 200)
  }

  return (
    <div className="py-12">
      <h3 className="text-sm font-semibold text-petal-600 tracking-wider uppercase mb-8 text-center">Two Sides</h3>
      
      <div className="max-w-4xl mx-auto">
        <h4 className="text-2xl font-display text-warm-800 mb-10 text-center">
          {current.question}
        </h4>
        
        <div className="relative flex flex-col md:flex-row gap-6 md:gap-0 bg-white rounded-3xl p-2 shadow-sm border border-pink-100/50">
          
          {/* Side A */}
          <div className="flex-1 p-8 rounded-2xl bg-warm-50/50">
            <h5 className="font-semibold text-warm-800 mb-4 uppercase tracking-wide text-xs">Side A</h5>
            <p className="font-display text-lg text-plum-900 font-medium mb-3">{current.sideA.label}</p>
            <AnimatePresence>
              {revealed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-warm-700 text-sm leading-relaxed"
                >
                  {current.sideA.argument}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Center Divider / Button */}
          <div className="md:absolute top-1/2 left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex justify-center z-10 my-4 md:my-0">
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="bg-white border-2 border-petal-200 text-petal-600 px-6 py-2 rounded-full font-medium shadow-sm hover:shadow hover:border-petal-300 transition-all text-sm whitespace-nowrap"
              >
                Explore both perspectives
              </button>
            ) : (
              <button
                onClick={nextDebate}
                className="bg-warm-800 text-white px-6 py-2 rounded-full font-medium shadow-sm hover:bg-warm-900 transition-all text-sm whitespace-nowrap"
              >
                Next Debate →
              </button>
            )}
          </div>

          {/* Side B */}
          <div className="flex-1 p-8 rounded-2xl bg-blush-50/50 text-right md:text-left">
            <h5 className="font-semibold text-warm-800 mb-4 uppercase tracking-wide text-xs md:text-right">Side B</h5>
            <p className="font-display text-lg text-plum-900 font-medium mb-3 md:text-right">{current.sideB.label}</p>
            <AnimatePresence>
              {revealed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-warm-700 text-sm leading-relaxed md:text-right"
                >
                  {current.sideB.argument}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
}
