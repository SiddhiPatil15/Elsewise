import { useState, useEffect } from 'react'
import type { SimulatorVariables } from '../../types/analysis'

interface WhatIfSimulatorProps {
  initialData?: SimulatorVariables
  onChange: (data: SimulatorVariables) => void
}

const defaultVariables: SimulatorVariables = {
  budget: 50,
  time: 50,
  riskTolerance: 50,
  expectedBenefit: 50
}

export function WhatIfSimulator({ initialData, onChange }: WhatIfSimulatorProps) {
  const [data, setData] = useState<SimulatorVariables>(initialData || defaultVariables)

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const handleSlider = (key: keyof SimulatorVariables, val: number) => {
    setData(prev => ({ ...prev, [key]: val }))
  }

  // Calculate some dynamic projection based on sliders
  const successProbability = Math.min(100, Math.max(0, 
    (data.budget * 0.3) + (data.time * 0.3) + (data.riskTolerance * 0.1) + (data.expectedBenefit * 0.3)
  ))

  const riskLevel = Math.min(100, Math.max(0, 
    (100 - data.budget * 0.4) + (100 - data.time * 0.4) + (data.riskTolerance * 0.2)
  ))

  const sliders = [
    { key: 'budget', label: 'Budget / Resources available' },
    { key: 'time', label: 'Time available' },
    { key: 'riskTolerance', label: 'Willingness to take risks' },
    { key: 'expectedBenefit', label: 'Required payoff' },
  ] as const

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <h3 className="mb-6 font-display text-xl text-warm-800">What-If Simulator</h3>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          {sliders.map(s => (
            <div key={s.key}>
              <div className="mb-1 flex justify-between text-sm">
                <label className="font-medium text-mauve-600">{s.label}</label>
                <span className="text-mauve-500">{data[s.key]}%</span>
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
        
        <div className="flex flex-col justify-center rounded-xl bg-petal-50 p-6">
          <h4 className="mb-4 text-center font-display text-lg text-warm-800">Projected Outcome</h4>
          
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-mauve-600">Likelihood of Success</span>
              <span className="font-semibold text-green-600">{Math.round(successProbability)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-green-100">
              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${successProbability}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-mauve-600">Failure Risk</span>
              <span className="font-semibold text-red-500">{Math.round(riskLevel)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-red-100">
              <div className="h-full bg-red-400 transition-all duration-300" style={{ width: `${riskLevel}%` }} />
            </div>
          </div>
          
          <p className="mt-6 text-center text-xs text-mauve-400">
            *This projection is simulated purely based on your selected parameters above.
          </p>
        </div>
      </div>
    </div>
  )
}
