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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:49',message:'checkAuth entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    try {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:52',message:'before getSession',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const { data: { session } } = await supabase.auth.getSession()
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:54',message:'after getSession',data:{hasSession:!!session,hasUser:!!session?.user},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      if (session) {
        setIsAuthenticated(true)
        // Check admin status
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:58',message:'before isAdminClient',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        const adminStatus = await isAdminClient()
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:60',message:'after isAdminClient',data:{adminStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
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
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:70',message:'checkAuth error',data:{errorMessage:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      console.error('Error checking auth:', error)
      setIsAuthenticated(false)
      setIsAdmin(false)
    } finally {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:73',message:'checkAuth finally block',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
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
