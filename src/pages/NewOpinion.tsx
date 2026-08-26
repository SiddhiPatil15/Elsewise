import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DecisionInput } from '../components/analysis/DecisionInput'
import { QuickDecisionInput } from '../components/analysis/QuickDecisionInput'
import { TemplateSelector } from '../components/analysis/TemplateSelector'
import type { Template } from '../components/analysis/TemplateSelector'
import type { FocusArea, ProviderId } from '../types/analysis'

const PENDING_KEY = 'elsewise:pending'

export interface PendingDecision {
  id: string
  decision: string
  context: string
  focusAreas: FocusArea[]
  provider: ProviderId
  isQuickMode?: boolean
  quickData?: any
}

export function NewOpinion() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'deep' | 'quick' | 'templates'>('deep')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  function handleDeepSubmit(decision: string, context: string, focusAreas: FocusArea[], provider: ProviderId) {
    const pending: PendingDecision = { 
      id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
      decision, 
      context, 
      focusAreas, 
      provider 
    }
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending))
    navigate('/analyzing/pending')
  }

  function handleQuickSubmit(data: any) {
    const pending: PendingDecision = {
      id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
      decision: data.goal,
      context: `Options: ${data.options}\nRisk: ${data.risk}\nBenefit: ${data.benefit}`,
      focusAreas: ['Time', 'Risk'],
      provider: 'fastest',
      isQuickMode: true,
      quickData: data
    }
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending))
    navigate('/analyzing/pending')
  }

  function handleTemplateSelect(template: Template) {
    setSelectedTemplate(template)
    setActiveTab('deep')
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      
      <div className="mb-8 flex space-x-2 border-b border-pink-200/50 pb-px">
        <button
          onClick={() => setActiveTab('deep')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'deep' ? 'border-petal-500 text-petal-600' : 'border-transparent text-mauve-400 hover:text-mauve-600'}`}
        >
          Deep Analysis
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'quick' ? 'border-petal-500 text-petal-600' : 'border-transparent text-mauve-400 hover:text-mauve-600'}`}
        >
          Quick Decision
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'templates' ? 'border-petal-500 text-petal-600' : 'border-transparent text-mauve-400 hover:text-mauve-600'}`}
        >
          Templates
        </button>
      </div>

      <div className={activeTab === 'deep' ? 'block' : 'hidden'}>
        <DecisionInput 
          onSubmit={handleDeepSubmit} 
          initialDecision={selectedTemplate?.prompt}
          initialContext={selectedTemplate?.context}
          initialFocus={selectedTemplate?.focusAreas}
        />
      </div>

      <div className={activeTab === 'quick' ? 'block' : 'hidden'}>
        <QuickDecisionInput onSubmit={handleQuickSubmit} />
      </div>

      <div className={activeTab === 'templates' ? 'block' : 'hidden'}>
        <TemplateSelector onSelect={handleTemplateSelect} />
      </div>

    </div>
  )
}

export function getPendingDecision(): PendingDecision | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    return raw ? (JSON.parse(raw) as PendingDecision) : null
  } catch {
    return null
  }
}

export function clearPendingDecision() {
  sessionStorage.removeItem(PENDING_KEY)
}
