'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Edit2, Trash2, Lock, Loader2 } from 'lucide-react'
import type { Tables } from '@/types/database'

interface TerritoryWithOwnership extends Tables<'territories'> {
  territory_ownership: {
    id: string
    company_id: string
    status: string
    price_type: string
    companies: { name: string } | null
  }[]
}

interface TerritoryAdminTableProps {
  territories: TerritoryWithOwnership[]
}

export function TerritoryAdminTable({ territories }: TerritoryAdminTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  const handleDelete = async (territoryId: string) => {
    if (!confirm('Are you sure you want to delete this territory? This action cannot be undone.')) {
      return
    }

    setDeletingId(territoryId)

    try {
      const { error } = await supabase
        .from('territories')
        .delete()
        .eq('id', territoryId)

      if (error) throw error

      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete territory')
    } finally {
      setDeletingId(null)
    }
  }

  const statusColors = {
    available: 'bg-emerald-500/20 text-emerald-400',
    held: 'bg-amber-500/20 text-amber-400',
    taken: 'bg-red-500/20 text-red-400'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Territory
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Population
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              ZIPs
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Owner
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {territories.map((territory) => {
            const activeOwnership = territory.territory_ownership?.find(o => o.status === 'active')
            const owner = activeOwnership?.companies?.name

            return (
              <tr key={territory.id} className="hover:bg-slate-700/30">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{territory.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-300">{territory.metro_area || '—'}</p>
                  <p className="text-xs text-slate-500">{territory.state}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-300 capitalize">{territory.type}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {territory.population_est.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {territory.zip_codes?.length || 0}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[territory.status]}`}>
                    {territory.status === 'taken' && <Lock className="w-3 h-3 mr-1" />}
                    {territory.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {owner || '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/territories/${territory.id}`)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(territory.id)}
                      disabled={deletingId === territory.id || territory.status === 'taken'}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === territory.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

