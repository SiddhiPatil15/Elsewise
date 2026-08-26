import { useState, useEffect } from 'react'
import type { TimelineEvent } from '../../types/analysis'
import { Button } from '../ui/Button'
import { Plus, X } from 'lucide-react'

interface DecisionTimelineProps {
  initialData?: TimelineEvent[]
  onChange: (data: TimelineEvent[]) => void
}

export function DecisionTimeline({ initialData, onChange }: DecisionTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(initialData || [])
  const [date, setDate] = useState('')
  const [type, setType] = useState<TimelineEvent['type']>('expected')
  const [description, setDescription] = useState('')

  useEffect(() => {
    onChange(events)
  }, [events, onChange])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || !date) return
    const newEvent: TimelineEvent = {
      id: crypto.randomUUID(),
      date,
      type,
      description: description.trim()
    }
    const newEvents = [...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setEvents(newEvents)
    setDescription('')
    setDate('')
  }

  const handleRemove = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const getTypeStyle = (t: TimelineEvent['type']) => {
    switch (t) {
      case 'decision': return 'bg-blue-100 text-blue-800'
      case 'expected': return 'bg-yellow-100 text-yellow-800'
      case 'review': return 'bg-purple-100 text-purple-800'
      case 'actual': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <h3 className="mb-2 font-display text-xl text-warm-800">Decision Timeline</h3>
      <p className="mb-6 text-sm text-mauve-500">Map out when you made the decision, and when you expect outcomes.</p>
      
      <form onSubmit={handleAdd} className="mb-8 flex flex-wrap gap-3 items-end rounded-xl bg-petal-50 p-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-mauve-600">Date</label>
          <input 
            type="date"
            value={date} 
            onChange={e => setDate(e.target.value)}
            className="w-36 rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-petal-400 focus:outline-none" 
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-mauve-600">Type</label>
          <select 
            value={type}
            onChange={e => setType(e.target.value as TimelineEvent['type'])}
            className="w-28 rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-petal-400 focus:outline-none"
          >
            <option value="decision">Decision</option>
            <option value="expected">Expected</option>
            <option value="review">Review</option>
            <option value="actual">Actual</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-semibold text-mauve-600">Event Description</label>
          <input 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm focus:border-petal-400 focus:outline-none" 
            placeholder="e.g. Expected launch date"
          />
        </div>
        <Button type="submit" className="py-2 px-3"><Plus size={16} /></Button>
      </form>

      {events.length > 0 ? (
        <div className="relative pl-4 border-l-2 border-pink-200 space-y-6">
          {events.map((evt) => (
            <div key={evt.id} className="relative">
              <div className={`absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 border-white ${getTypeStyle(evt.type).split(' ')[0]}`} />
              <div className="flex items-start justify-between rounded-xl border border-pink-200/50 bg-white p-3 shadow-sm">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-xs">
                    <span className="font-semibold text-warm-800">{new Date(evt.date).toLocaleDateString()}</span>
                    <span className={`rounded px-2 py-0.5 font-bold uppercase tracking-wider ${getTypeStyle(evt.type)}`}>{evt.type}</span>
                  </div>
                  <p className="text-sm text-mauve-600">{evt.description}</p>
                </div>
                <button onClick={() => handleRemove(evt.id)} className="text-mauve-300 hover:text-red-500"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-mauve-400 py-6 italic">No timeline events added.</div>
      )}
    </div>
  )
}
