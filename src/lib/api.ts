import type { CompareResult, DecisionAnalysis, FocusArea, ProviderId, ProviderInfo } from '../types/analysis'

export class ApiError extends Error {}

export const API_BASE = import.meta.env.VITE_API_URL || '/api'

import { auth } from './firebase'

async function getHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken()
      headers['Authorization'] = `Bearer ${token}`
    } catch (e) {
      console.error('Failed to get auth token', e)
    }
  }
  return headers
}

export async function listProviders(): Promise<ProviderInfo[]> {
  try {
    const res = await fetch(`${API_BASE}/providers`, { headers: await getHeaders() })
    if (!res.ok) throw new Error('Failed to fetch providers')
    return res.json()
  } catch (err) {
    console.error('Failed to load providers, using fallback', err)
    return [
      { id: 'gemini', label: 'Gemini (Default)', hasApiKey: true, model: 'gemini-3.6-flash' },
      { id: 'groq', label: 'Groq (Fallback)', hasApiKey: true, model: 'groq/compound' },
    ]
  }
}

export async function requestAnalysis(
  decision: string,
  context: string,
  focusAreas: FocusArea[],
  provider: ProviderId
): Promise<DecisionAnalysis> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ decision, context, focusAreas, provider })
  })
  if (!res.ok) {
    let err
    try {
      err = await res.json()
    } catch {
      err = { error: await res.text() }
    }
    throw new ApiError(err.error || 'Analysis failed')
  }
  return res.json()
}

export async function requestCompare(opinionA: string, opinionB: string, provider: ProviderId): Promise<CompareResult> {
  const res = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ opinionA, opinionB, provider })
  })
  if (!res.ok) {
    let err
    try {
      err = await res.json()
    } catch {
      err = { error: await res.text() }
    }
    throw new ApiError(err.error || 'Compare failed')
  }
  return res.json()
}
