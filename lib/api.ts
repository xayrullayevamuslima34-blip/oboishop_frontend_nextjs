export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export interface Sozlamalar {
  id: number
  bannerMatni: string
  stat1Raqam: string
  stat1Label: string
  stat2Raqam: string
  stat2Label: string
  stat3Raqam: string
  stat3Label: string
  telefon: string
  manzil: string
  ishVaqti: string
  instagramLink: string
  telegramKanal: string
  telegramMurojaat: string
  xaritaEmbed: string
  xaritaLink: string
}

export const SOZLAMALAR_DEFAULT: Sozlamalar = {
  id: 1,
  bannerMatni: '',
  stat1Raqam: '500+',
  stat1Label: 'Oboi modeli',
  stat2Raqam: '3000+',
  stat2Label: 'Mamnun mijoz',
  stat3Raqam: '5+',
  stat3Label: 'Yil tajriba',
  telefon: '+998507470753',
  manzil: 'Yangiyer, Sirdaryo',
  ishVaqti: 'Du–Sha: 09:00 – 18:00',
  instagramLink: 'https://www.instagram.com/oboishop.uz',
  telegramKanal: 'https://t.me/abduvahidovna_muslimax',
  telegramMurojaat: 'https://t.me/abduvahidovna_muslimax',
  xaritaEmbed: '',
  xaritaLink: '',
}

export async function fetchSozlamalar(): Promise<Sozlamalar> {
  const res = await fetch(`${API_URL}/sozlamalar`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Sozlamalarni olishda xatolik')
  return res.json()
}

// ===== Oboilar (mahsulotlar) =====
export interface Oboi {
  id: string
  kod: string
  nom: string
  narx: number
  olcham: string
  rasm: string | null
  asos: string
  color1: string
  color2: string
  kategoriya: { id: string; nom: string } | null
  fabrika: { id: string; nom: string } | null
  stok: boolean
  reytingOrtacha: number
  reytingSoni: number
  xususiyatlar: string[]
  featured: boolean
  createdAt: string
  yangi: boolean
}

export async function fetchOboilar(): Promise<Oboi[]> {
  const res = await fetch(`${API_URL}/oboilar?limit=200`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Oboilarni olishda xatolik')
  const data = await res.json()
  return data.data
}

// ===== Admin auth token saqlash =====
const ACCESS_KEY = 'admin_access_token'
const REFRESH_KEY = 'admin_refresh_token'

export const adminAuth = {
  getAccessToken: () => (typeof window === 'undefined' ? null : localStorage.getItem(ACCESS_KEY)),
  getRefreshToken: () => (typeof window === 'undefined' ? null : localStorage.getItem(REFRESH_KEY)),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_KEY, accessToken)
    localStorage.setItem(REFRESH_KEY, refreshToken)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

async function refreshTokens(): Promise<string | null> {
  const refreshToken = adminAuth.getRefreshToken()
  if (!refreshToken) return null
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) return null
  const data = await res.json()
  adminAuth.setTokens(data.accessToken, data.refreshToken)
  return data.accessToken
}

// Admin (JWT) himoyalangan so'rovlar uchun — 401 bo'lsa avtomatik refresh qilib qayta urinadi.
export async function apiAdmin(path: string, options: RequestInit = {}) {
  const doFetch = (token: string | null) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    })

  let res = await doFetch(adminAuth.getAccessToken())
  if (res.status === 401) {
    const newToken = await refreshTokens()
    if (newToken) res = await doFetch(newToken)
  }
  return res
}

export async function apiPublic(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
}
