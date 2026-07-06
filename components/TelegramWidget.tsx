'use client'
import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/lib/context'
import styles from './TelegramWidget.module.css'

export default function TelegramWidget() {
  const { lang, sozlamalar } = useApp()
  const label = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className={styles.wrap} ref={wrapRef}>
      {open && (
        <div className={styles.popup}>
          <div className={styles.popupHead}>
            <div className={styles.avatar}><i className="ti ti-brand-telegram" /></div>
            <div>
              <div className={styles.name}>OboiShop</div>
              <div className={styles.status}>● {label('Onlayn', 'Онлайн', 'Online')}</div>
            </div>
            <button className={styles.close} onClick={() => setOpen(false)}><i className="ti ti-x" /></button>
          </div>
          <div className={styles.popupBody}>
            <div className={styles.msg}>{label('Salom! 👋 Oboi haqida savolingiz bormi?', 'Здравствуйте! 👋 Есть вопросы об обоях?', 'Hello! 👋 Have a question about wallpaper?')}</div>
            <div className={styles.msg}>{label('Telegramda yozing, tez javob beramiz!', 'Напишите нам в Telegram, ответим быстро!', "Message us on Telegram, we'll reply fast!")}</div>
          </div>
          <a href={sozlamalar.telegramMurojaat} target="_blank" rel="noopener noreferrer" className={styles.popupBtn}>
            <i className="ti ti-brand-telegram" /> {label('Telegramda yozish', 'Написать в Telegram', 'Write on Telegram')}
          </a>
        </div>
      )}
      <button className={styles.fab} onClick={() => setOpen(!open)}>
        <i className={open ? 'ti ti-x' : 'ti ti-brand-telegram'} />
        {!open && <span className={styles.pulse} />}
      </button>
    </div>
  )
}
