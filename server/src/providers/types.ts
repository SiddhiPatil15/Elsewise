export type ProviderId = 'claude' | 'chatgpt' | 'gemini' | 'groq' | 'fastest'

export interface ProviderInfo {
  id: ProviderId
  label: string
  hasApiKey: boolean
  model: string
}

export interface CallOptions {
  system: string
  userPrompt: string
  maxTokens?: number
}

export interface Provider {
  id: ProviderId
  label: string
  hasApiKey: boolean
  model: string
  /** Calls the underlying model and returns its raw text response. */
  call(options: CallOptions): Promise<string>
}
