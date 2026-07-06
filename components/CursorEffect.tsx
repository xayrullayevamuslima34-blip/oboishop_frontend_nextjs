'use client'
import { useEffect, useRef, useState } from 'react'

export default function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Mobile/touch uchun cursor effekti kerak emas
    if (window.matchMedia('(hover: none)').matches) return
    setShow(true)

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0
    let animId: number

    const move = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY
      dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px'
      animId = requestAnimationFrame(animate)
    }

    const grow = () => { ring.style.width = '46px'; ring.style.height = '46px' }
    const shrink = () => { ring.style.width = '30px'; ring.style.height = '30px' }

    document.addEventListener('mousemove', move)
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })
    animId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', move)
      cancelAnimationFrame(animId)
    }
  }, [])

  if (!show) return null

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: 6, height: 6,
        background: 'var(--accent)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%, -50%)',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 30, height: 30,
        border: '1.5px solid var(--accent)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.2s, height 0.2s',
        opacity: 0.65,
      }} />
    </>
  )
}
