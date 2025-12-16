'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, MapPin } from 'lucide-react'

export default function EditTerritoryPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [territory, setTerritory] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allTerritories, setAllTerritories] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    metro_area: '',
    type: 'metro' as 'metro' | 'rural',
    population_est: 100000,
    zip_codes: '',
    adjacent_ids: [] as string[]
  })

  const supabase = createClient()

  useEffect(() => {
    const loadTerritory = async () => {
      const { data: territoryData } = await supabase
        .from('territories')
        .select('*')
        .eq('id', id)
        .single()

      const { data: allTerritoriesData } = await supabase
        .from('territories')
        .select('id, name')
        .neq('id', id)
        .order('name')

      if (territoryData) {
        setTerritory(territoryData)
        setFormData({
          name: territoryData.name,
          state: territoryData.state,
          metro_area: territoryData.metro_area || '',
          type: territoryData.type,
          population_est: territoryData.population_est,
          zip_codes: territoryData.zip_codes?.join(', ') || '',
          adjacent_ids: territoryData.adjacent_ids || []
        })
      }

      if (allTerritoriesData) {
        setAllTerritories(allTerritoriesData)
      }

      setIsLoading(false)
    }

    loadTerritory()
  }, [id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      const zipCodes = formData.zip_codes
        .split(/[,\n]/)
        .map(z => z.trim())
        .filter(z => z.length > 0)

      const { error: updateError } = await supabase
        .from('territories')
        .update({
          name: formData.name,
          state: formData.state,
          metro_area: formData.metro_area || null,
          type: formData.type,
          population_est: formData.population_est,
          zip_codes: zipCodes,
          adjacent_ids: formData.adjacent_ids
        })
        .eq('id', id)

      if (updateError) throw updateError

      router.push('/admin/territories')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update territory')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleAdjacent = (territoryId: string) => {
    setFormData(prev => ({
      ...prev,
      adjacent_ids: prev.adjacent_ids.includes(territoryId)
        ? prev.adjacent_ids.filter(id => id !== territoryId)
        : [...prev.adjacent_ids, territoryId]
    }))
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    )
  }

  if (!territory) {
    return (
      <div className="p-8">
        <p className="text-slate-400">Territory not found</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <Link 
        href="/admin/territories"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Territories
      </Link>

      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Edit Territory</h1>
          <p className="text-slate-400 mt-1">Update territory details and adjacency</p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-white">Territory Details</h2>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                territory.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                territory.status === 'taken' ? 'bg-red-500/20 text-red-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {territory.status}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-500/20 text-red-400 rounded-lg p-4">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Territory Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase().slice(0, 2) })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
                  maxLength={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Metro Area
                </label>
                <input
                  type="text"
                  value={formData.metro_area}
                  onChange={(e) => setFormData({ ...formData, metro_area: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'metro' | 'rural' })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="metro">Metro</option>
                  <option value="rural">Rural</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Population Estimate
                </label>
                <input
                  type="number"
                  value={formData.population_est}
                  onChange={(e) => setFormData({ ...formData, population_est: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ZIP Codes
              </label>
              <textarea
                value={formData.zip_codes}
                onChange={(e) => setFormData({ ...formData, zip_codes: e.target.value })}
                className="w-full h-24 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Adjacent Territories
              </label>
              <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 max-h-48 overflow-y-auto">
                {allTerritories.length === 0 ? (
                  <p className="text-sm text-slate-500">No other territories to link</p>
                ) : (
                  <div className="space-y-2">
                    {allTerritories.map((t) => (
                      <label key={t.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.adjacent_ids.includes(t.id)}
                          onChange={() => toggleAdjacent(t.id)}
                          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm text-slate-300">{t.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Selected adjacent territories: {formData.adjacent_ids.length}
              </p>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <Link
                href="/admin/territories"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

