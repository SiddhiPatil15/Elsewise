export function CounterArgument({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-mauve-200 bg-white/60 backdrop-blur-sm p-6 sm:p-7 shadow-sm">
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-mauve-600">
        If your decision is wrong, this is probably why
      </p>
      <p className="font-display text-lg leading-relaxed text-warm-900 sm:text-xl">
        {text}
      </p>
    </div>
  )
}
