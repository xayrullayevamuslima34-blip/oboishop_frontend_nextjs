'use client'
import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/lib/context'
import { apiPublic } from '@/lib/api'
import { safeStorage } from '@/lib/storage'
import styles from './ChatWidget.module.css'

interface Xabar {
  id: string
  matn: string
  kimdan: 'mijoz' | 'admin'
  createdAt: string
}

const DEVICE_KEY = 'suhbat_device_id'
const KORILGAN_KEY = 'suhbat_admin_korilgan_soni'
const POLL_MS = 15000

function deviceIdOl(): string {
  let id = safeStorage.get(DEVICE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    safeStorage.set(DEVICE_KEY, id)
  }
  return id
}

export default function ChatWidget() {
  const { lang } = useApp()
  const label = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en
  const [open, setOpen] = useState(false)
  const [xabarlar, setXabarlar] = useState<Xabar[]>([])
  const [matn, setMatn] = useState('')
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [badge, setBadge] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const yangilash = () => {
    apiPublic(`/suhbatlar/mijoz/${deviceIdOl()}`)
      .then(r => r.json())
      .then((d: { xabarlar: Xabar[] }) => {
        setXabarlar(d.xabarlar)
        const adminSoni = d.xabarlar.filter(x => x.kimdan === 'admin').length
        const korilgan = parseInt(safeStorage.get(KORILGAN_KEY) || '0', 10)
        setBadge(Math.max(0, adminSoni - korilgan))
      })
      .catch(() => {})
  }

  useEffect(() => {
    yangilash()
    const interval = setInterval(yangilash, POLL_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (open) {
      const adminSoni = xabarlar.filter(x => x.kimdan === 'admin').length
      safeStorage.set(KORILGAN_KEY, String(adminSoni))
      setBadge(0)
    }
  }, [open, xabarlar])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [xabarlar, open])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const yuborish = async () => {
    const trimmed = matn.trim()
    if (!trimmed || yuborilmoqda) return
    setYuborilmoqda(true)
    setMatn('')
    try {
      const res = await apiPublic('/suhbatlar/xabar', {
        method: 'POST',
        body: JSON.stringify({ deviceId: deviceIdOl(), matn: trimmed }),
      })
      const d = await res.json()
      setXabarlar(d.xabarlar)
    } catch {} finally {
      setYuborilmoqda(false)
    }
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      {open && (
        <div className={styles.popup}>
          <div className={styles.popupHead}>
            <div className={styles.avatar}><i className="ti ti-message-circle-2" /></div>
            <div className={styles.headText}>
              <div className={styles.name}>OboiShop</div>
              <div className={styles.status}>{label('Savolingiz qabul qilindi — tez orada bog\'lanamiz.', 'Ваш вопрос принят — скоро свяжемся с вами.', 'Your question has been received — we\'ll get back to you soon.')}</div>
            </div>
            <button className={styles.close} onClick={() => setOpen(false)}><i className="ti ti-x" /></button>
          </div>
          <div className={styles.popupBody} ref={bodyRef}>
            {xabarlar.length === 0 && (
              <div className={styles.emptyState}>
                {label('Savolingizni shu yerga yozing 👇', 'Напишите свой вопрос здесь 👇', 'Write your question here 👇')}
              </div>
            )}
            {xabarlar.map(x => (
              <div key={x.id} className={`${styles.msg} ${x.kimdan === 'mijoz' ? styles.msgMijoz : styles.msgAdmin}`}>
                {x.matn}
              </div>
            ))}
          </div>
          <div className={styles.inputRow}>
            <input
              value={matn}
              onChange={e => setMatn(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') yuborish() }}
              placeholder={label('Xabar yozing...', 'Напишите сообщение...', 'Type a message...')}
              className={styles.input}
            />
            <button className={styles.sendBtn} onClick={yuborish} disabled={yuborilmoqda || !matn.trim()}>
              <i className="ti ti-send" />
            </button>
          </div>
        </div>
      )}
      <button className={styles.fab} onClick={() => setOpen(!open)}>
        <i className={open ? 'ti ti-x' : 'ti ti-message-circle-2'} />
        {!open && badge > 0 && <span className={styles.badge}>{badge}</span>}
      </button>
    </div>
  )
}
