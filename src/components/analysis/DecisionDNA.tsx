import type { DecisionAnalysis } from '../../types/analysis'

interface DecisionDNAProps {
  history: DecisionAnalysis[]
}

export function DecisionDNA({ history }: DecisionDNAProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm text-center">
        <h3 className="mb-2 font-display text-xl text-warm-800">Decision DNA</h3>
        <p className="text-sm text-mauve-500">Make more decisions to see your personal patterns.</p>
      </div>
    )
  }

  // Calculate patterns
  const focusCount: Record<string, number> = {}
  let totalConfidenceBefore = 0
  let totalConfidenceAfter = 0
  let confidenceDecisions = 0
  
  let totalAccuracy = 0
  let accuracyCount = 0
  
  history.forEach(h => {
    h.focusAreas.forEach(f => {
      focusCount[f] = (focusCount[f] || 0) + 1
    })
    
    if (h.confidenceRating) {
      totalConfidenceBefore += h.confidenceRating.before
      totalConfidenceAfter += (h.confidenceRating.after ?? h.confidenceRating.before)
      confidenceDecisions++
    }
    
    if (h.outcomeTracking?.accuracyScore !== undefined) {
      totalAccuracy += h.outcomeTracking.accuracyScore
      accuracyCount++
    }
  })

  const topFocus = Object.entries(focusCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
  
  const avgBefore = confidenceDecisions ? Math.round(totalConfidenceBefore / confidenceDecisions) : 0
  const avgAfter = confidenceDecisions ? Math.round(totalConfidenceAfter / confidenceDecisions) : 0
  const confidenceChange = avgAfter - avgBefore
  
  const avgAccuracy = accuracyCount ? Math.round(totalAccuracy / accuracyCount) : null

  return (
    <div className="rounded-2xl border border-pink-200 bg-white/70 p-6 shadow-sm mb-10">
      <h3 className="mb-2 font-display text-xl text-warm-800">Your Decision DNA</h3>
      <p className="mb-6 text-sm text-mauve-500">Patterns based on your last {history.length} decisions.</p>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-petal-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-mauve-500">Top Priority</p>
          <p className="font-display text-2xl font-bold text-petal-600">{topFocus}</p>
          <p className="mt-2 text-xs text-mauve-600">You optimize most heavily for this factor.</p>
        </div>
        
        <div className="rounded-xl bg-petal-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-mauve-500">Avg Confidence Lift</p>
          <div className="flex items-center gap-2">
            <span className={`font-display text-2xl font-bold ${confidenceChange > 0 ? 'text-green-600' : 'text-mauve-600'}`}>
              {confidenceChange > 0 ? '+' : ''}{confidenceChange}%
            </span>
          </div>
          <p className="mt-2 text-xs text-mauve-600">How much more certain you feel after analysis.</p>
        </div>

        <div className="rounded-xl bg-petal-50 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-mauve-500">Prediction Accuracy</p>
          {avgAccuracy !== null ? (
            <>
              <p className={`font-display text-2xl font-bold ${avgAccuracy > 70 ? 'text-green-600' : avgAccuracy < 40 ? 'text-red-500' : 'text-yellow-600'}`}>
                {avgAccuracy}%
              </p>
              <p className="mt-2 text-xs text-mauve-600">Based on {accuracyCount} tracked outcomes.</p>
            </>
          ) : (
            <p className="mt-2 text-xs italic text-mauve-400">Track outcomes on decisions to calculate accuracy.</p>
          )}
        </div>
      </div>
    </div>
  )
}
