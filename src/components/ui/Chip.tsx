interface ChipProps {
  label: string
  active?: boolean
  onClick?: () => void
}

export function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
        active
          ? 'border-petal-400 bg-gradient-to-r from-petal-500/15 to-lavender-500/10 text-petal-600 shadow-sm shadow-petal-200/60   '
          : 'border-pink-200 text-mauve-500 hover:border-petal-300 hover:bg-petal-50 hover:text-petal-600 dark:-petal-500 dark:-plum-800'
      }`}
    >
      {label}
    </button>
  )
}
