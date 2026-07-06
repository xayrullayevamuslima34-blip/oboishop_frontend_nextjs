'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { safeStorage } from '@/lib/storage'
import { useApp } from '@/lib/context'
import OboyCard from '@/components/OboyCard'
import styles from './page.module.css'

export default function SevimlilarPage() {
  const { lang, oboilar } = useApp()
  const [favIds, setFavIds] = useState<string[]>([])

  const label = (uz: string, ru: string, en: string) =>
    lang === 'uz' ? uz : lang === 'ru' ? ru : en

  useEffect(() => {
    const load = () => {
      const favs = safeStorage.getJSON<string[]>('favs', [])
      setFavIds(favs)
    }
    load()
    window.addEventListener('favsUpdated', load)
    return () => window.removeEventListener('favsUpdated', load)
  }, [])

  const clearAll = () => {
    safeStorage.setJSON('favs', [])
    setFavIds([])
    window.dispatchEvent(new Event('favsUpdated'))
  }

  const favItems = oboilar.filter(o => favIds.includes(o.id))

  return (
    <div>
      <div className={styles.divider} />
      <div className={styles.breadcrumb}>
        <Link href="/">{label('Bosh sahifa', 'Главная', 'Home')}</Link> / <span>{label('Sevimlilar', 'Избранное', 'Favorites')}</span>
      </div>
      <div className={styles.page}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}><i className="ti ti-heart" /> {label('Sevimlilar', 'Избранное', 'Favorites')}</h1>
            <p className={styles.count}>{favItems.length} {label('ta oboi saqlangan', 'обоев сохранено', 'wallpapers saved')}</p>
          </div>
          {favItems.length > 0 && (
            <button className={styles.clearBtn} onClick={clearAll}>
              <i className="ti ti-trash" /> {label("Hammasini o'chirish", 'Очистить всё', 'Clear all')}
            </button>
          )}
        </div>

        {/* Device info box */}
        <div className={styles.infoBox}>
          <div className={styles.infoIcon}><i className="ti ti-device-mobile" /></div>
          <div className={styles.infoText}>
            <strong>{label('Eslatma', 'Примечание', 'Note')}</strong>
            <p>{label(
              "Sevimlilar faqat shu qurilmada saqlanadi. Telefon yoki brauzer ma'lumotlari tozalansa, sevimlilar yo'qolishi mumkin.",
              'Избранное сохраняется только на этом устройстве. При очистке данных браузера список может быть удалён.',
              'Favorites are saved only on this device. Clearing browser data may remove your saved items.'
            )}</p>
          </div>
        </div>

        {favItems.length === 0 ? (
          <div className={styles.empty}>
            <i className="ti ti-heart" />
            <h2>{label("Sevimlilar bo'sh", 'Избранное пусто', 'No favorites yet')}</h2>
            <p>{label(
              "Katalogdan yoqqan oboilaringizni yurakcha bosib saqlab qo'ying",
              'Нажмите на сердечко на понравившихся обоях чтобы сохранить',
              'Click the heart icon on wallpapers you like to save them here'
            )}</p>
            <Link href="/katalog" className={styles.emptyBtn}>
              <i className="ti ti-layout-grid" /> {label('Katalogga o\'tish', 'Перейти в каталог', 'Go to catalog')}
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {favItems.map(oboi => <OboyCard key={oboi.id} oboi={oboi} />)}
          </div>
        )}
      </div>
    </div>
  )
}
