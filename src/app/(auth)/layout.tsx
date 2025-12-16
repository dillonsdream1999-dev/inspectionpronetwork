import Link from 'next/link'

// Force dynamic rendering to avoid build-time env var issues
export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 flex flex-col">
      <header className="p-6">
        <Link href="/" className="flex flex-col w-fit">
          <span className="text-lg font-bold text-white leading-tight">
            Inspection Pro Network
          </span>
          <span className="text-[10px] text-slate-400 tracking-wide">
            Powered by Bed Bug Inspection Pro
          </span>
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
      
      <footer className="p-6 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Inspection Pro Network
        </p>
      </footer>
    </div>
  )
}

