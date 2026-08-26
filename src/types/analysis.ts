export type FocusArea =
  | 'Time'
  | 'Money'
  | 'Career'
  | 'Learning'
  | 'Risk'
  | 'Growth'
  | 'Convenience'
  | 'Relationships'

export type ProviderId = 'claude' | 'chatgpt' | 'gemini' | 'fastest' | 'groq'

export interface ProviderInfo {
  id: ProviderId
  label: string
  hasApiKey: boolean
  model: string
}

export interface Assumption {
  id: string
  text: string
  confidence: number // 0-100, how confident the AI is that the user is making this assumption
  explanation: string
}

export interface ConsequenceBranch {
  label: string
  steps: string[]
  tone: 'upside' | 'downside' | 'neutral'
}

export interface ConsequenceMap {
  root: string
  branches: ConsequenceBranch[]
}

export interface Alternative {
  title: string
  upside: string
  downside: string
  whenItMakesSense: string
}

export type PerspectiveType = 'skeptic' | 'longTerm' | 'practical' | 'assumptionHunter'

export interface Perspective {
  type: PerspectiveType
  label: string
  prompt: string
  analysis: string
}

export interface Challenge {
  strongestArgument: string
  strongestCounterargument: string
  evidenceThatWouldChangeDecision: string
  likelyUnderestimate: string
}

export interface FinalOpinion {
  whatLooksStrong: string
  concerns: string
  investigateFirst: string
  confidence: 'Low' | 'Medium' | 'High'
}

export interface DecisionAnalysis {
  id: string
  decision: string
  context?: string
  focusAreas: FocusArea[]
  provider?: ProviderId
  createdAt: string
  clarityEstimate: number
  clarityExplanation: string
  supportingArguments: string[]
  blindSpots: string[]
  assumptions: Assumption[]
  strongestCounterargument: string
  consequences: ConsequenceMap
  alternatives: Alternative[]
  perspectives: Perspective[]
  challenge: Challenge
  questions: string[]
  finalOpinion: FinalOpinion
  
  // --- New Feature Fields ---
  scorecard?: ScorecardVariables
  prosCons?: ProConItem[]
  decisionTree?: DecisionTreeNode
  simulatorVariables?: SimulatorVariables
  reversibilityMeter?: ReversibilityFactors
  detectedBiases?: DetectedBias[]
  statements?: Statement[]
  regretAnswers?: RegretAnswers
  confidenceRating?: ConfidenceRating
  missingInfo?: MissingInfoItem[]
  optionComparison?: OptionComparisonData
  timelineEvents?: TimelineEvent[]
  journalEntries?: JournalEntry[]
  outcomeTracking?: OutcomeTracking
}

export interface CompareResult {
  agreements: string[]
  disagreements: string[]
  differingAssumptions: string[]
  strongerArgument: string
  resolvingInfo: string[]
}

// --- NEW FEATURE TYPES ---

export interface ScorecardVariables {
  risk: number
  cost: number
  time: number
  growth: number
  careerImpact: number
  convenience: number
  reversibility: number
}

export interface ProConItem {
  id: string
  text: string
  importance: number
  isPro: boolean
}

export interface DecisionTreeNode {
  id: string
  label: string
  children: DecisionTreeNode[]
}

export interface SimulatorVariables {
  budget: number
  time: number
  riskTolerance: number
  expectedBenefit: number
}

export interface ReversibilityFactors {
  financialCommitment: number
  timeCommitment: number
  socialImpact: number
}

export interface DetectedBias {
  id: string
  biasType: string
  explanation: string
  challengingQuestion: string
}

export interface Statement {
  id: string
  text: string
  type: 'fact' | 'assumption' | 'opinion' | 'unknown'
  evidenceStrength?: 'weak' | 'moderate' | 'strong'
}

export interface RegretAnswers {
  oneMonth: string
  oneYear: string
  fiveYears: string
}

export interface ConfidenceRating {
  before: number
  after?: number
}

export interface MissingInfoItem {
  id: string
  question: string
  isAnswered: boolean
  answer?: string
}

export interface OptionCriteria {
  id: string
  label: string
  weight: number
}

export interface OptionScore {
  optionId: string
  criteriaId: string
  score: number
}

export interface ComparisonOption {
  id: string
  label: string
}

export interface OptionComparisonData {
  options: ComparisonOption[]
  criteria: OptionCriteria[]
  scores: OptionScore[]
}

export interface TimelineEvent {
  id: string
  date: string
  type: 'decision' | 'expected' | 'review' | 'actual'
  description: string
}

export interface JournalEntry {
  id: string
  date: string
  content: string
}

export interface OutcomeTracking {
  expectedOutcome: string
  actualOutcome?: string
  accuracyScore?: number
  reviewNotes?: string
}
