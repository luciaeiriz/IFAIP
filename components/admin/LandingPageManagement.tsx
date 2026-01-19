'use client'

import { useState, useEffect } from 'react'
import { Course } from '@/types/course'
import { getCoursesByTag } from '@/src/data/courses'
import { LandingPage } from '@/lib/landing-pages'
import { adminFetch } from '@/lib/admin-api-client'

export default function LandingPageManagement() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([])
  const [selectedLandingPage, setSelectedLandingPage] = useState<LandingPage | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingLandingPage, setEditingLandingPage] = useState<LandingPage | null>(null)
  const [expandedPageId, setExpandedPageId] = useState<string | null>(null)

  useEffect(() => {
    fetchLandingPages()
  }, [])

  useEffect(() => {
    if (selectedLandingPage && expandedPageId === selectedLandingPage.id) {
      fetchCourses()
    }
  }, [selectedLandingPage, expandedPageId])

  const fetchLandingPages = async () => {
    try {
      setIsLoading(true)
      const response = await adminFetch('/api/admin/landing-pages')
      
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
      
      const response = await adminFetch('/api/admin/landing-pages', {
        method: 'PUT',
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
      
      const response = await adminFetch(url, {
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
        setExpandedPageId(null)
        setEditingLandingPage(null)
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
      const response = await adminFetch(`/api/admin/landing-pages/${landingPage.tag}/rank-courses`, {
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
      
      const response = await adminFetch('/api/admin/courses/reorder', {
        method: 'POST',
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
        response = await adminFetch('/api/admin/landing-pages', {
          method: 'PUT',
          body: JSON.stringify(updatePayload),
        })
      } else {
        // Ensure description is always included in POST payload too
        const postPayload = {
          ...formData,
          description: formData.description !== undefined ? formData.description : ''
        }
        console.log('📤 POST request payload:', postPayload)
        response = await adminFetch('/api/admin/landing-pages', {
          method: 'POST',
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
        // New landing page created - expand it
        setSelectedLandingPage(result.landingPage)
        setExpandedPageId(result.landingPage.id)
      } else {
        // Updated existing page - keep it expanded
        setExpandedPageId(editingLandingPage.id)
      }
    } catch (error: any) {
      console.error('Error saving landing page:', error)
      alert(`Failed to save landing page: ${error.message}`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Landing Page Management</h2>
          <p className="text-sm text-gray-600 mt-2">
            Create and manage course landing pages
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLandingPage(null)
            setShowCreateForm(true)
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#36498C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#36498C]/90 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Landing Page
        </button>
      </div>

      {/* Landing Pages List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Landing Pages</h3>
          <p className="text-xs text-gray-500 mt-1">Manage your landing pages and their settings</p>
        </div>
        <div className="p-6">
          {isLoading && landingPages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#36498C]"></div>
              <p className="text-sm text-gray-600 mt-4">Loading landing pages...</p>
            </div>
          ) : landingPages.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No landing pages</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new landing page.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {landingPages.map((page) => {
                const isExpanded = expandedPageId === page.id
                const isEditing = editingLandingPage?.id === page.id
                
                return (
                  <div
                    key={page.id}
                    className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                      isExpanded 
                        ? 'border-[#36498C] bg-white shadow-lg' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Card Header - Clickable to expand/collapse */}
                    <div
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedPageId(null)
                          setSelectedLandingPage(null)
                          setEditingLandingPage(null)
                        } else {
                          setExpandedPageId(page.id)
                          setSelectedLandingPage(page)
                          setEditingLandingPage(null)
                        }
                      }}
                      className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${
                        isExpanded ? 'bg-blue-50/50 border-b border-gray-200' : 'hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-base font-semibold text-gray-900">{page.name}</h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            {page.tag}
                          </span>
                          {page.is_enabled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Enabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Disabled
                            </span>
                          )}
                          {page.courseCount !== undefined ? (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              {page.courseCount} {page.courseCount === 1 ? 'course' : 'courses'}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 animate-pulse">Loading...</span>
                          )}
                        </div>
                        {page.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-1">{page.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRankCourses(page)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          title="Re-rank all courses"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Rank
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleEnabled(page)
                          }}
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#36498C] focus:ring-offset-2 ${
                            page.is_enabled
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                          role="switch"
                          aria-checked={page.is_enabled}
                          title={page.is_enabled ? 'Disable landing page' : 'Enable landing page'}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                              page.is_enabled ? 'translate-x-8' : 'translate-x-1'
                            }`}
                          >
                            {page.is_enabled ? (
                              <svg className="h-full w-full p-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="h-full w-full p-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(page)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ml-2 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 bg-gray-50/30">
                        {/* Edit Form Section */}
                        <div className="p-6 border-b border-gray-200 bg-white">
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-gray-900">Edit Landing Page</h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (isEditing) {
                                  setEditingLandingPage(null)
                                } else {
                                  setEditingLandingPage(page)
                                }
                              }}
                              className="inline-flex items-center gap-1.5 text-sm text-[#36498C] hover:text-[#36498C]/80 font-medium transition-colors"
                            >
                              {isEditing ? (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancel Edit
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit Settings
                                </>
                              )}
                            </button>
                          </div>
                          {isEditing ? (
                            <LandingPageForm
                              landingPage={page}
                              onSave={async (data) => {
                                await handleSaveLandingPage(data)
                                setEditingLandingPage(null)
                              }}
                              onCancel={() => setEditingLandingPage(null)}
                            />
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 font-medium">Name:</span>
                                <span className="ml-2 text-gray-900">{page.name}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium">Tag:</span>
                                <span className="ml-2 text-gray-900">{page.tag}</span>
                              </div>
                              <div className="md:col-span-2">
                                <span className="text-gray-500 font-medium">Description:</span>
                                <p className="mt-1 text-gray-900">{page.description || 'No description'}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium">Hero Title:</span>
                                <span className="ml-2 text-gray-900">{page.hero_title || 'Auto-generated'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium">Subtitle:</span>
                                <span className="ml-2 text-gray-900">{page.subtitle || 'at IFAIP'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium">Background Color:</span>
                                <div className="mt-1 flex items-center gap-2">
                                  <div 
                                    className="w-8 h-8 rounded border-2 border-gray-200"
                                    style={{ backgroundColor: page.bg_color }}
                                  ></div>
                                  <span className="text-gray-900">{page.bg_color}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Course Management Section */}
                        <div className="p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Course Management
                          </h4>
                          {isLoading ? (
                            <div className="text-center py-12">
                              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#36498C]"></div>
                              <p className="text-sm text-gray-600 mt-4">Loading courses...</p>
                            </div>
                          ) : courses.length === 0 ? (
                            <div className="text-center py-12">
                              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                              <p className="mt-1 text-sm text-gray-500">No courses found for {page.name} landing page.</p>
                            </div>
                          ) : (
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-50/50 border-b border-gray-200">
                                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  <div className="col-span-1">Rank</div>
                                  <div className="col-span-6">Course Details</div>
                                  <div className="col-span-2">Provider</div>
                                  <div className="col-span-3">Status</div>
                                </div>
                              </div>
                              <div className="divide-y divide-gray-100">
                                {courses.map((course, index) => (
                                  <div
                                    key={course.id}
                                    className={`px-6 py-4 transition-all duration-150 ${
                                      index < 3 
                                        ? 'bg-gradient-to-r from-blue-50/50 to-white border-l-4 border-blue-500' 
                                        : 'hover:bg-gray-50/50'
                                    }`}
                                  >
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                      <div className="col-span-1">
                                        <div className="flex items-center gap-3">
                                          <span className={`text-base font-bold min-w-[24px] ${
                                            index < 3 ? 'text-blue-600' : 'text-gray-900'
                                          }`}>
                                            {index + 1}
                                          </span>
                                          <div className="flex flex-col gap-0.5">
                                            <button
                                              onClick={() => handleMoveUp(index)}
                                              disabled={index === 0 || isSaving}
                                              className="p-1 rounded text-gray-400 hover:text-[#36498C] hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                                              title="Move up"
                                            >
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                              </svg>
                                            </button>
                                            <button
                                              onClick={() => handleMoveDown(index)}
                                              disabled={index === courses.length - 1 || isSaving}
                                              className="p-1 rounded text-gray-400 hover:text-[#36498C] hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                                              title="Move down"
                                            >
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                              </svg>
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-span-6">
                                        <div className="text-sm font-semibold text-gray-900 mb-1">{course.title}</div>
                                        <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                          {course.description || 'No description available'}
                                        </div>
                                      </div>

                                      <div className="col-span-2">
                                        <div className="text-sm text-gray-700 font-medium">
                                          {course.provider || <span className="text-gray-400 italic">Unknown</span>}
                                        </div>
                                      </div>

                                      <div className="col-span-3">
                                        {index < 3 && (
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border border-orange-200">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            Top {index + 1}
                                          </span>
                                        )}
                                        {isSaving && (
                                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                            <div className="w-3 h-3 border-2 border-gray-300 border-t-[#36498C] rounded-full animate-spin"></div>
                                            Saving...
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
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Form - Only shown when creating new landing page */}
      {showCreateForm && !editingLandingPage && (
        <LandingPageForm
          landingPage={null}
          onSave={handleSaveLandingPage}
          onCancel={() => {
            setShowCreateForm(false)
            setEditingLandingPage(null)
          }}
        />
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-50/50 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">
          {landingPage ? 'Edit Landing Page' : 'Create New Landing Page'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {landingPage ? 'Update landing page settings and content' : 'Configure your new landing page'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag (URL-friendly) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value.toLowerCase() })}
              placeholder="e.g., healthcare, education"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#36498C] focus:ring-2 focus:ring-[#36498C]/20 transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              required
              disabled={!!landingPage}
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name (Display Name) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Healthcare"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#36498C] focus:ring-2 focus:ring-[#36498C]/20 transition-all"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Description for course cards"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#36498C] focus:ring-2 focus:ring-[#36498C]/20 transition-all resize-none"
            />
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-800 flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Leave blank to auto-generate using AI (125-145 characters, matching existing landing pages)</span>
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Title
            </label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              placeholder="e.g., The Best AI Certification for Healthcare Professionals"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#36498C] focus:ring-2 focus:ring-[#36498C]/20 transition-all"
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Leave blank to auto-generate: "The Best AI Certification for [Name]"
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g., at IFAIP"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#36498C] focus:ring-2 focus:ring-[#36498C]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <select
                  value={formData.bgColor}
                  onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#36498C] focus:ring-2 focus:ring-[#36498C]/20 transition-all"
                >
                  {colors.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </div>
              <div 
                className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0"
                style={{ backgroundColor: formData.bgColor }}
                title={`Preview: ${formData.bgColor}`}
              >
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">This color will be used for the landing page card background</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Header Image URL
            </label>
            <input
              type="text"
              value={formData.headerImageUrl}
              onChange={(e) => setFormData({ ...formData, headerImageUrl: e.target.value })}
              placeholder="/hero.png"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#36498C] focus:ring-2 focus:ring-[#36498C]/20 transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="isEnabled"
                checked={formData.isEnabled}
                onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[#36498C] focus:ring-2 focus:ring-[#36498C]/20 cursor-pointer"
              />
              <label htmlFor="isEnabled" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                Enable landing page (show in navigation)
              </label>
              {formData.isEnabled && (
                <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Enabled
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#36498C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#36498C]/90 shadow-sm hover:shadow-md transition-all"
          >
            {landingPage ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Landing Page
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Landing Page
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
