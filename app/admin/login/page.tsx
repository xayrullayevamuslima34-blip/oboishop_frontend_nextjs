'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiPublic, adminAuth } from '@/lib/api'
import { useApp } from '@/lib/context'
import styles from '../admin.module.css'

export default function AdminLoginPage() {
  const router = useRouter()
  const { t } = useApp()
  const [login, setLogin] = useState('')
  const [parol, setParol] = useState('')
  const [parolKorinsin, setParolKorinsin] = useState(false)
  const [xato, setXato] = useState('')
  const [yuklanmoqda, setYuklanmoqda] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setXato('')
    setYuklanmoqda(true)
    try {
      const res = await apiPublic('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ login, parol }),
      })
      const data = await res.json()
      if (!res.ok) {
        setXato(data.message || t('a_xatolik_yuz_berdi'))
        return
      }
      adminAuth.setTokens(data.accessToken, data.refreshToken)
      router.push('/admin')
    } catch {
      setXato(t('a_backend_ulanib_bolmadi'))
    } finally {
      setYuklanmoqda(false)
    }
  }

  return (
    <div className={styles.loginWrap}>
      <form className={styles.loginBox} onSubmit={submit}>
        <div className={styles.loginTitle}>OboiShop Admin</div>
        <div className={styles.loginSub}>{t('a_login_sub')}</div>
        {xato && <div className={styles.error}>{xato}</div>}
        <div className={styles.field} style={{ marginBottom: 14 }}>
          <label>{t('a_login_label')}</label>
          <input value={login} onChange={e => setLogin(e.target.value)} required autoFocus />
        </div>
        <div className={styles.field} style={{ marginBottom: 20 }}>
          <label>{t('a_parol_label')}</label>
          <div style={{ position: 'relative' }}>
            <input
              type={parolKorinsin ? 'text' : 'password'}
              value={parol}
              onChange={e => setParol(e.target.value)}
              required
              style={{ width: '100%', paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setParolKorinsin(v => !v)}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#857c6e', padding: 4,
              }}
              aria-label={parolKorinsin ? t('a_parol_yashirish') : t('a_parol_korsatish')}
            >
              <i className={parolKorinsin ? 'ti ti-eye-off' : 'ti ti-eye'} />
            </button>
          </div>
        </div>
        <button type="submit" className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={yuklanmoqda}>
          {yuklanmoqda ? t('a_kirilmoqda') : t('a_kirish')}
        </button>
      </form>
    </div>
  )
}
