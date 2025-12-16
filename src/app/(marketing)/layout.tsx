import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'

// Force dynamic rendering to avoid build-time env var issues
export const dynamic = 'force-dynamic'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}

