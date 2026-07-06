'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { apiAdmin } from '@/lib/api'
import { useApp } from '@/lib/context'
import styles from '../../admin.module.css'

interface OboiRow {
  id: string
  kod: string
  nom: string
  narx: number
  olcham: string
  rasm: string | null
  kategoriya: { id: string; nom: string } | null
  fabrika: { id: string; nom: string } | null
  stok: boolean
  featured: boolean
  yangi: boolean
  reytingOrtacha: number
  reytingSoni: number
}

const LIMIT = 20

export default function AdminOboilarPage() {
  const { t } = useApp()
  const [data, setData] = useState<OboiRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  const yuklash = useCallback(() => {
    setYuklanmoqda(true)
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) })
    if (q) params.set('q', q)
    apiAdmin(`/oboilar?${params.toString()}`)
      .then(r => r.json())
      .then(d => { setData(d.data); setTotal(d.total) })
      .finally(() => setYuklanmoqda(false))
  }, [page, q])

  useEffect(() => { yuklash() }, [yuklash])

  const ochirish = async (id: string) => {
    if (!confirm(t('a_oboini_ochirish_tasdiq'))) return
    await apiAdmin(`/oboilar/${id}`, { method: 'DELETE' })
    yuklash()
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t('a_nav_oboilar')} ({total})</h1>
        <Link href="/admin/oboilar/new" className={styles.btnPrimary}><i className="ti ti-plus" /> {t('a_yangi_oboi')}</Link>
      </div>

      <div className={styles.inlineForm}>
        <input
          placeholder={t('a_qidirish_placeholder')}
          value={q}
          onChange={e => { setQ(e.target.value); setPage(1) }}
        />
      </div>

      {yuklanmoqda ? (
        <div>{t('a_yuklanmoqda')}</div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('a_th_rasm')}</th>
                <th>{t('a_th_kod')}</th>
                <th>{t('a_th_nom')}</th>
                <th>{t('a_th_narx')}</th>
                <th>{t('a_th_kategoriya')}</th>
                <th>{t('a_th_fabrika')}</th>
                <th>{t('a_th_stok')}</th>
                <th>{t('a_th_reyting')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map(o => (
                <tr key={o.id}>
                  <td>{o.rasm ? <img src={o.rasm} className={styles.thumb} /> : <div className={styles.thumb} />}</td>
                  <td>{o.kod}</td>
                  <td>
                    {o.nom} {o.featured && <span className={styles.tag} style={{ marginLeft: 6 }}>{t('a_tavsiya')}</span>} {o.yangi && <span className={styles.tag}>{t('a_yangi_teg')}</span>}
                  </td>
                  <td>{o.narx.toLocaleString('ru-RU')} so'm</td>
                  <td>{o.kategoriya?.nom ?? '—'}</td>
                  <td>{o.fabrika?.nom ?? '—'}</td>
                  <td>{o.stok ? t('a_mavjud') : t('a_tugagan')}</td>
                  <td>{o.reytingOrtacha.toFixed(1)} ({o.reytingSoni})</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/admin/oboilar/${o.id}`} className={styles.btn}>{t('a_tahrirlash')}</Link>
                    <button className={styles.btnDanger} onClick={() => ochirish(o.id)}>{t('a_ochirish')}</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24 }}>{t('a_hech_narsa_topilmadi')}</td></tr>
              )}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button className={styles.btn} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{t('a_oldingi')}</button>
            <span>{page} / {totalPages}</span>
            <button className={styles.btn} disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>{t('a_keyingi')}</button>
          </div>
        </>
      )}
    </div>
  )
}
