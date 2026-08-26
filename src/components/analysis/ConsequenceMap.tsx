import { motion } from 'framer-motion'
import type { ConsequenceMap as ConsequenceMapType } from '../../types/analysis'

const toneStyles: Record<string, string> = {
  upside: 'border-moss-600/30 bg-moss-500/[0.06]',
  downside: 'border-rust-500/30 bg-rust-500/[0.06]',
  neutral: 'border-ink-800/15 bg-ink-800/[0.03]  .03]',
}

export function ConsequenceMap({ map }: { map: ConsequenceMapType }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {map.branches.map((branch, bi) => (
        <div key={bi} className={`rounded-lg border p-5 ${toneStyles[branch.tone]}`}>
          <p className="mb-4 text-sm font-medium text-ink-800 ">{branch.label}</p>
          <ol className="space-y-0">
            {[map.root, ...branch.steps].map((step, i, arr) => (
              <li key={i} className="relative pb-4 pl-6 last:pb-0">
                {i < arr.length - 1 && (
                  <span className="absolute left-[5px] top-2.5 h-full w-px bg-ink-800/15 " />
                )}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className={`absolute left-0 top-1.5 h-[10px] w-[10px] rounded-full ${
                    i === 0 ? 'bg-ink-500 ' : 'bg-current opacity-70'
                  }`}
                  style={i > 0 ? { color: branch.tone === 'upside' ? '#5F7457' : branch.tone === 'downside' ? '#A85A38' : undefined } : undefined}
                />
                <p className={`text-sm leading-snug ${i === 0 ? 'text-ink-500 ' : 'text-ink-800 '}`}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
