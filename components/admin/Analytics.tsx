'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AnalyticsData {
  conversionRate: number
  totalLeads: number
  totalSignups: number
  signupsByTag: { tag: string; count: number }[]
  topUTMSources: { source: string; count: number }[]
  signupsByMonth: { month: string; count: number }[]
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)

      // Get total counts
      const [leadsRes, signupsRes] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact' }),
        supabase.from('signups').select('id', { count: 'exact' })
      ])

      const totalLeads = leadsRes.count || 0
      const totalSignups = signupsRes.count || 0
      const conversionRate = totalLeads > 0 ? (totalSignups / totalLeads) * 100 : 0

      // Get signups by landing tag
      const signupsByTagRes = await supabase
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

      // Get top UTM sources
      const topSourcesRes = await supabase
        .from('signups')
        .select('utm_source')
        .not('utm_source', 'is', null)

      const sourceCounts: Record<string, number> = {}
      topSourcesRes.data?.forEach((item: any) => {
        const source = item.utm_source || 'Unknown'
        sourceCounts[source] = (sourceCounts[source] || 0) + 1
      })

      const topUTMSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Get signups by month (last 6 months)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const signupsByMonthRes = await supabase
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

      setAnalytics({
        conversionRate,
        totalLeads,
        totalSignups,
        signupsByTag,
        topUTMSources,
        signupsByMonth,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12 text-gray-600">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-12 text-gray-600">No analytics data available</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{analytics.conversionRate.toFixed(1)}%</p>
          <p className="mt-1 text-sm text-gray-500">
            {analytics.totalSignups} signups from {analytics.totalLeads} leads
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{analytics.totalLeads}</p>
          <p className="mt-1 text-sm text-gray-500">Email captures</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Total Signups</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{analytics.totalSignups}</p>
          <p className="mt-1 text-sm text-gray-500">Course enrollments</p>
        </div>
      </div>

      {/* Signups by Tag */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Signups by Landing Tag</h3>
        {analytics.signupsByTag.length === 0 ? (
          <p className="text-sm text-gray-500">No data available</p>
        ) : (
          <div className="space-y-3">
            {analytics.signupsByTag.map((item) => {
              const percentage = analytics.totalSignups > 0
                ? ((item.count / analytics.totalSignups) * 100).toFixed(1)
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
        {analytics.topUTMSources.length === 0 ? (
          <p className="text-sm text-gray-500">No UTM source data available</p>
        ) : (
          <div className="space-y-2">
            {analytics.topUTMSources.map((item, index) => (
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
        {analytics.signupsByMonth.length === 0 ? (
          <p className="text-sm text-gray-500">No data available</p>
        ) : (
          <div className="space-y-2">
            {analytics.signupsByMonth.map((item) => {
              const maxCount = Math.max(...analytics.signupsByMonth.map(m => m.count))
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

