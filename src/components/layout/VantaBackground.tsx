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

    let checkInterval: any;

    const initVanta = () => {
      if (!vantaEffect && myRef.current && (window as any).VANTA && (window as any).VANTA.CLOUDS) {
        setVantaEffect(
          (window as any).VANTA.CLOUDS({
            el: myRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            skyColor: 0xffffff,
            cloudColor: 0xe6e6e6,
            cloudShadowColor: 0xd9d9d9,
            sunColor: 0xff9919,
            sunGlareColor: 0xff6633,
            sunPosition: { x: 0, y: 0, z: 0 }
          })
        )
        if (checkInterval) clearInterval(checkInterval)
      }
    }

    if (!(window as any).VANTA) {
      checkInterval = setInterval(initVanta, 500)
    } else {
      initVanta()
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval)
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
