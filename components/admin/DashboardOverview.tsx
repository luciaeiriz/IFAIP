'use client'

import { useEffect, useState } from 'react'
import { adminFetch } from '@/lib/admin-api-client'

interface DashboardStats {
  totalCourses: number
  totalLeads: number
  totalSignups: number
  totalContactSubmissions: number
  recentSignups: any[]
  recentLeads: any[]
  recentContactSubmissions: any[]
  popularCourses: { course_id: string; count: number; title: string }[]
  signupsByTag: { tag: string; count: number }[]
  topUTMSources: { source: string; count: number }[]
  topUTMMediums: { medium: string; count: number }[]
  topUTMCampaigns: { campaign: string; count: number }[]
  signupsByMonth: { month: string; count: number }[]
  leadsByMonth: { month: string; count: number }[]
  contactByMonth: { month: string; count: number }[]
  recentActivity: {
    signupsToday: number
    signupsThisWeek: number
    membershipsToday: number
    membershipsThisWeek: number
    contactToday: number
    contactThisWeek: number
  }
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Add timestamp to prevent caching
      const timestamp = Date.now()
      const response = await adminFetch(`/api/admin/dashboard?_t=${timestamp}`, {
        cache: 'no-store',
      })
      
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard stats')
      }

      setStats(result.stats)
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error)
      setError(error?.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12 text-gray-600">Loading dashboard...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 font-medium">Error loading dashboard</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recent Activity Summary */}
      {stats?.recentActivity && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.recentActivity.signupsToday}</p>
              <p className="text-xs text-gray-600 mt-1">Signups Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.recentActivity.signupsThisWeek}</p>
              <p className="text-xs text-gray-600 mt-1">Signups This Week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.recentActivity.membershipsToday}</p>
              <p className="text-xs text-gray-600 mt-1">Memberships Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.recentActivity.membershipsThisWeek}</p>
              <p className="text-xs text-gray-600 mt-1">Memberships This Week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.recentActivity.contactToday}</p>
              <p className="text-xs text-gray-600 mt-1">Contact Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.recentActivity.contactThisWeek}</p>
              <p className="text-xs text-gray-600 mt-1">Contact This Week</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Courses"
          value={stats?.totalCourses || 0}
          icon="📚"
          color="blue"
        />
        <StatCard
          title="Total Memberships"
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
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentSignups signups={stats?.recentSignups || []} />
        <RecentMemberships leads={stats?.recentLeads || []} />
        <RecentContactSubmissions submissions={stats?.recentContactSubmissions || []} />
      </div>

      {/* Popular Courses */}
      <div className="grid grid-cols-1 gap-6">
        <PopularCourses courses={stats?.popularCourses || []} />
      </div>

      {/* Analytics Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics & Insights</h2>
        <p className="text-sm text-gray-600 mb-6">
          Complete analytics of all collected data (no filters applied)
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
              const totalSignups = stats.signupsByTag.reduce((sum, t) => sum + t.count, 0)
              const percentage = totalSignups > 0
                ? ((item.count / totalSignups) * 100).toFixed(1)
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

      {/* UTM Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                  <span className="text-sm text-gray-600 font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top UTM Mediums */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top UTM Mediums</h3>
          {stats?.topUTMMediums && stats.topUTMMediums.length === 0 ? (
            <p className="text-sm text-gray-500">No UTM medium data available</p>
          ) : (
            <div className="space-y-2">
              {stats?.topUTMMediums.map((item, index) => (
                <div key={item.medium} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-400 mr-3 w-6">#{index + 1}</span>
                    <span className="text-sm text-gray-900">{item.medium}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top UTM Campaigns */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top UTM Campaigns</h3>
          {stats?.topUTMCampaigns && stats.topUTMCampaigns.length === 0 ? (
            <p className="text-sm text-gray-500">No UTM campaign data available</p>
          ) : (
            <div className="space-y-2">
              {stats?.topUTMCampaigns.map((item, index) => (
                <div key={item.campaign} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-400 mr-3 w-6">#{index + 1}</span>
                    <span className="text-sm text-gray-900">{item.campaign}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Signups Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Signups Trend</h3>
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
                      <span className="text-sm text-gray-600">{item.count}</span>
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

        {/* Memberships Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Memberships Trend</h3>
          {stats?.leadsByMonth && stats.leadsByMonth.length === 0 ? (
            <p className="text-sm text-gray-500">No data available</p>
          ) : (
            <div className="space-y-2">
              {stats?.leadsByMonth.map((item) => {
                const maxCount = Math.max(...(stats.leadsByMonth || []).map(m => m.count))
                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                const monthName = new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                return (
                  <div key={item.month}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{monthName}</span>
                      <span className="text-sm text-gray-600">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Contact Submissions Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Submissions Trend</h3>
          {stats?.contactByMonth && stats.contactByMonth.length === 0 ? (
            <p className="text-sm text-gray-500">No data available</p>
          ) : (
            <div className="space-y-2">
              {stats?.contactByMonth.map((item) => {
                const maxCount = Math.max(...(stats.contactByMonth || []).map(m => m.count))
                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                const monthName = new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                return (
                  <div key={item.month}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{monthName}</span>
                      <span className="text-sm text-gray-600">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
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

function RecentMemberships({ leads }: { leads: any[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Memberships</h3>
      {leads.length === 0 ? (
        <p className="text-sm text-gray-500">No memberships yet</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{lead.email}</p>
                {lead.role && (
                  <p className="text-xs text-gray-500">{lead.role}</p>
                )}
                {lead.landing_tag && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {lead.landing_tag}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(lead.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RecentContactSubmissions({ submissions }: { submissions: any[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Contact Submissions</h3>
      {submissions.length === 0 ? (
        <p className="text-sm text-gray-500">No contact submissions yet</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div key={submission.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{submission.name}</p>
                <p className="text-xs text-gray-500">{submission.email}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">{submission.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(submission.created_at).toLocaleDateString()}
                </p>
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
