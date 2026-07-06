'use client'
import { useEffect, useState } from 'react'
import { apiAdmin } from '@/lib/api'
import { useApp } from '@/lib/context'
import styles from '../../admin.module.css'

interface Fabrika { id: string; nom: string }

export default function FabrikalarAdminPage() {
  const { t } = useApp()
  const [list, setList] = useState<Fabrika[]>([])
  const [nom, setNom] = useState('')
  const [xato, setXato] = useState('')

  const yuklash = () => apiAdmin('/fabrikalar').then(r => r.json()).then(setList)

  useEffect(() => { yuklash() }, [])

  const qoshish = async (e: React.FormEvent) => {
    e.preventDefault()
    setXato('')
    if (!nom.trim()) return
    const res = await apiAdmin('/fabrikalar', { method: 'POST', body: JSON.stringify({ nom: nom.trim() }) })
    if (!res.ok) {
      const err = await res.json()
      setXato(err.message || t('a_xatolik'))
      return
    }
    setNom('')
    yuklash()
  }

  const ochirish = async (id: string) => {
    if (!confirm(t('a_ochirish_fabrika_tasdiq'))) return
    await apiAdmin(`/fabrikalar/${id}`, { method: 'DELETE' })
    yuklash()
  }

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t('a_nav_fabrikalar')}</h1>
      </div>
      {xato && <div className={styles.error}>{xato}</div>}
      <form className={styles.inlineForm} onSubmit={qoshish}>
        <input value={nom} onChange={e => setNom(e.target.value)} placeholder={t('a_yangi_fabrika_nomi')} />
        <button className={styles.btnPrimary}>{t('a_qoshish')}</button>
      </form>
      <table className={styles.table}>
        <thead><tr><th>{t('a_nomi')}</th><th></th></tr></thead>
        <tbody>
          {list.map(f => (
            <tr key={f.id}>
              <td>{f.nom}</td>
              <td><button className={styles.btnDanger} onClick={() => ochirish(f.id)}>{t('a_ochirish')}</button></td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan={2} style={{ textAlign: 'center', padding: 24 }}>{t('a_hozircha_fabrika_yoq')}</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
