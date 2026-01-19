'use client'

import { useEffect, useState } from 'react'
import { adminFetch } from '@/lib/admin-api-client'

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  created_at: string
}

export default function ContactSubmissionsManagement() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching contact submissions...')
      const response = await adminFetch('/api/admin/contact-submissions')
      
      console.log('Response status:', response.status, response.statusText)
      
      const result = await response.json()
      console.log('Response data:', result)

      if (!response.ok) {
        console.error('API returned error status:', response.status, result)
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      if (!result.success) {
        console.error('API returned success:false:', result)
        throw new Error(result.error || 'Failed to fetch contact submissions')
      }

      const submissionsData = result.submissions || []
      console.log('Fetched contact submissions:', submissionsData.length, 'items')
      console.log('Sample submission:', submissionsData[0])
      
      // Store debug info
      setDebugInfo({
        count: submissionsData.length,
        totalCount: result.count,
        sample: submissionsData[0],
        allData: submissionsData
      })
      
      setSubmissions(submissionsData)
    } catch (error: any) {
      console.error('Error fetching contact submissions:', error)
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      })
      const errorMessage = error?.message || 'Unknown error'
      alert(`Failed to load contact submissions.\n\nError: ${errorMessage}\n\nPlease check:\n1. Has the migration been run in Supabase?\n2. Check browser console for more details.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) {
      return
    }

    try {
      const response = await adminFetch(`/api/admin/contact-submissions/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete contact submission')
      }

      fetchSubmissions()
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null)
      }
    } catch (error: any) {
      console.error('Error deleting contact submission:', error)
      alert(`Failed to delete contact submission: ${error?.message || 'Unknown error'}`)
    }
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Subject', 'Message', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Date'],
      ...submissions.map(s => [
        `"${s.name}"`,
        s.email,
        `"${s.subject}"`,
        `"${s.message.replace(/"/g, '""')}"`,
        s.utm_source || '',
        s.utm_medium || '',
        s.utm_campaign || '',
        new Date(s.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Submissions</h2>
          <p className="text-sm text-gray-600 mt-1">{submissions.length} total submissions</p>
        </div>
        <button
          onClick={handleExport}
          disabled={submissions.length === 0}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-600">Loading contact submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center mb-4">
            <p className="text-gray-600">No contact submissions found</p>
          </div>
          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded text-xs">
              <p className="font-semibold mb-2">Debug Info:</p>
              <p>Count from API: {debugInfo.count}</p>
              <p>Total count: {debugInfo.totalCount}</p>
              {debugInfo.sample && (
                <div className="mt-2">
                  <p className="font-semibold">Sample data:</p>
                  <pre className="mt-1 overflow-auto">{JSON.stringify(debugInfo.sample, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List View */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr 
                      key={submission.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedSubmission?.id === submission.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {submission.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{submission.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(submission.id)
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail View */}
          <div className="lg:col-span-1">
            {selectedSubmission ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Submission Details</h3>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                    <p className="mt-1 text-sm text-gray-900">
                      <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:underline">
                        {selectedSubmission.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Subject</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSubmission.subject}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Message</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>
                  {(selectedSubmission.utm_source || selectedSubmission.utm_medium || selectedSubmission.utm_campaign) && (
                    <div className="pt-4 border-t border-gray-200">
                      <label className="text-xs font-medium text-gray-500 uppercase">UTM Parameters</label>
                      <div className="mt-2 space-y-1">
                        {selectedSubmission.utm_source && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Source:</span> {selectedSubmission.utm_source}
                          </p>
                        )}
                        {selectedSubmission.utm_medium && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Medium:</span> {selectedSubmission.utm_medium}
                          </p>
                        )}
                        {selectedSubmission.utm_campaign && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Campaign:</span> {selectedSubmission.utm_campaign}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(selectedSubmission.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-sm">Select a submission to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
