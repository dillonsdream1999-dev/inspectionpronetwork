'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, User, LogOut, Phone } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let supabase
    try {
      supabase = createClient()
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      setIsLoading(false)
      return
    }

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Failed to get user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    getUser()
    
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null)
      })
      
      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('Failed to set up auth state listener:', error)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Failed to sign out:', error)
      // Still redirect even if sign out fails
      window.location.href = '/'
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/inspection-pro-network-logo.png" 
              alt="Inspection Pro Network" 
              className="h-10 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/territories" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Territories
            </Link>
            
            <Link 
              href="/#contact" 
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Contact
            </Link>
            
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                      Dashboard
                    </Link>
                    <div className="relative group">
                      <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        <User className="w-4 h-4" />
                        <span className="max-w-[150px] truncate">{user.email}</span>
                      </button>
                      <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <div className="bg-white rounded-lg shadow-lg border border-slate-200 py-2 min-w-[160px]">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" className="btn-primary text-sm">
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/territories"
                className="text-sm font-medium text-slate-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Territories
              </Link>
              
              <Link
                href="/#contact"
                className="flex items-center gap-2 text-sm font-medium text-slate-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="w-4 h-4" />
                Contact
              </Link>
              
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="text-sm font-medium text-slate-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="text-sm font-medium text-slate-600 text-left"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="btn-primary text-sm w-fit"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

