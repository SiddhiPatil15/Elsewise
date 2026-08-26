import type { FocusArea } from '../../types/analysis'

export interface Template {
  id: string
  name: string
  prompt: string
  context: string
  focusAreas: FocusArea[]
}

export const TEMPLATES: Template[] = [
  {
    id: 'career',
    name: 'Career Move',
    prompt: 'Should I take this new job offer or stay at my current company?',
    context: 'The new job pays 20% more but requires 3 days in office. My current job is fully remote.',
    focusAreas: ['Career', 'Money', 'Convenience']
  },
  {
    id: 'purchase',
    name: 'Major Purchase',
    prompt: 'Should I buy a house now or keep renting?',
    context: 'Interest rates are high, but rent keeps increasing every year.',
    focusAreas: ['Money', 'Risk', 'Time']
  },
  {
    id: 'relationship',
    name: 'Relationship',
    prompt: 'Should we move in together?',
    context: 'We have been dating for 1 year and both our leases are up next month.',
    focusAreas: ['Relationships', 'Risk', 'Growth']
  },
  {
    id: 'startup',
    name: 'Startup Idea',
    prompt: 'Should I quit my job to build my SaaS app?',
    context: 'I have 6 months of savings and some early validation, but no paying customers yet.',
    focusAreas: ['Career', 'Risk', 'Time']
  }
]

interface TemplateSelectorProps {
  onSelect: (template: Template) => void
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {TEMPLATES.map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          className="text-left rounded-2xl border border-pink-200 bg-white/70 p-5 transition-all hover:border-petal-300 hover:shadow-md focus:outline-none"
        >
          <h3 className="font-display text-lg text-warm-800 mb-2">{t.name}</h3>
          <p className="text-sm text-mauve-500 line-clamp-2">{t.prompt}</p>
        </button>
      ))}
    </div>
  )
}
