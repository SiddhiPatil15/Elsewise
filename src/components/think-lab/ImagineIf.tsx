import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const scenarios = [
  {
    id: 1,
    prompt: "What if you couldn't fail?",
    reflection: "Fear of failure often masks our true desires. If the possibility of failure was removed, the choice you'd make is likely what you actually want."
  },
  {
    id: 2,
    prompt: "What if money wasn't a factor?",
    reflection: "Financial constraints are real, but removing them temporarily helps separate what you want from what you feel you can afford. Are you deciding based on passion or budget?"
  },
  {
    id: 3,
    prompt: "What if you had to decide today?",
    reflection: "More time doesn't always yield more clarity. Forcing a deadline often reveals what your intuition already knows."
  },
  {
    id: 4,
    prompt: "What if nobody judged your choice?",
    reflection: "Social expectation is a heavy burden. If no one else's opinion mattered, would your decision change?"
  }
]

export function ImagineIf() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const current = scenarios[currentIndex]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setSubmitted(true)
    }
  }

  const nextScenario = () => {
    setSubmitted(false)
    setInputValue('')
    setCurrentIndex((prev) => (prev + 1) % scenarios.length)
  }

  return (
    <div className="bg-blush-50 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-sm border border-pink-100/50 my-8">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-petal-300 to-transparent opacity-50" />
      
      <h3 className="text-sm font-semibold text-petal-600 tracking-wider uppercase mb-8">Imagine If...</h3>
      
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl mx-auto"
          >
            <h4 className="text-3xl font-display text-warm-800 mb-8">
              {current.prompt}
            </h4>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your initial thought..."
                className="w-full bg-white/60 border border-pink-200/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-petal-300 text-warm-800 placeholder:text-mauve-400 backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-warm-800 text-white px-6 py-2 rounded-full font-medium text-sm transition-all hover:bg-warm-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reveal Insight
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="reflection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <p className="text-mauve-500 text-sm mb-4">You thought about: "{current.prompt}"</p>
            <h4 className="text-2xl font-display text-plum-900 mb-8 leading-relaxed">
              {current.reflection}
            </h4>
            <button
              onClick={nextScenario}
              className="text-petal-600 font-medium hover:text-petal-700 transition-colors"
            >
              Next Scenario →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
