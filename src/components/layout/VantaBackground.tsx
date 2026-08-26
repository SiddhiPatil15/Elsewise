import { useState, useEffect, useRef } from 'react'

export function VantaBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if the global variables are available
    if (!vantaEffect && (window as any).VANTA && (window as any).VANTA.CLOUDS) {
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

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy()
      }
    }
  }, [vantaEffect])

  return (
    <div
      ref={myRef}
      className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
    />
  )
}
