'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { isAdminClient } from '@/lib/admin-auth'
import AdminLogin from '@/components/admin/AdminLogin'
import DashboardOverview from '@/components/admin/DashboardOverview'
import CourseManagement from '@/components/admin/CourseManagement'
import LeadsManagement from '@/components/admin/LeadsManagement'
import SignupsManagement from '@/components/admin/SignupsManagement'
import LandingPageManagement from '@/components/admin/LandingPageManagement'
import NewsManagement from '@/components/admin/NewsManagement'

type AdminTab = 'dashboard' | 'courses' | 'landing-pages' | 'leads' | 'signups' | 'news'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setIsAuthenticated(true)
        // Check admin status when session changes
        const adminStatus = await isAdminClient()
        setIsAdmin(adminStatus)
        // If user is authenticated but not admin, sign them out
        if (!adminStatus) {
          await supabase.auth.signOut()
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
        setIsAdmin(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
        // Check admin status
        const adminStatus = await isAdminClient()
        setIsAdmin(adminStatus)
        // If user is authenticated but not admin, sign them out
        if (!adminStatus) {
          await supabase.auth.signOut()
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Error checking auth:', {
        error: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
      })
      setIsAuthenticated(false)
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = async () => {
    // Verify admin status after login
    const adminStatus = await isAdminClient()
    if (adminStatus) {
      setIsAuthenticated(true)
      setIsAdmin(true)
    } else {
      // User logged in but is not an admin
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      setIsAdmin(false)
      alert('Access denied. You do not have admin privileges.')
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      setIsAdmin(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#36498C] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: '📊' },
    { id: 'courses' as AdminTab, label: 'Courses', icon: '📚' },
    { id: 'landing-pages' as AdminTab, label: 'Landing Pages', icon: '🎨' },
    { id: 'news' as AdminTab, label: 'News', icon: '📰' },
    { id: 'leads' as AdminTab, label: 'Leads', icon: '👥' },
    { id: 'signups' as AdminTab, label: 'Signups', icon: '✅' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 border-t border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#36498C] text-[#36498C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'courses' && <CourseManagement />}
        {activeTab === 'landing-pages' && <LandingPageManagement />}
        {activeTab === 'news' && <NewsManagement />}
        {activeTab === 'leads' && <LeadsManagement />}
        {activeTab === 'signups' && <SignupsManagement />}
      </div>
    </div>
  )
}
