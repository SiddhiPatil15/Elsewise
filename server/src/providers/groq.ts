import type { CallOptions, Provider } from './types.js'

const MODEL = process.env.GROQ_MODEL || 'groq/compound-mini'
const apiKey = process.env.GROQ_API_KEY

export const groqProvider: Provider = {
  id: 'groq',
  label: 'Groq',
  model: MODEL,
  hasApiKey: Boolean(apiKey),

  async call({ system, userPrompt, maxTokens = 1200 }: CallOptions) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'groq/compound-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: maxTokens,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Groq returned ${response.status}: ${err}`)
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content
    if (!text) throw new Error('Groq returned no text content')
    return text
  },
}
