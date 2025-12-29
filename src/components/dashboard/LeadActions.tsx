'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Phone, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import type { LeadStatus } from '@/types/database'

interface LeadActionsProps {
  leadId: string
  currentStatus: LeadStatus
}

export function LeadActions({ leadId, currentStatus }: LeadActionsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleUpdateStatus = async (newStatus: LeadStatus) => {
    setIsUpdating(newStatus)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId)

      if (error) throw error

      router.refresh()
    } catch (err) {
      console.error('Failed to update lead:', err)
      alert('Failed to update lead status')
    } finally {
      setIsUpdating(null)
    }
  }

  const actions = [
    {
      status: 'contacted' as LeadStatus,
      label: 'Mark Contacted',
      icon: Phone,
      class: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
      activeClass: 'bg-blue-600 text-white border-blue-600'
    },
    {
      status: 'booked' as LeadStatus,
      label: 'Mark Booked',
      icon: CheckCircle2,
      class: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
      activeClass: 'bg-emerald-600 text-white border-emerald-600'
    },
    {
      status: 'not_a_fit' as LeadStatus,
      label: 'Not a Fit',
      icon: XCircle,
      class: 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200',
      activeClass: 'bg-slate-600 text-white border-slate-600'
    }
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => {
        const Icon = action.icon
        const isActive = currentStatus === action.status
        const isLoading = isUpdating === action.status

        return (
          <button
            key={action.status}
            onClick={() => handleUpdateStatus(action.status)}
            disabled={isUpdating !== null}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-colors disabled:opacity-50 ${
              isActive ? action.activeClass : action.class
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            {action.label}
            {isActive && <span className="text-xs opacity-75">(Current)</span>}
          </button>
        )
      })}
    </div>
  )
}

