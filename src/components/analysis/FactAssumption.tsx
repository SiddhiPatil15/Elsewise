import { useState, useEffect } from 'react'
import type { Statement } from '../../types/analysis'
import { Button } from '../ui/Button'
import { Plus, X } from 'lucide-react'

interface FactAssumptionProps {
  initialData?: Statement[]
  onChange: (data: Statement[]) => void
}

export function FactAssumption({ initialData, onChange }: FactAssumptionProps) {
  const [statements, setStatements] = useState<Statement[]>(initialData || [])
  const [text, setText] = useState('')
  const [type, setType] = useState<Statement['type']>('unknown')
  const [evidence, setEvidence] = useState<Statement['evidenceStrength']>('moderate')

  useEffect(() => {
    onChange(statements)
  }, [statements, onChange])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const newItem: Statement = {
      id: crypto.randomUUID(),
      text: text.trim(),
      type,
      evidenceStrength: type === 'fact' ? evidence : undefined
    }
    setStatements([...statements, newItem])
    setText('')
    setType('unknown')
  }

  const handleRemove = (id: string) => {
    setStatements(statements.filter(s => s.id !== id))
  }

  const getTypeColor = (t: Statement['type']) => {
    switch (t) {
      case 'fact': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'assumption': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'opinion': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <h3 className="mb-2 font-display text-xl text-warm-800">Fact vs Assumption</h3>
      <p className="mb-6 text-sm text-mauve-500">Break down your reasoning into verifiable facts, unchecked assumptions, and personal opinions.</p>
      
      <form onSubmit={handleAdd} className="mb-8 flex flex-wrap gap-3 items-end rounded-xl bg-petal-50 p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-semibold text-mauve-600">Statement</label>
          <input 
            value={text} 
            onChange={e => setText(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-petal-400 focus:outline-none" 
            placeholder="e.g. Sales will increase next quarter"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-mauve-600">Classification</label>
          <select 
            value={type}
            onChange={e => setType(e.target.value as Statement['type'])}
            className="w-32 rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-petal-400 focus:outline-none"
          >
            <option value="unknown">Unknown</option>
            <option value="fact">Fact</option>
            <option value="assumption">Assumption</option>
            <option value="opinion">Opinion</option>
          </select>
        </div>
        {type === 'fact' && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-mauve-600">Evidence</label>
            <select 
              value={evidence}
              onChange={e => setEvidence(e.target.value as Statement['evidenceStrength'])}
              className="w-24 rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-petal-400 focus:outline-none"
            >
              <option value="weak">Weak</option>
              <option value="moderate">Moderate</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        )}
        <Button type="submit" className="py-2 px-3"><Plus size={16} /></Button>
      </form>

      {statements.length > 0 ? (
        <div className="space-y-3">
          {statements.map(s => (
            <div key={s.id} className="flex items-start justify-between gap-3 rounded-xl border border-pink-200/50 bg-white p-4">
              <div>
                <p className="mb-2 text-sm text-warm-800">{s.text}</p>
                <div className="flex gap-2">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(s.type)}`}>
                    {s.type}
                  </span>
                  {s.type === 'fact' && s.evidenceStrength && (
                    <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Evidence: {s.evidenceStrength}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => handleRemove(s.id)} className="text-mauve-400 hover:text-mauve-600"><X size={16} /></button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-mauve-400 py-6 italic">No statements added yet.</div>
      )}
    </div>
  )
}
