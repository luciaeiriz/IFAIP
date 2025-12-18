'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDBPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing Supabase connection...')
        console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
        console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')

        // Test 1: Simple count query
        const { count, error: countError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })

        console.log('Count query result:', { count, error: countError })

        // Test 2: Fetch one row
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .limit(1)

        console.log('Fetch query result:', { data, error })

        // Test 3: Get table schema info
        const { data: schemaData, error: schemaError } = await supabase
          .from('courses')
          .select('*')
          .limit(0)

        console.log('Schema query result:', { schemaData, schemaError })

        setResult({
          count,
          countError: countError ? { message: countError.message, code: countError.code } : null,
          sampleData: data?.[0] || null,
          fetchError: error ? { message: error.message, code: error.code } : null,
          columns: data?.[0] ? Object.keys(data[0]) : [],
        })
      } catch (err: any) {
        console.error('Test failed:', err)
        setResult({ error: err.message })
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Testing Database Connection...</h1>
          <p>Check the browser console for detailed logs.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-lg mb-2">Connection Status</h2>
            <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
            <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Course Count</h2>
            {result?.countError ? (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 font-semibold">Error: {result.countError.message}</p>
                <p className="text-red-600 text-sm">Code: {result.countError.code}</p>
              </div>
            ) : (
              <p className="text-lg">
                <span className="font-semibold">{result?.count ?? 0}</span> courses found
              </p>
            )}
          </div>

          {result?.fetchError && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Fetch Error</h2>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 font-semibold">Error: {result.fetchError.message}</p>
                <p className="text-red-600 text-sm">Code: {result.fetchError.code}</p>
              </div>
            </div>
          )}

          {result?.sampleData && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Sample Course Data</h2>
              <div className="bg-gray-50 rounded p-3">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(result.sampleData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {result?.columns && result.columns.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Column Names</h2>
              <div className="flex flex-wrap gap-2">
                {result.columns.map((col: string) => (
                  <span key={col} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result?.error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-800 font-semibold">Exception: {result.error}</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Check the browser console (F12) for detailed logs.
          </p>
        </div>
      </div>
    </div>
  )
}

