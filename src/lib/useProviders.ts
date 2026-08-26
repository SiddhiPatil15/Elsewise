import { useEffect, useState } from 'react'
import type { ProviderId, ProviderInfo } from '../types/analysis'
import { listProviders } from './api'

const LAST_PROVIDER_KEY = 'elsewise:last-provider'

export function useProviders() {
  const [providers, setProviders] = useState<ProviderInfo[] | null>(null)
  const [selected, setSelected] = useState<ProviderId | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listProviders()
      .then((list) => {
        if (cancelled) return
        setProviders(list)

        const remembered = localStorage.getItem(LAST_PROVIDER_KEY) as ProviderId | null

        // 'fastest' is always usable as long as any real provider is configured
        const anyConfigured = list.some((p) => p.id !== 'fastest' && p.hasApiKey)
        const rememberedIsUsable =
          remembered &&
          (remembered === 'fastest'
            ? anyConfigured
            : list.find((p) => p.id === remembered)?.hasApiKey)

        // Default to 'fastest' if any real provider is configured
        const defaultId: ProviderId | null = anyConfigured
          ? 'fastest'
          : list.find((p) => p.hasApiKey)?.id ?? list[0]?.id ?? null

        setSelected(rememberedIsUsable ? remembered : defaultId)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load available AI providers from the server.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  function select(id: ProviderId) {
    setSelected(id)
    localStorage.setItem(LAST_PROVIDER_KEY, id)
  }

  return { providers, selected, select, error }
}
