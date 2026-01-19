'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getAllCourses } from '@/lib/courses'

interface DashboardStats {
  totalCourses: number
  totalLeads: number
  totalSignups: number
  totalContactSubmissions: number
  recentSignups: any[]
  popularCourses: { course_id: string; count: number; title: string }[]
  signupsByTag: { tag: string; count: number }[]
  topUTMSources: { source: string; count: number }[]
  signupsByMonth: { month: string; count: number }[]
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  // Helper function to get all visible course IDs for a tag (top 10 by relevancy)
  const getVisibleCourseIds = async (tag: string): Promise<string[]> => {
    const relevancyColumn = tag === 'Business' 
      ? 'business_relevancy' 
      : tag === 'Restaurant' 
      ? 'restaurant_relevancy' 
      : 'fleet_relevancy'
    
    // Get top 10 courses by relevancy (no tag or signup_enabled filter)
    const { data } = await supabase
      .from('courses')
      .select('id')
      .order(relevancyColumn, { ascending: true, nullsFirst: false })
      .limit(10)
    
    return (data || []).map(course => course.id)
  }

  const fetchStats = async () => {
    try {
      // Fetch courses using getAllCourses to ensure proper transformation
      const allCourses = await getAllCourses()
      const totalCourses = allCourses.length

      // Get all leads, signups, and contact submissions (not filtered)
      const [leadsRes, signupsRes, contactRes] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact' }),
        supabase.from('signups').select('id, created_at, course_id', { count: 'exact' }),
        supabase.from('contact_submissions').select('id', { count: 'exact' })
      ])
      
      const totalLeads = leadsRes.count || leadsRes.data?.length || 0
      const totalSignups = signupsRes.count || signupsRes.data?.length || 0
      const totalContactSubmissions = contactRes.count || contactRes.data?.length || 0
      
      // Get recent signups
      const recentSignupsRes = await supabase
        .from('signups')
        .select('*, courses(title)')
        .order('created_at', { ascending: false })
        .limit(5)

      // Get popular courses (by signup count) - all signups
      const signupsWithCourses = await supabase
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

      // Get visible course IDs for analytics (top 10 per tag)
      const [businessCourseIds, restaurantCourseIds, fleetCourseIds] = await Promise.all([
        getVisibleCourseIds('Business'),
        getVisibleCourseIds('Restaurant'),
        getVisibleCourseIds('Fleet'),
      ])

      const visibleCourseIds = [...businessCourseIds, ...restaurantCourseIds, ...fleetCourseIds]

      // Get signups by landing tag (only for visible courses)
      let signupsByTagRes
      if (visibleCourseIds.length > 0) {
        signupsByTagRes = await supabase
          .from('signups')
          .select('landing_tag, course_id')
          .in('course_id', visibleCourseIds)
      } else {
        signupsByTagRes = { data: [], error: null }
      }

      const tagCounts: Record<string, number> = {}
      signupsByTagRes.data?.forEach((item: any) => {
        const tag = item.landing_tag || 'Unknown'
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })

      const signupsByTag = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)

      // Get top UTM sources (only for visible courses)
      let topSourcesRes
      if (visibleCourseIds.length > 0) {
        topSourcesRes = await supabase
          .from('signups')
          .select('utm_source, course_id')
          .in('course_id', visibleCourseIds)
          .not('utm_source', 'is', null)
      } else {
        topSourcesRes = { data: [], error: null }
      }

      const sourceCounts: Record<string, number> = {}
      topSourcesRes.data?.forEach((item: any) => {
        const source = item.utm_source || 'Unknown'
        sourceCounts[source] = (sourceCounts[source] || 0) + 1
      })

      const topUTMSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Get signups by month (last 6 months, only for visible courses)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      let signupsByMonthRes
      if (visibleCourseIds.length > 0) {
        signupsByMonthRes = await supabase
          .from('signups')
          .select('created_at, course_id')
          .in('course_id', visibleCourseIds)
          .gte('created_at', sixMonthsAgo.toISOString())
      } else {
        signupsByMonthRes = { data: [], error: null }
      }

      const monthCounts: Record<string, number> = {}
      signupsByMonthRes.data?.forEach((item: any) => {
        const date = new Date(item.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
      })

      const signupsByMonth = Object.entries(monthCounts)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month))

      setStats({
        totalCourses,
        totalLeads,
        totalSignups,
        totalContactSubmissions,
        recentSignups: recentSignupsRes.data || [],
        popularCourses,
        signupsByTag,
        topUTMSources,
        signupsByMonth,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12 text-gray-600">Loading dashboard...</div>
  }

  const conversionRate = stats && stats.totalLeads > 0
    ? ((stats.totalSignups / stats.totalLeads) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Courses"
          value={stats?.totalCourses || 0}
          icon="📚"
          color="blue"
        />
        <StatCard
          title="Total Leads"
          value={stats?.totalLeads || 0}
          icon="👥"
          color="green"
        />
        <StatCard
          title="Total Signups"
          value={stats?.totalSignups || 0}
          icon="✅"
          color="purple"
        />
        <StatCard
          title="Contact Submissions"
          value={stats?.totalContactSubmissions || 0}
          icon="📧"
          color="orange"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon="📈"
          color="yellow"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentSignups signups={stats?.recentSignups || []} />
        <PopularCourses courses={stats?.popularCourses || []} />
      </div>

      {/* Analytics Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics & Insights</h2>
        <p className="text-sm text-gray-600 mb-6">
          Analytics of all courses
        </p>
      </div>

      {/* Signups by Tag */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Signups by Landing Tag</h3>
        {stats?.signupsByTag && stats.signupsByTag.length === 0 ? (
          <p className="text-sm text-gray-500">No data available</p>
        ) : (
          <div className="space-y-3">
            {stats?.signupsByTag.map((item) => {
              const totalVisibleSignups = stats.signupsByTag.reduce((sum, t) => sum + t.count, 0)
              const percentage = totalVisibleSignups > 0
                ? ((item.count / totalVisibleSignups) * 100).toFixed(1)
                : 0
              return (
                <div key={item.tag}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.tag}</span>
                    <span className="text-sm text-gray-600">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#36498C] h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Top UTM Sources */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top UTM Sources</h3>
        {stats?.topUTMSources && stats.topUTMSources.length === 0 ? (
          <p className="text-sm text-gray-500">No UTM source data available</p>
        ) : (
          <div className="space-y-2">
            {stats?.topUTMSources.map((item, index) => (
              <div key={item.source} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-400 mr-3 w-6">#{index + 1}</span>
                  <span className="text-sm text-gray-900">{item.source}</span>
                </div>
                <span className="text-sm text-gray-600 font-medium">{item.count} signups</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signups by Month */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Signups Trend (Last 6 Months)</h3>
        {stats?.signupsByMonth && stats.signupsByMonth.length === 0 ? (
          <p className="text-sm text-gray-500">No data available</p>
        ) : (
          <div className="space-y-2">
            {stats?.signupsByMonth.map((item) => {
              const maxCount = Math.max(...(stats.signupsByMonth || []).map(m => m.count))
              const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
              const monthName = new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              return (
                <div key={item.month}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{monthName}</span>
                    <span className="text-sm text-gray-600">{item.count} signups</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#34B682] h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}

function RecentSignups({ signups }: { signups: any[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Signups</h3>
      {signups.length === 0 ? (
        <p className="text-sm text-gray-500">No signups yet</p>
      ) : (
        <div className="space-y-3">
          {signups.map((signup) => (
            <div key={signup.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {signup.first_name} {signup.last_name}
                </p>
                <p className="text-xs text-gray-500">{signup.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(signup.created_at).toLocaleDateString()}
                </p>
                {signup.courses?.title && (
                  <p className="text-xs text-gray-400 mt-1">{signup.courses.title}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PopularCourses({ courses }: { courses: { course_id: string; count: number; title: string }[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Courses</h3>
      {courses.length === 0 ? (
        <p className="text-sm text-gray-500">No signup data yet</p>
      ) : (
        <div className="space-y-3">
          {courses.map((course, index) => (
            <div key={course.course_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-400 mr-3 w-6">#{index + 1}</span>
                <p className="text-sm font-medium text-gray-900">{course.title}</p>
              </div>
              <span className="text-sm text-gray-600 font-medium">{course.count} signups</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
