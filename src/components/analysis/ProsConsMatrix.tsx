import { useState, useEffect } from 'react'
import type { ProConItem } from '../../types/analysis'
import { Button } from '../ui/Button'
import { Plus, X } from 'lucide-react'

interface ProsConsMatrixProps {
  initialData?: ProConItem[]
  onChange: (data: ProConItem[]) => void
}

export function ProsConsMatrix({ initialData, onChange }: ProsConsMatrixProps) {
  const [items, setItems] = useState<ProConItem[]>(initialData || [])
  const [text, setText] = useState('')
  const [importance, setImportance] = useState(3)
  const [isPro, setIsPro] = useState(true)

  useEffect(() => {
    onChange(items)
  }, [items, onChange])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const newItem: ProConItem = {
      id: crypto.randomUUID(),
      text: text.trim(),
      importance,
      isPro
    }
    setItems([...items, newItem])
    setText('')
  }

  const handleRemove = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const pros = items.filter(i => i.isPro)
  const cons = items.filter(i => !i.isPro)

  const prosScore = pros.reduce((acc, curr) => acc + curr.importance, 0)
  const consScore = cons.reduce((acc, curr) => acc + curr.importance, 0)

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <h3 className="mb-4 font-display text-xl text-warm-800">Pros & Cons Matrix</h3>
      
      <form onSubmit={handleAdd} className="mb-8 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-semibold text-mauve-600">Argument</label>
          <input 
            value={text} 
            onChange={e => setText(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-petal-400 focus:outline-none focus:ring-1 focus:ring-petal-200" 
            placeholder="e.g. Higher salary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-mauve-600">Type</label>
          <select 
            value={isPro ? 'pro' : 'con'}
            onChange={e => setIsPro(e.target.value === 'pro')}
            className="rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-petal-400 focus:outline-none"
          >
            <option value="pro">Pro</option>
            <option value="con">Con</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-mauve-600">Weight (1-5)</label>
          <input 
            type="number" 
            min="1" max="5" 
            value={importance}
            onChange={e => setImportance(parseInt(e.target.value))}
            className="w-16 rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-petal-400 focus:outline-none"
          />
        </div>
        <Button type="submit" className="py-2 px-3"><Plus size={16} /></Button>
      </form>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-4">
          <div className="mb-3 flex items-center justify-between border-b border-green-200 pb-2">
            <h4 className="font-semibold text-green-800">Pros</h4>
            <span className="rounded bg-green-200 px-2 py-0.5 text-xs font-bold text-green-900">Score: {prosScore}</span>
          </div>
          <ul className="space-y-2">
            {pros.map(p => (
              <li key={p.id} className="flex items-start justify-between gap-2 text-sm text-green-900">
                <span>{p.text} <span className="opacity-50">(x{p.importance})</span></span>
                <button onClick={() => handleRemove(p.id)} className="text-green-700/50 hover:text-green-700"><X size={14} /></button>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
          <div className="mb-3 flex items-center justify-between border-b border-red-200 pb-2">
            <h4 className="font-semibold text-red-800">Cons</h4>
            <span className="rounded bg-red-200 px-2 py-0.5 text-xs font-bold text-red-900">Score: {consScore}</span>
          </div>
          <ul className="space-y-2">
            {cons.map(c => (
              <li key={c.id} className="flex items-start justify-between gap-2 text-sm text-red-900">
                <span>{c.text} <span className="opacity-50">(x{c.importance})</span></span>
                <button onClick={() => handleRemove(c.id)} className="text-red-700/50 hover:text-red-700"><X size={14} /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
