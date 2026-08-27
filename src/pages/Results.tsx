import { useEffect, useState, useTransition, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCw, Download } from 'lucide-react'
import type { DecisionAnalysis, ProviderId } from '../types/analysis'
import { DEMO_ANALYSIS } from '../lib/mockAI'
import { getAnalysisById, updateAnalysis } from '../lib/storage'
import { SectionHeading } from '../components/analysis/SectionHeading'
import { ClarityScore } from '../components/analysis/ClarityScore'
import { SupportCard } from '../components/analysis/SupportCard'
import { BlindSpotCard } from '../components/analysis/BlindSpotCard'
import { AssumptionCard } from '../components/analysis/AssumptionCard'
import { CounterArgument } from '../components/analysis/CounterArgument'
import { ConsequenceMap } from '../components/analysis/ConsequenceMap'
import { AlternativeCard } from '../components/analysis/AlternativeCard'
import { PerspectiveCard } from '../components/analysis/PerspectiveCard'
import { ChallengePanel } from '../components/analysis/ChallengePanel'
import { QuestionList } from '../components/analysis/QuestionList'
import { FinalOpinion } from '../components/analysis/FinalOpinion'
import { Button } from '../components/ui/Button'

// New Tool Components
import { DecisionScorecard } from '../components/analysis/DecisionScorecard'
import { ProsConsMatrix } from '../components/analysis/ProsConsMatrix'
import { DecisionTree } from '../components/analysis/DecisionTree'
import { WhatIfSimulator } from '../components/analysis/WhatIfSimulator'
import { ReversibilityMeter } from '../components/analysis/ReversibilityMeter'
import { BiasDetector } from '../components/analysis/BiasDetector'
import { FactAssumption } from '../components/analysis/FactAssumption'
import { RegretTest } from '../components/analysis/RegretTest'
import { ConfidenceMeter } from '../components/analysis/ConfidenceMeter'
import { MissingInfoMeter } from '../components/analysis/MissingInfoMeter'
import { OptionComparison } from '../components/analysis/OptionComparison'
import { DecisionTimeline } from '../components/analysis/DecisionTimeline'
import { DecisionJournal } from '../components/analysis/DecisionJournal'
import { OutcomeTracker } from '../components/analysis/OutcomeTracker'

const revisitOptions = ['7 days', '30 days', '90 days', 'Custom']
const PROVIDER_LABELS: Record<ProviderId, string> = {
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  gemini: 'Gemini',
  fastest: 'Fastest Available',
  groq: 'Groq'
}

export function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null | undefined>(undefined)
  const [revisit, setRevisit] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'deep' | 'tools' | 'outcomes'>('deep')
  const [, startTransition] = useTransition()
  const updateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingUpdates = useRef<Partial<DecisionAnalysis>>({})

  useEffect(() => {
    if (!id || id === 'demo-internship') {
      setAnalysis(DEMO_ANALYSIS)
      return
    }
    const found = getAnalysisById(id)
    setAnalysis(found ?? null)
  }, [id])

  if (analysis === undefined) return null

  if (analysis === null) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="mb-2 font-display text-xl text-black">Analysis not found</p>
        <p className="mb-6 text-sm text-gray-800">
          This decision doesn't exist in your history, or your browser storage was cleared.
        </p>
        <Button onClick={() => navigate('/new')}>Get a Second Opinion</Button>
      </div>
    )
  }

  const handleUpdate = (updates: Partial<DecisionAnalysis>) => {
    // 1. React State (deferred rendering)
    startTransition(() => {
      setAnalysis(prev => prev ? { ...prev, ...updates } : prev)
    })

    // 2. Queue for localStorage
    pendingUpdates.current = { ...pendingUpdates.current, ...updates }
    
    if (updateTimeout.current) clearTimeout(updateTimeout.current)
    updateTimeout.current = setTimeout(() => {
      if (id && id !== 'demo-internship') {
        updateAnalysis(id, pendingUpdates.current)
        pendingUpdates.current = {}
      }
    }, 500)
  }

  const handleDownload = () => {
    if (!analysis) return;
    let content = `# Elsewise Analysis: ${analysis.decision}\n\n`;
    if (analysis.context) content += `**Context:**\n${analysis.context}\n\n`;
    content += `## The Case For\n`;
    (analysis.supportingArguments || []).forEach(arg => content += `- ${arg}\n`);
    content += `\n## Blind Spots\n`;
    (analysis.blindSpots || []).forEach(bs => content += `- ${bs}\n`);
    content += `\n## Assumptions\n`;
    (analysis.assumptions || []).forEach(a => content += `- **${a.text}**: ${a.explanation}\n`);
    content += `\n## Strongest Counterargument\n${analysis.strongestCounterargument}\n\n`;
    if (analysis.finalOpinion) {
      content += `## Final Opinion\n`;
      content += `- What looks strong: ${analysis.finalOpinion.whatLooksStrong}\n`;
      content += `- Concerns: ${analysis.finalOpinion.concerns}\n`;
      content += `- Investigate first: ${analysis.finalOpinion.investigateFirst}\n`;
    }
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `elsewise-analysis-${id || 'download'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-400">
            Your decision
          </p>
          {analysis.provider && (
            <span className="rounded-full border border-ink-800/15 px-2.5 py-1 text-xs text-ink-500">
              Analyzed by {PROVIDER_LABELS[analysis.provider] ?? analysis.provider}
            </span>
          )}
        </div>
        <h1 className="mb-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
          {analysis.decision}
        </h1>
        {analysis.context && (
          <p className="mb-8 text-[15px] text-ink-500">{analysis.context}</p>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="mb-10 flex space-x-2 border-b border-pink-200/50 pb-px">
        <button
          onClick={() => setActiveTab('deep')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'deep' ? 'border-petal-500 text-petal-600' : 'border-transparent text-mauve-400 hover:text-mauve-600'}`}
        >
          Deep Analysis
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'tools' ? 'border-petal-500 text-petal-600' : 'border-transparent text-mauve-400 hover:text-mauve-600'}`}
        >
          Decision Tools
        </button>
        <button
          onClick={() => setActiveTab('outcomes')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'outcomes' ? 'border-petal-500 text-petal-600' : 'border-transparent text-mauve-400 hover:text-mauve-600'}`}
        >
          Outcomes & Journal
        </button>
      </div>

      <div className="space-y-14">
        <div className={activeTab === 'deep' ? 'block space-y-14' : 'hidden'}>
          <section>
            <ClarityScore score={analysis.clarityEstimate} explanation={analysis.clarityExplanation} />
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <SupportCard items={analysis.supportingArguments} />
            <BlindSpotCard items={analysis.blindSpots} />
          </section>

          <section>
            <SectionHeading eyebrow="Hidden assumptions" title="What you're assuming, whether you meant to or not" />
            <div className="space-y-3">
              {analysis.assumptions?.map((a, i) => (
                <AssumptionCard key={a.id} assumption={a} index={i} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeading eyebrow="Strongest counterargument" title="The case against you" />
            <CounterArgument text={analysis.strongestCounterargument} />
          </section>

          <section>
            <SectionHeading
              eyebrow="Risks & consequences"
              title="Where each path could lead"
              description="Outcomes shown are plausible, not guaranteed."
            />
            <ConsequenceMap map={analysis.consequences} />
          </section>

          <section>
            <SectionHeading eyebrow="Alternative paths" title="It's rarely just yes or no" />
            <div className="grid gap-4 sm:grid-cols-2">
              {analysis.alternatives?.map((alt, i) => (
                <AlternativeCard key={i} alt={alt} index={i} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="Different perspectives"
              title="Get different perspectives"
              description="Analytical lenses, not separate human experts."
            />
            <div className="space-y-3">
              {analysis.perspectives?.map((p) => (
                <PerspectiveCard key={p.type} perspective={p} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeading eyebrow="Challenge my thinking" title="Put your reasoning to the test" />
            <ChallengePanel challenge={analysis.challenge} />
          </section>

          <section>
            <SectionHeading eyebrow="Before you decide" title="Answer these first" />
            <QuestionList questions={analysis.questions} />
          </section>

          <section>
            <SectionHeading eyebrow="Your second opinion" title="Where this leaves you" />
            <FinalOpinion opinion={analysis.finalOpinion} />
          </section>
        </div>

        <div className={activeTab === 'tools' ? 'block space-y-10' : 'hidden'}>
          <DecisionScorecard initialData={analysis.scorecard} onChange={scorecard => handleUpdate({ scorecard })} />
          <ProsConsMatrix initialData={analysis.prosCons} onChange={prosCons => handleUpdate({ prosCons })} />
          <OptionComparison initialData={analysis.optionComparison} onChange={optionComparison => handleUpdate({ optionComparison })} />
          <DecisionTree initialData={analysis.decisionTree} onChange={decisionTree => handleUpdate({ decisionTree })} />
          <WhatIfSimulator initialData={analysis.simulatorVariables} onChange={simulatorVariables => handleUpdate({ simulatorVariables })} />
          
          <div className="grid gap-10 md:grid-cols-2">
            <ReversibilityMeter initialData={analysis.reversibilityMeter} onChange={reversibilityMeter => handleUpdate({ reversibilityMeter })} />
            <ConfidenceMeter initialData={analysis.confidenceRating} onChange={confidenceRating => handleUpdate({ confidenceRating })} />
          </div>

          <FactAssumption initialData={analysis.statements} onChange={statements => handleUpdate({ statements })} />
          <BiasDetector initialBiases={analysis.detectedBiases} onChange={detectedBiases => handleUpdate({ detectedBiases })} />
          <MissingInfoMeter initialData={analysis.missingInfo} onChange={missingInfo => handleUpdate({ missingInfo })} />
          <RegretTest initialData={analysis.regretAnswers} onChange={regretAnswers => handleUpdate({ regretAnswers })} />
        </div>

        <div className={activeTab === 'outcomes' ? 'block space-y-10' : 'hidden'}>
          <DecisionTimeline initialData={analysis.timelineEvents} onChange={timelineEvents => handleUpdate({ timelineEvents })} />
          <DecisionJournal initialData={analysis.journalEntries} onChange={journalEntries => handleUpdate({ journalEntries })} />
          <OutcomeTracker initialData={analysis.outcomeTracking} onChange={outcomeTracking => handleUpdate({ outcomeTracking })} />
        </div>

        <section className="rounded-lg border border-dashed border-ink-800/20 p-6 ">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 flex items-center gap-2 text-[15px] font-medium text-ink-900">
                <RefreshCw size={15} /> Revisit this decision
              </p>
              <p className="text-sm text-ink-500">
                Check back on what you thought would happen, against what actually did.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {revisitOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setRevisit(opt)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    revisit === opt
                      ? 'border-wine-600 bg-wine-600/10 text-wine-600'
                      : 'border-ink-800/20 text-ink-600 hover:border-ink-800/40'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {revisit && (
            <p className="mt-3 text-xs text-ink-400">
              We'll flag this in your history in {revisit.toLowerCase()} — no notifications yet in this version.
            </p>
          )}
        </section>

        <div className="flex flex-col gap-3 border-t border-ink-800/10 pt-8 sm:flex-row ">
          <Button onClick={() => navigate('/new')}>Ask another question</Button>
          <Button variant="outline" onClick={handleDownload} className="w-full sm:w-auto flex items-center justify-center">
            <Download size={16} className="mr-2" /> Download
          </Button>
          <Link to="/history">
            <Button variant="outline" className="w-full sm:w-auto">
              View decision history
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
