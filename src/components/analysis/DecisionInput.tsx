import { useState, useEffect } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { Button } from '../ui/Button'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker
import { Chip } from '../ui/Chip'
import { ProviderPicker } from '../ui/ProviderPicker'
import { useProviders } from '../../lib/useProviders'
import type { FocusArea, ProviderId } from '../../types/analysis'

const examples = [
  'Should I switch careers?',
  'Is this startup idea worth building?',
  'Should I buy this laptop?',
  'Should I choose React or Flutter?',
  'Is this design actually good?',
  'Should I leave my internship?',
]

const focusOptions: FocusArea[] = [
  'Time',
  'Money',
  'Career',
  'Learning',
  'Risk',
  'Growth',
  'Convenience',
  'Relationships',
]

interface DecisionInputProps {
  onSubmit: (decision: string, context: string, focusAreas: FocusArea[], provider: ProviderId) => void
  initialDecision?: string
  initialContext?: string
  initialFocus?: FocusArea[]
}

const EMPTY_FOCUS: FocusArea[] = []

export function DecisionInput({ onSubmit, initialDecision = '', initialContext = '', initialFocus = EMPTY_FOCUS }: DecisionInputProps) {
  const [decision, setDecision] = useState(initialDecision)
  const [context, setContext] = useState(initialContext)
  const [focus, setFocus] = useState<FocusArea[]>(initialFocus)
  const [isUploadingPDF, setIsUploadingPDF] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const { providers, selected, select, error: providerError } = useProviders()

  useEffect(() => {
    setDecision(initialDecision)
    setContext(initialContext)
    setFocus(initialFocus)
  }, [initialDecision, initialContext, initialFocus])

  function toggleFocus(f: FocusArea) {
    setFocus((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!decision.trim() || !selected) return
    onSubmit(decision.trim(), context.trim(), focus, selected)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setPdfError('Only PDF files are supported.')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setPdfError('File is too large (max 10MB).')
      return
    }

    setIsUploadingPDF(true)
    setPdfError('')
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(' ')
        fullText += pageText + '\n\n'
      }
      
      setContext(prev => (prev ? prev + '\n\n' : '') + `[Extracted from ${file.name}]\n` + fullText)
    } catch (err: any) {
      setPdfError('Failed to extract text from PDF.')
    } finally {
      setIsUploadingPDF(false)
      e.target.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-petal-500  select-none">)(</span>
          <h1 className="font-display text-3xl text-warm-800 sm:text-4xl ">
            What's on your mind?
          </h1>
        </div>
        <p className="mb-5 text-sm text-mauve-400 ">
          Share your decision — Elsewise will think it through with you.
        </p>
        <textarea
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder="I'm considering…"
          rows={4}
          className="w-full resize-none rounded-2xl border border-pink-200 bg-white/90 px-5 py-4 text-[16px] leading-relaxed text-black placeholder:text-gray-500 focus:border-petal-400 focus:outline-none focus:ring-2 focus:ring-petal-200 transition-shadow"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setDecision(ex)}
              className="rounded-full border border-pink-200/70 px-3 py-1 text-xs text-mauve-600 transition-all hover:border-petal-300 hover:bg-petal-50 hover:text-petal-600"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="context" className="block text-sm font-semibold text-black ">
            Context <span className="font-normal text-gray-600 ">— what should I know?</span>
          </label>
          <label className={`cursor-pointer text-sm font-medium text-petal-600 hover:text-petal-700 transition-colors flex items-center gap-1 ${isUploadingPDF ? 'opacity-70 pointer-events-none' : ''}`}>
            {isUploadingPDF ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {isUploadingPDF ? 'Extracting...' : 'Upload PDF'}
            <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} disabled={isUploadingPDF} />
          </label>
        </div>
        {pdfError && <p className="mb-2 text-xs text-red-500">{pdfError}</p>}
        <textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Any details that would change the analysis…"
          rows={3}
          className="w-full resize-none rounded-2xl border border-pink-200 bg-white/90 px-5 py-3.5 text-[15px] leading-relaxed text-black placeholder:text-gray-500 focus:border-petal-400 focus:outline-none focus:ring-2 focus:ring-petal-200 transition-shadow"
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-mauve-600 ">What matters most?</p>
        <div className="flex flex-wrap gap-2">
          {focusOptions.map((f) => (
            <Chip key={f} label={f} active={focus.includes(f)} onClick={() => toggleFocus(f)} />
          ))}
        </div>
      </div>

      {providers && (
        <ProviderPicker providers={providers} selected={selected} onSelect={select} />
      )}
      {providerError && <p className="text-sm text-petal-600/80 ">{providerError}</p>}

      <Button type="submit" disabled={!decision.trim() || !selected} className="w-full sm:w-auto">
        Ask Elsewise →
      </Button>
    </form>
  )
}
