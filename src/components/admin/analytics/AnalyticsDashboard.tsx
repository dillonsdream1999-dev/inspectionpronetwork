'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, FunnelChart, Funnel, LabelList
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Smartphone, Target, Users, MapPin, 
  Phone, MessageSquare, PhoneIncoming, Search, Calendar, RefreshCw,
  AlertTriangle, CheckCircle, XCircle
} from 'lucide-react'
import { format } from 'date-fns'

interface SummaryData {
  appOpens: { value: number; change: number }
  scansStarted: { value: number; change: number }
  scansCompleted: { value: number; change: number }
  scanConversion: { value: number; change: number }
  leadsSubmitted: { value: number; change: number }
  providerMatchRate: { value: number; providerFound: number; providerNotFound: number }
}

interface FunnelStage {
  stage: string
  count: number
  percentage: number
}

interface LeadSource {
  name: string
  value: number
  color: string
}

interface CoverageGap {
  zipCode: string
  requestCount: number
  lastRequested: string
}

interface AnalyticsEvent {
  id: string
  event_name: string
  properties: Record<string, unknown>
  platform: string
  created_at: string
}

interface Lead {
  id: string
  date: string
  zipCode: string
  contactType: string
  providerFound: boolean
  providerName: string
}

const DATE_RANGES = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
]

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'leads' | 'gaps'>('overview')
  
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [dailyOpens, setDailyOpens] = useState<{ date: string; opens: number }[]>([])
  const [funnel, setFunnel] = useState<FunnelStage[]>([])
  const [leadSources, setLeadSources] = useState<LeadSource[]>([])
  const [coverage, setCoverage] = useState<{ name: string; value: number; color: string }[]>([])
  const [coverageGaps, setCoverageGaps] = useState<CoverageGap[]>([])
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [eventFilter, setEventFilter] = useState<string>('all')

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      const data = await response.json()
      
      setSummary(data.summary)
      setDailyOpens(data.dailyOpens)
      setFunnel(data.funnel)
      setLeadSources(data.leadSources)
      setCoverage(data.coverage)
      setCoverageGaps(data.coverageGaps)
      setRecentEvents(data.recentEvents)
      setLeads(data.leads)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }, [dateRange])

  useEffect(() => {
    setIsLoading(true)
    fetchData().finally(() => setIsLoading(false))
  }, [fetchData])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setIsRefreshing(false)
  }

  const filteredEvents = eventFilter === 'all' 
    ? recentEvents 
    : recentEvents.filter(e => e.event_name === eventFilter)

  const eventTypes = [...new Set(recentEvents.map(e => e.event_name))]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">App Analytics</h1>
          <p className="text-slate-400 mt-1">Bed Bug Inspection Pro usage metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {DATE_RANGES.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <SummaryCard
            title="App Opens"
            value={summary.appOpens.value}
            change={summary.appOpens.change}
            icon={<Smartphone className="w-5 h-5" />}
          />
          <SummaryCard
            title="Scans Started"
            value={summary.scansStarted.value}
            change={summary.scansStarted.change}
            icon={<Target className="w-5 h-5" />}
          />
          <SummaryCard
            title="Scans Completed"
            value={summary.scansCompleted.value}
            change={summary.scansCompleted.change}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <SummaryCard
            title="Scan Conversion"
            value={`${summary.scanConversion.value}%`}
            change={summary.scanConversion.change}
            suffix="%"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <SummaryCard
            title="Leads Submitted"
            value={summary.leadsSubmitted.value}
            change={summary.leadsSubmitted.change}
            icon={<Users className="w-5 h-5" />}
          />
          <SummaryCard
            title="Provider Match"
            value={`${summary.providerMatchRate.value}%`}
            subtitle={`${summary.providerMatchRate.providerFound} found / ${summary.providerMatchRate.providerNotFound} not found`}
            icon={<MapPin className="w-5 h-5" />}
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-700">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'events', label: 'Recent Events' },
          { id: 'leads', label: 'Leads' },
          { id: 'gaps', label: 'Coverage Gaps' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id 
                ? 'text-brand-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* App Opens Over Time */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">App Opens Over Time</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyOpens}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b"
                      tickFormatter={(value) => format(new Date(value), 'MMM d')}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="opens" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Scan Funnel */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Scan Funnel</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnel} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis 
                      type="category" 
                      dataKey="stage" 
                      stroke="#64748b" 
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                      formatter={(value, name, props) => [
                        `${value} (${props.payload.percentage}%)`,
                        'Count'
                      ]}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Second Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Lead Sources */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Methods</h3>
              <div className="h-72 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {leadSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 min-w-[140px]">
                  {leadSources.map((source, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="text-sm text-slate-300">{source.name}</span>
                      <span className="text-sm text-slate-500 ml-auto">{source.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Coverage */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Provider Coverage</h3>
              <div className="h-72 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={coverage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {coverage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4 min-w-[160px]">
                  {coverage.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full flex items-center justify-center" 
                        style={{ backgroundColor: item.color }}
                      >
                        {item.name === 'Provider Found' 
                          ? <CheckCircle className="w-3 h-3 text-white" />
                          : <XCircle className="w-3 h-3 text-white" />
                        }
                      </div>
                      <div>
                        <span className="text-sm text-slate-300 block">{item.name}</span>
                        <span className="text-lg font-bold text-white">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Events</h3>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Events</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{formatEventName(type)}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Timestamp</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Event</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Details</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredEvents.map(event => (
                  <tr key={event.id} className="hover:bg-slate-700/50">
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {format(new Date(event.created_at), 'MMM d, h:mm a')}
                    </td>
                    <td className="px-4 py-3">
                      <EventBadge eventName={event.event_name} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {formatEventProperties(event.properties)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {event.platform || 'Unknown'}
                    </td>
                  </tr>
                ))}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Submitted Leads</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">ZIP Code</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Contact Type</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Provider Status</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Provider Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-700/50">
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {format(new Date(lead.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-mono">
                      {lead.zipCode}
                    </td>
                    <td className="px-4 py-3">
                      <ContactTypeBadge type={lead.contactType} />
                    </td>
                    <td className="px-4 py-3">
                      {lead.providerFound ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Found
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 text-sm">
                          <XCircle className="w-4 h-4" />
                          Not Found
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {lead.providerName}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coverage Gaps Tab */}
      {activeTab === 'gaps' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Coverage Gaps</h3>
            <p className="text-sm text-slate-400 mt-1">ZIP codes where users couldn&apos;t find a provider</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">ZIP Code</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Request Count</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Last Requested</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase px-4 py-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {coverageGaps.map((gap, i) => (
                  <tr key={gap.zipCode} className="hover:bg-slate-700/50">
                    <td className="px-4 py-3 text-sm text-white font-mono font-bold">
                      {gap.zipCode}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-semibold">{gap.requestCount}</span>
                        <div className="flex-1 max-w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (gap.requestCount / (coverageGaps[0]?.requestCount || 1)) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {format(new Date(gap.lastRequested), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge index={i} />
                    </td>
                  </tr>
                ))}
                {coverageGaps.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No coverage gaps found - great coverage!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper Components
function SummaryCard({ 
  title, 
  value, 
  change, 
  suffix = '',
  subtitle,
  icon 
}: { 
  title: string
  value: number | string
  change?: number
  suffix?: string
  subtitle?: string
  icon: React.ReactNode
}) {
  const isPositive = change !== undefined && change >= 0
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{title}</span>
        <div className="text-slate-500">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm mt-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{change}{suffix} vs prev
        </div>
      )}
      {subtitle && (
        <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
      )}
    </div>
  )
}

function EventBadge({ eventName }: { eventName: string }) {
  const colors: Record<string, string> = {
    app_open: 'bg-blue-500/20 text-blue-400',
    scan_started: 'bg-purple-500/20 text-purple-400',
    scan_completed: 'bg-emerald-500/20 text-emerald-400',
    scan_abandoned: 'bg-orange-500/20 text-orange-400',
    lead_submitted: 'bg-green-500/20 text-green-400',
    provider_found: 'bg-teal-500/20 text-teal-400',
    provider_not_found: 'bg-red-500/20 text-red-400',
    google_search_clicked: 'bg-yellow-500/20 text-yellow-400',
    call_initiated: 'bg-cyan-500/20 text-cyan-400',
    text_initiated: 'bg-indigo-500/20 text-indigo-400',
    callback_requested: 'bg-pink-500/20 text-pink-400',
  }
  
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${colors[eventName] || 'bg-slate-500/20 text-slate-400'}`}>
      {formatEventName(eventName)}
    </span>
  )
}

function ContactTypeBadge({ type }: { type: string }) {
  const config: Record<string, { icon: React.ReactNode; color: string }> = {
    call: { icon: <Phone className="w-3 h-3" />, color: 'bg-emerald-500/20 text-emerald-400' },
    text: { icon: <MessageSquare className="w-3 h-3" />, color: 'bg-blue-500/20 text-blue-400' },
    callback: { icon: <PhoneIncoming className="w-3 h-3" />, color: 'bg-purple-500/20 text-purple-400' },
    google: { icon: <Search className="w-3 h-3" />, color: 'bg-yellow-500/20 text-yellow-400' },
  }
  
  const { icon, color } = config[type.toLowerCase()] || { icon: null, color: 'bg-slate-500/20 text-slate-400' }
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {type}
    </span>
  )
}

function PriorityBadge({ index }: { index: number }) {
  if (index < 5) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
        <AlertTriangle className="w-3 h-3" />
        High
      </span>
    )
  }
  if (index < 15) {
    return (
      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
        Medium
      </span>
    )
  }
  return (
    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400">
      Low
    </span>
  )
}

function formatEventName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatEventProperties(props: Record<string, unknown>): string {
  if (!props || Object.keys(props).length === 0) return '-'
  
  const entries = Object.entries(props)
    .filter(([key]) => !key.startsWith('_'))
    .slice(0, 3)
    .map(([key, value]) => `${key}: ${value}`)
  
  return entries.join(', ') || '-'
}

