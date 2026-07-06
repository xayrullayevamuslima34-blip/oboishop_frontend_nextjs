'use client'
import { ReactNode, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { adminAuth, apiAdmin } from '@/lib/api'
import { safeStorage } from '@/lib/storage'
import { useApp } from '@/lib/context'
import styles from '../admin.module.css'

interface QidiruvNatija {
  oboilar: { id: string; nom: string; kod: string; kategoriya: string | null; fabrika: string | null }[]
  kategoriyalar: { id: string; nom: string }[]
  fabrikalar: { id: string; nom: string }[]
  suhbatlar: { id: string; deviceId: string; matn: string }[]
}

const NAV = [
  { href: '/admin', labelKey: 'a_nav_bosh_sahifa' as const, icon: 'ti-layout-dashboard' },
  { href: '/admin/oboilar', labelKey: 'a_nav_oboilar' as const, icon: 'ti-photo' },
  { href: '/admin/kategoriyalar', labelKey: 'a_nav_kategoriyalar' as const, icon: 'ti-category' },
  { href: '/admin/fabrikalar', labelKey: 'a_nav_fabrikalar' as const, icon: 'ti-building-factory' },
  { href: '/admin/xabarlar', labelKey: 'a_nav_xabarlar' as const, icon: 'ti-message-circle' },
  { href: '/admin/sozlamalar', labelKey: 'a_nav_sozlamalar' as const, icon: 'ti-settings' },
]

const MAMNUN_KORILGAN_KEY = 'admin_mamnun_korilgan'
const MAMNUN_POLL_MS = 60000
const XABAR_POLL_MS = 20000

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t, lang, setLang } = useApp()
  const [ready, setReady] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mamnunNotif, setMamnunNotif] = useState<number | null>(null)
  const [yangiXabarlar, setYangiXabarlar] = useState(0)
  const [qidiruvMatn, setQidiruvMatn] = useState('')
  const [qidiruvNatija, setQidiruvNatija] = useState<QidiruvNatija | null>(null)
  const [qidiruvOchiq, setQidiruvOchiq] = useState(false)
  const qidiruvRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!adminAuth.getAccessToken() && !adminAuth.getRefreshToken()) {
      router.replace('/admin/login')
      return
    }
    setReady(true)
  }, [router])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!ready) return
    const tekshir = () => {
      apiAdmin('/reyting/mamnun-mijozlar-soni')
        .then(r => r.json())
        .then(({ soni }: { soni: number }) => {
          const korilgan = parseInt(safeStorage.get(MAMNUN_KORILGAN_KEY) || '0', 10)
          if (soni > korilgan) {
            setMamnunNotif(soni)
            safeStorage.set(MAMNUN_KORILGAN_KEY, String(soni))
          }
        })
        .catch(() => {})
    }
    tekshir()
    const interval = setInterval(tekshir, MAMNUN_POLL_MS)
    return () => clearInterval(interval)
  }, [ready])

  useEffect(() => {
    if (!ready) return
    const tekshir = () => {
      apiAdmin('/suhbatlar/yangi-soni')
        .then(r => r.json())
        .then(({ soni }: { soni: number }) => setYangiXabarlar(soni))
        .catch(() => {})
    }
    tekshir()
    const interval = setInterval(tekshir, XABAR_POLL_MS)
    return () => clearInterval(interval)
  }, [ready, pathname])

  useEffect(() => {
    const q = qidiruvMatn.trim()
    if (q.length < 2) {
      setQidiruvNatija(null)
      return
    }
    const timeout = setTimeout(() => {
      apiAdmin(`/qidiruv?q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .then(setQidiruvNatija)
        .catch(() => {})
    }, 300)
    return () => clearTimeout(timeout)
  }, [qidiruvMatn])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (qidiruvRef.current && !qidiruvRef.current.contains(e.target as Node)) setQidiruvOchiq(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const natijaBosildi = () => {
    setQidiruvOchiq(false)
    setQidiruvMatn('')
    setQidiruvNatija(null)
  }

  const logout = () => {
    adminAuth.clear()
    router.push('/admin/login')
  }

  if (!ready) return null

  return (
    <div className={styles.shell}>
      <button className={styles.mobileMenuBtn} onClick={() => setMobileOpen(true)}>
        <i className="ti ti-menu-2" />
      </button>

      {mobileOpen && <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarMobileOpen : ''}`}>
        <div className={styles.sidebarLogo}>
          OBOISHOP<span>{t('a_admin_panel_sub')}</span>
          <button className={styles.mobileCloseBtn} onClick={() => setMobileOpen(false)}>
            <i className="ti ti-x" />
          </button>
        </div>
        <div style={{ padding: '0 24px 16px' }}>
          <select
            value={lang}
            onChange={e => setLang(e.target.value as any)}
            style={{
              width: '100%', padding: '7px 10px', borderRadius: 8,
              border: '1px solid #4a3f30', background: '#3a2f22', color: '#f5f2ee', fontSize: 13,
            }}
          >
            <option value="uz">🇺🇿 UZ</option>
            <option value="ru">🇷🇺 RU</option>
            <option value="en">🇬🇧 EN</option>
          </select>
        </div>
        <nav style={{ flex: 1 }}>
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
            >
              <i className={`ti ${item.icon}`} /> {t(item.labelKey)}
              {item.href === '/admin/xabarlar' && yangiXabarlar > 0 && (
                <span className={styles.navBadge}>{yangiXabarlar}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className={styles.qidiruvWrap} ref={qidiruvRef}>
          <div className={styles.qidiruvBox}>
            <i className="ti ti-search" />
            <input
              value={qidiruvMatn}
              onChange={e => { setQidiruvMatn(e.target.value); setQidiruvOchiq(true) }}
              onFocus={() => setQidiruvOchiq(true)}
              placeholder={t('qidirish')}
              className={styles.qidiruvInput}
            />
          </div>
          {qidiruvOchiq && qidiruvNatija && (
            <div className={styles.qidiruvDropdown}>
              {qidiruvNatija.oboilar.length === 0 && qidiruvNatija.kategoriyalar.length === 0 &&
                qidiruvNatija.fabrikalar.length === 0 && qidiruvNatija.suhbatlar.length === 0 && (
                <div className={styles.qidiruvBosh}>{t('a_hech_narsa_topilmadi')}</div>
              )}
              {qidiruvNatija.oboilar.length > 0 && (
                <div className={styles.qidiruvGuruh}>
                  <div className={styles.qidiruvGuruhSarlavha}>{t('a_nav_oboilar')}</div>
                  {qidiruvNatija.oboilar.map(o => (
                    <Link key={o.id} href={`/admin/oboilar/${o.id}`} className={styles.qidiruvItem} onClick={natijaBosildi}>
                      <span>{o.nom}</span><span className={styles.qidiruvKod}>{o.kod}</span>
                    </Link>
                  ))}
                </div>
              )}
              {qidiruvNatija.kategoriyalar.length > 0 && (
                <div className={styles.qidiruvGuruh}>
                  <div className={styles.qidiruvGuruhSarlavha}>{t('a_nav_kategoriyalar')}</div>
                  {qidiruvNatija.kategoriyalar.map(k => (
                    <Link key={k.id} href="/admin/kategoriyalar" className={styles.qidiruvItem} onClick={natijaBosildi}>
                      <span>{k.nom}</span>
                    </Link>
                  ))}
                </div>
              )}
              {qidiruvNatija.fabrikalar.length > 0 && (
                <div className={styles.qidiruvGuruh}>
                  <div className={styles.qidiruvGuruhSarlavha}>{t('a_nav_fabrikalar')}</div>
                  {qidiruvNatija.fabrikalar.map(f => (
                    <Link key={f.id} href="/admin/fabrikalar" className={styles.qidiruvItem} onClick={natijaBosildi}>
                      <span>{f.nom}</span>
                    </Link>
                  ))}
                </div>
              )}
              {qidiruvNatija.suhbatlar.length > 0 && (
                <div className={styles.qidiruvGuruh}>
                  <div className={styles.qidiruvGuruhSarlavha}>{t('a_nav_xabarlar')}</div>
                  {qidiruvNatija.suhbatlar.map(s => (
                    <Link key={s.id} href={`/admin/xabarlar/${s.id}`} className={styles.qidiruvItem} onClick={natijaBosildi}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.matn}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <button className={styles.logoutBtn} onClick={logout}>
          <i className="ti ti-logout" /> {t('a_chiqish')}
        </button>
      </aside>
      <div className={styles.main}>
        {mamnunNotif !== null && (
          <div className={styles.mamnunToast}>
            <i className="ti ti-confetti" />
            <span>
              {t('a_mamnun_notif_pre')} <strong>{mamnunNotif}</strong> {t('a_mamnun_notif_post')}
            </span>
            <Link href="/admin/sozlamalar" className={styles.mamnunToastLink} onClick={() => setMamnunNotif(null)}>
              {t('a_mamnun_sozlamalarga_otish')}
            </Link>
            <button className={styles.mamnunToastClose} onClick={() => setMamnunNotif(null)}>
              <i className="ti ti-x" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
