import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column', textAlign: 'center',
      padding: '40px', background: 'var(--cream)'
    }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🏠</div>
      <h1 style={{ fontSize: 48, fontWeight: 800, color: 'var(--brown-dark)', fontFamily: 'Georgia', marginBottom: 12 }}>
        404
      </h1>
      <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 32 }}>
        Bu sahifa topilmadi
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/" style={{
          background: 'var(--brown-dark)', color: '#fff',
          padding: '12px 28px', borderRadius: 28, textDecoration: 'none',
          fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
        }}>
          🏠 Bosh sahifaga
        </Link>
        <Link href="/katalog" style={{
          background: 'var(--cream-dark)', color: 'var(--brown-dark)',
          border: '1px solid var(--border)',
          padding: '12px 28px', borderRadius: 28, textDecoration: 'none',
          fontSize: 14, fontWeight: 500
        }}>
          Katalogga
        </Link>
      </div>
    </div>
  )
}
