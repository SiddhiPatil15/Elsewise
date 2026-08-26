import { useState } from 'react'
import { Button } from '../ui/Button'

interface QuickDecisionInputProps {
  onSubmit: (data: { goal: string, options: string, risk: string, benefit: string, confidence: number }) => void
}

export function QuickDecisionInput({ onSubmit }: QuickDecisionInputProps) {
  const [goal, setGoal] = useState('')
  const [options, setOptions] = useState('')
  const [risk, setRisk] = useState('')
  const [benefit, setBenefit] = useState('')
  const [confidence, setConfidence] = useState(50)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!goal.trim()) return
    onSubmit({ goal, options, risk, benefit, confidence })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-black">1. What is your Goal?</label>
        <input required value={goal} onChange={e => setGoal(e.target.value)} className="w-full rounded-xl border border-pink-200 bg-white/90 px-4 py-2.5 text-black placeholder:text-gray-500 focus:border-petal-400 focus:outline-none focus:ring-2 focus:ring-petal-200 transition-shadow" placeholder="e.g. Choose a javascript framework" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-black">2. What are your Options?</label>
        <textarea required value={options} onChange={e => setOptions(e.target.value)} className="w-full rounded-xl border border-pink-200 bg-white/90 px-4 py-2.5 text-black placeholder:text-gray-500 focus:border-petal-400 focus:outline-none focus:ring-2 focus:ring-petal-200 transition-shadow" placeholder="e.g. React vs Vue" rows={2} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-black">3. What is the Biggest Risk?</label>
        <input required value={risk} onChange={e => setRisk(e.target.value)} className="w-full rounded-xl border border-pink-200 bg-white/90 px-4 py-2.5 text-black placeholder:text-gray-500 focus:border-petal-400 focus:outline-none focus:ring-2 focus:ring-petal-200 transition-shadow" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-black">4. What is the Biggest Benefit?</label>
        <input required value={benefit} onChange={e => setBenefit(e.target.value)} className="w-full rounded-xl border border-pink-200 bg-white/90 px-4 py-2.5 text-black placeholder:text-gray-500 focus:border-petal-400 focus:outline-none focus:ring-2 focus:ring-petal-200 transition-shadow" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-black">5. Your Confidence ({confidence}%)</label>
        <input type="range" min="0" max="100" value={confidence} onChange={e => setConfidence(parseInt(e.target.value))} className="w-full accent-petal-500" />
      </div>
      <Button type="submit" disabled={!goal.trim()} className="w-full sm:w-auto">Run Quick Analysis →</Button>
    </form>
  )
}
