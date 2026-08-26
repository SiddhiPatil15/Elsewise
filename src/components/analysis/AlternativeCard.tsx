import type { Alternative } from '../../types/analysis'

export function AlternativeCard({ alt, index }: { alt: Alternative; index: number }) {
  return (
    <div className="rounded-lg border border-ink-800/12 bg-cream-50 p-5  ">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="font-mono text-xs text-ink-400 ">
          {String.fromCharCode(65 + index)}
        </span>
        <h4 className="text-[15px] font-medium text-ink-900 ">{alt.title}</h4>
      </div>
      <dl className="space-y-2.5 text-sm">
        <div>
          <dt className="text-ink-400 ">Potential upside</dt>
          <dd className="text-ink-700 ">{alt.upside}</dd>
        </div>
        <div>
          <dt className="text-ink-400 ">Potential downside</dt>
          <dd className="text-ink-700 ">{alt.downside}</dd>
        </div>
        <div>
          <dt className="text-ink-400 ">When it makes sense</dt>
          <dd className="text-ink-700 ">{alt.whenItMakesSense}</dd>
        </div>
      </dl>
    </div>
  )
}
