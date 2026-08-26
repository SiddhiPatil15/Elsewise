import { claudeProvider } from './claude.js'
import { chatgptProvider } from './chatgpt.js'
import { geminiProvider } from './gemini.js'
import { groqProvider } from './groq.js'
import type { Provider, ProviderId, ProviderInfo, CallOptions } from './types.js'

const registry: Record<Exclude<ProviderId, 'fastest'>, Provider> = {
  claude: claudeProvider,
  chatgpt: chatgptProvider,
  gemini: geminiProvider,
  groq: groqProvider,
}

const REAL_ORDER: Exclude<ProviderId, 'fastest'>[] = ['gemini', 'chatgpt', 'claude', 'groq']

export function getProvider(id: unknown): Provider {
  if (typeof id === 'string' && id in registry) {
    return registry[id as Exclude<ProviderId, 'fastest'>]
  }
  // No provider specified (or invalid) — fall back to the first one with a key configured.
  const fallback = REAL_ORDER.map((p) => registry[p]).find((p) => p.hasApiKey)
  return fallback ?? registry.claude
}

/**
 * Race all configured providers simultaneously.
 * Returns the first successful result along with which provider won.
 */
export async function raceProviders(options: CallOptions): Promise<{ text: string; winnerId: Exclude<ProviderId, 'fastest'> }> {
  const configured = REAL_ORDER
    .map((id) => ({ id, provider: registry[id] }))
    .filter(({ provider }) => provider.hasApiKey)

  if (configured.length === 0) {
    throw new Error('No providers are configured.')
  }

  if (configured.length === 1) {
    const { id, provider } = configured[0]
    const text = await provider.call(options)
    return { text, winnerId: id }
  }

  // Fire all configured providers at once — first success wins
  const raceResult = await Promise.any(
    configured.map(({ id, provider }) =>
      provider.call(options).then((text) => ({ text, winnerId: id }))
    )
  )

  return raceResult
}

export function listProviders(): ProviderInfo[] {
  const realProviders = REAL_ORDER.map((id) => {
    const p = registry[id]
    return { id: p.id, label: p.label, hasApiKey: p.hasApiKey, model: p.model }
  })

  const anyConfigured = realProviders.some((p) => p.hasApiKey)
  const configuredCount = realProviders.filter((p) => p.hasApiKey).length

  // Prepend the "Fastest" virtual provider only when ≥1 real provider is configured
  const fastestEntry: ProviderInfo = {
    id: 'fastest',
    label: '⚡ Fastest',
    hasApiKey: anyConfigured,
    model: configuredCount >= 2
      ? `Races all ${configuredCount} providers — returns first reply`
      : 'Uses the one available provider',
  }

  return [fastestEntry, ...realProviders]
}

export type { ProviderId } from './types.js'
