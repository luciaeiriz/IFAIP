'use client'

import { useState, useEffect } from 'react'
import { Course, CourseTag } from '@/types/course'
import { getCoursesByTag } from '@/src/data/courses'

export default function LandingPageManagement() {
  const [selectedTag, setSelectedTag] = useState<CourseTag>('Business')
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [selectedTag])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      
      // Use the EXACT same function that course pages use
      // This returns exactly what appears on course pages: top 10 visible courses by relevancy
      const fetchedCourses = await getCoursesByTag(selectedTag)
      
      setCourses(fetchedCourses)
    } catch (error) {
      console.error('❌ Error fetching courses:', error)
      setCourses([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0 || isSaving) return
    
    const newCourses = [...courses]
    const temp = newCourses[index]
    newCourses[index] = newCourses[index - 1]
    newCourses[index - 1] = temp
    
    await saveOrder(newCourses)
  }

  const handleMoveDown = async (index: number) => {
    if (index === courses.length - 1 || isSaving) return
    
    const newCourses = [...courses]
    const temp = newCourses[index]
    newCourses[index] = newCourses[index + 1]
    newCourses[index + 1] = temp
    
    await saveOrder(newCourses)
  }

  const saveOrder = async (newCourses: Course[]) => {
    try {
      setIsSaving(true)
      
      console.log(`💾 Saving order for ${selectedTag} page`)
      console.log(`💾 Courses to update:`, newCourses.map((c, i) => ({ position: i + 1, id: c.id, title: c.title })))
      
      // Use API route to update relevancy scores (bypasses RLS)
      const response = await fetch('/api/admin/courses/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tag: selectedTag,
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

      const result = await response.json()
      console.log(`✅ Order saved successfully:`, result)
      
      // Wait a moment to ensure database updates are committed
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Refresh the list to show the new order
      await fetchCourses()
      
      alert('Order updated successfully! The course pages will now show courses in this order.')
    } catch (error) {
      console.error('❌ Error saving order:', error)
      alert(`Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Landing Page Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Edit exactly what appears on the courses pages
          </p>
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value as CourseTag)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
        >
          <option value="Business">Business</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Fleet">Fleet</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-600">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No courses found for {selectedTag} landing page.
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
  )
}

