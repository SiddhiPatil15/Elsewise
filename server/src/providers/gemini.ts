import { GoogleGenAI, ThinkingLevel } from '@google/genai'
import type { CallOptions, Provider } from './types.js'

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash'
const apiKey = process.env.GEMINI_API_KEY
let client: GoogleGenAI | null = null
function getClient(): GoogleGenAI {
  if (!client) client = new GoogleGenAI({ apiKey })
  return client
}

export const geminiProvider: Provider = {
  id: 'gemini',
  label: 'Gemini',
  model: MODEL,
  hasApiKey: Boolean(apiKey),

  async call({ system, userPrompt, maxTokens = 2000 }: CallOptions) {
    const response = await getClient().models.generateContent({
      model: MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: system,
        maxOutputTokens: maxTokens,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      },
    })
    const text = response.text
    if (!text) throw new Error('Gemini returned no text content')
    return text
  },
}
