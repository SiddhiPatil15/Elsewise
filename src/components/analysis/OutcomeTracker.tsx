import { useState, useEffect } from 'react'
import type { OutcomeTracking } from '../../types/analysis'

interface OutcomeTrackerProps {
  initialData?: OutcomeTracking
  onChange: (data: OutcomeTracking) => void
}

export function OutcomeTracker({ initialData, onChange }: OutcomeTrackerProps) {
  const [data, setData] = useState<OutcomeTracking>(initialData || { expectedOutcome: '' })

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const handleChange = (key: keyof OutcomeTracking, val: any) => {
    setData(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="mb-1 font-display text-xl text-warm-800">Outcome Tracker</h3>
          <p className="text-sm text-mauve-500">Compare what you thought would happen vs what actually did.</p>
        </div>
        {data.accuracyScore !== undefined && (
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold uppercase tracking-wider text-mauve-500">Accuracy Score</span>
            <span className={`font-display text-3xl font-bold ${data.accuracyScore > 70 ? 'text-green-600' : data.accuracyScore < 40 ? 'text-red-500' : 'text-yellow-600'}`}>
              {data.accuracyScore}%
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-warm-800">Expected Outcome</label>
          <textarea 
            value={data.expectedOutcome}
            onChange={e => handleChange('expectedOutcome', e.target.value)}
            placeholder="What do you think will happen?"
            className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm focus:border-petal-400 focus:outline-none focus:ring-1 focus:ring-petal-200"
            rows={4}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-warm-800">Actual Outcome</label>
          <textarea 
            value={data.actualOutcome || ''}
            onChange={e => handleChange('actualOutcome', e.target.value)}
            placeholder="Come back later and write what actually happened."
            className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm focus:border-petal-400 focus:outline-none focus:ring-1 focus:ring-petal-200"
            rows={4}
          />
        </div>
      </div>

      {(data.expectedOutcome && data.actualOutcome) && (
        <div className="mt-6 rounded-xl border border-pink-100 bg-petal-50 p-5">
          <label className="mb-2 block text-sm font-semibold text-warm-800">Review Notes & Accuracy</label>
          <p className="mb-3 text-xs text-mauve-600">How accurate was your prediction? (0 = Completely wrong, 100 = Exactly as expected)</p>
          <input 
            type="range" min="0" max="100" 
            value={data.accuracyScore || 50}
            onChange={e => handleChange('accuracyScore', parseInt(e.target.value))}
            className="mb-4 w-full accent-petal-500"
          />
          <textarea 
            value={data.reviewNotes || ''}
            onChange={e => handleChange('reviewNotes', e.target.value)}
            placeholder="Why was there a difference between expected and actual?"
            className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm focus:border-petal-400 focus:outline-none focus:ring-1 focus:ring-petal-200"
            rows={2}
          />
        </div>
      )}
    </div>
  )
}
