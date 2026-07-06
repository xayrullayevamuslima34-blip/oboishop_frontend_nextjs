'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { apiPublic, Oboi } from '@/lib/api'
import { useApp } from '@/lib/context'
import { safeStorage } from '@/lib/storage'
import styles from './page.module.css'

export default function OboiDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, lang, sozlamalar } = useApp()
  const label = (uz: string, ru: string, en: string) => (lang === 'uz' ? uz : lang === 'ru' ? ru : en)

  const [oboi, setOboi] = useState<Oboi | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    apiPublic(`/oboilar/${id}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(setOboi)
      .catch(() => setNotFound(true))
  }, [id])

  useEffect(() => {
    if (!oboi) return
    try {
      const favs = safeStorage.getJSON<string[]>('favs', [])
      setLiked(favs.includes(oboi.id))
      const viewed = safeStorage.getJSON<string[]>('viewed', [])
      if (!viewed.includes(oboi.id)) safeStorage.setJSON('viewed', [oboi.id, ...viewed].slice(0, 10))
    } catch {}
  }, [oboi])

  const toggleLike = () => {
    if (!oboi) return
    const newLiked = !liked
    setLiked(newLiked)
    const favs = safeStorage.getJSON<string[]>('favs', [])
    const updated = newLiked ? [...favs, oboi.id] : favs.filter(favId => favId !== oboi.id)
    safeStorage.setJSON('favs', updated)
    window.dispatchEvent(new Event('favsUpdated'))
  }

  const copyCode = () => {
    if (!oboi) return
    navigator.clipboard.writeText(oboi.kod)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadImage = () => {
    if (!oboi?.rasm) return
    const a = document.createElement('a')
    a.href = oboi.rasm
    a.download = `${oboi.kod}-${oboi.nom}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <p>{label('Mahsulot topilmadi', 'Товар не найден', 'Product not found')}</p>
          <Link href="/katalog" className={styles.backLink}>
            {label('Katalogga qaytish', 'Вернуться в каталог', 'Back to catalog')}
          </Link>
        </div>
      </div>
    )
  }

  if (!oboi) {
    return <div className={styles.page}>{label('Yuklanmoqda...', 'Загрузка...', 'Loading...')}</div>
  }

  const bg = oboi.rasm
    ? { backgroundImage: `url(${oboi.rasm})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(160deg, ${oboi.color1}, ${oboi.color2})` }

  const ratingStars = Math.round(oboi.reytingOrtacha)

  const badgeMap: Record<string, string> = {
    'yangi': label('Yangi', 'Новинка', 'New'),
    'nol-qoldiq': label('Nol qoldiq', 'Заканчивается', 'Low stock'),
    'eko': label('Eko', 'Эко', 'Eco'),
    'ommaviy': label('Ommaviy', 'Популярное', 'Popular'),
    'arzon': label('Arzon', 'Акция', 'Sale'),
  }
  const badges = oboi.yangi ? [...oboi.xususiyatlar.filter(x => x !== 'yangi'), 'yangi'] : oboi.xususiyatlar

  return (
    <div>
      <div className={styles.divider} />
      <div className={styles.breadcrumb}>
        <Link href="/">{t('asosiy')}</Link> / <Link href="/katalog">{t('katalog')}</Link> / <span>{oboi.nom}</span>
      </div>
      <div className={styles.page}>
        <div className={styles.grid}>
          <div className={styles.imgCol}>
            <div className={styles.imgBox} style={bg}>
              {badges.length > 0 && (
                <div className={styles.badges}>
                  {badges.map(x => <span key={x} className={styles.badge}>{badgeMap[x] || x}</span>)}
                </div>
              )}
            </div>
            {oboi.rasm && (
              <button className={styles.downloadBtn} onClick={downloadImage}>
                <i className="ti ti-download" /> {label('Rasmni yuklab olish', 'Скачать изображение', 'Download image')}
              </button>
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{oboi.nom}</h1>
            <div className={styles.rating}>
              {[1, 2, 3, 4, 5].map(s => (
                <i
                  key={s}
                  className="ti ti-star-filled"
                  style={{ color: s <= ratingStars ? '#c9a84c' : 'var(--border)', fontSize: 15 }}
                />
              ))}
              <span>({oboi.reytingOrtacha.toFixed(1)} &middot; {oboi.reytingSoni} {label('baho', 'оценок', 'ratings')})</span>
            </div>
            <div className={styles.price}>{oboi.narx.toLocaleString('ru-RU')} so'm</div>

            <div className={styles.metaGrid}>
              <div className={styles.metaRow}><span>{t('asos')}</span><strong>{oboi.asos}</strong></div>
              <div className={styles.metaRow}><span>{t('olcham')}</span><strong>{oboi.olcham}</strong></div>
              {oboi.kategoriya && (
                <div className={styles.metaRow}>
                  <span>{label('Kategoriya', 'Категория', 'Category')}</span><strong>{oboi.kategoriya.nom}</strong>
                </div>
              )}
              {oboi.fabrika && (
                <div className={styles.metaRow}><span>{t('fabrika')}</span><strong>{oboi.fabrika.nom}</strong></div>
              )}
              <div className={styles.metaRow}>
                <span>{t('kod')}</span>
                <button className={styles.copyBtn} onClick={copyCode}>
                  <i className={copied ? 'ti ti-check' : 'ti ti-copy'} /> {oboi.kod}
                </button>
              </div>
              <div className={styles.metaRow}>
                <span>{label('Holati', 'Наличие', 'Availability')}</span>
                <strong style={{ color: oboi.stok ? '#5a8a5a' : '#c0392b' }}>
                  {oboi.stok ? t('stok') : t('stok_yo')}
                </strong>
              </div>
            </div>

            <div className={styles.actionsRow}>
              <button className={`${styles.likeBtn} ${liked ? styles.liked : ''}`} onClick={toggleLike}>
                <i className={liked ? 'ti ti-heart-filled' : 'ti ti-heart'} />
              </button>
              <a href={sozlamalar.telegramMurojaat} target="_blank" rel="noopener noreferrer" className={styles.orderBtn}>
                <i className="ti ti-brand-telegram" /> {t('buyurtma')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
