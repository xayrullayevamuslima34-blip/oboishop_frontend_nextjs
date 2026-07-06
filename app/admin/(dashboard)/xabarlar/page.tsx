'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api'
import { useApp } from '@/lib/context'
import styles from '../../admin.module.css'

interface SuhbatRow {
  id: string
  deviceId: string
  oxirgiXabar: string
  oxirgiVaqt: string
  oqilmaganSoni: number
}

export default function AdminXabarlarPage() {
  const { t, lang } = useApp()
  const [data, setData] = useState<SuhbatRow[]>([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  const yuklash = useCallback(() => {
    apiAdmin('/suhbatlar')
      .then(r => r.json())
      .then(setData)
      .finally(() => setYuklanmoqda(false))
  }, [])

  useEffect(() => { yuklash() }, [yuklash])

  const sanaFormat = (iso: string) =>
    new Date(iso).toLocaleString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    })

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t('a_nav_xabarlar')}</h1>
      </div>

      {yuklanmoqda ? (
        <div>{t('a_yuklanmoqda')}</div>
      ) : data.length === 0 ? (
        <div className={styles.card}>{t('a_suhbatlar_yoq')}</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('a_mijoz')}</th>
              <th>{t('a_nav_xabarlar')}</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(s => (
              <tr key={s.id}>
                <td>{s.deviceId.slice(0, 8)}</td>
                <td style={{ maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.oxirgiXabar}
                </td>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: 12 }}>
                  {sanaFormat(s.oxirgiVaqt)}
                </td>
                <td>
                  <Link href={`/admin/xabarlar/${s.id}`} className={styles.btn} style={{ position: 'relative' }}>
                    <i className="ti ti-message-circle-2" />
                    {s.oqilmaganSoni > 0 && (
                      <span className={styles.navBadge} style={{ marginLeft: 6, position: 'static' }}>
                        {s.oqilmaganSoni}
                      </span>
                    )}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
