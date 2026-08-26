interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-petal-400 ">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-2xl text-warm-800 sm:text-[28px] ">{title}</h2>
      {description && (
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-mauve-500 ">
          {description}
        </p>
      )}
    </div>
  )
}
