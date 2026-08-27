import type { ProviderId, ProviderInfo } from '../../types/analysis'

interface ProviderPickerProps {
  providers: ProviderInfo[]
  selected: ProviderId | null
  onSelect: (id: ProviderId) => void
  label?: string
}

export function ProviderPicker({ providers, selected, onSelect, label = 'Choose your AI' }: ProviderPickerProps) {
  const anyConfigured = providers.some((p) => p.id !== 'fastest' && p.hasApiKey)

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-mauve-600 ">{label}</p>
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => {
          const isSelected = selected === p.id
          const isFastest = p.id === 'fastest'
          const disabled = !p.hasApiKey

          if (isFastest) {
            // Special "Fastest" pill with gradient styling
            return (
              <button
                key={p.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(p.id)}
                title={p.model}
                aria-pressed={isSelected}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                  disabled
                    ? 'cursor-not-allowed border-pink-100 text-mauve-300/50  '
                    : isSelected
                      ? 'border-transparent bg-gradient-to-r from-petal-500 to-lavender-500 text-white shadow-md shadow-petal-300/40 '
                      : 'border-petal-300 bg-gradient-to-r from-petal-50 to-lavender-100/50 text-petal-600 hover:from-petal-100 hover:to-lavender-200/60    '
                }`}
              >
                {p.label}
              </button>
            )
          }

          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(p.id)}
              title={disabled ? `${p.label} has no API key configured on the server` : p.model}
              aria-pressed={isSelected}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${
                disabled
                  ? 'cursor-not-allowed border-pink-100 text-mauve-300/50  '
                  : isSelected
                    ? 'border-petal-500 bg-gradient-to-r from-petal-500/15 to-lavender-500/15 text-petal-600 shadow-sm shadow-petal-200   '
                    : 'border-pink-200 text-mauve-500 hover:border-petal-400 hover:text-petal-600 hover:bg-petal-50 dark:-petal-500 dark:-plum-800'
              }`}
            >
              {p.label}
              {disabled && <span className="ml-1.5 text-xs opacity-60">— unavailable</span>}
            </button>
          )
        })}
      </div>
      {!anyConfigured && (
        <p className="mt-2 text-xs text-petal-600/80 ">
          No provider is configured on the server yet — add an API key to the backend's .env file.
        </p>
      )}
      {anyConfigured && selected === 'fastest' && (
        <p className="mt-2 text-xs text-mauve-400 ">
          ⚡ Races Gemini + ChatGPT simultaneously — uses whichever replies first
        </p>
      )}
    </div>
  )
}
