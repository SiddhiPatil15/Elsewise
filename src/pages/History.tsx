import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { DecisionAnalysis } from '../types/analysis'
import { getHistory, clearHistory } from '../lib/storage'
import { DecisionHistory } from '../components/analysis/DecisionHistory'
import { Button } from '../components/ui/Button'

import { DecisionDNA } from '../components/analysis/DecisionDNA'

export function History() {
  const [items, setItems] = useState<DecisionAnalysis[]>([])

  useEffect(() => {
    setItems(getHistory())
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 font-display text-3xl text-ink-900 ">Decision history</h1>
          <p className="text-[15px] text-ink-500 ">
            Saved in this browser only — reopen any past analysis.
          </p>
        </div>
        <Link to="/new" className="shrink-0">
          <Button size="sm">New</Button>
        </Link>
      </div>

      <DecisionDNA history={items} />
      
      <h2 className="mb-4 font-display text-2xl text-ink-900">Past Decisions</h2>
      <DecisionHistory items={items} />

      {items.length > 0 && (
        <button
          onClick={() => {
            clearHistory()
            setItems([])
          }}
          className="mt-8 text-sm text-ink-400 underline decoration-ink-800/20 underline-offset-4 hover:text-ink-600   :text-cream-300"
        >
          Clear history
        </button>
      )}
    </div>
  )
}
