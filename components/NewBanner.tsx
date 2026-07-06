'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './NewBanner.module.css'
import { useApp } from '@/lib/context'
import { API_URL } from '@/lib/api'

export default function NewBanner() {
  const { lang } = useApp()
  const label = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en
  const [show, setShow] = useState(false)
  const [yangiSoni, setYangiSoni] = useState<number | null>(null)

  useEffect(() => {
    // sessionStorage - har sessiyada bir marta ko'rsatadi
    const closed = sessionStorage.getItem('bannerClosed')
    if (!closed) setShow(true)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/oboilar?limit=1&oxirgiKunlar=7`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setYangiSoni(d.total))
      .catch(() => setYangiSoni(0))
  }, [])

  const close = () => {
    setShow(false)
    sessionStorage.setItem('bannerClosed', '1')
  }

  // Oxirgi 7 kunda yangi mahsulot qo'shilmagan bo'lsa banner umuman ko'rinmaydi.
  if (!show || !yangiSoni) return null

  return (
    <div className={styles.banner}>
      <span>🎉 {label('Bu hafta', 'На этой неделе', 'This week')} <strong>{label(`${yangiSoni} ta yangi oboi`, `${yangiSoni} новых обоев`, `${yangiSoni} new wallpapers`)}</strong> {label('keldi!', 'поступило!', 'arrived!')}</span>
      <Link href="/katalog" className={styles.link}>{label("Ko'rish →", 'Смотреть →', 'View →')}</Link>
      <button className={styles.close} onClick={close}><i className="ti ti-x" /></button>
    </div>
  )
}
