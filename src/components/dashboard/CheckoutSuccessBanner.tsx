'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, X, MapPin } from 'lucide-react'
import Link from 'next/link'

export function CheckoutSuccessBanner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkoutStatus = searchParams.get('checkout')
  const territoryId = searchParams.get('territory')
  
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (checkoutStatus === 'success') {
      setIsVisible(true)
      // Remove query params from URL after showing banner
      const url = new URL(window.location.href)
      url.searchParams.delete('checkout')
      url.searchParams.delete('territory')
      window.history.replaceState({}, '', url.toString())
      
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 8000)
      
      return () => clearTimeout(timer)
    }
  }, [checkoutStatus, router])

  if (!isVisible || checkoutStatus !== 'success') {
    return null
  }

  return (
    <div className="mb-6 bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-xl p-4 shadow-lg animate-in slide-in-from-top duration-500">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-emerald-900 mb-1">
            Subscription Activated! 🎉
          </h3>
          <p className="text-emerald-800 mb-3">
            Your territory subscription is now active. You'll start receiving leads immediately.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/territories"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <MapPin className="w-4 h-4" />
              View My Territories
            </Link>
            <Link
              href="/territories"
              className="text-emerald-700 hover:text-emerald-800 font-medium text-sm"
            >
              Add Another Territory →
            </Link>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-emerald-600 hover:text-emerald-800 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

