'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/lib/context'
import styles from './page.module.css'

interface EshikDarcha {
  id: number
  eni: string
  boyi: string
}

export default function KalkulyatorPage() {
  const { t, lang, sozlamalar, oboilar } = useApp()
  const [uzunlik, setUzunlik] = useState('')
  const [kenglik, setKenglik] = useState('')
  const [balandlik, setBalandlik] = useState('')
  const [selectedOboi, setSelectedOboi] = useState('')
  const [eshiklar, setEshiklar] = useState<EshikDarcha[]>([{ id: 1, eni: '0.9', boyi: '2.0' }])
  const [darchalar, setDarchalar] = useState<EshikDarcha[]>([{ id: 1, eni: '1.2', boyi: '1.4' }])
  const [result, setResult] = useState<null | { rulon: number; metr: number; narx: number; rulonEni: number; rulonUzunlik: number }>(null)
  const [errors, setErrors] = useState<string[]>([])

  const addEshik = () => setEshiklar([...eshiklar, { id: Date.now(), eni: '0.9', boyi: '2.0' }])
  const removeEshik = (id: number) => setEshiklar(eshiklar.filter(e => e.id !== id))
  const updateEshik = (id: number, field: 'eni' | 'boyi', val: string) =>
    setEshiklar(eshiklar.map(e => e.id === id ? { ...e, [field]: val } : e))

  const addDarcha = () => setDarchalar([...darchalar, { id: Date.now(), eni: '1.2', boyi: '1.4' }])
  const removeDarcha = (id: number) => setDarchalar(darchalar.filter(d => d.id !== id))
  const updateDarcha = (id: number, field: 'eni' | 'boyi', val: string) =>
    setDarchalar(darchalar.map(d => d.id === id ? { ...d, [field]: val } : d))

  const hisobla = () => {
    const errs: string[] = []
    const u = parseFloat(uzunlik)
    const k = parseFloat(kenglik)
    const b = balandlik ? parseFloat(balandlik) : 2.7

    if (!u || u <= 0 || u > 100) errs.push(lang === 'uz' ? 'Xona uzunligi noto\'g\'ri' : lang === 'ru' ? 'Неверная длина комнаты' : 'Invalid room length')
    if (!k || k <= 0 || k > 100) errs.push(lang === 'uz' ? 'Xona kengligi noto\'g\'ri' : lang === 'ru' ? 'Неверная ширина комнаты' : 'Invalid room width')
    if (balandlik && (b <= 0 || b > 10)) errs.push(lang === 'uz' ? 'Xona balandligi noto\'g\'ri' : lang === 'ru' ? 'Неверная высота потолка' : 'Invalid ceiling height')

    if (errs.length) { setErrors(errs); return }
    setErrors([])

    // Tanlangan oboi o'lchami
    const oboi = oboilar.find(o => o.id === selectedOboi)
    const olchamQismlari = oboi?.olcham.split(/[x×]/i).map(s => parseFloat(s.trim()))
    const rulonEni = olchamQismlari?.[0] || 0.53
    const rulonUzunlik = olchamQismlari?.[1] || 10.05

    // Devor maydoni
    const umumiyDevor = 2 * (u + k) * b

    // Eshiklar maydoni
    const eshikMaydon = eshiklar.reduce((sum, e) => {
      const eni = parseFloat(e.eni) || 0
      const boyi = parseFloat(e.boyi) || 0
      return sum + (eni * boyi)
    }, 0)

    // Darchalar maydoni
    const darchaMaydon = darchalar.reduce((sum, d) => {
      const eni = parseFloat(d.eni) || 0
      const boyi = parseFloat(d.boyi) || 0
      return sum + (eni * boyi)
    }, 0)

    const sofMaydon = Math.max(0, umumiyDevor - eshikMaydon - darchaMaydon)
    const rulonMaydon = rulonEni * rulonUzunlik
    const rulon = Math.ceil(sofMaydon / rulonMaydon) + 1 // +1 zaxira

    setResult({
      rulon,
      metr: Math.round(rulon * rulonUzunlik),
      narx: oboi ? rulon * oboi.narx : rulon * 75000,
      rulonEni,
      rulonUzunlik
    })
  }

  const label = (uz: string, ru: string, en: string) =>
    lang === 'uz' ? uz : lang === 'ru' ? ru : en

  return (
    <div>
      <div className={styles.divider} />
      <div className={styles.breadcrumb}>
        <Link href="/">
          {label('Bosh sahifa', 'Главная', 'Home')}
        </Link> / <span>{label('Hisob-kitob kalkulyatori', 'Калькулятор обоев', 'Wallpaper Calculator')}</span>
      </div>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <i className="ti ti-calculator" />
            <div>
              <h1>{label('Oboi kalkulyatori', 'Калькулятор обоев', 'Wallpaper Calculator')}</h1>
              <p>{label("Xona o'lchamini kiriting — kerakli oboi miqdorini hisoblaymiz", 'Введите размеры комнаты — рассчитаем количество обоев', 'Enter room dimensions — we\'ll calculate the amount of wallpaper')}</p>
            </div>
          </div>

          {/* Xona o'lchamlari */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <i className="ti ti-home" /> {label("Xona o'lchamlari", 'Размеры комнаты', 'Room dimensions')}
            </h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>{label('Uzunlik (m)', 'Длина (м)', 'Length (m)')}</label>
                <input type="number" min="0" max="100" step="0.1"
                  placeholder={label('masalan: 4.5', 'например: 4.5', 'e.g. 4.5')} value={uzunlik}
                  onChange={e => setUzunlik(e.target.value)}
                  className={styles.input} />
              </div>
              <div className={styles.field}>
                <label>{label('Kenglik (m)', 'Ширина (м)', 'Width (m)')}</label>
                <input type="number" min="0" max="100" step="0.1"
                  placeholder={label('masalan: 3.5', 'например: 3.5', 'e.g. 3.5')} value={kenglik}
                  onChange={e => setKenglik(e.target.value)}
                  className={styles.input} />
              </div>
              <div className={styles.field}>
                <label>{label('Balandlik (m)', 'Высота (м)', 'Height (m)')}</label>
                <input type="number" min="0" max="10" step="0.1"
                  placeholder={label('masalan: 2.7', 'например: 2.7', 'e.g. 2.7')} value={balandlik}
                  onChange={e => setBalandlik(e.target.value)}
                  className={styles.input} />
              </div>
            </div>
          </div>

          {/* Oboi tanlash */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <i className="ti ti-wallpaper" /> {label('Oboi tanlang (ixtiyoriy)', 'Выберите обои (необязательно)', 'Select wallpaper (optional)')}
            </h3>
            <select className={styles.input} value={selectedOboi} onChange={e => setSelectedOboi(e.target.value)}>
              <option value="">{label('Standart o\'lcham (0.53×10.05)', 'Стандарт (0.53×10.05)', 'Standard (0.53×10.05)')}</option>
              {oboilar.map(o => (
                <option key={o.id} value={o.id}>
                  {o.nom} — {o.olcham} m ({o.narx.toLocaleString('ru-RU')} so'm)
                </option>
              ))}
            </select>
          </div>

          {/* Eshiklar */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h3 className={styles.sectionTitle}>
                <i className="ti ti-door" /> {label('Eshiklar', 'Двери', 'Doors')}
              </h3>
              <button className={styles.addBtn} onClick={addEshik}>
                <i className="ti ti-plus" /> {label('Qo\'shish', 'Добавить', 'Add')}
              </button>
            </div>
            {eshiklar.map((e, idx) => (
              <div key={e.id} className={styles.itemRow}>
                <span className={styles.itemNum}>{idx + 1}</span>
                <div className={styles.field}>
                  <label>{label('Eni (m)', 'Ширина (м)', 'Width (m)')}</label>
                  <input type="number" min="0" max="5" step="0.1"
                    value={e.eni} onChange={ev => updateEshik(e.id, 'eni', ev.target.value)}
                    className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label>{label('Balandligi (m)', 'Высота (м)', 'Height (m)')}</label>
                  <input type="number" min="0" max="5" step="0.1"
                    value={e.boyi} onChange={ev => updateEshik(e.id, 'boyi', ev.target.value)}
                    className={styles.input} />
                </div>
                {eshiklar.length > 1 && (
                  <button className={styles.removeBtn} onClick={() => removeEshik(e.id)}>
                    <i className="ti ti-trash" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Darchalar */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h3 className={styles.sectionTitle}>
                <i className="ti ti-window" /> {label('Darchalar', 'Окна', 'Windows')}
              </h3>
              <button className={styles.addBtn} onClick={addDarcha}>
                <i className="ti ti-plus" /> {label('Qo\'shish', 'Добавить', 'Add')}
              </button>
            </div>
            {darchalar.map((d, idx) => (
              <div key={d.id} className={styles.itemRow}>
                <span className={styles.itemNum}>{idx + 1}</span>
                <div className={styles.field}>
                  <label>{label('Eni (m)', 'Ширина (м)', 'Width (m)')}</label>
                  <input type="number" min="0" max="5" step="0.1"
                    value={d.eni} onChange={ev => updateDarcha(d.id, 'eni', ev.target.value)}
                    className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label>{label('Balandligi (m)', 'Высота (м)', 'Height (m)')}</label>
                  <input type="number" min="0" max="5" step="0.1"
                    value={d.boyi} onChange={ev => updateDarcha(d.id, 'boyi', ev.target.value)}
                    className={styles.input} />
                </div>
                {darchalar.length > 1 && (
                  <button className={styles.removeBtn} onClick={() => removeDarcha(d.id)}>
                    <i className="ti ti-trash" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Xatolar */}
          {errors.length > 0 && (
            <div className={styles.errorBox}>
              {errors.map((err, i) => <p key={i}><i className="ti ti-alert-circle" /> {err}</p>)}
            </div>
          )}

          <button className={styles.btn} onClick={hisobla}>
            <i className="ti ti-calculator" /> {label('Hisoblash', 'Рассчитать', 'Calculate')}
          </button>

          {/* Natija */}
          {result && (
            <div className={styles.result}>
              <h2>{label('Natija', 'Результат', 'Result')}</h2>
              <div className={styles.resultGrid}>
                <div className={styles.resultCard}>
                  <i className="ti ti-stack" />
                  <div className={styles.resultNum}>{result.rulon}</div>
                  <div className={styles.resultLabel}>
                    {label('ta rulon kerak', 'рулонов нужно', 'rolls needed')}
                  </div>
                  <div className={styles.resultSub}>{result.rulonEni}×{result.rulonUzunlik}m</div>
                </div>
                <div className={styles.resultCard}>
                  <i className="ti ti-ruler" />
                  <div className={styles.resultNum}>{result.metr}</div>
                  <div className={styles.resultLabel}>
                    {label('metr uzunlik', 'метров длина', 'meters total')}
                  </div>
                </div>
                <div className={styles.resultCard}>
                  <i className="ti ti-currency-dollar" />
                  <div className={styles.resultNum}>{result.narx.toLocaleString('ru-RU')}</div>
                  <div className={styles.resultLabel}>so'm</div>
                  <div className={styles.resultSub}>{label('taxminiy', 'примерно', 'approx.')}</div>
                </div>
              </div>

              <div className={styles.note}>
                <i className="ti ti-info-circle" />
                {label(
                  '* Bu taxminiy hisob. Zaxira uchun 1 ta qo\'shimcha rulon qo\'shilgan. Aniq hisob uchun usta bilan maslahatlashing.',
                  '* Это приблизительный расчёт. Добавлен 1 запасной рулон. Для точного расчёта проконсультируйтесь с мастером.',
                  '* This is an approximate calculation. 1 extra roll added. Consult a professional for exact measurements.'
                )}
              </div>

              <a href={sozlamalar.telegramMurojaat} target="_blank" rel="noopener noreferrer" className={styles.orderBtn}>
                <i className="ti ti-brand-telegram" />
                {label('Buyurtma berish', 'Заказать', 'Order now')}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
