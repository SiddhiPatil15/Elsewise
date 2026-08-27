import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="flex h-8 w-8 items-center justify-center rounded-md text-ink-600 transition-colors hover:bg-ink-800/[0.06] dark:-cream-200/[0.08]"
    >
      {theme === 'light' ? <Moon size={17} strokeWidth={1.75} /> : <Sun size={17} strokeWidth={1.75} />}
    </button>
  )
}
