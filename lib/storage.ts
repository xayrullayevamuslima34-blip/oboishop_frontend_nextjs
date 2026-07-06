// Xavfsiz localStorage yordamchi funksiyalar

export const safeStorage = {
  get: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null
      const val = localStorage.getItem(key)
      return val
    } catch {
      return null
    }
  },

  set: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return
      // Hajm chegarasi - 50KB dan oshmasin
      if (value.length > 50000) return
      localStorage.setItem(key, value)
    } catch {}
  },

  getJSON: <T>(key: string, fallback: T): T => {
    try {
      if (typeof window === 'undefined') return fallback
      const val = localStorage.getItem(key)
      if (!val) return fallback
      return JSON.parse(val) as T
    } catch {
      return fallback
    }
  },

  setJSON: (key: string, value: unknown): void => {
    try {
      if (typeof window === 'undefined') return
      const str = JSON.stringify(value)
      if (str.length > 50000) return
      localStorage.setItem(key, str)
    } catch {}
  },

  remove: (key: string): void => {
    try {
      if (typeof window === 'undefined') return
      localStorage.removeItem(key)
    } catch {}
  }
}

// Input sanitizatsiya
export const sanitize = (input: string): string => {
  return input
    .replace(/[<>\"'&]/g, '') // XSS belgilarini olib tashlash
    .replace(/javascript:/gi, '') // JS injection
    .replace(/on\w+=/gi, '') // event handler injection
    .trim()
    .slice(0, 200) // maksimal uzunlik
}
