export function QuestionList({ questions }: { questions: string[] }) {
  return (
    <div>
      <ol className="space-y-3">
        {questions.map((q, i) => (
          <li key={i} className="flex gap-3.5">
            <span className="mt-0.5 shrink-0 font-mono text-sm text-wine-600 ">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[15px] leading-relaxed text-ink-800 ">{q}</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t border-ink-800/10 pt-5 font-display text-lg italic text-ink-700  ">
        You don't need more advice. You need answers to these questions.
      </p>
    </div>
  )
}
