'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Lead {
  id: string
  email: string
  role: string | null
  landing_tag: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  created_at: string
}

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterTag, setFilterTag] = useState<string>('all')

  useEffect(() => {
    fetchLeads()
  }, [filterTag])

  const fetchLeads = async () => {
    try {
      setIsLoading(true)
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)

      if (filterTag !== 'all') {
        query = query.eq('landing_tag', filterTag)
      }

      const { data, error } = await query

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
      alert('Failed to load leads. Please check the console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    const csv = [
      ['Email', 'Role', 'Landing Tag', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Date'],
      ...leads.map(l => [
        l.email,
        l.role || '',
        l.landing_tag,
        l.utm_source || '',
        l.utm_medium || '',
        l.utm_campaign || '',
        new Date(l.created_at).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
          <p className="text-sm text-gray-600 mt-1">{leads.length} total leads</p>
        </div>
        <div className="flex gap-2">
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
            disabled={leads.length === 0}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-600">Loading leads...</div>
      ) : leads.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No leads found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Landing Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UTM Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UTM Medium
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UTM Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.role || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {lead.landing_tag}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.utm_source || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.utm_medium || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.utm_campaign || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
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


