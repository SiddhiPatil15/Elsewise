import Anthropic from '@anthropic-ai/sdk'
import type { CallOptions, Provider } from './types.js'

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022'
const apiKey = process.env.ANTHROPIC_API_KEY
let client: Anthropic | null = null
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey })
  return client
}

export const claudeProvider: Provider = {
  id: 'claude',
  label: 'Claude',
  model: MODEL,
  hasApiKey: Boolean(apiKey),

  async call({ system, userPrompt, maxTokens = 2000 }: CallOptions) {
    const message = await getClient().messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    })
    const textBlock = message.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
    if (!textBlock) throw new Error('Claude returned no text content')
    return textBlock.text
  },
}
