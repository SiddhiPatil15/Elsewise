import type { DecisionAnalysis } from '../types/analysis'

// --- The one hand-written, fully realistic demo analysis -----------------
// Used on the landing page demo and reachable from "Try an Example."

export const DEMO_ANALYSIS: DecisionAnalysis = {
  id: 'demo-internship',
  decision: 'Should I leave my internship to focus on college?',
  context:
    'The internship is unpaid-adjacent, 15 hours a week, and my GPA dropped half a point this semester.',
  focusAreas: ['Time', 'Career', 'Learning'],
  createdAt: new Date().toISOString(),
  clarityEstimate: 71,
  clarityExplanation:
    'Your reasoning is fairly strong, but there are 3 unresolved assumptions worth checking before you act.',
  supportingArguments: [
    'Your GPA has measurably declined since the internship started, which is a concrete, trackable signal rather than a feeling.',
    'Fifteen hours a week is a significant, recurring time cost during an academically demanding semester.',
    'You can point to specific courses where you are behind, which suggests the trade-off is already visible in your outcomes.',
  ],
  blindSpots: [
    'Leaving may free up study time, but you are assuming that extra time will automatically translate into better grades — time and outcome are not the same thing.',
    'You have not named what you would actually do with the freed hours, which makes the benefit hypothetical rather than planned.',
    'The internship may be contributing to your academic slump in ways beyond hours lost — or it may be unrelated, and something else is the real cause.',
  ],
  assumptions: [
    {
      id: 'a1',
      text: 'More free time will significantly improve my grades.',
      confidence: 54,
      explanation:
        'This is the load-bearing assumption in your reasoning, but it is stated, not demonstrated. Time freed up often gets absorbed by rest, other commitments, or procrastination rather than converted directly into study output.',
    },
    {
      id: 'a2',
      text: 'This internship will not matter much for what I do after graduation.',
      confidence: 62,
      explanation:
        'You have not said what you want to do after college. If the internship is in your target field, its value may outlast one semester\u2019s GPA dip.',
    },
    {
      id: 'a3',
      text: 'The GPA drop is caused by the internship, not something else.',
      confidence: 41,
      explanation:
        'A single semester of correlation is weak evidence of causation. Course difficulty, personal circumstances, or study habits could be doing some or all of the work here.',
    },
  ],
  strongestCounterargument:
    'The internship may be the only thing on your transcript that demonstrates you can operate in a real professional environment. A half-point GPA dip is recoverable in a later semester; a resume with a shorter, unfinished internship is a harder story to explain in an interview. If the real problem is time management rather than time available, leaving treats the symptom and not the cause \u2014 and you may find the same GPA pattern continues without the internship to blame.',
  consequences: {
    root: 'Leave the internship',
    branches: [
      {
        label: 'If the time is well spent',
        tone: 'upside',
        steps: ['More free time', 'Deliberate, scheduled studying', 'Potentially improved grades'],
      },
      {
        label: 'If the time is not well spent',
        tone: 'neutral',
        steps: ['More free time', 'Time gets absorbed by rest or other commitments', 'Grades unchanged'],
      },
      {
        label: 'Professional cost',
        tone: 'downside',
        steps: ['Leave internship', 'Shorter, unfinished professional experience', 'Possible disadvantage in future applications'],
      },
    ],
  },
  alternatives: [
    {
      title: 'Leave the internship',
      upside: 'Immediate, unambiguous recovery of 15 hours a week with no ongoing obligation.',
      downside: 'Loses a concrete professional credential mid-way, with no guarantee the time converts into grades.',
      whenItMakesSense: 'When the internship offers little relevance to your intended field and your study plan for the freed time is specific and scheduled.',
    },
    {
      title: 'Continue as-is',
      upside: 'Preserves the completed internship and the relationships and reference it produces.',
      downside: 'The GPA trend continues unaddressed if the internship really is the binding constraint.',
      whenItMakesSense: 'When the internship is closely tied to your career goals and you can identify a non-time cause for the GPA drop.',
    },
    {
      title: 'Reduce hours',
      upside: 'Recovers some study time while keeping the role and the relationship with your manager.',
      downside: 'Requires a negotiation you may not be able to control, and only partially resolves the time pressure.',
      whenItMakesSense: 'When your manager has flexibility and the value of the internship is in the relationship more than the hours.',
    },
    {
      title: 'Negotiate responsibilities',
      upside: 'Keeps the internship\u2019s title and network value while trimming the most time-consuming tasks.',
      downside: 'May reduce how substantive the experience looks on a resume or in a reference.',
      whenItMakesSense: 'When specific tasks (not the role itself) are the real time sink, and your manager is open to reshaping the work.',
    },
  ],
  perspectives: [
    {
      type: 'skeptic',
      label: 'The Skeptic',
      prompt: 'Why might this decision fail?',
      analysis:
        'It fails if the freed-up hours quietly get spent on anything other than studying. Nothing in the plan currently commits that time to coursework \u2014 the internship is simply the most visible, nameable cause of a problem that may have several sources.',
    },
    {
      type: 'longTerm',
      label: 'The Long-Term Thinker',
      prompt: 'How could this affect you six months or one year from now?',
      analysis:
        'A recovered GPA is easy to explain later; an internship left unfinished requires a story. If you are early in exploring your field, the professional signal may matter more a year from now than it feels like it does this semester.',
    },
    {
      type: 'practical',
      label: 'The Practical Thinker',
      prompt: 'What are the real-world costs and tradeoffs?',
      analysis:
        'Fifteen hours a week is roughly two hours a day \u2014 real, but not overwhelming, if the rest of your schedule has slack. The real cost is less the hours themselves and more whatever you are not currently doing with your other hours.',
    },
    {
      type: 'assumptionHunter',
      label: 'The Assumption Hunter',
      prompt: 'What are you assuming without enough evidence?',
      analysis:
        'That this internship is the cause, that leaving fixes it, and that you\u2019ll actually redirect the time to studying. All three are plausible. None are confirmed.',
    },
  ],
  challenge: {
    strongestArgument:
      'You have concrete, measurable evidence \u2014 a real GPA drop \u2014 that something in your current schedule is not working, and the internship is the largest single time commitment you have visibility into.',
    strongestCounterargument:
      'You are treating time availability as the bottleneck without evidence that it is, and an unfinished internship is a cost you would carry regardless of whether the GPA recovers.',
    evidenceThatWouldChangeDecision:
      'A week of tracking exactly how you spend your non-internship hours would show whether the constraint is really time, or something else \u2014 focus, workload distribution, or course difficulty.',
    likelyUnderestimate:
      'How much of the freed time gets absorbed by things other than studying, and how a partial internship reads to a future employer or reference.',
  },
  questions: [
    'Would reducing your internship hours solve the problem, without requiring you to leave entirely?',
    'How much academic improvement do you realistically expect from the freed time \u2014 in specific, checkable terms?',
    'How valuable is this experience for what you actually want to do after graduation?',
    'Is the GPA drop concentrated in specific courses, and does that point to a cause other than time?',
    'If you tracked one week of your schedule right now, where would the hours actually go?',
  ],
  finalOpinion: {
    whatLooksStrong:
      'The GPA evidence is real and the time commitment is significant \u2014 this is not a manufactured problem.',
    concerns:
      'The causal link between the internship and the GPA drop is asserted, not tested, and there is no concrete plan for the freed time.',
    investigateFirst:
      'Track one week of your actual schedule, and find out whether reduced hours is available before deciding to leave outright.',
    confidence: 'Medium',
  },
}
