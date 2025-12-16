'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export function TerritoryUploader() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [jsonInput, setJsonInput] = useState('')

  const handleUpload = async () => {
    if (!jsonInput.trim()) {
      setResult({ success: false, message: 'Please paste JSON data' })
      return
    }

    setIsUploading(true)
    setResult(null)

    try {
      const data = JSON.parse(jsonInput)

      const response = await fetch('/api/admin/territories/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()

      if (responseData.error) {
        throw new Error(responseData.error)
      }

      setResult({ 
        success: true, 
        message: `Successfully imported ${responseData.imported} territories` 
      })
      setJsonInput('')
      router.refresh()
    } catch (err) {
      setResult({ 
        success: false, 
        message: err instanceof Error ? err.message : 'Failed to import territories' 
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Paste JSON Data
        </label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-48 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          placeholder={`{
  "territories": [
    {
      "name": "Territory Name",
      "state": "CO",
      "metro_area": "Denver",
      "type": "metro",
      "population_est": 100000,
      "zip_codes": ["80202", "80203"],
      "adjacent_territory_names": ["Adjacent Territory"]
    }
  ]
}`}
        />
      </div>

      {result && (
        <div className={`flex items-start gap-3 p-4 rounded-lg ${
          result.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {result.success ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <p className="text-sm">{result.message}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isUploading || !jsonInput.trim()}
        className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Import Territories
          </>
        )}
      </button>
    </div>
  )
}

