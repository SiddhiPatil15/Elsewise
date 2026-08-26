import { useState, useEffect } from 'react'
import type { ReversibilityFactors } from '../../types/analysis'

interface ReversibilityMeterProps {
  initialData?: ReversibilityFactors
  onChange: (data: ReversibilityFactors) => void
}

const defaultFactors: ReversibilityFactors = {
  financialCommitment: 50,
  timeCommitment: 50,
  socialImpact: 50
}

export function ReversibilityMeter({ initialData, onChange }: ReversibilityMeterProps) {
  const [data, setData] = useState<ReversibilityFactors>(initialData || defaultFactors)

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const handleSlider = (key: keyof ReversibilityFactors, val: number) => {
    setData(prev => ({ ...prev, [key]: val }))
  }

  // Calculate difficulty to reverse. 0 = Easy, 100 = Difficult
  const difficulty = Math.round((data.financialCommitment + data.timeCommitment + data.socialImpact) / 3)
  
  let label = "Moderate"
  let colorClass = "text-yellow-600"
  let barColor = "bg-yellow-500"
  if (difficulty < 33) {
    label = "Easy to Reverse"
    colorClass = "text-green-600"
    barColor = "bg-green-500"
  } else if (difficulty > 66) {
    label = "Difficult to Reverse"
    colorClass = "text-red-600"
    barColor = "bg-red-500"
  }

  const sliders = [
    { key: 'financialCommitment', label: 'Financial Cost to Undo' },
    { key: 'timeCommitment', label: 'Time Required to Undo' },
    { key: 'socialImpact', label: 'Impact on Reputation/Relationships' },
  ] as const

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <h3 className="mb-2 font-display text-xl text-warm-800">Reversibility Meter</h3>
      <p className="mb-6 text-sm text-mauve-500">How hard is it to change your mind after deciding?</p>
      
      <div className="mb-8">
        <div className="mb-2 flex items-end justify-between">
          <span className={`font-display text-2xl font-bold ${colorClass}`}>{label}</span>
          <span className="text-sm font-medium text-mauve-500">{difficulty}/100</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full transition-all duration-500 ${barColor}`} style={{ width: `${difficulty}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {sliders.map(s => (
          <div key={s.key}>
            <div className="mb-1 flex justify-between text-xs">
              <label className="font-medium text-mauve-600">{s.label}</label>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={data[s.key]}
              onChange={e => handleSlider(s.key, parseInt(e.target.value))}
              className="w-full accent-petal-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
