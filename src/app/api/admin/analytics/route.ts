import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Verify the requester is an admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'
    const query = searchParams.get('query') || 'all'

    // Calculate date range
    const now = new Date()
    let startDate: Date
    let previousStartDate: Date
    let previousEndDate: Date

    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(previousStartDate.getDate() - 1)
        previousEndDate = new Date(startDate)
        break
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        previousStartDate = new Date(startDate)
        previousStartDate.setDate(previousStartDate.getDate() - 1)
        previousEndDate = new Date(startDate)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousEndDate = new Date(startDate)
        break
      case '30d':
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000)
        previousEndDate = new Date(startDate)
        break
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        previousEndDate = new Date(startDate)
        break
      case 'last_month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        previousEndDate = new Date(startDate)
        break
    }

    // Use service client for queries
    const serviceClient = await createServiceClient()

    if (query === 'summary') {
      return await getSummaryMetrics(serviceClient, startDate, previousStartDate, previousEndDate)
    }

    if (query === 'daily_opens') {
      return await getDailyOpens(serviceClient, startDate)
    }

    if (query === 'funnel') {
      return await getFunnelMetrics(serviceClient, startDate)
    }

    if (query === 'lead_sources') {
      return await getLeadSources(serviceClient, startDate)
    }

    if (query === 'coverage') {
      return await getCoverageMetrics(serviceClient, startDate)
    }

    if (query === 'coverage_gaps') {
      return await getCoverageGaps(serviceClient)
    }

    if (query === 'recent_events') {
      return await getRecentEvents(serviceClient)
    }

    if (query === 'leads') {
      return await getLeadsTable(serviceClient, startDate)
    }

    if (query === 'platforms') {
      return await getPlatformBreakdown(serviceClient, startDate)
    }

    if (query === 'room_types') {
      return await getRoomTypes(serviceClient, startDate)
    }

    // Return all data
    const [summary, dailyOpens, funnel, leadSources, coverage, gaps, recent, leads, platforms, roomTypes] = 
      await Promise.all([
        getSummaryData(serviceClient, startDate, previousStartDate, previousEndDate),
        getDailyOpensData(serviceClient, startDate),
        getFunnelData(serviceClient, startDate),
        getLeadSourcesData(serviceClient, startDate),
        getCoverageData(serviceClient, startDate),
        getCoverageGapsData(serviceClient),
        getRecentEventsData(serviceClient),
        getLeadsData(serviceClient, startDate),
        getPlatformData(serviceClient, startDate),
        getRoomTypesData(serviceClient, startDate),
      ])

    return NextResponse.json({
      summary,
      dailyOpens,
      funnel,
      leadSources,
      coverage,
      coverageGaps: gaps,
      recentEvents: recent,
      leads,
      platforms,
      roomTypes,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

// Helper functions to get data
async function getSummaryData(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date,
  prevStart: Date,
  prevEnd: Date
) {
  const startISO = startDate.toISOString()
  const prevStartISO = prevStart.toISOString()
  const prevEndISO = prevEnd.toISOString()

  // Current period counts
  const [appOpens, scansStarted, scansCompleted, leadsSubmitted, providerFound, providerNotFound] = 
    await Promise.all([
      supabase.from('analytics_events').select('id', { count: 'exact', head: true })
        .eq('event_name', 'app_open').gte('created_at', startISO),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true })
        .eq('event_name', 'scan_started').gte('created_at', startISO),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true })
        .eq('event_name', 'scan_completed').gte('created_at', startISO),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true })
        .eq('event_name', 'lead_submitted').gte('created_at', startISO),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true })
        .eq('event_name', 'provider_found').gte('created_at', startISO),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true })
        .eq('event_name', 'provider_not_found').gte('created_at', startISO),
    ])

  // Previous period counts
  const [prevAppOpens, prevScansStarted, prevScansCompleted, prevLeadsSubmitted] = 
    await Promise.all([
      supabase.from('analytics_events').select('id', { count: 'exact', head: true })
        .eq('event_name', 'app_open').gte('created_at', prevStartISO).lt('created_at', prevEndISO),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true })
        .eq('event_name', 'scan_started').gte('created_at', prevStartISO).lt('created_at', prevEndISO),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true })
        .eq('event_name', 'scan_completed').gte('created_at', prevStartISO).lt('created_at', prevEndISO),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true })
        .eq('event_name', 'lead_submitted').gte('created_at', prevStartISO).lt('created_at', prevEndISO),
    ])

  const currentAppOpens = appOpens.count || 0
  const currentScansStarted = scansStarted.count || 0
  const currentScansCompleted = scansCompleted.count || 0
  const currentLeads = leadsSubmitted.count || 0
  const currentProviderFound = providerFound.count || 0
  const currentProviderNotFound = providerNotFound.count || 0

  const scanConversion = currentScansStarted > 0 
    ? Math.round((currentScansCompleted / currentScansStarted) * 100) 
    : 0

  const providerMatchRate = (currentProviderFound + currentProviderNotFound) > 0
    ? Math.round((currentProviderFound / (currentProviderFound + currentProviderNotFound)) * 100)
    : 0

  // Calculate changes
  const prevOpens = prevAppOpens.count || 0
  const prevLeads = prevLeadsSubmitted.count || 0
  const prevScans = prevScansStarted.count || 0
  const prevCompleted = prevScansCompleted.count || 0
  const prevConversion = prevScans > 0 ? Math.round((prevCompleted / prevScans) * 100) : 0

  return {
    appOpens: {
      value: currentAppOpens,
      change: prevOpens > 0 ? Math.round(((currentAppOpens - prevOpens) / prevOpens) * 100) : 0,
    },
    scansStarted: {
      value: currentScansStarted,
      change: prevScans > 0 ? Math.round(((currentScansStarted - prevScans) / prevScans) * 100) : 0,
    },
    scansCompleted: {
      value: currentScansCompleted,
      change: prevCompleted > 0 ? Math.round(((currentScansCompleted - prevCompleted) / prevCompleted) * 100) : 0,
    },
    scanConversion: {
      value: scanConversion,
      change: scanConversion - prevConversion,
    },
    leadsSubmitted: {
      value: currentLeads,
      change: prevLeads > 0 ? Math.round(((currentLeads - prevLeads) / prevLeads) * 100) : 0,
    },
    providerMatchRate: {
      value: providerMatchRate,
      providerFound: currentProviderFound,
      providerNotFound: currentProviderNotFound,
    },
  }
}

async function getDailyOpensData(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const { data } = await supabase
    .from('analytics_events')
    .select('created_at')
    .eq('event_name', 'app_open')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  // Group by day
  const dailyCounts: Record<string, number> = {}
  
  if (data) {
    for (const event of data) {
      const day = new Date(event.created_at).toISOString().split('T')[0]
      dailyCounts[day] = (dailyCounts[day] || 0) + 1
    }
  }

  // Fill in missing days
  const result = []
  const current = new Date(startDate)
  const now = new Date()

  while (current <= now) {
    const day = current.toISOString().split('T')[0]
    result.push({
      date: day,
      opens: dailyCounts[day] || 0,
    })
    current.setDate(current.getDate() + 1)
  }

  return result
}

async function getFunnelData(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const startISO = startDate.toISOString()

  const [started, completed, leads] = await Promise.all([
    supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      .eq('event_name', 'scan_started').gte('created_at', startISO),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      .eq('event_name', 'scan_completed').gte('created_at', startISO),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      .eq('event_name', 'lead_submitted').gte('created_at', startISO),
  ])

  const startedCount = started.count || 0
  const completedCount = completed.count || 0
  const leadsCount = leads.count || 0

  return [
    { 
      stage: 'Scans Started', 
      count: startedCount, 
      percentage: 100 
    },
    { 
      stage: 'Scans Completed', 
      count: completedCount, 
      percentage: startedCount > 0 ? Math.round((completedCount / startedCount) * 100) : 0 
    },
    { 
      stage: 'Leads Submitted', 
      count: leadsCount, 
      percentage: startedCount > 0 ? Math.round((leadsCount / startedCount) * 100) : 0 
    },
  ]
}

async function getLeadSourcesData(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const startISO = startDate.toISOString()

  const [calls, texts, callbacks, google] = await Promise.all([
    supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      .eq('event_name', 'call_initiated').gte('created_at', startISO),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      .eq('event_name', 'text_initiated').gte('created_at', startISO),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      .eq('event_name', 'callback_requested').gte('created_at', startISO),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      .eq('event_name', 'google_search_clicked').gte('created_at', startISO),
  ])

  return [
    { name: 'Call Now', value: calls.count || 0, color: '#10b981' },
    { name: 'Text Now', value: texts.count || 0, color: '#3b82f6' },
    { name: 'Callback Requested', value: callbacks.count || 0, color: '#8b5cf6' },
    { name: 'Google Search', value: google.count || 0, color: '#f59e0b' },
  ]
}

async function getCoverageData(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const startISO = startDate.toISOString()

  const [found, notFound] = await Promise.all([
    supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      .eq('event_name', 'provider_found').gte('created_at', startISO),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true })
      .eq('event_name', 'provider_not_found').gte('created_at', startISO),
  ])

  return [
    { name: 'Provider Found', value: found.count || 0, color: '#10b981' },
    { name: 'No Provider', value: notFound.count || 0, color: '#ef4444' },
  ]
}

async function getCoverageGapsData(
  supabase: Awaited<ReturnType<typeof createServiceClient>>
) {
  const { data } = await supabase
    .from('analytics_events')
    .select('properties, created_at')
    .eq('event_name', 'provider_not_found')
    .order('created_at', { ascending: false })

  if (!data) return []

  // Group by ZIP code
  const zipCounts: Record<string, { count: number; lastRequested: string }> = {}
  
  for (const event of data) {
    const zip = (event.properties as { zip_code?: string })?.zip_code
    if (zip) {
      if (!zipCounts[zip]) {
        zipCounts[zip] = { count: 0, lastRequested: event.created_at }
      }
      zipCounts[zip].count++
    }
  }

  // Convert to array and sort by count
  return Object.entries(zipCounts)
    .map(([zip, data]) => ({
      zipCode: zip,
      requestCount: data.count,
      lastRequested: data.lastRequested,
    }))
    .sort((a, b) => b.requestCount - a.requestCount)
    .slice(0, 50)
}

async function getRecentEventsData(
  supabase: Awaited<ReturnType<typeof createServiceClient>>
) {
  const { data } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return data || []
}

async function getLeadsData(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const { data } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('event_name', 'lead_submitted')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(100)

  return (data || []).map(event => ({
    id: event.id,
    date: event.created_at,
    zipCode: (event.properties as { zip_code?: string })?.zip_code || 'N/A',
    contactType: (event.properties as { contact_type?: string })?.contact_type || 'N/A',
    providerFound: (event.properties as { provider_found?: boolean })?.provider_found || false,
    providerName: (event.properties as { provider_name?: string })?.provider_name || 'N/A',
  }))
}

async function getPlatformData(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const { data } = await supabase
    .from('analytics_events')
    .select('platform')
    .eq('event_name', 'app_open')
    .gte('created_at', startDate.toISOString())

  if (!data) return []

  const counts: Record<string, number> = {}
  for (const event of data) {
    const platform = event.platform || 'Unknown'
    counts[platform] = (counts[platform] || 0) + 1
  }

  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

async function getRoomTypesData(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const { data } = await supabase
    .from('analytics_events')
    .select('properties')
    .eq('event_name', 'scan_started')
    .gte('created_at', startDate.toISOString())

  if (!data) return []

  const counts: Record<string, number> = {}
  for (const event of data) {
    const roomType = (event.properties as { room_type?: string })?.room_type || 'Unknown'
    counts[roomType] = (counts[roomType] || 0) + 1
  }

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

// Response wrapper functions
async function getSummaryMetrics(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date,
  prevStart: Date,
  prevEnd: Date
) {
  const data = await getSummaryData(supabase, startDate, prevStart, prevEnd)
  return NextResponse.json(data)
}

async function getDailyOpens(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const data = await getDailyOpensData(supabase, startDate)
  return NextResponse.json(data)
}

async function getFunnelMetrics(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const data = await getFunnelData(supabase, startDate)
  return NextResponse.json(data)
}

async function getLeadSources(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const data = await getLeadSourcesData(supabase, startDate)
  return NextResponse.json(data)
}

async function getCoverageMetrics(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const data = await getCoverageData(supabase, startDate)
  return NextResponse.json(data)
}

async function getCoverageGaps(
  supabase: Awaited<ReturnType<typeof createServiceClient>>
) {
  const data = await getCoverageGapsData(supabase)
  return NextResponse.json(data)
}

async function getRecentEvents(
  supabase: Awaited<ReturnType<typeof createServiceClient>>
) {
  const data = await getRecentEventsData(supabase)
  return NextResponse.json(data)
}

async function getLeadsTable(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const data = await getLeadsData(supabase, startDate)
  return NextResponse.json(data)
}

async function getPlatformBreakdown(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const data = await getPlatformData(supabase, startDate)
  return NextResponse.json(data)
}

async function getRoomTypes(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  startDate: Date
) {
  const data = await getRoomTypesData(supabase, startDate)
  return NextResponse.json(data)
}

