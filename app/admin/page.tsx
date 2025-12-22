'use client'

import { useState } from 'react'
import DashboardOverview from '@/components/admin/DashboardOverview'
import CourseManagement from '@/components/admin/CourseManagement'
import LeadsManagement from '@/components/admin/LeadsManagement'
import SignupsManagement from '@/components/admin/SignupsManagement'
import Analytics from '@/components/admin/Analytics'

type AdminTab = 'dashboard' | 'courses' | 'leads' | 'signups' | 'analytics'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: '📊' },
    { id: 'courses' as AdminTab, label: 'Courses', icon: '📚' },
    { id: 'leads' as AdminTab, label: 'Leads', icon: '👥' },
    { id: 'signups' as AdminTab, label: 'Signups', icon: '✅' },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: '📈' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
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
        {activeTab === 'leads' && <LeadsManagement />}
        {activeTab === 'signups' && <SignupsManagement />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  )
}
