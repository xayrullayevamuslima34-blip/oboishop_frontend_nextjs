'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api'
import { useApp } from '@/lib/context'
import styles from '../../../admin.module.css'

interface Xabar {
  id: string
  matn: string
  kimdan: 'mijoz' | 'admin'
  createdAt: string
}

export default function AdminSuhbatPage() {
  const { id } = useParams<{ id: string }>()
  const { t, lang } = useApp()
  const [xabarlar, setXabarlar] = useState<Xabar[]>([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [matn, setMatn] = useState('')
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  const yuklash = useCallback(() => {
    apiAdmin(`/suhbatlar/${id}`)
      .then(r => r.json())
      .then(d => setXabarlar(d.xabarlar))
      .finally(() => setYuklanmoqda(false))
  }, [id])

  useEffect(() => { yuklash() }, [yuklash])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [xabarlar])

  const sanaFormat = (iso: string) =>
    new Date(iso).toLocaleString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    })

  const yuborish = async () => {
    const trimmed = matn.trim()
    if (!trimmed || yuborilmoqda) return
    setYuborilmoqda(true)
    setMatn('')
    try {
      const res = await apiAdmin(`/suhbatlar/${id}/javob`, { method: 'POST', body: JSON.stringify({ matn: trimmed }) })
      const d = await res.json()
      setXabarlar(d.xabarlar)
    } finally {
      setYuborilmoqda(false)
    }
  }

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t('a_mijoz')}</h1>
        <Link href="/admin/xabarlar" className={styles.btn}>{t('a_orqaga_royxatga')}</Link>
      </div>

      {yuklanmoqda ? (
        <div>{t('a_yuklanmoqda')}</div>
      ) : (
        <div className={styles.card} style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', height: 500 }}>
          <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 12 }}>
            {xabarlar.length === 0 && <div style={{ margin: 'auto', color: 'var(--text-muted, #8b7d72)' }}>{t('a_xabar_yoq')}</div>}
            {xabarlar.map(x => (
              <div
                key={x.id}
                style={{
                  alignSelf: x.kimdan === 'admin' ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  background: x.kimdan === 'admin' ? '#8b6f5e' : '#f5f2ee',
                  color: x.kimdan === 'admin' ? '#fff' : '#2c2318',
                  padding: '9px 13px',
                  borderRadius: 12,
                  fontSize: 14,
                }}
              >
                <div>{x.matn}</div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>{sanaFormat(x.createdAt)}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #eee6da', paddingTop: 12 }}>
            <input
              value={matn}
              onChange={e => setMatn(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') yuborish() }}
              placeholder={t('a_javob_placeholder')}
              style={{ flex: 1, padding: '9px 12px', border: '1px solid #d8cfc0', borderRadius: 8 }}
            />
            <button className={styles.btnPrimary} onClick={yuborish} disabled={yuborilmoqda || !matn.trim()}>
              {t('a_yuborish')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
