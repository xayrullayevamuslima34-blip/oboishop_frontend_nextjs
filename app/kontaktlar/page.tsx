'use client'
import Link from 'next/link'
import { useApp } from '@/lib/context'
import styles from './page.module.css'

export default function KontaktlarPage() {
  const { lang, sozlamalar } = useApp()
  const label = (uz: string, ru: string, en: string) =>
    lang === 'uz' ? uz : lang === 'ru' ? ru : en
  return (
    <div>
      <div className={styles.divider} />
      <div className={styles.breadcrumb}>
        <Link href="/">{label('Bosh sahifa', 'Главная', 'Home')}</Link> / <span>{label('Kontaktlar', 'Контакты', 'Contacts')}</span>
      </div>
      <div className={styles.page}>
        <h1 className={styles.title}>{label('KONTAKTLAR', 'КОНТАКТЫ', 'CONTACTS')}</h1>

        <div className={styles.grid}>
          <div>
            <div className={styles.blockTitle}>{label("Do'kon ma'lumotlari", 'Информация о магазине', 'Store info')}</div>
            <div className={styles.infoRow}>
              <div className={styles.label}>{label('Telefon', 'Телефон', 'Phone')}</div>
              <div className={styles.val}><a href={`tel:${sozlamalar.telefon}`}>{sozlamalar.telefon}</a></div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.label}>{label('Manzil', 'Адрес', 'Address')}</div>
              <div className={styles.val}>{sozlamalar.manzil}</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.label}>{label('Ish vaqti', 'Режим работы', 'Working hours')}</div>
              <div className={styles.val}>{sozlamalar.ishVaqti}</div>
            </div>
            {sozlamalar.xaritaEmbed && (
              <div className={styles.mapBox}>
                <iframe
                  src={sozlamalar.xaritaEmbed}
                  allowFullScreen loading="lazy"
                />
                {sozlamalar.xaritaLink && (
                  <a href={sozlamalar.xaritaLink} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                    <i className="ti ti-external-link" /> {label('Xaritada ochish', 'Открыть на карте', 'Open in maps')}
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <div className={styles.blockTitle}>{label("Bog'lanish usullari", 'Способы связи', 'Contact methods')}</div>
            <div className={styles.infoRow}>
              <div className={styles.label}>{label('Telegram orqali murojaat (buyurtma)', 'Telegram (заказ)', 'Telegram orqali murojaat (order)')}</div>
              <div className={styles.val}><a href={sozlamalar.telegramMurojaat} target="_blank" rel="noopener noreferrer">{sozlamalar.telegramMurojaat}</a></div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.label}>{label('Telegram kanal', 'Telegram канал', 'Telegram channel')}</div>
              <div className={styles.val}><a href={sozlamalar.telegramKanal} target="_blank" rel="noopener noreferrer">{sozlamalar.telegramKanal}</a></div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.label}>Instagram</div>
              <div className={styles.val}><a href={sozlamalar.instagramLink} target="_blank" rel="noopener noreferrer">{sozlamalar.instagramLink}</a></div>
            </div>
            <div style={{ marginTop: '28px' }}>
              <a href={sozlamalar.telegramMurojaat} target="_blank" rel="noopener noreferrer" className={styles.tgBtn}>
                <i className="ti ti-brand-telegram" /> {label('Buyurtma uchun telegramdan murojaat qilish', 'Написать в Telegram для заказа', 'Message on Telegram to order')}
              </a>
            </div>
          </div>
        </div>

        <div className={styles.socialSection}>
          <div className={styles.socialTitle}>{label('Ijtimoiy tarmoqlarda', 'Мы в соцсетях', 'Social media')}</div>
          <div className={styles.socialLinks}>
            <a href={sozlamalar.instagramLink} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <div className={styles.igIcon}><i className="ti ti-brand-instagram" /></div>
              <div><div className={styles.slName}>Instagram</div><div className={styles.slSub}>@oboishop.uz</div></div>
            </a>
            <a href={sozlamalar.telegramKanal} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <div className={styles.tgIcon}><i className="ti ti-brand-telegram" /></div>
              <div><div className={styles.slName}>{label('Telegram kanal', 'Telegram канал', 'Telegram channel')}</div><div className={styles.slSub}>{sozlamalar.telegramKanal}</div></div>
            </a>
            <a href={`tel:${sozlamalar.telefon}`} className={styles.socialLink}>
              <div className={styles.phIcon}><i className="ti ti-phone" /></div>
              <div><div className={styles.slName}>{label('Telefon', 'Телефон', 'Phone')}</div><div className={styles.slSub}>{sozlamalar.telefon}</div></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
