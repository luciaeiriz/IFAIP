'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { adminFetch } from '@/lib/admin-api-client'

interface AdminLoginProps {
  onLoginSuccess: () => void
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message || 'Invalid email or password')
        setIsLoading(false)
        return
      }

      if (data.user && data.session?.access_token) {
        // Check if user is admin before allowing access
        // Use the session we just got from signInWithPassword to avoid another getSession() call
        // Add timeout to prevent hanging
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
        
        let response: Response
        try {
          response = await fetch('/api/admin/check-status', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.session.access_token}`,
            },
            credentials: 'include',
            signal: controller.signal,
          })
          clearTimeout(timeoutId)
        } catch (fetchError: any) {
          clearTimeout(timeoutId)
          if (fetchError.name === 'AbortError') {
            setError('Admin verification timed out. Please check your connection and try again.')
            setIsLoading(false)
            return
          }
          throw fetchError
        }

        if (!response.ok) {
          // Error checking admin status - sign out for safety
          await supabase.auth.signOut()
          setError('Error verifying admin status. Please try again.')
          setIsLoading(false)
          return
        }

        const { isAdmin } = await response.json()

        if (!isAdmin) {
          // User is not an admin - sign them out immediately
          await supabase.auth.signOut()
          setError('Access denied. You do not have admin privileges.')
          setIsLoading(false)
          return
        }

        // User is confirmed admin - proceed with login
        onLoginSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#36498C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#36498C]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}


