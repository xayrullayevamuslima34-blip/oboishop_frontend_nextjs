'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Oboi } from '@/lib/api'
import { safeStorage } from '@/lib/storage'
import { useApp } from '@/lib/context'
import styles from './OboyCard.module.css'

export default function OboyCard({ oboi }: { oboi: Oboi }) {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [zoom, setZoom] = useState(false)

  useEffect(() => {
    try {
      const favs = safeStorage.getJSON<string[]>('favs', [])
      setLiked(favs.includes(oboi.id))
    } catch {}
  }, [oboi.id])

  useEffect(() => {
    try {
      const viewed = safeStorage.getJSON<string[]>('viewed', [])
      if (!viewed.includes(oboi.id)) {
        safeStorage.setJSON('viewed', [oboi.id, ...viewed].slice(0, 10))
      }
    } catch {}
  }, []) // eslint-disable-line

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoom(false) }
    if (zoom) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [zoom])

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newLiked = !liked
    setLiked(newLiked)
    const favs = safeStorage.getJSON<string[]>('favs', [])
    const updated = newLiked ? [...favs, oboi.id] : favs.filter((id: string) => id !== oboi.id)
    safeStorage.setJSON('favs', updated)
    window.dispatchEvent(new Event('favsUpdated'))
  }

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(oboi.kod)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveImg = (e: React.MouseEvent) => {
    e.stopPropagation()
    const canvas = document.createElement('canvas')
    canvas.width = 300; canvas.height = 300
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 300, 300)
    grad.addColorStop(0, oboi.color1)
    grad.addColorStop(1, oboi.color2)
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 300, 300)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 18px Georgia'
    ctx.textAlign = 'center'; ctx.fillText(oboi.nom, 150, 130)
    ctx.font = '13px sans-serif'
    ctx.fillText(oboi.kod, 150, 155)
    ctx.fillText(`${oboi.narx.toLocaleString('ru-RU')} so'm`, 150, 175)
    const a = document.createElement('a')
    a.download = `oboi-${oboi.nom}.png`
    a.href = canvas.toDataURL(); a.click()
  }

  const { t, lang, sozlamalar } = useApp()
  const L = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en

  const badgeMap: Record<string, string> = {
    'yangi': L('Yangi', 'Новинка', 'New'),
    'nol-qoldiq': L('Nol qoldiq', 'Заканчивается', 'Low stock'),
    'eko': L('Eko', 'Эко', 'Eco'),
    'ommaviy': L('Ommaviy', 'Популярное', 'Popular'),
    'arzon': L('Arzon', 'Акция', 'Sale'),
  }

  const badgeColors: Record<string, string> = {
    'yangi': '#8b6f5e', 'nol-qoldiq': '#6b8e6b',
    'eko': '#5a8a5a', 'ommaviy': '#7a6a8e', 'arzon': '#8e6a3a',
  }

  const badges = oboi.yangi ? [...oboi.xususiyatlar.filter(x => x !== 'yangi'), 'yangi'] : oboi.xususiyatlar
  const bg = oboi.rasm
    ? { backgroundImage: `url(${oboi.rasm})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(160deg, ${oboi.color1}, ${oboi.color2})` }
  const zoomBg = oboi.rasm
    ? { backgroundImage: `url(${oboi.rasm})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(135deg, ${oboi.color1}, ${oboi.color2})` }

  const ratingStars = Math.round(oboi.reytingOrtacha)

  return (
    <>
      <div className={styles.card} onClick={() => router.push(`/oboi/${oboi.id}`)}>
        <div className={styles.img} style={bg}>
          <div className={styles.badges}>
            {badges.slice(0, 2).map(x => (
              <span key={x} className={styles.badge} style={{ background: badgeColors[x] || '#8b6f5e' }}>
                {badgeMap[x] || x}
              </span>
            ))}
          </div>
          <div className={styles.actions}>
            <button className={`${styles.actionBtn} ${liked ? styles.liked : ''}`} onClick={toggleLike}>
              <i className={liked ? 'ti ti-heart-filled' : 'ti ti-heart'} />
            </button>
            <button className={styles.actionBtn} onClick={e => { e.stopPropagation(); setZoom(true) }}>
              <i className="ti ti-zoom-in" />
            </button>
            <button className={styles.actionBtn} onClick={saveImg}>
              <i className="ti ti-download" />
            </button>
          </div>
          <div className={styles.hoverInfo}>
            <div className={styles.hiCol}>/ {t('kolleksiya').toUpperCase()}</div>
            <div className={styles.hiName}>{oboi.nom}</div>
            <div className={styles.rating}>
              {[1,2,3,4,5].map(s => <i key={s} className="ti ti-star-filled" style={{ color: s <= ratingStars ? '#c9a84c' : 'rgba(255,255,255,0.2)', fontSize: 11 }} />)}
              <span>({oboi.reytingOrtacha.toFixed(1)})</span>
            </div>
            <div className={styles.hiRow}><span>/ {t('asos')}</span><span>{oboi.asos}</span></div>
            <div className={styles.hiRow}><span>/ {t('olcham')}</span><span>{oboi.olcham}</span></div>
            <div className={styles.hiRow}><span>/ {t('fabrika')}</span><span>{oboi.fabrika?.nom ?? '—'}</span></div>
            <div className={styles.stock}><span className={styles.stockDot} /> {oboi.stok ? t('stok') : t('stok_yo')}</div>
            <button className={styles.codeBtn} onClick={copyCode}>
              <i className={copied ? 'ti ti-check' : 'ti ti-copy'} />
              {copied ? '✓' : oboi.kod}
            </button>
            <div className={styles.hiPrice}>{oboi.narx.toLocaleString('ru-RU')} so'm</div>
            <a
              href={sozlamalar.telegramMurojaat}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.orderBtn}
              onClick={e => e.stopPropagation()}
            >
              <i className="ti ti-brand-telegram" /> {t('buyurtma')}
            </a>
          </div>
        </div>
      </div>

      {zoom && (
        <div className={styles.zoomOverlay} onClick={() => setZoom(false)}>
          <div className={styles.zoomBox} onClick={e => e.stopPropagation()}>
            <button className={styles.zoomClose} onClick={() => setZoom(false)}><i className="ti ti-x" /></button>
            <div className={styles.zoomImg} style={zoomBg}>
              {!oboi.rasm && <div className={styles.zoomPattern} />}
            </div>
            <div className={styles.zoomInfo}>
              <h2>{oboi.nom}</h2>
              <div className={styles.rating} style={{ justifyContent: 'flex-start', marginBottom: 14 }}>
                {[1,2,3,4,5].map(s => <i key={s} className="ti ti-star-filled" style={{ color: s <= ratingStars ? '#c9a84c' : '#ddd', fontSize: 15 }} />)}
                <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 6 }}>({oboi.reytingOrtacha.toFixed(1)})</span>
              </div>
              <div className={styles.zoomMeta}><span>{t('asos')}</span><strong>{oboi.asos}</strong></div>
              <div className={styles.zoomMeta}><span>{t('olcham')}</span><strong>{oboi.olcham}</strong></div>
              <div className={styles.zoomMeta}><span>{t('fabrika')}</span><strong>{oboi.fabrika?.nom ?? '—'}</strong></div>
              <div className={styles.zoomMeta}><span>{t('kod')}</span><strong>{oboi.kod}</strong></div>
              <div className={styles.zoomMeta}><span>{t('stok')}</span><strong style={{ color: oboi.stok ? '#5a8a5a' : '#c0392b' }}>{oboi.stok ? `✓ ${t('stok')}` : t('stok_yo')}</strong></div>
              <div className={styles.zoomMeta}><span>{t('narx')}</span><strong style={{ color: 'var(--brown)', fontSize: 16 }}>{oboi.narx.toLocaleString('ru-RU')} so'm</strong></div>
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button onClick={toggleLike} className={styles.zoomLikeBtn}>
                  <i className={liked ? 'ti ti-heart-filled' : 'ti ti-heart'} style={{ color: liked ? '#e53935' : undefined }} />
                </button>
                <a href={sozlamalar.telegramMurojaat} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
                  <i className="ti ti-brand-telegram" /> {t('buyurtma')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
