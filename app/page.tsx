'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useApp } from '@/lib/context'
import { safeStorage } from '@/lib/storage'
import OboyCard from '@/components/OboyCard'
import styles from './page.module.css'

export default function Home() {
  const { t, lang, sozlamalar, oboilar } = useApp()
  const label = (uz: string, ru: string, en: string) => lang === 'uz' ? uz : lang === 'ru' ? ru : en
  const HERO_OBOILAR = oboilar.slice(0, 5)
  const [heroIdx, setHeroIdx] = useState(0)
  const [parallaxY, setParallaxY] = useState(0)
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const heroRef = useRef<HTMLDivElement>(null)

  // Animated hero
  useEffect(() => {
    if (HERO_OBOILAR.length === 0) return
    const timer = setInterval(() => setHeroIdx(i => (i + 1) % HERO_OBOILAR.length), 3000)
    return () => clearInterval(timer)
  }, [HERO_OBOILAR.length])

  // Parallax
  useEffect(() => {
    const onScroll = () => setParallaxY(window.scrollY * 0.3)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Recently viewed - SSR safe
  useEffect(() => {
    try {
      const viewed = safeStorage.getJSON<string[]>('viewed', [])
      setRecentlyViewed(viewed)
    } catch {}
  }, [])

  return (
    <div>
      <div className={styles.divider} />

      {/* Hero with animated wallpaper */}
      <div className={styles.hero} ref={heroRef}>
        <div className={styles.heroText} style={{ transform: `translateY(${parallaxY * 0.2}px)` }}>
          <p className={styles.sectionLabel}>OBOISHOP — YANGIYER</p>
          <h1>
            {sozlamalar.bannerMatni ? sozlamalar.bannerMatni : (
              lang === 'uz'
                ? <>Uyingizni <span className={styles.accent}>chiroyli</span> oboilar bilan bezang</>
                : lang === 'ru'
                ? <>Украсьте ваш дом <span className={styles.accent}>красивыми</span> обоями</>
                : <>Decorate with <span className={styles.accent}>beautiful</span> wallpapers</>
            )}
          </h1>
          <p>{t('hero_sub')}</p>
          <div className={styles.heroBtns}>
            <Link href="/katalog" className={styles.btnPrimary}><i className="ti ti-layout-grid" /> {t('katalog')}</Link>
            <Link href="/virtual" className={styles.btnSecondary}><i className="ti ti-eye" /> {t('sinab')}</Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}><div className={styles.statNum}>{sozlamalar.stat1Raqam}</div><div className={styles.statLabel}>{sozlamalar.stat1Label}</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{sozlamalar.stat2Raqam}</div><div className={styles.statLabel}>{sozlamalar.stat2Label}</div></div>
            <div className={styles.stat}><div className={styles.statNum}>{sozlamalar.stat3Raqam}</div><div className={styles.statLabel}>{sozlamalar.stat3Label}</div></div>
          </div>
        </div>

        {/* Animated wallpaper preview */}
        <div className={styles.heroAnim} style={{ transform: `translateY(${parallaxY * -0.1}px)` }}>
          {HERO_OBOILAR.map((o, i) => (
            <div key={o.id} className={`${styles.heroSlide} ${i === heroIdx ? styles.heroSlideActive : ''}`}
              style={o.rasm ? { backgroundImage: `url(${o.rasm})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: `linear-gradient(135deg, ${o.color1}, ${o.color2})` }}>
              {!o.rasm && <div className={styles.heroSlidePattern} />}
              <div className={styles.heroSlideInfo}>
                <span className={styles.heroSlideName}>{o.nom}</span>
                <span className={styles.heroSlidePrice}>{o.narx.toLocaleString('ru-RU')} so'm</span>
              </div>
            </div>
          ))}
          <div className={styles.heroDots}>
            {HERO_OBOILAR.map((_, i) => (
              <button key={i} className={`${styles.heroDot} ${i === heroIdx ? styles.heroDotActive : ''}`}
                onClick={() => setHeroIdx(i)} />
            ))}
          </div>
        </div>
      </div>

      {/* Kategoriyalar */}
      <div className={styles.catsSection}>
        <p className={styles.sectionLabel}>{label('ASSORTIMENT', 'АССОРТИМЕНТ', 'ASSORTMENT')}</p>
        <h2 className={styles.sectionTitle}>{t('cats')}</h2>
        <div className={styles.catsGrid}>
          <Link href="/katalog?kategoriya=Vintil" className={styles.catCard}><i className="ti ti-layers" /><span>Vintil</span><small>{label('Chidamli', 'Прочный', 'Durable')}</small></Link>
          <Link href="/katalog?kategoriya=Flizelin" className={styles.catCard}><i className="ti ti-texture" /><span>Flizelin</span><small>{label('Zamonaviy', 'Современный', 'Modern')}</small></Link>
          <Link href="/katalog?kategoriya=Qog'oz" className={styles.catCard}><i className="ti ti-file" /><span>Qog'oz</span><small>{label('Klassik', 'Классический', 'Classic')}</small></Link>
          <Link href="/katalog?kategoriya=3D" className={styles.catCard}><i className="ti ti-cube-3d" /><span>3D</span><small>{label('Hajmli', 'Объёмный', 'Voluminous')}</small></Link>
          <Link href="/katalog?kategoriya=Bolalar uchun" className={styles.catCard}><i className="ti ti-mood-happy" /><span>{label('Bolalar', 'Детские', 'Kids')}</span><small>{label('Rang-barang', 'Разноцветный', 'Colorful')}</small></Link>
          <Link href="/katalog?fabrika=grandeco" className={styles.catCard}><i className="ti ti-building-factory" /><span>Grandeco</span><small>{label('Fabrika', 'Фабрика', 'Factory')}</small></Link>
          <Link href="/katalog?fabrika=erismann" className={styles.catCard}><i className="ti ti-building-factory" /><span>Erismann</span><small>{label('Fabrika', 'Фабрика', 'Factory')}</small></Link>
          <Link href="/katalog?fabrika=sintra" className={styles.catCard}><i className="ti ti-building-factory" /><span>Sintra</span><small>{label('Fabrika', 'Фабрика', 'Factory')}</small></Link>
        </div>
      </div>

      {/* Mashhur oboilar */}
      <div className={styles.gridSection}>
        <div className={styles.gridHeader}>
          <div>
            <p className={styles.sectionLabel}>{label("ENG KO'P TANLANGAN", 'ПОПУЛЯРНОЕ', 'MOST POPULAR')}</p>
            <h2 className={styles.sectionTitle}>{t('popular')}</h2>
          </div>
          <Link href="/katalog" className={styles.viewAll}>{t('hammasini')} <i className="ti ti-arrow-right" /></Link>
        </div>
        <div className={styles.grid}>
          {oboilar.slice(0, 5).map(oboi => <OboyCard key={oboi.id} oboi={oboi} />)}
        </div>
      </div>

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && oboilar.length > 0 && (
        <div className={styles.gridSection}>
          <div className={styles.gridHeader}>
            <div>
              <p className={styles.sectionLabel}>{label('TARIX', 'ИСТОРИЯ', 'HISTORY')}</p>
              <h2 className={styles.sectionTitle}>{t('korilgan')}</h2>
            </div>
          </div>
          <div className={styles.grid}>
            {recentlyViewed.slice(0, 5).map(id => {
              const o = oboilar.find(ob => ob.id === id)
              return o ? <OboyCard key={o.id} oboi={o} /> : null
            })}
          </div>
        </div>
      )}

      {/* Nega biz */}
      <div className={styles.whySection}>
        <p className={styles.sectionLabel}>{label('AFZALLIKLARIMIZ', 'НАШИ ПРЕИМУЩЕСТВА', 'OUR ADVANTAGES')}</p>
        <h2 className={styles.sectionTitle}>{t('why')}</h2>
        <div className={styles.whyGrid}>
          <div className={styles.whyCard}><i className="ti ti-certificate" /><h3>{t('sifat')}</h3><p>{t('sifat_d')}</p></div>
          <div className={styles.whyCard}><i className="ti ti-truck-delivery" /><h3>{t('yetkazish')}</h3><p>{t('yetkazish_d')}</p></div>
          <div className={styles.whyCard}><i className="ti ti-headset" /><h3>{t('maslahat')}</h3><p>{t('maslahat_d')}</p></div>
          <div className={styles.whyCard}><i className="ti ti-eye" /><h3>{t('uyda')}</h3><p>{t('uyda_d')}</p></div>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.ctaSection}>
        <h2>{label('Buyurtma berishga tayyormisiz?', 'Готовы сделать заказ?', 'Ready to order?')}</h2>
        <p>{label('Telegram orqali murojaatimizga yozing — mutaxassislarimiz sizga yordam beradi', 'Напишите нам в Telegram — наши специалисты помогут', 'Write to our Telegram — our specialists will help you')}</p>
        <div className={styles.ctaBtns}>
          <a href={sozlamalar.telegramMurojaat} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}><i className="ti ti-brand-telegram" /> {label('Telegram orqali murojaat', 'Написать в Telegram', 'Message on Telegram')}</a>
          <a href={`tel:${sozlamalar.telefon}`} className={styles.ctaBtnOutline}><i className="ti ti-phone" /> {label("Qo'ng'iroq", 'Позвонить', 'Call')}</a>
        </div>
      </div>
    </div>
  )
}
