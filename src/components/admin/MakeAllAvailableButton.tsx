'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export function MakeAllAvailableButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleMakeAllAvailable = async () => {
    if (!confirm('This will set all territories without active subscriptions to "available" status. Territories with active subscriptions will remain "taken". Continue?')) {
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/territories/make-all-available', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update territories')
      }

      setResult({ 
        success: true, 
        message: data.message || `Successfully set ${data.updated || 0} territories to available status` 
      })
      router.refresh()
    } catch (err) {
      setResult({ 
        success: false, 
        message: err instanceof Error ? err.message : 'Failed to update territories' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <RefreshCw className="w-5 h-5 text-slate-400" />
        <h2 className="text-lg font-semibold text-white">Bulk Status Update</h2>
      </div>
      
      <p className="text-sm text-slate-400 mb-4">
        Set all territories without active subscriptions to "available" status. Territories with active subscriptions will remain "taken".
      </p>

      <button
        onClick={handleMakeAllAvailable}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Make All Available
          </>
        )}
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
          result.success 
            ? 'bg-emerald-500/10 border border-emerald-500/20' 
            : 'bg-red-500/10 border border-red-500/20'
        }`}>
          {result.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
            {result.message}
          </p>
        </div>
      )}
    </div>
  )
}




