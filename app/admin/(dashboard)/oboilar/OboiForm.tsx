'use client'
import { useEffect, useRef, useState } from 'react'
import { apiAdmin } from '@/lib/api'
import { useApp } from '@/lib/context'
import styles from '../../admin.module.css'

export interface OboiFormData {
  nom: string
  narx: number
  olcham: string
  rasm?: string | null
  asos?: string
  color1?: string
  color2?: string
  kategoriyaId?: string
  fabrikaId?: string
  stok: boolean
  xususiyatlar: string[]
  featured: boolean
}

interface Option { id: string; nom: string }

export default function OboiForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<OboiFormData>
  onSubmit: (data: OboiFormData) => Promise<void>
  submitLabel: string
}) {
  const { t } = useApp()
  const [nom, setNom] = useState(initial?.nom ?? '')
  const [narx, setNarx] = useState(initial?.narx?.toString() ?? '')
  const [olcham, setOlcham] = useState(initial?.olcham ?? '')
  const [rasm, setRasm] = useState<string | null>(initial?.rasm ?? null)
  const [asos, setAsos] = useState(initial?.asos ?? 'Vintil')
  const [color1, setColor1] = useState(initial?.color1 ?? '#e8e0d5')
  const [color2, setColor2] = useState(initial?.color2 ?? '#c4a882')
  const [kategoriyaId, setKategoriyaId] = useState(initial?.kategoriyaId ?? '')
  const [fabrikaId, setFabrikaId] = useState(initial?.fabrikaId ?? '')
  const [stok, setStok] = useState(initial?.stok ?? true)
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [xususiyatlar, setXususiyatlar] = useState<string[]>(initial?.xususiyatlar ?? [])
  const [yangiXususiyat, setYangiXususiyat] = useState('')

  const [kategoriyalar, setKategoriyalar] = useState<Option[]>([])
  const [fabrikalar, setFabrikalar] = useState<Option[]>([])
  const [xato, setXato] = useState('')
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const rasmInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    apiAdmin('/kategoriyalar').then(r => r.json()).then(setKategoriyalar).catch(() => {})
    apiAdmin('/fabrikalar').then(r => r.json()).then(setFabrikalar).catch(() => {})
  }, [])

  const rasmTanlash = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setRasm(reader.result as string)
    reader.readAsDataURL(file)
  }

  const rasmOchirish = () => {
    setRasm(null)
    if (rasmInputRef.current) rasmInputRef.current.value = ''
  }

  const xususiyatQoshish = () => {
    const v = yangiXususiyat.trim()
    if (v && !xususiyatlar.includes(v)) setXususiyatlar([...xususiyatlar, v])
    setYangiXususiyat('')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setXato('')
    const narxSon = parseFloat(narx)
    if (!nom || Number.isNaN(narxSon) || !olcham) {
      setXato(t('a_majburiy_maydonlar'))
      return
    }
    setSaqlanmoqda(true)
    try {
      await onSubmit({
        nom,
        narx: narxSon,
        olcham,
        rasm,
        asos,
        color1,
        color2,
        kategoriyaId: kategoriyaId || undefined,
        fabrikaId: fabrikaId || undefined,
        stok,
        featured,
        xususiyatlar,
      })
    } catch (err: any) {
      setXato(err?.message || t('a_saqlashda_xatolik'))
    } finally {
      setSaqlanmoqda(false)
    }
  }

  return (
    <form onSubmit={submit} className={styles.card}>
      {xato && <div className={styles.error}>{xato}</div>}
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>{t('a_nomi_label')}</label>
          <input value={nom} onChange={e => setNom(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label>{t('a_narxi_label')}</label>
          <input type="number" min={0} value={narx} onChange={e => setNarx(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label>{t('a_olchami_label')}</label>
          <input value={olcham} onChange={e => setOlcham(e.target.value)} placeholder="masalan: 1.06 x 10.05" required />
        </div>
        <div className={styles.field}>
          <label>{t('a_asos_label')}</label>
          <input value={asos} onChange={e => setAsos(e.target.value)} placeholder={t('a_asos_placeholder')} />
        </div>
        <div className={styles.field}>
          <label>{t('a_rang1_label')}</label>
          <input type="color" value={color1} onChange={e => setColor1(e.target.value)} style={{ height: 42, padding: 4 }} />
        </div>
        <div className={styles.field}>
          <label>{t('a_rang2_label')}</label>
          <input type="color" value={color2} onChange={e => setColor2(e.target.value)} style={{ height: 42, padding: 4 }} />
        </div>
        <div className={styles.field}>
          <label>{t('a_kategoriya_filtri_label')}</label>
          <select value={kategoriyaId} onChange={e => setKategoriyaId(e.target.value)}>
            <option value="">{t('a_tanlanmagan')}</option>
            {kategoriyalar.map(k => <option key={k.id} value={k.id}>{k.nom}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label>{t('a_fabrika_label')}</label>
          <select value={fabrikaId} onChange={e => setFabrikaId(e.target.value)}>
            <option value="">{t('a_tanlanmagan')}</option>
            {fabrikalar.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label>{t('a_rasm_label')}</label>
          <input ref={rasmInputRef} type="file" accept="image/*" onChange={e => rasmTanlash(e.target.files?.[0])} />
        </div>
        {rasm && (
          <div className="full">
            <div style={{ position: 'relative', width: 90, height: 90 }}>
              <img src={rasm} className={styles.thumb} style={{ width: 90, height: 90 }} />
              <button
                type="button"
                onClick={rasmOchirish}
                title={t('a_rasmni_olib_tashlash')}
                style={{
                  position: 'absolute', top: -8, right: -8, width: 24, height: 24,
                  borderRadius: '50%', background: '#c0392b', color: '#fff', border: '2px solid #fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, padding: 0, lineHeight: 1,
                }}
              >
                <i className="ti ti-x" />
              </button>
            </div>
          </div>
        )}

        <div className="full">
          <div className={styles.field}>
            <label>{t('a_xususiyatlar_label')}</label>
            <div className={styles.tagList} style={{ marginBottom: 8 }}>
              {xususiyatlar.map(x => (
                <span key={x} className={styles.tag}>
                  {x}
                  <span className={styles.tagRemove} onClick={() => setXususiyatlar(xususiyatlar.filter(v => v !== x))}>
                    <i className="ti ti-x" />
                  </span>
                </span>
              ))}
            </div>
            <div className={styles.inlineForm} style={{ marginBottom: 0 }}>
              <input
                value={yangiXususiyat}
                onChange={e => setYangiXususiyat(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); xususiyatQoshish() } }}
                placeholder={t('a_xususiyat_placeholder')}
              />
              <button type="button" className={styles.btn} onClick={xususiyatQoshish}>{t('a_qoshish')}</button>
            </div>
          </div>
        </div>

        <div className={styles.checkboxRow}>
          <input type="checkbox" checked={stok} onChange={e => setStok(e.target.checked)} id="stok" />
          <label htmlFor="stok">{t('a_mavjud_stokda')}</label>
        </div>
        <div className={styles.checkboxRow}>
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} id="featured" />
          <label htmlFor="featured">{t('a_tavsiya_etilgan')}</label>
        </div>
      </div>

      <button type="submit" className={styles.btnPrimary} style={{ marginTop: 20 }} disabled={saqlanmoqda}>
        {saqlanmoqda ? t('a_saqlanmoqda') : submitLabel}
      </button>
    </form>
  )
}
