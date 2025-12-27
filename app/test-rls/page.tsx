'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestRLSPage() {
  const [results, setResults] = useState<any>({})

  useEffect(() => {
    const testRLS = async () => {
      const tests: any = {}

      // Test 1: Count query
      const { count, error: countError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
      tests.count = { count, error: countError }

      // Test 2: Select all
      const { data: allData, error: allError } = await supabase
        .from('courses')
        .select('*')
        .limit(5)
      tests.selectAll = { data: allData, error: allError, count: allData?.length || 0 }

      // Test 3: Select by tag
      const { data: tagData, error: tagError } = await supabase
        .from('courses')
        .select('*')
        .eq('tag', 'Business')
        .limit(5)
      tests.selectByTag = { data: tagData, error: tagError, count: tagData?.length || 0 }

      // Test 4: Select just IDs (minimal query)
      const { data: idData, error: idError } = await supabase
        .from('courses')
        .select('id')
        .limit(5)
      tests.selectIds = { data: idData, error: idError, count: idData?.length || 0 }

      setResults(tests)
    }

    testRLS()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">RLS Policy Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-2">Test 1: Count Query</h2>
            {results.count?.error ? (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 font-semibold">Error: {results.count.error.message}</p>
                <p className="text-red-600 text-sm">Code: {results.count.error.code}</p>
              </div>
            ) : (
              <p className="text-lg">
                <span className="font-semibold">{results.count?.count ?? 0}</span> courses found
              </p>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Test 2: Select All (limit 5)</h2>
            {results.selectAll?.error ? (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 font-semibold">Error: {results.selectAll.error.message}</p>
                <p className="text-red-600 text-sm">Code: {results.selectAll.error.code}</p>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-2">
                  <span className="font-semibold">{results.selectAll?.count ?? 0}</span> courses returned
                </p>
                {results.selectAll?.data && results.selectAll.data.length > 0 && (
                  <div className="bg-gray-50 rounded p-3">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(results.selectAll.data[0], null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Test 3: Select by Tag (Business)</h2>
            {results.selectByTag?.error ? (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 font-semibold">Error: {results.selectByTag.error.message}</p>
                <p className="text-red-600 text-sm">Code: {results.selectByTag.error.code}</p>
              </div>
            ) : (
              <p className="text-lg">
                <span className="font-semibold">{results.selectByTag?.count ?? 0}</span> Business courses found
              </p>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Test 4: Select Just IDs</h2>
            {results.selectIds?.error ? (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800 font-semibold">Error: {results.selectIds.error.message}</p>
                <p className="text-red-600 text-sm">Code: {results.selectIds.error.code}</p>
              </div>
            ) : (
              <p className="text-lg">
                <span className="font-semibold">{results.selectIds?.count ?? 0}</span> IDs returned
              </p>
            )}
          </div>
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

