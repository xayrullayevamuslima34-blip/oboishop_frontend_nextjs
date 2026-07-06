import type { Metadata } from 'next'
import './globals.css'
import './mobile.css'
import { AppProvider } from '@/lib/context'
import SiteChrome from '@/components/SiteChrome'

export const metadata: Metadata = {
  title: { default: 'OboiShop - Sifatli oboilar | Yangiyer', template: '%s | OboiShop' },
  description: "Sirdaryo viloyati, Yangiyer shahridagi oboi do'koni. 500+ oboi modeli, qulay narxlar.",
  keywords: ['oboi', 'oboilar', 'yangiyer', 'sirdaryo', 'devor bezash', 'vintil', 'flizelin'],
  openGraph: {
    title: 'OboiShop - Sifatli oboilar',
    description: "Yangiyer shahridagi oboi do'koni. 500+ model.",
    locale: 'uz_UZ',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      </head>
      <body>
        <AppProvider>
          <SiteChrome>{children}</SiteChrome>
        </AppProvider>
      </body>
    </html>
  )
}
