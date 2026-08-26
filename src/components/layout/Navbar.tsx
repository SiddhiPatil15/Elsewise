import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Button } from '../ui/Button'

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

  return (
    <header className="sticky top-0 z-40 border-b border-pink-200/40 bg-blush-50/80 backdrop-blur-md  ">
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
                    : 'text-mauve-500 hover:bg-petal-500/8 hover:text-petal-600  :text-plum-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/new')}>
            Ask Elsewise →
          </Button>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-mauve-500 hover:bg-petal-100 md:hidden  :bg-plum-800 transition-colors"
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
          </nav>
        </div>
      )}
    </header>
  )
}
