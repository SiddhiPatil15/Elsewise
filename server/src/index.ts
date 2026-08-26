import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { randomUUID } from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import {
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisUserPrompt,
  COMPARE_SYSTEM_PROMPT,
  buildCompareUserPrompt,
} from './prompts.js'

// -----------------------------------------------------------------------------
// Load environment variables BEFORE loading the provider modules.
//
// Your .env file is located at:
// second-opinion-ai/server/.env
//
// Because providers read process.env when they are imported, we load dotenv
// first and dynamically import the providers afterwards.
// -----------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ENV_PATH = path.resolve(__dirname, '../.env')

const dotenvResult = dotenv.config({
  path: ENV_PATH,
})

if (dotenvResult.error) {
  console.error(`Could not load .env file from: ${ENV_PATH}`)
  console.error(dotenvResult.error)
} else {
  console.log(`Loaded environment from: ${ENV_PATH}`)
  console.log(`Environment variables loaded: ${Object.keys(dotenvResult.parsed ?? {}).length}`)
}

// IMPORTANT:
// Do not change this to a normal static import.
// The provider modules need to be loaded AFTER dotenv.config().
const { getProvider, listProviders, raceProviders } = await import('./providers/index.js')

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const FRONTEND_DIST = path.resolve(__dirname, '../../dist')

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001

// -----------------------------------------------------------------------------
// Provider configuration check
// -----------------------------------------------------------------------------

const providerList = listProviders()

console.log(
  'Provider configuration:',
  providerList
    .map((p) => `${p.label}: ${p.hasApiKey ? 'API key found ✓' : 'NO API KEY ✗'}`)
    .join(' | '),
)

if (!providerList.some((p) => p.hasApiKey)) {
  console.error(
    'No provider API keys found in environment (.env).',
  )

  console.error(
    'Expected at least one of: ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY',
  )

  console.error(`Checked .env at: ${ENV_PATH}`)
}

// -----------------------------------------------------------------------------
// Express application
// -----------------------------------------------------------------------------

const app = express()

app.use(cors())

app.use(express.json({ limit: '256kb' }))

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function extractJson(text: string): unknown {
  // Models occasionally wrap JSON in prose or code fences despite instructions.
  // This defensively extracts the first top-level JSON object.

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)

  const candidate = fenced ? fenced[1] : text

  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')

  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in model response')
  }

  return JSON.parse(candidate.slice(start, end + 1))
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

// -----------------------------------------------------------------------------
// Analysis response validation
// -----------------------------------------------------------------------------

function validateAnalysisShape(data: any): string[] {
  const problems: string[] = []

  if (typeof data.clarityEstimate !== 'number') {
    problems.push('clarityEstimate must be a number')
  }

  if (!isNonEmptyString(data.clarityExplanation)) {
    problems.push('clarityExplanation missing')
  }

  if (
    !Array.isArray(data.supportingArguments) ||
    data.supportingArguments.length !== 2
  ) {
    problems.push('supportingArguments must have 2 items')
  }

  if (
    !Array.isArray(data.blindSpots) ||
    data.blindSpots.length !== 2
  ) {
    problems.push('blindSpots must have 2 items')
  }

  if (
    !Array.isArray(data.assumptions) ||
    data.assumptions.length !== 2
  ) {
    problems.push('assumptions must have 2 items')
  }

  if (!isNonEmptyString(data.strongestCounterargument)) {
    problems.push('strongestCounterargument missing')
  }

  if (
    !data.consequences ||
    !Array.isArray(data.consequences.branches)
  ) {
    problems.push('consequences.branches missing')
  }

  if (
    !Array.isArray(data.alternatives) ||
    data.alternatives.length !== 2
  ) {
    problems.push('alternatives must have 2 items')
  }

  if (
    !Array.isArray(data.perspectives) ||
    data.perspectives.length !== 2
  ) {
    problems.push('perspectives must have 2 items')
  }

  if (!data.challenge) {
    problems.push('challenge missing')
  }

  if (
    !Array.isArray(data.questions) ||
    data.questions.length !== 3
  ) {
    problems.push('questions must have 3 items')
  }

  if (
    !data.finalOpinion ||
    !isNonEmptyString(data.finalOpinion.confidence)
  ) {
    problems.push('finalOpinion missing')
  }

  return problems
}

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

// Check available providers
app.get('/api/providers', (_req, res) => {
  res.json(listProviders())
})

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    providers: listProviders(),
  })
})

async function callWithTimeoutAndFallback(initialProvider: any, options: any) {
  const timeoutMs = 8000;
  try {
    const result = await Promise.race([
      initialProvider.call(options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs))
    ]);
    return { rawText: result as string, winnerId: initialProvider.id, winnerLabel: initialProvider.label };
  } catch (err: any) {
    console.warn(`${initialProvider.label} failed or timed out: ${err.message}. Falling back to Groq...`);
    const groq = getProvider('groq');
    try {
      const groqResult = await groq.call(options);
      return { rawText: groqResult, winnerId: groq.id, winnerLabel: groq.label };
    } catch (fallbackErr: any) {
      throw new Error(`Both ${initialProvider.label} and Groq failed. Last error: ${fallbackErr.message}`);
    }
  }
}

// -----------------------------------------------------------------------------
// Analyze
// -----------------------------------------------------------------------------

app.post('/api/analyze', async (req, res) => {
  const {
    decision,
    context = '',
    focusAreas = [],
    provider: providerId,
  } = req.body ?? {}

  if (!isNonEmptyString(decision)) {
    return res.status(400).json({
      error: 'A "decision" string is required.',
    })
  }

  if (
    decision.length > 2000 ||
    (typeof context === 'string' && context.length > 2000)
  ) {
    return res.status(400).json({
      error:
        'Decision or context is too long (max 2000 characters each).',
    })
  }

  const isFastest = providerId === 'fastest' || !providerId

  try {
    const userPrompt = buildAnalysisUserPrompt(
      decision,
      context,
      Array.isArray(focusAreas) ? focusAreas : [],
    )

    let rawText: string
    let winnerLabel: string
    let winnerId: string

    if (isFastest) {
      // Race all configured providers — return whichever replies first
      console.log('Racing all providers...')
      const result = await raceProviders({
        system: ANALYSIS_SYSTEM_PROMPT,
        userPrompt,
        maxTokens: 1200,
      })
      rawText = result.text
      winnerId = result.winnerId
      winnerLabel = winnerId
      console.log(`Race winner: ${winnerLabel}`)
    } else {
      const provider = getProvider(providerId)
      if (!provider.hasApiKey) {
        return res.status(400).json({
          error: `${provider.label} is not configured on the server (missing API key).`,
        })
      }
      const fallbackResult = await callWithTimeoutAndFallback(provider, {
        system: ANALYSIS_SYSTEM_PROMPT,
        userPrompt,
        maxTokens: 1200,
      })
      rawText = fallbackResult.rawText
      winnerId = fallbackResult.winnerId
      winnerLabel = fallbackResult.winnerLabel
    }

    console.log('RAW TEXT RECEIVED:', rawText)
    const raw = extractJson(rawText)
    const problems = validateAnalysisShape(raw as any)

    if (problems.length > 0) {
      console.error(`${winnerLabel} response failed validation:`, problems)
      return res.status(502).json({
        error: `${winnerLabel} returned an incomplete analysis. Please try again.`,
      })
    }

    const analysis = {
      id: randomUUID(),
      decision,
      context: context || undefined,
      focusAreas,
      provider: winnerId,
      createdAt: new Date().toISOString(),
      ...(raw as object),
    }

    res.json(analysis)
  } catch (err: any) {
    console.error('POST /api/analyze failed:', err)
    res.status(502).json({
      error: `Could not generate an analysis right now. Please try again in a moment.`,
      debug_message: err.message,
      debug_stack: err.stack,
    })
  }
})

// -----------------------------------------------------------------------------
// Compare
// -----------------------------------------------------------------------------

app.post('/api/compare', async (req, res) => {
  const {
    opinionA,
    opinionB,
    provider: providerId,
  } = req.body ?? {}

  if (
    !isNonEmptyString(opinionA) ||
    !isNonEmptyString(opinionB)
  ) {
    return res.status(400).json({
      error: 'Both "opinionA" and "opinionB" are required.',
    })
  }

  if (opinionA.length > 6000 || opinionB.length > 6000) {
    return res.status(400).json({
      error: 'Each opinion must be under 6000 characters.',
    })
  }

  const isFastest = providerId === 'fastest' || !providerId

  try {
    const userPrompt = buildCompareUserPrompt(opinionA, opinionB)

    let rawText: string

    if (isFastest) {
      const result = await raceProviders({
        system: COMPARE_SYSTEM_PROMPT,
        userPrompt,
        maxTokens: 1200,
      })
      rawText = result.text
    } else {
      const provider = getProvider(providerId)
      if (!provider.hasApiKey) {
        return res.status(400).json({
          error: `${provider.label} is not configured on the server (missing API key).`,
        })
      }
      const fallbackResult = await callWithTimeoutAndFallback(provider, {
        system: COMPARE_SYSTEM_PROMPT,
        userPrompt,
        maxTokens: 1200,
      })
      rawText = fallbackResult.rawText
    }

    const raw = extractJson(rawText)
    res.json(raw)
  } catch (err) {
    console.error('POST /api/compare failed:', err)
    res.status(502).json({
      error: `Could not compare these opinions right now. Please try again in a moment.`,
    })
  }
})

// -----------------------------------------------------------------------------
// Serve built frontend if it exists
// -----------------------------------------------------------------------------

if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST))

  app.use((_req, res) => {
    res.sendFile(
      path.join(FRONTEND_DIST, 'index.html'),
    )
  })

  console.log(
    `Serving built frontend from ${FRONTEND_DIST}`,
  )
}

// -----------------------------------------------------------------------------
// Start server
// -----------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log('')
  console.log('==========================================')
  console.log('       SECOND OPINION AI SERVER')
  console.log('==========================================')
  console.log(`API: http://localhost:${PORT}`)
  console.log('')

  console.log(
    'Providers:',
    providerList
      .map(
        (p) =>
          `${p.label}${p.hasApiKey ? ' ✓' : ' (no key)'}`,
      )
      .join(', '),
  )

  console.log('')
  console.log('Available endpoints:')
  console.log(`  GET  http://localhost:${PORT}/api/health`)
  console.log(`  GET  http://localhost:${PORT}/api/providers`)
  console.log(`  POST http://localhost:${PORT}/api/analyze`)
  console.log(`  POST http://localhost:${PORT}/api/compare`)
  console.log('==========================================')
  console.log('')
})