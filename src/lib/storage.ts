import type { DecisionAnalysis } from '../types/analysis'

const HISTORY_KEY = 'second-opinion:history'

export function getHistory(): DecisionAnalysis[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DecisionAnalysis[]
  } catch {
    return []
  }
}

export function saveToHistory(analysis: DecisionAnalysis) {
  const current = getHistory()
  const next = [analysis, ...current.filter((a) => a.id !== analysis.id)].slice(0, 50)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
}

export function getAnalysisById(id: string): DecisionAnalysis | undefined {
  return getHistory().find((a) => a.id === id)
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export function updateAnalysis(id: string, updates: Partial<DecisionAnalysis>) {
  const current = getHistory()
  const existing = current.find((a) => a.id === id)
  if (!existing) return
  
  const updated = { ...existing, ...updates }
  const next = [updated, ...current.filter((a) => a.id !== id)].slice(0, 50)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
}
