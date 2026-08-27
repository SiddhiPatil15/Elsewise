import { useState, useEffect, useRef } from 'react'

export function VantaBackground() {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
            minWidth: 200.00
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
  }, [vantaEffect])

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
      className="fixed inset-0 z-0 h-full w-full pointer-events-none transition-all duration-300 bg-transparent"
    >
      {/* Vanta injects its canvas inside this div. */}
    </div>
  )
}
