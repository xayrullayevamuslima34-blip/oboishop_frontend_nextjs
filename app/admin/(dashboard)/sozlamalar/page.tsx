'use client'
import { useEffect, useState } from 'react'
import { apiAdmin } from '@/lib/api'
import { Sozlamalar } from '@/lib/api'
import { useApp } from '@/lib/context'
import styles from '../../admin.module.css'

export default function SozlamalarAdminPage() {
  const { t } = useApp()
  const [form, setForm] = useState<Sozlamalar | null>(null)
  const [xato, setXato] = useState('')
  const [muvaffaqiyat, setMuvaffaqiyat] = useState(false)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)

  useEffect(() => {
    apiAdmin('/sozlamalar').then(r => r.json()).then(setForm)
  }, [])

  const set = (key: keyof Sozlamalar, value: string) =>
    setForm(f => (f ? { ...f, [key]: value } : f))

  const saqlash = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setXato('')
    setMuvaffaqiyat(false)
    setSaqlanmoqda(true)
    try {
      const { id, ...dto } = form
      const res = await apiAdmin('/sozlamalar', { method: 'PUT', body: JSON.stringify(dto) })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || t('a_xatolik'))
      }
      setMuvaffaqiyat(true)
    } catch (err: any) {
      setXato(err.message)
    } finally {
      setSaqlanmoqda(false)
    }
  }

  if (!form) return <div>{t('a_yuklanmoqda')}</div>

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t('a_sayt_sozlamalari')}</h1>
      </div>
      {xato && <div className={styles.error}>{xato}</div>}
      {muvaffaqiyat && <div className={styles.success}>{t('a_saqlandi')}</div>}

      <form onSubmit={saqlash} className={styles.card}>
        <h3 style={{ marginTop: 0 }}>{t('a_3_korsatkich')}</h3>
        <div className={styles.formGrid} style={{ marginBottom: 24 }}>
          <div className={styles.field}><label>{t('a_stat1_raqam')}</label><input value={form.stat1Raqam} onChange={e => set('stat1Raqam', e.target.value)} /></div>
          <div className={styles.field}><label>{t('a_stat1_matn')}</label><input value={form.stat1Label} onChange={e => set('stat1Label', e.target.value)} /></div>
          <div className={styles.field}><label>{t('a_stat2_raqam')}</label><input value={form.stat2Raqam} onChange={e => set('stat2Raqam', e.target.value)} /></div>
          <div className={styles.field}><label>{t('a_stat2_matn')}</label><input value={form.stat2Label} onChange={e => set('stat2Label', e.target.value)} /></div>
          <div className={styles.field}><label>{t('a_stat3_raqam')}</label><input value={form.stat3Raqam} onChange={e => set('stat3Raqam', e.target.value)} /></div>
          <div className={styles.field}><label>{t('a_stat3_matn')}</label><input value={form.stat3Label} onChange={e => set('stat3Label', e.target.value)} /></div>
        </div>

        <h3>{t('a_kontakt_malumotlari')}</h3>
        <div className={styles.formGrid} style={{ marginBottom: 24 }}>
          <div className={styles.field}><label>{t('a_telefon')}</label><input value={form.telefon} onChange={e => set('telefon', e.target.value)} placeholder="+998901234567" /></div>
          <div className={styles.field}><label>{t('a_manzil')}</label><input value={form.manzil} onChange={e => set('manzil', e.target.value)} /></div>
          <div className={styles.field}><label>{t('a_ish_vaqti')}</label><input value={form.ishVaqti} onChange={e => set('ishVaqti', e.target.value)} /></div>
          <div className={styles.field}>
            <label>{t('a_bosh_sahifa_sarlavhasi')}</label>
            <input value={form.bannerMatni} onChange={e => set('bannerMatni', e.target.value)} placeholder={t('a_sarlavha_placeholder')} />
          </div>
        </div>

        <h3>{t('a_ijtimoiy_telegram')}</h3>
        <div className={styles.formGrid} style={{ marginBottom: 24 }}>
          <div className={styles.field}><label>{t('a_instagram_havolasi')}</label><input value={form.instagramLink} onChange={e => set('instagramLink', e.target.value)} placeholder="https://instagram.com/..." /></div>
          <div className={styles.field}><label>{t('a_telegram_kanal')}</label><input value={form.telegramKanal} onChange={e => set('telegramKanal', e.target.value)} placeholder="https://t.me/..." /></div>
          <div className={styles.field}><label>{t('a_telegram_murojaat')}</label><input value={form.telegramMurojaat} onChange={e => set('telegramMurojaat', e.target.value)} placeholder="https://t.me/..." /></div>
        </div>

        <h3>{t('a_manzil_xarita')}</h3>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>{t('a_google_maps_embed')}</label>
            <input value={form.xaritaEmbed} onChange={e => set('xaritaEmbed', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
          </div>
          <div className={styles.field}>
            <label>{t('a_xaritada_ochish_havolasi')}</label>
            <input value={form.xaritaLink} onChange={e => set('xaritaLink', e.target.value)} placeholder="https://maps.google.com/?q=..." />
          </div>
          <div className="full" style={{ fontSize: 12, color: '#857c6e' }}>
            {t('a_google_maps_yoriqnoma')}
          </div>
        </div>

        <button type="submit" className={styles.btnPrimary} style={{ marginTop: 24 }} disabled={saqlanmoqda}>
          {saqlanmoqda ? t('a_saqlanmoqda') : t('a_saqlash')}
        </button>
      </form>
    </div>
  )
}
