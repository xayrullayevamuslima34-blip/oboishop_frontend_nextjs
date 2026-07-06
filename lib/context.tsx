'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Lang } from './i18n'
import { safeStorage } from './storage'
import { Sozlamalar, SOZLAMALAR_DEFAULT, fetchSozlamalar, Oboi, fetchOboilar } from './api'

interface AppContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: keyof typeof translations.uz) => string
  dark: boolean
  toggleDark: () => void
  favCount: number
  sozlamalar: Sozlamalar
  oboilar: Oboi[]
  oboilarLoading: boolean
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('uz')
  const [dark, setDark] = useState(false)
  const [favCount, setFavCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [sozlamalar, setSozlamalar] = useState<Sozlamalar>(SOZLAMALAR_DEFAULT)
  const [oboilar, setOboilar] = useState<Oboi[]>([])
  const [oboilarLoading, setOboilarLoading] = useState(true)

  useEffect(() => {
    fetchSozlamalar().then(setSozlamalar).catch(() => {})
    fetchOboilar().then(setOboilar).catch(() => {}).finally(() => setOboilarLoading(false))
  }, [])

  useEffect(() => {
    setMounted(true)
    const savedLang = safeStorage.get('lang') as Lang
    const savedDark = safeStorage.get('dark') === 'true'
    const savedFavs = safeStorage.getJSON<string[]>('favs', [])

    if (savedLang) setLangState(savedLang)
    if (savedDark) {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
    setFavCount(savedFavs.length)
  }, [])

  useEffect(() => {
    const update = () => {
      const favs = safeStorage.getJSON<string[]>('favs', [])
      setFavCount(favs.length)
    }
    window.addEventListener('favsUpdated', update)
    return () => window.removeEventListener('favsUpdated', update)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    if (mounted) safeStorage.set('lang', l)
  }

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    if (mounted) safeStorage.set('dark', String(next))
  }

  const t = (key: keyof typeof translations.uz) =>
    translations[lang]?.[key] || translations.uz[key]

  return (
    <AppContext.Provider value={{ lang, setLang, t, dark, toggleDark, favCount, sozlamalar, oboilar, oboilarLoading }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
