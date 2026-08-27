import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/new', label: 'New Opinion' },
  { to: '/history', label: 'History' },
  { to: '/compare', label: 'Compare AI' },
  { to: '/think-lab', label: 'Think Lab' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-pink-200/40 dark:border-plum-800/60 bg-blush-50/80 dark:bg-plum-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          {/* )( logo mark */}
          <span className="font-display text-xl font-semibold tracking-tight text-petal-600  transition-all duration-300 group-hover:scale-110 inline-block select-none">
            )(
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-warm-800 ">
            Elsewise
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-petal-500/10 text-petal-600  '
                    : 'text-mauve-500 hover:bg-petal-500/8 hover:text-petal-600 dark:-plum-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/new')}>
                Ask Elsewise →
              </Button>
              <button
                onClick={signOut}
                className="hidden sm:inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium text-mauve-500 hover:bg-wine-100 hover:text-wine-800 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/signin')}>
              Sign In
            </Button>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-mauve-500 hover:bg-petal-100 md:hidden dark:-plum-800 transition-colors"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-pink-200/40 px-5 pb-4 pt-2 md:hidden ">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-[15px] font-medium transition-all ${
                    isActive
                      ? 'bg-petal-500/10 text-petal-600  '
                      : 'text-mauve-500 '
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setOpen(false)
                    navigate('/new')
                  }}
                >
                  Ask Elsewise →
                </Button>
                <button
                  onClick={() => {
                    setOpen(false)
                    signOut()
                  }}
                  className="mt-2 rounded-xl px-4 py-2.5 text-left text-[15px] font-medium text-mauve-500 hover:bg-wine-100 hover:text-wine-800 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Button
                size="sm"
                className="mt-2"
                onClick={() => {
                  setOpen(false)
                  navigate('/signin')
                }}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
