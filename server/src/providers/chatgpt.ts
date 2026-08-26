import OpenAI from 'openai'
import type { CallOptions, Provider } from './types.js'

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const apiKey = process.env.OPENAI_API_KEY
let client: OpenAI | null = null
function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey })
  return client
}

export const chatgptProvider: Provider = {
  id: 'chatgpt',
  label: 'ChatGPT',
  model: MODEL,
  hasApiKey: Boolean(apiKey),

  async call({ system, userPrompt, maxTokens = 2000 }: CallOptions) {
    const response = await getClient().chat.completions.create({
      model: MODEL,
      max_completion_tokens: maxTokens,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    })
    const text = response.choices[0]?.message?.content
    if (!text) throw new Error('ChatGPT returned no text content')
    return text
  },
}
