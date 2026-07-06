'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 400)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 3,
      background: 'linear-gradient(90deg, var(--beige), var(--accent), var(--brown))',
      zIndex: 10000,
      transform: visible ? 'scaleX(1)' : 'scaleX(0)',
      transformOrigin: 'left',
      transition: visible ? 'transform 0.4s ease' : 'transform 0.3s ease',
      opacity: visible ? 1 : 0,
    }} />
  )
}
