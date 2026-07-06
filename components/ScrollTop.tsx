'use client'
import { useEffect, useState } from 'react'
import styles from './ScrollTop.module.css'

export default function ScrollTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return show ? (
    <button className={styles.btn} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <i className="ti ti-arrow-up" />
    </button>
  ) : null
}
