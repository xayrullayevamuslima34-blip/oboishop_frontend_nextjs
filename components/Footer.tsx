'use client'
import Link from 'next/link'
import { useApp } from '@/lib/context'
import styles from './Footer.module.css'

export default function Footer() {
  const { lang, sozlamalar } = useApp()
  const label = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.logoMain}>OBOISHOP</div>
          <div className={styles.logoSub}>WALLPAPER</div>
          <p className={styles.desc}>{label('Sifatli oboilarning yagona manzili.', 'Лучший выбор обоев в вашем городе.', 'The best wallpaper selection in your city.')}</p>
          <div className={styles.socials}>
            <a href={sozlamalar.instagramLink} target="_blank" rel="noopener noreferrer" className={styles.ig}><i className="ti ti-brand-instagram" /></a>
            <a href={sozlamalar.telegramKanal} target="_blank" rel="noopener noreferrer" className={styles.tg}><i className="ti ti-brand-telegram" /></a>
            <a href={`tel:${sozlamalar.telefon}`} className={styles.ph}><i className="ti ti-phone" /></a>
          </div>
        </div>

        <div className={styles.col}>
          <h4>{label('Katalog', 'Каталог', 'Catalog')}</h4>
          <Link href="/katalog?tur=vintil">{label('Vintil oboilar', 'Виниловые обои', 'Vinyl wallpapers')}</Link>
          <Link href="/katalog?tur=flizelin">{label('Flizelin oboilar', 'Флизелиновые обои', 'Non-woven wallpapers')}</Link>
          <Link href="/katalog?tur=qogoz">{label("Qog'oz oboilar", 'Бумажные обои', 'Paper wallpapers')}</Link>
          <Link href="/katalog?tur=3d">{label('3D oboilar', '3D обои', '3D wallpapers')}</Link>
          <Link href="/katalog?tur=bolalar">{label('Bolalar uchun', 'Детские', 'Kids')}</Link>
        </div>

        <div className={styles.col}>
          <h4>{label('Kompaniya', 'Компания', 'Company')}</h4>
          <Link href="/kontaktlar">{label('Kontaktlar', 'Контакты', 'Contacts')}</Link>
          <Link href="/katalog">{label('Katalog', 'Каталог', 'Catalog')}</Link>
          <Link href="/virtual">{label("Uyda sinab ko'ring", 'Примерить дома', 'Try at Home')}</Link>
          <Link href="/kalkulator">{label('Kalkulator', 'Калькулятор', 'Calculator')}</Link>
        </div>

        <div className={styles.col}>
          <h4>{label("Bog'lanish", 'Контакты', 'Contact')}</h4>
          <div className={styles.contactItem}>
            <i className="ti ti-phone" />
            <a href={`tel:${sozlamalar.telefon}`}>{sozlamalar.telefon}</a>
          </div>
          <div className={styles.contactItem}>
            <i className="ti ti-brand-telegram" />
            <a href={sozlamalar.telegramKanal} target="_blank" rel="noopener noreferrer">{label('Telegram kanal', 'Telegram канал', 'Telegram channel')}</a>
          </div>
          <div className={styles.contactItem}>
            <i className="ti ti-brand-instagram" />
            <a href={sozlamalar.instagramLink} target="_blank" rel="noopener noreferrer">@oboishop.uz</a>
          </div>
          <div className={styles.contactItem}>
            <i className="ti ti-map-pin" />
            <span>{sozlamalar.manzil}</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>{label('© 2025 OboiShop. Barcha huquqlar himoyalangan.', '© 2025 OboiShop. Все права защищены.', '© 2025 OboiShop. All rights reserved.')}</span>
        <a href={sozlamalar.telegramMurojaat} target="_blank" rel="noopener noreferrer" className={styles.orderBtn}>
          <i className="ti ti-brand-telegram" /> {label('Buyurtma berish', 'Заказать', 'Order')}
        </a>
      </div>
    </footer>
  )
}
