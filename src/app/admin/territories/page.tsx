import { createClient } from '@/lib/supabase/server'
import { TerritoryAdminTable } from '@/components/admin/TerritoryAdminTable'
import { TerritoryUploader } from '@/components/admin/TerritoryUploader'
import { MapPin, Plus, Upload } from 'lucide-react'
import Link from 'next/link'

export default async function AdminTerritoriesPage() {
  const supabase = await createClient()

  const { data: territories } = await supabase
    .from('territories')
    .select(`
      *,
      territory_ownership (
        id,
        company_id,
        status,
        price_type,
        companies (name)
      )
    `)
    .order('state', { ascending: true })
    .order('name', { ascending: true })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Territories</h1>
          <p className="text-slate-400 mt-1">Manage territory definitions and availability</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/territories/new"
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Territory
          </Link>
        </div>
      </div>

      {/* Uploader */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Bulk Import</h2>
        </div>
        <TerritoryUploader />
      </div>

      {/* Territories Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">All Territories</h2>
            <span className="text-sm text-slate-500">({territories?.length || 0})</span>
          </div>
        </div>
        
        {!territories || territories.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-lg text-slate-400">No territories defined</p>
            <p className="text-sm text-slate-500 mt-1">
              Create territories or import them from a JSON file
            </p>
          </div>
        ) : (
          <TerritoryAdminTable territories={territories} />
        )}
      </div>
    </div>
  )
}

