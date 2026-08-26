import { useState, useEffect } from 'react'
import type { RegretAnswers } from '../../types/analysis'

interface RegretTestProps {
  initialData?: RegretAnswers
  onChange: (data: RegretAnswers) => void
}

const defaultAnswers: RegretAnswers = {
  oneMonth: '',
  oneYear: '',
  fiveYears: ''
}

export function RegretTest({ initialData, onChange }: RegretTestProps) {
  const [data, setData] = useState<RegretAnswers>(initialData || defaultAnswers)

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const handleChange = (key: keyof RegretAnswers, val: string) => {
    setData(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <h3 className="mb-2 font-display text-xl text-warm-800">The Regret Test</h3>
      <p className="mb-6 text-sm text-mauve-500">Fast-forward in time. If you choose your primary option and it fails, how will you feel?</p>
      
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-warm-800">1 Month from now</label>
          <textarea 
            value={data.oneMonth}
            onChange={e => handleChange('oneMonth', e.target.value)}
            placeholder="e.g. I might feel embarrassed or stressed about money."
            className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm focus:border-petal-400 focus:outline-none focus:ring-1 focus:ring-petal-200"
            rows={2}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-warm-800">1 Year from now</label>
          <textarea 
            value={data.oneYear}
            onChange={e => handleChange('oneYear', e.target.value)}
            placeholder="e.g. I'll probably be over the initial sting and glad I tried."
            className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm focus:border-petal-400 focus:outline-none focus:ring-1 focus:ring-petal-200"
            rows={2}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-warm-800">5 Years from now</label>
          <textarea 
            value={data.fiveYears}
            onChange={e => handleChange('fiveYears', e.target.value)}
            placeholder="e.g. I won't even remember the cost, but I'll value the lesson."
            className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm focus:border-petal-400 focus:outline-none focus:ring-1 focus:ring-petal-200"
            rows={2}
          />
        </div>
      </div>
    </div>
  )
}
