'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getAllCourses } from '@/lib/courses'
import Link from 'next/link'

interface DashboardStats {
  totalCourses: number
  totalLeads: number
  totalSignups: number
  featuredCourses: number
  recentSignups: any[]
  popularCourses: { course_id: string; count: number; title: string }[]
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch courses using getAllCourses to ensure proper transformation
      const allCourses = await getAllCourses()
      const totalCourses = allCourses.length
      const featuredCourses = allCourses.filter(c => c.is_featured).length

      const [leadsRes, signupsRes] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact' }),
        supabase.from('signups').select('id, created_at, course_id', { count: 'exact' })
      ])
      
      // Get recent signups
      const recentSignupsRes = await supabase
        .from('signups')
        .select('*, courses(title)')
        .order('created_at', { ascending: false })
        .limit(5)

      // Get popular courses (by signup count)
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

      setStats({
        totalCourses,
        totalLeads: leadsRes.count || leadsRes.data?.length || 0,
        totalSignups: signupsRes.count || signupsRes.data?.length || 0,
        featuredCourses,
        recentSignups: recentSignupsRes.data || [],
        popularCourses,
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

