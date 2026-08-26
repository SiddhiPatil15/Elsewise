import { useState, useEffect } from 'react'
import type { ScorecardVariables } from '../../types/analysis'

interface DecisionScorecardProps {
  initialData?: ScorecardVariables
  onChange: (data: ScorecardVariables) => void
}

const defaultScorecard: ScorecardVariables = {
  risk: 5,
  cost: 5,
  time: 5,
  growth: 5,
  careerImpact: 5,
  convenience: 5,
  reversibility: 5
}

export function DecisionScorecard({ initialData, onChange }: DecisionScorecardProps) {
  const [data, setData] = useState<ScorecardVariables>(initialData || defaultScorecard)

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const calculateScore = () => {
    // Basic weighted logic: higher growth, career, convenience, reversibility is good
    // Higher risk, cost, time is bad
    const good = data.growth + data.careerImpact + data.convenience + data.reversibility
    const bad = data.risk + data.cost + data.time
    // Max good = 40, Max bad = 30
    const score = ((good - bad + 30) / 70) * 100
    return Math.round(score)
  }

  const handleSlider = (key: keyof ScorecardVariables, val: number) => {
    setData(prev => ({ ...prev, [key]: val }))
  }

  const sliders = [
    { key: 'risk', label: 'Risk (High is worse)' },
    { key: 'cost', label: 'Cost (High is worse)' },
    { key: 'time', label: 'Time Investment (High is worse)' },
    { key: 'growth', label: 'Growth Potential (High is better)' },
    { key: 'careerImpact', label: 'Career Impact (High is better)' },
    { key: 'convenience', label: 'Convenience (High is better)' },
    { key: 'reversibility', label: 'Reversibility (High is better)' },
  ] as const

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-xl text-warm-800">Decision Scorecard</h3>
        <div className="flex flex-col items-end">
          <span className="text-sm text-mauve-500">Overall Score</span>
          <span className="font-display text-3xl font-bold text-petal-500">{calculateScore()}/100</span>
        </div>
      </div>
      <div className="space-y-4">
        {sliders.map(s => (
          <div key={s.key} className="flex items-center gap-4">
            <label className="w-48 text-sm font-medium text-mauve-600">{s.label}</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={data[s.key]}
              onChange={e => handleSlider(s.key, parseInt(e.target.value))}
              className="flex-1 accent-petal-500"
            />
            <span className="w-8 text-right text-sm text-mauve-500">{data[s.key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
