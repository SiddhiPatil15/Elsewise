import { useState, useEffect } from 'react'
import type { MissingInfoItem } from '../../types/analysis'
import { Button } from '../ui/Button'
import { Plus, CheckCircle, Circle } from 'lucide-react'

interface MissingInfoMeterProps {
  initialData?: MissingInfoItem[]
  onChange: (data: MissingInfoItem[]) => void
}

export function MissingInfoMeter({ initialData, onChange }: MissingInfoMeterProps) {
  const [items, setItems] = useState<MissingInfoItem[]>(initialData || [])
  const [question, setQuestion] = useState('')

  useEffect(() => {
    onChange(items)
  }, [items, onChange])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    const newItem: MissingInfoItem = {
      id: crypto.randomUUID(),
      question: question.trim(),
      isAnswered: false
    }
    setItems([...items, newItem])
    setQuestion('')
  }

  const toggleAnswered = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, isAnswered: !i.isAnswered } : i))
  }

  const updateAnswer = (id: string, answer: string) => {
    setItems(items.map(i => i.id === id ? { ...i, answer } : i))
  }

  const total = items.length
  const answered = items.filter(i => i.isAnswered).length
  const completeness = total === 0 ? 100 : Math.round((answered / total) * 100)

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-center sm:flex-row sm:justify-between">
        <div>
          <h3 className="mb-1 font-display text-xl text-warm-800">Missing Information</h3>
          <p className="text-sm text-mauve-500">What don't you know yet?</p>
        </div>
        <div className="mt-4 flex flex-col items-end sm:mt-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-mauve-500">Completeness</span>
          <span className={`font-display text-3xl font-bold ${completeness === 100 ? 'text-green-600' : 'text-petal-500'}`}>
            {completeness}%
          </span>
        </div>
      </div>

      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full transition-all duration-500 ${completeness === 100 ? 'bg-green-500' : 'bg-petal-400'}`} style={{ width: `${completeness}%` }} />
      </div>

      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input 
          value={question} 
          onChange={e => setQuestion(e.target.value)}
          className="flex-1 rounded-xl border border-pink-200 px-4 py-2 text-sm focus:border-petal-400 focus:outline-none" 
          placeholder="e.g. Will they negotiate the price?"
        />
        <Button type="submit" className="py-2 px-3"><Plus size={16} /></Button>
      </form>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className={`rounded-xl border p-4 transition-colors ${item.isAnswered ? 'border-green-200 bg-green-50/30' : 'border-pink-200/50 bg-white'}`}>
            <div className="flex items-start gap-3">
              <button onClick={() => toggleAnswered(item.id)} className={`mt-0.5 ${item.isAnswered ? 'text-green-500' : 'text-mauve-300 hover:text-petal-400'}`}>
                {item.isAnswered ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>
              <div className="flex-1">
                <p className={`text-sm font-medium ${item.isAnswered ? 'text-green-800' : 'text-warm-800'}`}>{item.question}</p>
                {item.isAnswered && (
                  <input
                    value={item.answer || ''}
                    onChange={e => updateAnswer(item.id, e.target.value)}
                    placeholder="Enter the answer you found..."
                    className="mt-2 w-full rounded border-b border-transparent bg-transparent py-1 text-sm text-green-700 placeholder:text-green-700/40 focus:border-green-300 focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-sm italic text-mauve-400 py-4">No open questions. You have all the info you need!</p>
        )}
      </div>
    </div>
  )
}
