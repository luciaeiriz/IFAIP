'use client'

import { useEffect, useState } from 'react'
import { adminFetch } from '@/lib/admin-api-client'

interface Signup {
  id: string
  first_name: string
  last_name: string
  email: string
  course_id: string | null
  landing_tag: string
  source: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  created_at: string
  courses?: { title: string } | null
}

export default function SignupsManagement() {
  const [signups, setSignups] = useState<Signup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterTag, setFilterTag] = useState<string>('all')

  useEffect(() => {
    fetchSignups()
  }, [filterTag])

  const fetchSignups = async () => {
    try {
      setIsLoading(true)
      // Add timestamp to prevent caching
      const timestamp = Date.now()
      const url = filterTag !== 'all' 
        ? `/api/admin/signups?landing_tag=${filterTag}&limit=500&_t=${timestamp}`
        : `/api/admin/signups?limit=500&_t=${timestamp}`
      
      const response = await adminFetch(url, {
        cache: 'no-store',
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch signups')
      }

      console.log('Fetched signups:', result.signups?.length || 0)
      console.log('API Response timestamp:', result.timestamp)
      console.log('Total count from API:', result.count)
      // Force state update even if data appears the same
      setSignups([...(result.signups || [])])
    } catch (error: any) {
      console.error('Error fetching signups:', error)
      alert(`Failed to load signups: ${error?.message || 'Unknown error'}\n\nPlease check the browser console for more details.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Course', 'Landing Tag', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Date'],
      ...signups.map(s => [
        `"${s.first_name} ${s.last_name}"`,
        s.email,
        s.courses?.title || '',
        s.landing_tag,
        s.utm_source || '',
        s.utm_medium || '',
        s.utm_campaign || '',
        new Date(s.created_at).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `signups-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Signups Management</h2>
          <p className="text-sm text-gray-600 mt-1">{signups.length} recent signups</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchSignups()}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh signups"
          >
            {isLoading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
          >
            <option value="all">All Tags</option>
            <option value="Business">Business</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Fleet">Fleet</option>
          </select>
          <button
            onClick={handleExport}
            disabled={signups.length === 0}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-600">Loading signups...</div>
      ) : signups.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No signups found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Landing Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UTM Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {signups.map((signup) => (
                  <tr key={signup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {signup.first_name} {signup.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{signup.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {signup.courses?.title || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {signup.landing_tag}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{signup.utm_source || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(signup.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}


