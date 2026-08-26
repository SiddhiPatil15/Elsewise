import { forwardRef, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95'
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-[15px]',
    }
    const variants = {
      primary:
        'bg-gradient-to-r from-petal-600 to-lavender-500 text-white shadow-sm shadow-petal-500/25 hover:shadow-md hover:shadow-petal-500/30 hover:from-petal-500 hover:to-lavender-400',
      outline:
        'border border-petal-300 text-mauve-600 hover:bg-petal-50 hover:border-petal-400   :bg-plum-800 :border-plum-400',
      ghost:
        'text-mauve-500 hover:bg-petal-100/60  :bg-plum-800/60',
    }
    return (
      <button ref={ref} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
