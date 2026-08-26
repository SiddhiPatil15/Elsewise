import { useNavigate } from 'react-router-dom'
import type { DecisionAnalysis } from '../../types/analysis'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function DecisionHistory({ items }: { items: DecisionAnalysis[] }) {
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-ink-800/20 px-6 py-16 text-center ">
        <p className="mb-2 font-display text-lg text-ink-800 ">No decisions yet</p>
        <p className="mx-auto max-w-sm text-sm text-ink-500 ">
          Every second opinion you ask for is saved here, in this browser, so you can revisit how your thinking held up.
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-ink-800/10 ">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => navigate(`/results/${item.id}`)}
            className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-ink-800/[0.02] :bg-cream-200/[0.03]"
          >
            <div className="min-w-0">
              <p className="truncate text-[15px] text-ink-900 ">{item.decision}</p>
              <p className="mt-0.5 text-xs text-ink-400 ">
                Clarity {item.clarityEstimate}/100 · {formatDate(item.createdAt)}
              </p>
            </div>
            <span className="shrink-0 font-mono text-xs text-ink-400 ">
              {formatDate(item.createdAt)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
