import { motion } from 'framer-motion'

interface ClarityScoreProps {
  score: number
  explanation: string
}

export function ClarityScore({ score, explanation }: ClarityScoreProps) {
  const circumference = 2 * Math.PI * 42

  return (
    <div className="flex flex-col items-start gap-5 rounded-2xl border border-pink-200/60 bg-gradient-to-br from-white/80 to-blush-100/60 p-6 backdrop-blur-sm sm:flex-row sm:items-center   ">
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" className="stroke-pink-100 " />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="url(#scoreGradient)"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-warm-800 ">{score}</span>
          <span className="text-[11px] text-mauve-400 ">/ 100</span>
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-petal-400 ">
          Clarity estimate — not objective truth
        </p>
        <p className="text-[15px] leading-relaxed text-mauve-600 ">{explanation}</p>
      </div>
    </div>
  )
}
