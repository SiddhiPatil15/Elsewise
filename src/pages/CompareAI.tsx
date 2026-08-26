import { useState } from 'react'
import { motion } from 'framer-motion'
import type { CompareResult } from '../types/analysis'
import { requestCompare, ApiError } from '../lib/api'
import { useProviders } from '../lib/useProviders'
import { Button } from '../components/ui/Button'
import { ProviderPicker } from '../components/ui/ProviderPicker'

export function CompareAI() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [result, setResult] = useState<CompareResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { providers, selected, select } = useProviders()

  async function handleCompare() {
    if (!a.trim() || !b.trim()) {
      setError('Paste both AI opinions to compare them.')
      return
    }
    if (!selected) {
      setError('Choose which AI should judge this comparison.')
      return
    }
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const compared = await requestCompare(a.trim(), b.trim(), selected)
      setResult(compared)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong comparing these opinions.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="mb-2 font-mono text-xs uppercase tracking-wider text-wine-600 ">
        Compare AI opinions
      </p>
      <h1 className="mb-3 font-display text-3xl text-ink-900 sm:text-4xl ">
        When AI disagrees with AI, ask for a second opinion.
      </h1>
      <p className="mb-10 max-w-xl text-[15px] text-ink-500 ">
        Paste two AI responses to the same question — from ChatGPT, Claude, Gemini, or anywhere else — and see where they actually agree, where they diverge, and what would resolve it.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-700 ">AI Opinion #1</label>
          <textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            rows={8}
            placeholder="Paste the first response…"
            className="w-full resize-none rounded-lg border border-ink-800/15 bg-cream-50 px-4 py-3 text-sm leading-relaxed text-ink-900 placeholder:text-ink-400 focus:border-wine-500    :text-cream-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-700 ">AI Opinion #2</label>
          <textarea
            value={b}
            onChange={(e) => setB(e.target.value)}
            rows={8}
            placeholder="Paste the second response…"
            className="w-full resize-none rounded-lg border border-ink-800/15 bg-cream-50 px-4 py-3 text-sm leading-relaxed text-ink-900 placeholder:text-ink-400 focus:border-wine-500    :text-cream-500"
          />
        </div>
      </div>

      {providers && (
        <div className="mb-6">
          <ProviderPicker providers={providers} selected={selected} onSelect={select} label="Which AI should judge this?" />
        </div>
      )}

      {error && <p className="mb-4 text-sm text-rust-600 ">{error}</p>}

      <Button onClick={handleCompare} disabled={loading}>
        {loading ? 'Comparing…' : 'Compare'}
      </Button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-12 space-y-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-moss-600/25 bg-moss-500/[0.06] p-5">
              <h3 className="mb-3 text-[15px] font-medium text-moss-600 ">Where they agree</h3>
              <ul className="space-y-2 text-sm leading-relaxed text-ink-700 ">
                {result.agreements.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-rust-500/30 bg-rust-500/[0.06] p-5">
              <h3 className="mb-3 text-[15px] font-medium text-rust-600 ">Where they disagree</h3>
              <ul className="space-y-2 text-sm leading-relaxed text-ink-700 ">
                {result.disagreements.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-[15px] font-medium text-ink-900 ">Differing assumptions</h3>
            <ul className="space-y-2 text-sm leading-relaxed text-ink-700 ">
              {result.differingAssumptions.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-ink-900 bg-ink-900 p-6  ">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-cream-300/70 ">
              Which argument is stronger
            </p>
            <p className="text-[15px] leading-relaxed text-cream-50 ">{result.strongerArgument}</p>
          </div>

          <div>
            <h3 className="mb-3 text-[15px] font-medium text-ink-900 ">
              What would resolve the disagreement
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed text-ink-700 ">
              {result.resolvingInfo.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}
