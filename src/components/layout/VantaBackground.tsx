import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

export function VantaBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const myRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (theme === 'dark') {
      if (vantaEffect) {
        vantaEffect.destroy()
        setVantaEffect(null)
      }
      return
    }

    if (!vantaEffect && myRef.current && (window as any).VANTA && (window as any).VANTA.CLOUDS) {
      setVantaEffect(
        (window as any).VANTA.CLOUDS({
          el: myRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00
        })
      )
    }
  }, [theme, vantaEffect])

  useEffect(() => {
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy()
      }
    }
  }, [vantaEffect])

  return (
    <div
      ref={myRef}
      className={`fixed inset-0 -z-10 h-full w-full pointer-events-none transition-opacity duration-300 ${theme === 'dark' ? 'opacity-0 hidden' : 'opacity-100'}`}
    />
  )
}
