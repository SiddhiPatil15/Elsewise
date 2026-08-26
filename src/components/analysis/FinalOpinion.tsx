import type { FinalOpinion as FinalOpinionType } from '../../types/analysis'

const confidenceStyles: Record<FinalOpinionType['confidence'], string> = {
  Low: 'text-rust-600 ',
  Medium: 'text-ink-700 ',
  High: 'text-moss-600 ',
}

export function FinalOpinion({ opinion }: { opinion: FinalOpinionType }) {
  return (
    <div className="rounded-lg border border-ink-800/12 p-6 sm:p-7 ">
      <div className="mb-6 grid gap-5 sm:grid-cols-3">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-wider text-ink-400 ">
            What looks strong
          </p>
          <p className="text-[15px] leading-relaxed text-ink-800 ">{opinion.whatLooksStrong}</p>
        </div>
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-wider text-ink-400 ">
            What concerns me
          </p>
          <p className="text-[15px] leading-relaxed text-ink-800 ">{opinion.concerns}</p>
        </div>
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-wider text-ink-400 ">
            What I'd investigate first
          </p>
          <p className="text-[15px] leading-relaxed text-ink-800 ">{opinion.investigateFirst}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 border-t border-ink-800/10 pt-5 ">
        <span className="text-sm text-ink-500 ">Decision confidence:</span>
        <span className={`text-sm font-medium ${confidenceStyles[opinion.confidence]}`}>{opinion.confidence}</span>
      </div>
      <p className="mt-4 text-sm text-ink-400 ">
        This isn't a verdict. It's a second opinion — the decision is still yours.
      </p>
    </div>
  )
}
