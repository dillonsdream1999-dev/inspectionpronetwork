'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, MapPin } from 'lucide-react'

export default function NewTerritoryPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    metro_area: '',
    type: 'metro' as 'metro' | 'rural',
    population_est: 100000,
    zip_codes: ''
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      const zipCodes = formData.zip_codes
        .split(/[,\n]/)
        .map(z => z.trim())
        .filter(z => z.length > 0)

      const { error: insertError } = await supabase
        .from('territories')
        .insert({
          name: formData.name,
          state: formData.state,
          metro_area: formData.metro_area || null,
          type: formData.type,
          population_est: formData.population_est,
          zip_codes: zipCodes,
          adjacent_ids: [],
          status: 'available'
        })

      if (insertError) throw insertError

      router.push('/admin/territories')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create territory')
    } finally {
      setIsSaving(false)
    }
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
          <h1 className="text-2xl font-bold text-white">Create Territory</h1>
          <p className="text-slate-400 mt-1">Add a new territory to the platform</p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-white">Territory Details</h2>
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
                Territory Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="Denver Metro Central"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  State <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase().slice(0, 2) })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="CO"
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
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Denver"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'metro' | 'rural' })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="metro">Metro (up to ~100k pop)</option>
                  <option value="rural">Rural (up to ~150k pop)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Population Estimate <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={formData.population_est}
                  onChange={(e) => setFormData({ ...formData, population_est: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  min={1000}
                  step={1000}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                ZIP Codes <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.zip_codes}
                onChange={(e) => setFormData({ ...formData, zip_codes: e.target.value })}
                className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder="80202, 80203, 80204..."
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Separate ZIP codes with commas or new lines
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
                    Creating...
                  </>
                ) : (
                  'Create Territory'
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

