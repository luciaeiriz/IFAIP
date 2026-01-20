import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    // Fetch all courses using admin client (bypasses RLS)
    const coursesRes = await supabaseAdmin
      .from('courses')
      .select('id', { count: 'exact' })
    
    const totalCourses = coursesRes.count || coursesRes.data?.length || 0

    // Get all leads, signups, and contact submissions (no filtering)
    const [leadsRes, signupsRes, contactRes] = await Promise.all([
      supabaseAdmin.from('leads').select('*', { count: 'exact' }),
      supabaseAdmin.from('signups').select('*', { count: 'exact' }),
      supabaseAdmin.from('contact_submissions').select('*', { count: 'exact' })
    ])
    
    const totalLeads = leadsRes.count || leadsRes.data?.length || 0
    const totalSignups = signupsRes.count || signupsRes.data?.length || 0
    const totalContactSubmissions = contactRes.count || contactRes.data?.length || 0
    
    // Get recent signups (all signups, not filtered)
    const recentSignupsRes = await supabaseAdmin
      .from('signups')
      .select('*, courses(title)')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent memberships/leads
    const recentLeadsRes = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent contact submissions
    const recentContactRes = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get popular courses (by signup count) - ALL signups
    const signupsWithCourses = await supabaseAdmin
      .from('signups')
      .select('course_id, courses(title)')
      .not('course_id', 'is', null)

    // Process popular courses
    const courseCounts: Record<string, { count: number; title: string }> = {}
    signupsWithCourses.data?.forEach((item: any) => {
      if (item.course_id) {
        if (!courseCounts[item.course_id]) {
          courseCounts[item.course_id] = {
            count: 0,
            title: item.courses?.title || 'Unknown Course'
          }
        }
        courseCounts[item.course_id].count++
      }
    })

    const popularCourses = Object.entries(courseCounts)
      .map(([course_id, data]) => ({ course_id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Get signups by landing tag (ALL signups, not filtered by visible courses)
    const signupsByTagRes = await supabaseAdmin
      .from('signups')
      .select('landing_tag')

    const tagCounts: Record<string, number> = {}
    signupsByTagRes.data?.forEach((item: any) => {
      const tag = item.landing_tag || 'Unknown'
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })

    const signupsByTag = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)

    // Get leads by landing tag (ALL leads/memberships)
    const leadsByTagRes = await supabaseAdmin
      .from('leads')
      .select('landing_tag')

    const leadsTagCounts: Record<string, number> = {}
    leadsByTagRes.data?.forEach((item: any) => {
      const tag = item.landing_tag || 'Unknown'
      leadsTagCounts[tag] = (leadsTagCounts[tag] || 0) + 1
    })

    // Get UTM data from all sources (signups, leads, contact submissions) for combined analytics
    const [signupsUTMRes, leadsUTMRes, contactUTMRes] = await Promise.all([
      supabaseAdmin.from('signups').select('utm_source, utm_medium, utm_campaign'),
      supabaseAdmin.from('leads').select('utm_source, utm_medium, utm_campaign'),
      supabaseAdmin.from('contact_submissions').select('utm_source, utm_medium, utm_campaign')
    ])

    // Combine all UTM sources
    const combinedSourceCounts: Record<string, number> = {}
    const combinedMediumCounts: Record<string, number> = {}
    const combinedCampaignCounts: Record<string, number> = {}

    const processUTMData = (items: any[]) => {
      items?.forEach((item: any) => {
        if (item.utm_source) {
          combinedSourceCounts[item.utm_source] = (combinedSourceCounts[item.utm_source] || 0) + 1
        }
        if (item.utm_medium) {
          combinedMediumCounts[item.utm_medium] = (combinedMediumCounts[item.utm_medium] || 0) + 1
        }
        if (item.utm_campaign) {
          combinedCampaignCounts[item.utm_campaign] = (combinedCampaignCounts[item.utm_campaign] || 0) + 1
        }
      })
    }

    processUTMData(signupsUTMRes.data || [])
    processUTMData(leadsUTMRes.data || [])
    processUTMData(contactUTMRes.data || [])

    const topUTMSources = Object.entries(combinedSourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const topUTMMediums = Object.entries(combinedMediumCounts)
      .map(([medium, count]) => ({ medium, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const topUTMCampaigns = Object.entries(combinedCampaignCounts)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Get signups by month (last 6 months, ALL signups)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const signupsByMonthRes = await supabaseAdmin
      .from('signups')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString())

    const monthCounts: Record<string, number> = {}
    signupsByMonthRes.data?.forEach((item: any) => {
      const date = new Date(item.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
    })

    const signupsByMonth = Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Get leads/memberships by month (last 6 months, ALL leads)
    const leadsByMonthRes = await supabaseAdmin
      .from('leads')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString())

    const leadsMonthCounts: Record<string, number> = {}
    leadsByMonthRes.data?.forEach((item: any) => {
      const date = new Date(item.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      leadsMonthCounts[monthKey] = (leadsMonthCounts[monthKey] || 0) + 1
    })

    const leadsByMonth = Object.entries(leadsMonthCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Get contact submissions by month (last 6 months)
    const contactByMonthRes = await supabaseAdmin
      .from('contact_submissions')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString())

    const contactMonthCounts: Record<string, number> = {}
    contactByMonthRes.data?.forEach((item: any) => {
      const date = new Date(item.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      contactMonthCounts[monthKey] = (contactMonthCounts[monthKey] || 0) + 1
    })

    const contactByMonth = Object.entries(contactMonthCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Calculate recent activity (today and this week)
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0)

    const [todaySignupsRes, weekSignupsRes, todayLeadsRes, weekLeadsRes, todayContactRes, weekContactRes] = await Promise.all([
      supabaseAdmin.from('signups').select('id', { count: 'exact' }).gte('created_at', startOfToday.toISOString()),
      supabaseAdmin.from('signups').select('id', { count: 'exact' }).gte('created_at', startOfWeek.toISOString()),
      supabaseAdmin.from('leads').select('id', { count: 'exact' }).gte('created_at', startOfToday.toISOString()),
      supabaseAdmin.from('leads').select('id', { count: 'exact' }).gte('created_at', startOfWeek.toISOString()),
      supabaseAdmin.from('contact_submissions').select('id', { count: 'exact' }).gte('created_at', startOfToday.toISOString()),
      supabaseAdmin.from('contact_submissions').select('id', { count: 'exact' }).gte('created_at', startOfWeek.toISOString())
    ])

    const recentActivity = {
      signupsToday: todaySignupsRes.count || 0,
      signupsThisWeek: weekSignupsRes.count || 0,
      membershipsToday: todayLeadsRes.count || 0,
      membershipsThisWeek: weekLeadsRes.count || 0,
      contactToday: todayContactRes.count || 0,
      contactThisWeek: weekContactRes.count || 0,
    }

    const response = NextResponse.json({
      success: true,
      stats: {
        totalCourses,
        totalLeads,
        totalSignups,
        totalContactSubmissions,
        recentSignups: recentSignupsRes.data || [],
        recentLeads: recentLeadsRes.data || [],
        recentContactSubmissions: recentContactRes.data || [],
        popularCourses,
        signupsByTag,
        topUTMSources,
        topUTMMediums,
        topUTMCampaigns,
        signupsByMonth,
        leadsByMonth,
        contactByMonth,
        recentActivity,
      },
      timestamp: new Date().toISOString(),
    })
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
