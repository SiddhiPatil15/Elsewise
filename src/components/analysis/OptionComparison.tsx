import { useState, useEffect } from 'react'
import type { OptionComparisonData } from '../../types/analysis'
import { Button } from '../ui/Button'
import { Plus, X } from 'lucide-react'

interface OptionComparisonProps {
  initialData?: OptionComparisonData
  onChange: (data: OptionComparisonData) => void
}

const defaultData: OptionComparisonData = {
  options: [{ id: 'opt1', label: 'Option A' }, { id: 'opt2', label: 'Option B' }],
  criteria: [{ id: 'crit1', label: 'Cost', weight: 3 }],
  scores: []
}

export function OptionComparison({ initialData, onChange }: OptionComparisonProps) {
  const [data, setData] = useState<OptionComparisonData>(initialData || defaultData)
  const [newOption, setNewOption] = useState('')
  const [newCriteria, setNewCriteria] = useState('')

  useEffect(() => {
    onChange(data)
  }, [data, onChange])

  const addOption = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOption.trim() || data.options.length >= 4) return
    setData(prev => ({
      ...prev,
      options: [...prev.options, { id: crypto.randomUUID(), label: newOption.trim() }]
    }))
    setNewOption('')
  }

  const addCriteria = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCriteria.trim()) return
    setData(prev => ({
      ...prev,
      criteria: [...prev.criteria, { id: crypto.randomUUID(), label: newCriteria.trim(), weight: 3 }]
    }))
    setNewCriteria('')
  }

  const removeOption = (id: string) => {
    setData(prev => ({
      ...prev,
      options: prev.options.filter(o => o.id !== id),
      scores: prev.scores.filter(s => s.optionId !== id)
    }))
  }

  const removeCriteria = (id: string) => {
    setData(prev => ({
      ...prev,
      criteria: prev.criteria.filter(c => c.id !== id),
      scores: prev.scores.filter(s => s.criteriaId !== id)
    }))
  }

  const updateWeight = (id: string, weight: number) => {
    setData(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => c.id === id ? { ...c, weight } : c)
    }))
  }

  const updateScore = (optionId: string, criteriaId: string, score: number) => {
    setData(prev => {
      const existing = prev.scores.find(s => s.optionId === optionId && s.criteriaId === criteriaId)
      if (existing) {
        return {
          ...prev,
          scores: prev.scores.map(s => s.optionId === optionId && s.criteriaId === criteriaId ? { ...s, score } : s)
        }
      }
      return {
        ...prev,
        scores: [...prev.scores, { optionId, criteriaId, score }]
      }
    })
  }

  const getScore = (optionId: string, criteriaId: string) => {
    return data.scores.find(s => s.optionId === optionId && s.criteriaId === criteriaId)?.score || 1
  }

  const getTotal = (optionId: string) => {
    return data.criteria.reduce((sum, crit) => {
      const score = getScore(optionId, crit.id)
      return sum + (score * crit.weight)
    }, 0)
  }

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm overflow-x-auto">
      <h3 className="mb-2 font-display text-xl text-warm-800">Option Comparison</h3>
      <p className="mb-6 text-sm text-mauve-500">Score options against your criteria (1-5).</p>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <form onSubmit={addOption} className="flex gap-2">
          <input value={newOption} onChange={e => setNewOption(e.target.value)} placeholder="New option (max 4)" disabled={data.options.length >= 4} className="rounded border px-2 text-sm focus:outline-none focus:ring-1 focus:ring-petal-400" />
          <Button type="submit" disabled={data.options.length >= 4} className="py-1 px-2 text-xs"><Plus size={14}/></Button>
        </form>
        <form onSubmit={addCriteria} className="flex gap-2">
          <input value={newCriteria} onChange={e => setNewCriteria(e.target.value)} placeholder="New criteria" className="rounded border px-2 text-sm focus:outline-none focus:ring-1 focus:ring-petal-400" />
          <Button type="submit" className="py-1 px-2 text-xs"><Plus size={14}/></Button>
        </form>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="pb-3 pr-4 font-semibold text-warm-800">Criteria / Weight</th>
            {data.options.map(opt => (
              <th key={opt.id} className="pb-3 pr-4 font-semibold text-warm-800">
                <div className="flex items-center justify-between gap-2">
                  {opt.label}
                  <button onClick={() => removeOption(opt.id)} className="text-mauve-300 hover:text-red-500"><X size={14}/></button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.criteria.map(crit => (
            <tr key={crit.id} className="border-t border-pink-100">
              <td className="py-3 pr-4">
                <div className="flex items-center justify-between gap-2">
                  <span>{crit.label}</span>
                  <div className="flex items-center gap-1">
                    <input type="number" min="1" max="5" value={crit.weight} onChange={e => updateWeight(crit.id, parseInt(e.target.value))} className="w-10 rounded border p-1 text-xs text-center" title="Weight (1-5)" />
                    <button onClick={() => removeCriteria(crit.id)} className="text-mauve-300 hover:text-red-500"><X size={14}/></button>
                  </div>
                </div>
              </td>
              {data.options.map(opt => (
                <td key={opt.id} className="py-3 pr-4">
                  <input type="range" min="1" max="5" value={getScore(opt.id, crit.id)} onChange={e => updateScore(opt.id, crit.id, parseInt(e.target.value))} className="w-24 accent-petal-400" />
                  <span className="ml-2 inline-block w-4 text-center text-xs text-mauve-500">{getScore(opt.id, crit.id)}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-petal-200 bg-petal-50/50">
            <td className="py-3 pr-4 font-bold text-petal-700">Total Score</td>
            {data.options.map(opt => (
              <td key={opt.id} className="py-3 pr-4 font-bold text-petal-700">{getTotal(opt.id)}</td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
