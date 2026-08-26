import { useState, useEffect } from 'react'
import type { JournalEntry } from '../../types/analysis'
import { Button } from '../ui/Button'
import { Plus, X } from 'lucide-react'

interface DecisionJournalProps {
  initialData?: JournalEntry[]
  onChange: (data: JournalEntry[]) => void
}

export function DecisionJournal({ initialData, onChange }: DecisionJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialData || [])
  const [content, setContent] = useState('')

  useEffect(() => {
    onChange(entries)
  }, [entries, onChange])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      content: content.trim()
    }
    setEntries([newEntry, ...entries])
    setContent('')
  }

  const handleRemove = (id: string) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <h3 className="mb-2 font-display text-xl text-warm-800">Decision Journal</h3>
      <p className="mb-6 text-sm text-mauve-500">Log your thoughts, feelings, and updates about this decision over time.</p>
      
      <form onSubmit={handleAdd} className="mb-8">
        <textarea 
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
          placeholder="What are you thinking right now?"
          className="mb-3 w-full resize-none rounded-xl border border-pink-200 px-4 py-3 text-sm focus:border-petal-400 focus:outline-none focus:ring-1 focus:ring-petal-200"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!content.trim()}><Plus size={16} className="mr-2 inline" /> Add Entry</Button>
        </div>
      </form>

      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-pink-100 bg-petal-50/50 p-4">
              <div className="mb-2 flex items-center justify-between text-xs text-mauve-400">
                <span>{new Date(entry.date).toLocaleString()}</span>
                <button onClick={() => handleRemove(entry.id)} className="hover:text-red-500"><X size={14} /></button>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-warm-800">{entry.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-mauve-400 py-6 italic">No journal entries yet.</div>
      )}
    </div>
  )
}
