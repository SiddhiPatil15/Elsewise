export function CounterArgument({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-ink-900 bg-ink-900 p-6 sm:p-7  ">
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-cream-300/70 ">
        If your decision is wrong, this is probably why
      </p>
      <p className="font-display text-lg leading-relaxed text-cream-50 sm:text-xl ">
        {text}
      </p>
    </div>
  )
}
