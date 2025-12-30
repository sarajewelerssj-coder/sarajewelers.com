'use client'

import { usePathname } from 'next/navigation'
import Header from './header'
import Footer from './footer'
import TopBanner from './top-banner'
import { ThemeProvider } from '@/components/theme-provider'
import dynamic from 'next/dynamic'

const AIChatWidget = dynamic(() => import("@/components/ai/chat-widget"), { ssr: false })
const ScrollToTop = dynamic(() => import("@/components/ui/scroll-to-top"), { ssr: false })

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/sara-admin')

  if (isAdminRoute) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <TopBanner />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <AIChatWidget />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  )
}