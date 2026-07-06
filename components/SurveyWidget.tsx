'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useApp } from '@/lib/context'
import { apiPublic } from '@/lib/api'
import styles from './SurveyWidget.module.css'

const KORSATILDI_KEY = 'xizmat_sorovi_korsatildi'
const KORILGAN_OBOI_KEY = 'xizmat_sorovi_korilgan_oboilar'
const VAQT_MS = 60000
const KERAKLI_OBOI_SONI = 2

type Baho = 'yomon' | 'yaxshi' | 'ajoyib'

export default function SurveyWidget() {
  const { lang } = useApp()
  const label = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en
  const pathname = usePathname()
  const [korinsin, setKorinsin] = useState(false)
  const [tanlandi, setTanlandi] = useState<Baho | null>(null)
  const chiqdiRef = useRef(false)

  const chiqar = () => {
    if (chiqdiRef.current) return
    if (sessionStorage.getItem(KORSATILDI_KEY)) return
    chiqdiRef.current = true
    sessionStorage.setItem(KORSATILDI_KEY, '1')
    setKorinsin(true)
  }

  useEffect(() => {
    if (sessionStorage.getItem(KORSATILDI_KEY)) return
    const timeout = setTimeout(chiqar, VAQT_MS)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem(KORSATILDI_KEY)) return
    const match = pathname?.match(/^\/oboi\/(.+)$/)
    if (!match) return
    const oboiId = match[1]
    const korilgan: string[] = JSON.parse(sessionStorage.getItem(KORILGAN_OBOI_KEY) || '[]')
    if (!korilgan.includes(oboiId)) {
      const yangilangan = [...korilgan, oboiId]
      sessionStorage.setItem(KORILGAN_OBOI_KEY, JSON.stringify(yangilangan))
      if (yangilangan.length >= KERAKLI_OBOI_SONI) chiqar()
    }
  }, [pathname])

  const tanlash = async (baho: Baho) => {
    setTanlandi(baho)
    try {
      await apiPublic('/xizmat-bahosi', { method: 'POST', body: JSON.stringify({ baho }) })
    } catch {}
    setTimeout(() => setKorinsin(false), 1800)
  }

  if (!korinsin) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <button className={styles.close} onClick={() => setKorinsin(false)}><i className="ti ti-x" /></button>
        {tanlandi ? (
          <div className={styles.rahmat}>
            {label('Fikringiz uchun rahmat! 🙏', 'Спасибо за ваш отзыв! 🙏', 'Thank you for your feedback! 🙏')}
          </div>
        ) : (
          <>
            <div className={styles.savol}>
              {label('OboiShop xizmatlari sizga maqul keldimi?', 'Вам понравился сервис OboiShop?', 'Did you like OboiShop\'s service?')}
            </div>
            <div className={styles.emojiRow}>
              <div className={styles.emojiCol}>
                <button className={styles.emojiBtn} onClick={() => tanlash('yomon')}>🙁</button>
                <span className={styles.emojiLabel}>{label('Yomon', 'Плохо', 'Bad')}</span>
              </div>
              <div className={styles.emojiCol}>
                <button className={styles.emojiBtn} onClick={() => tanlash('yaxshi')}>🙂</button>
                <span className={styles.emojiLabel}>{label('Yaxshi', 'Хорошо', 'Good')}</span>
              </div>
              <div className={styles.emojiCol}>
                <button className={styles.emojiBtn} onClick={() => tanlash('ajoyib')}>😍</button>
                <span className={styles.emojiLabel}>{label('Ajoyib', 'Отлично', 'Great')}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
