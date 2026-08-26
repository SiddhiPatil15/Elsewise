import { useState, useEffect } from 'react'
import type { ConfidenceRating } from '../../types/analysis'

interface ConfidenceMeterProps {
  initialData?: ConfidenceRating
  onChange: (data: ConfidenceRating) => void
}

export function ConfidenceMeter({ initialData, onChange }: ConfidenceMeterProps) {
  const [data, setData] = useState<ConfidenceRating>(initialData || { before: 50 })

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const handleSlider = (key: keyof ConfidenceRating, val: number) => {
    setData(prev => ({ ...prev, [key]: val }))
  }

  const change = data.after !== undefined ? data.after - data.before : 0
  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="mb-1 font-display text-xl text-warm-800">Decision Confidence</h3>
          <p className="text-sm text-mauve-500">Track how your certainty shifts after analysis.</p>
        </div>
        {data.after !== undefined && (
          <div className={`flex flex-col items-end ${isPositive ? 'text-green-600' : isNegative ? 'text-red-500' : 'text-mauve-500'}`}>
            <span className="text-xs font-semibold uppercase tracking-wider">Change</span>
            <span className="font-display text-2xl font-bold">
              {isPositive ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span className="text-mauve-600">Before Analysis</span>
            <span className="text-warm-800">{data.before}%</span>
          </div>
          <input 
            type="range" min="0" max="100" 
            value={data.before}
            onChange={e => handleSlider('before', parseInt(e.target.value))}
            className="w-full accent-mauve-400"
          />
        </div>
        
        <div>
          <div className="mb-2 flex justify-between text-sm font-medium">
            <span className="text-petal-600">After Analysis</span>
            <span className="text-warm-800">{data.after ?? data.before}%</span>
          </div>
          <input 
            type="range" min="0" max="100" 
            value={data.after ?? data.before}
            onChange={e => handleSlider('after', parseInt(e.target.value))}
            className="w-full accent-petal-500"
          />
        </div>
      </div>
    </div>
  )
}
