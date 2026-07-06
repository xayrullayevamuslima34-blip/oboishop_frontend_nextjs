'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api'
import { useApp } from '@/lib/context'
import styles from '../admin.module.css'

interface XizmatStatistika {
  jami: number
  yaxshiVaAjoyib: number
  yomon: number
  yaxshi: number
  ajoyib: number
}

export default function AdminHomePage() {
  const { t, lang } = useApp()
  const label = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en
  const [total, setTotal] = useState<number | null>(null)
  const [xizmat, setXizmat] = useState<XizmatStatistika | null>(null)

  useEffect(() => {
    apiAdmin('/oboilar?limit=1')
      .then(r => r.json())
      .then(d => setTotal(d.total))
      .catch(() => {})
    apiAdmin('/xizmat-bahosi/statistika')
      .then(r => r.json())
      .then(setXizmat)
      .catch(() => {})
  }, [])

  const foizYaxshi = xizmat && xizmat.jami > 0 ? Math.round((xizmat.yaxshiVaAjoyib / xizmat.jami) * 100) : null

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t('a_boshqaruv_paneli')}</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className={styles.card}>
          <div style={{ fontSize: 13, color: '#857c6e', marginBottom: 6 }}>{t('a_jami_oboilar')}</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{total ?? '—'}</div>
        </div>
        <div className={styles.card}>
          <div style={{ fontSize: 13, color: '#857c6e', marginBottom: 6 }}>
            {label('Sayt xizmatidan qoniqish', 'Удовлетворённость сайтом', 'Site satisfaction')}
          </div>
          {xizmat && xizmat.jami > 0 ? (
            <>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{foizYaxshi}%</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: '#857c6e' }}>
                <span>🙁 {xizmat.yomon}</span>
                <span>🙂 {xizmat.yaxshi}</span>
                <span>😍 {xizmat.ajoyib}</span>
              </div>
              <div style={{ fontSize: 11, color: '#b5a68f', marginTop: 4 }}>
                {label(`Jami ${xizmat.jami} ta javob`, `Всего ${xizmat.jami} ответов`, `${xizmat.jami} responses total`)}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: '#b5a68f' }}>{t('a_hech_narsa_topilmadi')}</div>
          )}
        </div>
        <Link href="/admin/oboilar" className={styles.card} style={{ textDecoration: 'none', color: 'inherit' }}>
          <i className="ti ti-photo" style={{ fontSize: 22, color: '#8b6f5e' }} />
          <div style={{ fontWeight: 700, marginTop: 8 }}>{t('a_oboilarni_boshqarish')}</div>
        </Link>
        <Link href="/admin/sozlamalar" className={styles.card} style={{ textDecoration: 'none', color: 'inherit' }}>
          <i className="ti ti-settings" style={{ fontSize: 22, color: '#8b6f5e' }} />
          <div style={{ fontWeight: 700, marginTop: 8 }}>{t('a_sayt_sozlamalari')}</div>
        </Link>
      </div>
    </div>
  )
}
