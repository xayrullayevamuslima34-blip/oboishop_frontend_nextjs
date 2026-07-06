'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/lib/context'
import styles from './Header.module.css'

export default function Header() {
  const { lang, setLang, t, dark, toggleDark, favCount, sozlamalar } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true) }
      if (e.key === 'Escape') { setSearchOpen(false); setMobileOpen(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMain}>OBOISHOP</span>
          <span className={styles.logoSub}>WALLPAPER</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>{t('asosiy')}</Link>
          <Link href="/katalog" className={styles.kbtn}>{t('katalog')}</Link>
          <Link href="/virtual" className={styles.navLink}><i className="ti ti-eye" /> {t('sinab')}</Link>
          <Link href="/kalkulator" className={styles.navLink}><i className="ti ti-calculator" /> {t('kalkulator')}</Link>
          <Link href="/kontaktlar" className={styles.navLink}>{t('kontakt')}</Link>
        </nav>

        <div className={styles.right}>
          <button className={styles.iconBtn} onClick={() => setSearchOpen(true)} title="Ctrl+K">
            <i className="ti ti-search" />
          </button>
          <button className={styles.iconBtn} onClick={toggleDark} title={lang === 'uz' ? "Tungi rejim" : lang === 'ru' ? 'Тёмная тема' : 'Dark mode'}>
            <i className={dark ? 'ti ti-sun' : 'ti ti-moon'} />
          </button>
          <Link href="/sevimlilar" className={styles.heartBtn}>
            <i className="ti ti-heart" />
            {favCount > 0 && <span className={styles.badge}>{favCount}</span>}
          </Link>
          <select className={styles.langSel} value={lang} onChange={e => setLang(e.target.value as any)}>
            <option value="uz">🇺🇿 UZ</option>
            <option value="ru">🇷🇺 RU</option>
            <option value="en">🇬🇧 EN</option>
          </select>
          <div className={styles.socials}>
            <a href={sozlamalar.instagramLink} target="_blank" rel="noopener noreferrer" className={styles.ig}><i className="ti ti-brand-instagram" /></a>
            <a href={sozlamalar.telegramKanal} target="_blank" rel="noopener noreferrer" className={styles.tg}><i className="ti ti-brand-telegram" /></a>
            <a href={`tel:${sozlamalar.telefon}`} className={styles.ph}><i className="ti ti-phone" /></a>
          </div>
          <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)}>
            <i className={mobileOpen ? 'ti ti-x' : 'ti ti-menu-2'} />
          </button>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className={styles.searchOverlay} onClick={() => setSearchOpen(false)}>
          <div className={styles.searchBox} onClick={e => e.stopPropagation()}>
            <i className="ti ti-search" style={{ fontSize: 20, color: 'var(--text-muted)' }} />
            <input
              ref={searchRef}
              className={styles.searchInput}
              placeholder={t('qidirish')}
              value={search}
              onChange={e => {
                // XSS sanitizatsiya - faqat ruxsat etilgan belgilar
                const safe = e.target.value.replace(/[<>"'&]/g, '').slice(0, 100)
                setSearch(safe)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && search) {
                  window.location.href = `/katalog?q=${search}`
                  setSearchOpen(false)
                }
              }}
            />
            <kbd className={styles.kbd}>ESC</kbd>
          </div>
          {search && (
            <div className={styles.searchResults}>
              <Link href={`/katalog?q=${search}`} className={styles.searchResultItem}
                onClick={() => { setSearchOpen(false); setSearch('') }}>
                <i className="ti ti-layout-grid" /> "{search}" — {lang === 'uz' ? 'katalogda qidirish' : lang === 'ru' ? 'искать в каталоге' : 'search in catalog'}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{t('asosiy')}</Link>
          <Link href="/katalog" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{t('katalog')}</Link>
          <Link href="/virtual" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{t('sinab')}</Link>
          <Link href="/kontaktlar" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{t('kontakt')}</Link>
          <Link href="/sevimlilar" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{t('sevimlilar')}</Link>
          <Link href="/kalkulator" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{t('kalkulator')}</Link>
          <div className={styles.mobileSocials}>
            <a href={sozlamalar.instagramLink} target="_blank" rel="noopener noreferrer" className={styles.ig}><i className="ti ti-brand-instagram" /></a>
            <a href={sozlamalar.telegramKanal} target="_blank" rel="noopener noreferrer" className={styles.tg}><i className="ti ti-brand-telegram" /></a>
            <a href={`tel:${sozlamalar.telefon}`} className={styles.ph}><i className="ti ti-phone" /></a>
          </div>
        </div>
      )}
    </>
  )
}
