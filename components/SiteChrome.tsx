'use client'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import ScrollTop from './ScrollTop'
import TelegramWidget from './TelegramWidget'
import ChatWidget from './ChatWidget'
import SurveyWidget from './SurveyWidget'
import CursorEffect from './CursorEffect'
import PageTransition from './PageTransition'
import NewBanner from './NewBanner'

// /admin sahifalari o'z navigatsiyasiga ega — ommaviy sayt Header/Footer'i kerak emas.
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <CursorEffect />
      <PageTransition />
      <NewBanner />
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollTop />
      <TelegramWidget />
      <ChatWidget />
      <SurveyWidget />
    </>
  )
}
