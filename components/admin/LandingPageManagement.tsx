'use client'

import { useState, useEffect } from 'react'
import { Course } from '@/types/course'
import { getCoursesByTag } from '@/src/data/courses'
import { LandingPage } from '@/lib/landing-pages'

export default function LandingPageManagement() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [selectedLandingPage, setSelectedLandingPage] = useState<LandingPage | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingLandingPage, setEditingLandingPage] = useState<LandingPage | null>(null)

  useEffect(() => {
    fetchLandingPages()
  }, [])

  useEffect(() => {
    if (selectedLandingPage) {
      fetchCourses()
    }
  }, [selectedLandingPage])

  const fetchLandingPages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/landing-pages')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to fetch landing pages'
        
        // If table doesn't exist, show helpful message
        if (errorMessage.includes('schema cache') || errorMessage.includes('does not exist') || errorMessage.includes('migrations')) {
          alert('⚠️ Database migrations need to be run. Please run the migrations in supabase/migrations/ to create the landing_pages table.')
          setLandingPages([])
          return
        }
        
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      
      // Check for migration message
      if (data.message && data.message.includes('migrations')) {
        console.warn('⚠️', data.message)
      }
      
      // Debug: Log what we received
      if (data.landingPages) {
        console.log('📋 fetchLandingPages: Received landing pages:', data.landingPages.length)
        data.landingPages.forEach((page: any) => {
          if (page.tag === 'healthcare') {
            console.log('🏥 Healthcare page from fetch:', {
              id: page.id,
              name: page.name,
              description: page.description,
              descriptionType: typeof page.description,
              descriptionLength: page.description?.length || 0
            })
          }
        })
      }
      
      setLandingPages(data.landingPages || [])
      
      // Auto-select first landing page if none selected
      if (!selectedLandingPage && data.landingPages && data.landingPages.length > 0) {
        setSelectedLandingPage(data.landingPages[0])
      }
    } catch (error) {
      console.error('Error fetching landing pages:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load landing pages'
      alert(`Failed to load landing pages: ${errorMessage}`)
      setLandingPages([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCourses = async () => {
    if (!selectedLandingPage) return
    
    try {
      setIsLoading(true)
      const fetchedCourses = await getCoursesByTag(selectedLandingPage.tag)
      setCourses(fetchedCourses)
    } catch (error) {
      console.error('❌ Error fetching courses:', error)
      setCourses([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleEnabled = async (landingPage: LandingPage) => {
    try {
      const newValue = !landingPage.is_enabled
      console.log(`🔄 Toggle: ${landingPage.name} - Current: ${landingPage.is_enabled}, New: ${newValue}`)
      
      const response = await fetch('/api/admin/landing-pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: landingPage.id,
          isEnabled: newValue,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update landing page')
      }

      const updated = await response.json()
      console.log(`✅ Toggle: ${landingPage.name} - Update successful, new is_enabled: ${updated.landingPage?.is_enabled}`)
      
      // Wait a moment to ensure database transaction commits before refreshing
      await new Promise(resolve => setTimeout(resolve, 500))
      
      await fetchLandingPages()
      
      // Update selected landing page if it's the one being toggled
      if (selectedLandingPage?.id === landingPage.id) {
        setSelectedLandingPage(updated.landingPage)
      }
    } catch (error: any) {
      console.error('❌ Error toggling landing page:', error)
      alert(`Failed to update landing page: ${error.message}`)
    }
  }

  const handleDelete = async (landingPage: LandingPage, force: boolean = false) => {
    const confirmMessage = force
      ? `⚠️ FORCE DELETE: Are you sure you want to permanently delete "${landingPage.name}"? This will delete the landing page even though courses have relevancy scores. This action cannot be undone!`
      : `Are you sure you want to delete the "${landingPage.name}" landing page? This action cannot be undone.`
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      const url = force
        ? `/api/admin/landing-pages/${landingPage.id}?force=true`
        : `/api/admin/landing-pages/${landingPage.id}`
      
      const response = await fetch(url, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        
        // If deletion failed due to courses, offer force delete option
        if (error.courseCount && !force) {
          const shouldForce = confirm(
            `Cannot delete: ${error.courseCount} courses have relevancy scores for this landing page.\n\n` +
            `Do you want to FORCE DELETE it anyway? This will permanently delete the landing page and you'll lose the relevancy data.`
          )
          
          if (shouldForce) {
            // Retry with force=true
            return handleDelete(landingPage, true)
          }
          return
        }
        
        throw new Error(error.error || 'Failed to delete landing page')
      }

      console.log(`✅ Delete successful, refreshing landing pages list...`)
      await fetchLandingPages()
      
      // Clear selection if deleted page was selected
      if (selectedLandingPage?.id === landingPage.id) {
        setSelectedLandingPage(null)
        setCourses([])
      }
      
      alert(force 
        ? 'Landing page force deleted successfully. Relevancy scores have been cleared.'
        : 'Landing page deleted successfully. Relevancy scores have been cleared.'
      )
      
      // Force a page refresh to ensure UI updates immediately
      // This helps ensure the deleted page disappears from all views
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error: any) {
      console.error('Error deleting landing page:', error)
      alert(`Failed to delete landing page: ${error.message}`)
    }
  }

  const handleRankCourses = async (landingPage: LandingPage) => {
    if (!confirm(`This will re-rank all courses for "${landingPage.name}". This may take a few minutes. Continue?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/landing-pages/${landingPage.tag}/rank-courses`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to rank courses')
      }

      const result = await response.json()
      alert(`Successfully ranked ${result.ranked} courses!`)
      
      // Refresh courses if this is the selected landing page
      if (selectedLandingPage?.id === landingPage.id) {
        await fetchCourses()
      }
    } catch (error: any) {
      console.error('Error ranking courses:', error)
      alert(`Failed to rank courses: ${error.message}`)
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0 || isSaving || !selectedLandingPage) return
    
    const newCourses = [...courses]
    const temp = newCourses[index]
    newCourses[index] = newCourses[index - 1]
    newCourses[index - 1] = temp
    
    await saveOrder(newCourses)
  }

  const handleMoveDown = async (index: number) => {
    if (index === courses.length - 1 || isSaving || !selectedLandingPage) return
    
    const newCourses = [...courses]
    const temp = newCourses[index]
    newCourses[index] = newCourses[index + 1]
    newCourses[index + 1] = temp
    
    await saveOrder(newCourses)
  }

  const saveOrder = async (newCourses: Course[]) => {
    if (!selectedLandingPage) return

    try {
      setIsSaving(true)
      
      const response = await fetch('/api/admin/courses/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tag: selectedLandingPage.tag,
          courses: newCourses.map((course, index) => ({
            id: course.id,
            position: index + 1
          }))
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update order')
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      await fetchCourses()
      
      alert('Order updated successfully! The course pages will now show courses in this order.')
    } catch (error) {
      console.error('❌ Error saving order:', error)
      alert(`Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveLandingPage = async (formData: any) => {
    try {
      // Debug: Log what we're sending
      console.log('💾 Saving landing page with formData:', formData)
      console.log('  - description:', formData.description, `(type: ${typeof formData.description}, length: ${formData.description?.length || 0})`)
      console.log('  - description in formData?', 'description' in formData)
      
      let response
      if (editingLandingPage) {
        // Ensure description is always included in the payload (even if empty string)
        const updatePayload = { 
          id: editingLandingPage.id, 
          ...formData,
          // Explicitly ensure description is included
          description: formData.description !== undefined ? formData.description : ''
        }
        console.log('📤 PUT request payload:', updatePayload)
        console.log('📤 PUT payload description field:', {
          value: updatePayload.description,
          type: typeof updatePayload.description,
          length: updatePayload.description?.length || 0,
          isEmpty: !updatePayload.description || (typeof updatePayload.description === 'string' && updatePayload.description.trim() === '')
        })
        response = await fetch('/api/admin/landing-pages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        })
      } else {
        // Ensure description is always included in POST payload too
        const postPayload = {
          ...formData,
          description: formData.description !== undefined ? formData.description : ''
        }
        console.log('📤 POST request payload:', postPayload)
        response = await fetch('/api/admin/landing-pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postPayload),
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save landing page')
      }

      const result = await response.json()
      console.log('✅ Save response:', result)
      console.log('✅ Save response landingPage:', result.landingPage)
      if (result.landingPage) {
        console.log('✅ Save response description:', {
          description: result.landingPage.description,
          descriptionType: typeof result.landingPage.description,
          descriptionLength: result.landingPage.description?.length || 0
        })
      }
      
      await fetchLandingPages()
      setShowCreateForm(false)
      setEditingLandingPage(null)
      
      if (!editingLandingPage) {
        setSelectedLandingPage(result.landingPage)
      }
    } catch (error: any) {
      console.error('Error saving landing page:', error)
      alert(`Failed to save landing page: ${error.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Landing Page Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage course landing pages
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLandingPage(null)
            setShowCreateForm(true)
          }}
          className="rounded-lg bg-[#36498C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#36498C]/90"
        >
          Create New Landing Page
        </button>
      </div>

      {/* Landing Pages List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Landing Pages</h3>
        {isLoading && landingPages.length === 0 ? (
          <div className="text-center py-8 text-gray-600">Loading landing pages...</div>
        ) : landingPages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No landing pages found. Create your first one above.
          </div>
        ) : (
          <div className="space-y-3">
            {landingPages.map((page) => (
              <div
                key={page.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  selectedLandingPage?.id === page.id ? 'border-[#36498C] bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{page.name}</h4>
                    <span className="text-xs text-gray-500">({page.tag})</span>
                    {page.is_enabled ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Disabled
                      </span>
                    )}
                    {page.courseCount !== undefined ? (
                      <span className="text-xs text-gray-500">
                        {page.courseCount} courses
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Loading...
                      </span>
                    )}
                  </div>
                  {page.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{page.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRankCourses(page)}
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    title="Re-rank all courses"
                  >
                    Rank Courses
                  </button>
                  <button
                    onClick={() => {
                      setEditingLandingPage(page)
                      setShowCreateForm(true)
                    }}
                    className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleEnabled(page)}
                    className={`rounded-md px-3 py-1 text-xs font-medium ${
                      page.is_enabled
                        ? 'border border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                        : 'border border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {page.is_enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(page)}
                    className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedLandingPage(page)}
                    className={`rounded-md px-3 py-1 text-xs font-medium ${
                      selectedLandingPage?.id === page.id
                        ? 'bg-[#36498C] text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Manage Courses
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <LandingPageForm
          landingPage={editingLandingPage}
          onSave={handleSaveLandingPage}
          onCancel={() => {
            setShowCreateForm(false)
            setEditingLandingPage(null)
          }}
        />
      )}

      {/* Course Management */}
      {selectedLandingPage && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Course Management: {selectedLandingPage.name}
            </h3>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-600">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No courses found for {selectedLandingPage.name} landing page.
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-6">Title</div>
                  <div className="col-span-2">Provider</div>
                  <div className="col-span-3">Actions</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {courses.map((course, index) => (
                  <div
                    key={course.id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                      index < 3 ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 min-w-[20px]">
                            {index + 1}
                          </span>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0 || isSaving}
                              className="text-gray-400 hover:text-[#36498C] disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                              title="Move up"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => handleMoveDown(index)}
                              disabled={index === courses.length - 1 || isSaving}
                              className="text-gray-400 hover:text-[#36498C] disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                              title="Move down"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-6">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {course.description || 'No description'}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="text-sm text-gray-700">
                          {course.provider || <span className="text-gray-400">-</span>}
                        </div>
                      </div>

                      <div className="col-span-3">
                        {index < 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Top {index + 1}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LandingPageForm({
  landingPage,
  onSave,
  onCancel,
}: {
  landingPage: LandingPage | null
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    tag: landingPage?.tag || '',
    name: landingPage?.name || '',
    description: landingPage?.description || '',
    heroTitle: landingPage?.hero_title || '',
    subtitle: landingPage?.subtitle || 'at IFAIP',
    bgColor: landingPage?.bg_color || '#2563eb',
    headerImageUrl: landingPage?.header_image_url || '/hero.png',
    isEnabled: landingPage?.is_enabled ?? false,
    displayOrder: landingPage?.display_order || 0,
  })

  // Update form data when landingPage prop changes (for Edit mode)
  useEffect(() => {
    if (landingPage) {
      console.log('🔄 LandingPageForm: Updating form data from landingPage:', {
        id: landingPage.id,
        name: landingPage.name,
        description: landingPage.description,
        descriptionType: typeof landingPage.description,
        descriptionLength: landingPage.description?.length || 0
      })
      const updatedFormData = {
        tag: landingPage.tag || '',
        name: landingPage.name || '',
        description: landingPage.description || '', // Explicitly handle null -> empty string
        heroTitle: landingPage.hero_title || '',
        subtitle: landingPage.subtitle || 'at IFAIP',
        bgColor: landingPage.bg_color || '#2563eb',
        headerImageUrl: landingPage.header_image_url || '/hero.png',
        isEnabled: landingPage.is_enabled ?? false,
        displayOrder: landingPage.display_order || 0,
      }
      console.log('🔄 LandingPageForm: Setting form data:', {
        description: updatedFormData.description,
        descriptionLength: updatedFormData.description.length
      })
      setFormData(updatedFormData)
    } else {
      // Reset to defaults for Create mode
      setFormData({
        tag: '',
        name: '',
        description: '',
        heroTitle: '',
        subtitle: 'at IFAIP',
        bgColor: '#2563eb',
        headerImageUrl: '/hero.png',
        isEnabled: false,
        displayOrder: 0,
      })
    }
  }, [landingPage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate tag format
    const tagRegex = /^[a-z0-9-]+$/
    if (!tagRegex.test(formData.tag.toLowerCase())) {
      alert('Tag must be URL-friendly (lowercase letters, numbers, and hyphens only)')
      return
    }

    onSave({
      ...formData,
      tag: formData.tag.toLowerCase(),
    })
  }

  const colors = [
    { value: '#2563eb', label: 'Blue' },
    { value: '#16a34a', label: 'Green' },
    { value: '#9333ea', label: 'Purple' },
    { value: '#dc2626', label: 'Red' },
    { value: '#ea580c', label: 'Orange' },
    { value: '#0891b2', label: 'Cyan' },
    { value: '#7c3aed', label: 'Violet' },
    { value: '#059669', label: 'Emerald' },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {landingPage ? 'Edit Landing Page' : 'Create New Landing Page'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tag (URL-friendly) *
            </label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value.toLowerCase() })}
              placeholder="e.g., healthcare, education"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
              required
              disabled={!!landingPage}
            />
            <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, and hyphens only</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Name (Display Name) *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Healthcare"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Description for course cards"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Leave blank to auto-generate using AI (125-145 characters, matching existing landing pages)
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Hero Title
            </label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              placeholder="e.g., The Best AI Certification for Healthcare Professionals"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Leave blank to auto-generate: "The Best AI Certification for [Name]"
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g., at IFAIP"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <select
              value={formData.bgColor}
              onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            >
              {colors.map(color => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Header Image URL
            </label>
            <input
              type="text"
              value={formData.headerImageUrl}
              onChange={(e) => setFormData({ ...formData, headerImageUrl: e.target.value })}
              placeholder="/hero.png"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isEnabled"
              checked={formData.isEnabled}
              onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
              className="rounded border-gray-300 text-[#36498C] focus:ring-[#36498C]"
            />
            <label htmlFor="isEnabled" className="ml-2 text-sm text-gray-700">
              Enable (show in navigation)
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#36498C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#36498C]/90"
          >
            {landingPage ? 'Update' : 'Create'} Landing Page
          </button>
        </div>
      </form>
    </div>
  )
}
