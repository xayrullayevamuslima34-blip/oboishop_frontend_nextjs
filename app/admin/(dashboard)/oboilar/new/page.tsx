'use client'
import { useRouter } from 'next/navigation'
import { apiAdmin } from '@/lib/api'
import { useApp } from '@/lib/context'
import OboiForm, { OboiFormData } from '../OboiForm'
import styles from '../../../admin.module.css'

export default function YangiOboiPage() {
  const router = useRouter()
  const { t } = useApp()

  const saqlash = async (data: OboiFormData) => {
    const res = await apiAdmin('/oboilar', { method: 'POST', body: JSON.stringify(data) })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || t('a_saqlab_bolmadi'))
    }
    router.push('/admin/oboilar')
  }

  return (
    <div>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{t('a_yangi_oboi_qoshish')}</h1>
      </div>
      <OboiForm onSubmit={saqlash} submitLabel={t('a_qoshish')} />
    </div>
  )
}
