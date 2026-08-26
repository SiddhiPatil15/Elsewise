import { useState, useEffect } from 'react'
import type { DetectedBias } from '../../types/analysis'
import { Button } from '../ui/Button'
import { Search } from 'lucide-react'

interface BiasDetectorProps {
  initialBiases?: DetectedBias[]
  onChange: (data: DetectedBias[]) => void
}

const BIAS_RULES = [
  {
    type: 'Sunk Cost Fallacy',
    keywords: ['already spent', 'invested so much', 'too late to turn back', 'wasted time'],
    explanation: 'You are letting past investments (time, money) influence a future decision.',
    question: 'If you had invested nothing so far, would you still choose this option?'
  },
  {
    type: 'Confirmation Bias',
    keywords: ['obviously', 'everyone knows', 'proves that', 'undoubtedly'],
    explanation: 'You may be favoring information that confirms your existing beliefs.',
    question: 'What is the strongest piece of evidence against your current view?'
  },
  {
    type: 'All-or-Nothing Thinking',
    keywords: ['always', 'never', 'ruined', 'perfect', 'disaster'],
    explanation: 'You are framing outcomes in extreme black-and-white terms.',
    question: 'What does a middle-ground or partially successful outcome look like?'
  },
  {
    type: 'Availability Heuristic',
    keywords: ['just saw', 'recently', 'heard about', 'happened to my'],
    explanation: 'You might be overestimating the likelihood of events because they are recent or memorable.',
    question: 'Are there broader statistics or historical data that contradict this recent example?'
  }
]

export function BiasDetector({ initialBiases, onChange }: BiasDetectorProps) {
  const [text, setText] = useState('')
  const [biases, setBiases] = useState<DetectedBias[]>(initialBiases || [])

  useEffect(() => {
    onChange(biases)
  }, [biases, onChange])

  const handleAnalyze = () => {
    if (!text.trim()) return
    const lowerText = text.toLowerCase()
    
    const detected: DetectedBias[] = []
    
    BIAS_RULES.forEach(rule => {
      const match = rule.keywords.find(kw => lowerText.includes(kw.toLowerCase()))
      if (match) {
        detected.push({
          id: crypto.randomUUID(),
          biasType: rule.type,
          explanation: rule.explanation,
          challengingQuestion: rule.question
        })
      }
    })

    if (detected.length === 0) {
      // Just add a generic note if no matches
      detected.push({
        id: crypto.randomUUID(),
        biasType: 'No obvious cognitive biases detected',
        explanation: 'The text did not trigger any of our standard bias keyword rules.',
        challengingQuestion: 'Could you be hiding your assumptions in more subtle language?'
      })
    }

    setBiases(detected)
  }

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm">
      <h3 className="mb-2 font-display text-xl text-warm-800">Bias Detector</h3>
      <p className="mb-6 text-sm text-mauve-500">Paste your reasoning below to check for common cognitive biases.</p>
      
      <div className="mb-6">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="e.g. I've already spent 3 months on this project, so I can't just quit now. It would be a complete disaster..."
          rows={3}
          className="mb-3 w-full resize-none rounded-xl border border-pink-200 px-4 py-3 text-sm focus:border-petal-400 focus:outline-none focus:ring-1 focus:ring-petal-200"
        />
        <Button onClick={handleAnalyze} className="w-full sm:w-auto"><Search size={16} className="mr-2 inline" /> Analyze Text</Button>
      </div>

      {biases.length > 0 && (
        <div className="space-y-4 rounded-xl bg-petal-50 p-5">
          <h4 className="font-semibold text-warm-800">Detection Results</h4>
          <div className="space-y-3">
            {biases.map(b => (
              <div key={b.id} className="rounded-lg border border-pink-200/50 bg-white p-4">
                <div className="mb-1 font-display text-sm font-bold text-petal-600">{b.biasType}</div>
                <p className="mb-3 text-sm text-mauve-600">{b.explanation}</p>
                <div className="rounded border-l-2 border-petal-400 bg-petal-50/50 px-3 py-2 text-xs italic text-mauve-500">
                  <span className="font-semibold not-italic text-petal-500">Challenge: </span>
                  {b.challengingQuestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
