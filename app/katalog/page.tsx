'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useApp } from '@/lib/context'
import { apiPublic } from '@/lib/api'
import OboyCard from '@/components/OboyCard'
import styles from './page.module.css'

const ranglar = [
  { color: '#e8e0d5' }, { color: '#d8e8d5' }, { color: '#c8dfd8' },
  { color: '#e0e8f0' }, { color: '#f5e6d0' }, { color: '#f0e8f5' },
  { color: '#2c2c2c' }, { color: '#fff' }, { color: '#f5e8e0' },
]

function KatalogContent() {
  const { lang, oboilar, t } = useApp()
  const label = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en
  const searchParams = useSearchParams()
  const [selectedKategoriya, setSelectedKategoriya] = useState<string[]>([])
  const [selectedFabrika, setSelectedFabrika] = useState<string[]>([])
  const [selectedRang, setSelectedRang] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('yangi')
  const [searchQ, setSearchQ] = useState('')
  const [visibleCount, setVisibleCount] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [fabrikalar, setFabrikalar] = useState<string[]>([])
  const [kategoriyalar, setKategoriyalar] = useState<string[]>([])

  useEffect(() => {
    apiPublic('/fabrikalar')
      .then(r => r.json())
      .then((list: { nom: string }[]) => setFabrikalar(list.map(f => f.nom).sort()))
      .catch(() => {})
    apiPublic('/kategoriyalar')
      .then(r => r.json())
      .then((list: { nom: string }[]) => setKategoriyalar(list.map(k => k.nom).sort()))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const kategoriya = searchParams.get('kategoriya')
    const fabrika = searchParams.get('fabrika')
    const q = searchParams.get('q')
    if (kategoriya) {
      const mos = kategoriyalar.find(k => k.toLowerCase() === kategoriya.toLowerCase())
      if (mos) setSelectedKategoriya([mos])
    }
    if (fabrika) {
      const mos = fabrikalar.find(f => f.toLowerCase() === fabrika.toLowerCase())
      if (mos) setSelectedFabrika([mos])
    }
    if (q) setSearchQ(q)
  }, [searchParams, kategoriyalar, fabrikalar])

  const toggle = (arr: string[], val: string, setArr: (a: string[]) => void) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
    setVisibleCount(10)
  }

  const filtered = oboilar
    .filter(o => {
      if (searchQ && !o.nom.toLowerCase().includes(searchQ.toLowerCase()) &&
          !o.asos.toLowerCase().includes(searchQ.toLowerCase()) &&
          !(o.fabrika?.nom.toLowerCase().includes(searchQ.toLowerCase()))) return false
      if (selectedKategoriya.length && !(o.kategoriya && selectedKategoriya.includes(o.kategoriya.nom))) return false
      if (selectedFabrika.length && !(o.fabrika && selectedFabrika.includes(o.fabrika.nom))) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'narx-osh') return a.narx - b.narx
      if (sortBy === 'narx-tush') return b.narx - a.narx
      if (sortBy === 'nom') return a.nom.localeCompare(b.nom)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const clearAll = () => {
    setSelectedKategoriya([]); setSelectedFabrika([]); setSelectedRang([]); setSearchQ('')
    setVisibleCount(10)
  }

  const activeFilters = selectedKategoriya.length + selectedFabrika.length + selectedRang.length + (searchQ ? 1 : 0)

  return (
    <div className={styles.page}>
      {/* Mobile filter toggle */}
      <button className={styles.mobileFilterBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className="ti ti-adjustments-horizontal" /> {t('filter')}
        {activeFilters > 0 && <span className={styles.filterBadge}>{activeFilters}</span>}
      </button>

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHead}>
          <h2><i className="ti ti-adjustments-horizontal" /> {t('filter')}</h2>
          <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>
            <i className="ti ti-x" />
          </button>
        </div>

        {searchQ && (
          <div className={styles.searchInfo}>
            <i className="ti ti-search" /> "{searchQ}"
            <button onClick={() => setSearchQ('')}><i className="ti ti-x" /></button>
          </div>
        )}

        <div className={styles.filterSection}>
          <h3>{t('cats')}</h3>
          {kategoriyalar.map(k => (
            <label key={k} className={styles.filterItem}>
              <input type="checkbox" checked={selectedKategoriya.includes(k)} onChange={() => toggle(selectedKategoriya, k, setSelectedKategoriya)} />
              {k}
            </label>
          ))}
        </div>

        <div className={styles.filterSection}>
          <h3>{t('fabrika')}</h3>
          {fabrikalar.map(f => (
            <label key={f} className={styles.filterItem}>
              <input type="checkbox" checked={selectedFabrika.includes(f)} onChange={() => toggle(selectedFabrika, f, setSelectedFabrika)} />
              {f}
            </label>
          ))}
        </div>

        <div className={styles.filterSection}>
          <h3>{t('rang')}</h3>
          <div className={styles.colorGrid}>
            {ranglar.map(r => (
              <button key={r.color}
                className={`${styles.colorBtn} ${selectedRang.includes(r.color) ? styles.colorActive : ''}`}
                style={{ background: r.color, border: r.color === '#fff' ? '1px solid #ddd' : 'none' }}
                onClick={() => toggle(selectedRang, r.color, setSelectedRang)}
              />
            ))}
          </div>
        </div>

        {activeFilters > 0 && (
          <button className={styles.clearBtn} onClick={clearAll}>
            <i className="ti ti-x" /> {t('tozalash')} ({activeFilters})
          </button>
        )}
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <div className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>{t('katalog')}</h1>
            <p className={styles.count}>{label(`${filtered.length} ta mahsulot`, `${filtered.length} обоев`, `${filtered.length} wallpapers`)}</p>
          </div>
          <select className={styles.sortSel} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="yangi">{label('Saralash: Yangi', 'Сортировка: Новинки', 'Sort: Newest')}</option>
            <option value="nom">{label('Saralash: Nom', 'Сортировка: Название', 'Sort: Name')}</option>
            <option value="narx-osh">{label('Narx: Arzondan', 'Цена: Сначала дешёвые', 'Price: Low to high')}</option>
            <option value="narx-tush">{label('Narx: Qimmatdan', 'Цена: Сначала дорогие', 'Price: High to low')}</option>
          </select>
        </div>

        <div className={styles.grid}>
          {visible.map(oboi => <OboyCard key={oboi.id} oboi={oboi} />)}
          {visible.length === 0 && (
            <div className={styles.empty}>
              <i className="ti ti-search" />
              <p>{label('Hech narsa topilmadi', 'Ничего не найдено', 'Nothing found')}</p>
              <button onClick={clearAll}>{t('tozalash')}</button>
            </div>
          )}
        </div>

        {hasMore && (
          <div className={styles.loadMore}>
            <button className={styles.loadMoreBtn} onClick={() => setVisibleCount(v => v + 10)}>
              <i className="ti ti-refresh" /> {label(`Ko'proq ko'rish (${filtered.length - visibleCount} ta qoldi)`, `Показать ещё (осталось ${filtered.length - visibleCount})`, `Load more (${filtered.length - visibleCount} left)`)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function KatalogPage() {
  const { lang } = useApp()
  const label = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en
  return (
    <div>
      <div className={styles.divider} />
      <Suspense fallback={<div style={{padding:40,textAlign:'center',color:'var(--text-muted)'}}>{label('Yuklanmoqda...', 'Загрузка...', 'Loading...')}</div>}>
        <KatalogContent />
      </Suspense>
    </div>
  )
}
