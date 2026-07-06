'use client'
import { useState } from 'react'
import { ROOMS } from '@/lib/rooms'
import { useApp } from '@/lib/context'
import styles from './page.module.css'

const PATTERN_TILE = 130 // px — devordagi naqsh takrorlanish o'lchami

export default function VirtualPage() {
  const { lang, sozlamalar, oboilar } = useApp()
  const L = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en

  const [step, setStep] = useState<'select-room' | 'visualize'>('select-room')
  const [selectedRoom, setSelectedRoom] = useState<number>(0)
  const [selectedOboi, setSelectedOboi] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filteredOboilar = oboilar.filter(o =>
    o.nom.toLowerCase().includes(search.toLowerCase()) ||
    o.asos.toLowerCase().includes(search.toLowerCase()) ||
    (o.fabrika?.nom.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  const room = ROOMS[selectedRoom]
  const oboi = selectedOboi !== null ? oboilar[selectedOboi] : null

  const selectRoom = (i: number) => {
    setSelectedRoom(i)
    setSelectedOboi(null)
    setStep('visualize')
  }

  if (step === 'select-room') {
    return (
      <div className={styles.page}>
        <div className={styles.divider} />
        <div className={styles.selectPage}>
          <h1 className={styles.selectTitle}>{L('Xonani tanlang', 'Выберите интерьер', 'Select interior')}</h1>
          <p className={styles.selectSub}>{L("Xonaga bosing — oboi ko'rish rejimi ochiladi", 'Нажмите на комнату — откроется режим примерки', 'Click a room to open the try-on mode')}</p>
          <div className={styles.roomSelectGrid}>
            {ROOMS.map((r, i) => (
              <div key={r.id} className={styles.roomSelectCard} onClick={() => selectRoom(i)}>
                <img src={r.image} alt={r.nom[lang]} />
                <div className={styles.roomSelectOverlay}>
                  <span>{r.nom[lang]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.divider} />
      <div className={styles.vizPage}>
        <div className={styles.canvasSection}>
          <button className={styles.backBtn} onClick={() => setStep('select-room')}>
            <i className="ti ti-arrow-left" /> {L('Xona tanlash', 'Выбрать комнату', 'Select room')}
          </button>

          <div className={styles.canvasWrap}>
            <div className={styles.tryOnStage}>
              <div
                className={styles.patternLayer}
                style={oboi ? (oboi.rasm
                  ? {
                      backgroundImage: `url(${oboi.rasm})`,
                      backgroundSize: `${PATTERN_TILE}px ${PATTERN_TILE}px`,
                    }
                  : { background: `linear-gradient(135deg, ${oboi.color1}, ${oboi.color2})` }) : undefined}
              />
              <img src={room.image} alt={room.nom[lang]} className={styles.roomLayer} />
            </div>
            {oboi && (
              <div className={styles.infoBar}>
                <div>
                  <div className={styles.infoName}>{oboi.nom}</div>
                  <div className={styles.infoMeta}>
                    {oboi.asos} · {oboi.olcham} m · {oboi.narx.toLocaleString('ru-RU')} so'm
                  </div>
                </div>
                <a href={sozlamalar.telegramMurojaat} target="_blank" rel="noopener noreferrer" className={styles.orderBtn}>
                  <i className="ti ti-brand-telegram" /> {L('Buyurtma', 'Заказать', 'Order')}
                </a>
              </div>
            )}
            {!oboi && (
              <div className={styles.hintBar}>
                <i className="ti ti-arrow-right" /> {L("O'ngdan oboi tanlang", 'Выберите обои справа', 'Select wallpaper on the right')}
              </div>
            )}
          </div>
        </div>

        <aside className={styles.oboyPanel}>
          <div className={styles.panelHead}>
            <h2>{L('Katalog', 'Каталог', 'Catalog')}</h2>
          </div>
          <div className={styles.searchWrap}>
            <i className="ti ti-search" />
            <input
              type="text"
              placeholder={L('Oboi qidirish...', 'Поиск обоев...', 'Search wallpapers...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button onClick={() => setSearch('')} className={styles.searchClear}>
                <i className="ti ti-x" />
              </button>
            )}
          </div>
          <div className={styles.oboyList}>
            {filteredOboilar.length === 0 && (
              <div className={styles.noResult}>{L('Topilmadi', 'Ничего не найдено', 'Not found')}</div>
            )}
            {filteredOboilar.map((o) => {
              const idx = oboilar.indexOf(o)
              return (
                <div
                  key={o.id}
                  className={`${styles.oboyItem} ${idx === selectedOboi ? styles.oboyActive : ''}`}
                  onClick={() => setSelectedOboi(idx)}
                >
                  <div className={styles.oboyPreview} style={o.rasm
                    ? { backgroundImage: `url(${o.rasm})` }
                    : { background: `linear-gradient(135deg, ${o.color1}, ${o.color2})` }} />
                  <div className={styles.oboyInfo}>
                    <div className={styles.oboyName}>{o.nom}</div>
                    <div className={styles.oboyMeta}>{o.asos} · {o.fabrika?.nom ?? '—'}</div>
                    <div className={styles.oboyPrice}>{o.narx.toLocaleString('ru-RU')} so'm</div>
                  </div>
                  {idx === selectedOboi && (
                    <i className="ti ti-check" style={{ color: 'var(--brown)', fontSize: 18, marginLeft: 'auto' }} />
                  )}
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}
