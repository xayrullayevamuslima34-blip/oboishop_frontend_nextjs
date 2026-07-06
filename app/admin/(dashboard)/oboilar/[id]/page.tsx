'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiAdmin } from '@/lib/api'
import { useApp } from '@/lib/context'
import OboiForm, { OboiFormData } from '../OboiForm'
import styles from '../../../admin.module.css'

export default function OboiTahrirlashPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t } = useApp()
  const [initial, setInitial] = useState<Partial<OboiFormData> | null>(null)

  useEffect(() => {
    apiAdmin(`/oboilar/${id}`)
      .then(r => r.json())
      .then(o => setInitial({
        nom: o.nom,
        narx: o.narx,
        olcham: o.olcham,
        rasm: o.rasm,
        asos: o.asos,
        color1: o.color1,
        color2: o.color2,
        kategoriyaId: o.kategoriya?.id,
        fabrikaId: o.fabrika?.id,
        stok: o.stok,
        featured: o.featured,
        xususiyatlar: o.xususiyatlar ?? [],
      }))
  }, [id])

  const saqlash = async (data: OboiFormData) => {
    const res = await apiAdmin(`/oboilar/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || t('a_saqlab_bolmadi'))
    }
    router.push('/admin/oboilar')
  }

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t('a_oboini_tahrirlash')}</h1>
      </div>
      {initial ? (
        <OboiForm initial={initial} onSubmit={saqlash} submitLabel={t('a_saqlash')} />
      ) : (
        <div>{t('a_yuklanmoqda')}</div>
      )}
    </div>
  )
}
