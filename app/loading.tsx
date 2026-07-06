import styles from './loading.module.css'

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} />
      <p className={styles.text}>Yuklanmoqda...</p>
    </div>
  )
}
