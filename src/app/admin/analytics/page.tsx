import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AdminAnalyticsPage() {
  return (
    <div className="p-8">
      <AnalyticsDashboard />
    </div>
  )
}

