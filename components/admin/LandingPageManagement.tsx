'use client'

import { useState, useEffect } from 'react'
import { Course, CourseTag } from '@/types/course'
import { supabase } from '@/lib/supabase'

interface CourseWithRelevancy extends Course {
  business_relevancy?: number | null
  restaurant_relevancy?: number | null
  fleet_relevancy?: number | null
}

export default function LandingPageManagement() {
  const [selectedTag, setSelectedTag] = useState<CourseTag>('Business')
  const [courses, setCourses] = useState<CourseWithRelevancy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCourse, setEditingCourse] = useState<CourseWithRelevancy | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [selectedTag])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      
      // Determine which relevancy column to use based on tag
      const relevancyColumn = selectedTag === 'Business' 
        ? 'business_relevancy' 
        : selectedTag === 'Restaurant' 
        ? 'restaurant_relevancy' 
        : 'fleet_relevancy'
      
      // Fetch courses filtered by tag, ordered by relevancy (fallback to priority)
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('tag', selectedTag)
        .order(relevancyColumn || 'priority', { ascending: true, nullsFirst: false })

      if (error) {
        // Fallback to priority if relevancy column doesn't exist
        const fallbackData = await supabase
          .from('courses')
          .select('*')
          .eq('tag', selectedTag)
          .order('priority', { ascending: true, nullsFirst: false })
        
        if (fallbackData.error) throw fallbackData.error
        
        const transformed = (fallbackData.data || []).map(transformCourse)
        setCourses(transformed)
        return
      }

      const transformed = (data || []).map(transformCourse)
      setCourses(transformed)
    } catch (error) {
      console.error('Error fetching courses:', error)
      alert('Failed to load courses. Please check the console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const transformCourse = (row: any): CourseWithRelevancy => {
    return {
      id: String(row.id || ''),
      title: String(row.title || ''),
      description: String(row.description || ''),
      headline: row.headline || null,
      bullet_points: Array.isArray(row.bullet_points) ? row.bullet_points : null,
      provider: row.provider || null,
      level: (row.level as any) || 'Beginner',
      duration: String(row.duration || ''),
      tags: row.tag ? [row.tag] : [],
      external_url: row.external_url || null,
      priority: Number(row.priority) || 999,
      rating: row.rating ? Number(row.rating) : null,
      reviews: row.reviews ? Number(row.reviews) : null,
      course_type: row.course_type || null,
      key_skills: row.key_skills || null,
      modules: row.modules || null,
      instructors: row.instructors || null,
      effort: row.effort || null,
      languages: row.languages || null,
      price: row.free_trial || undefined,
      source: String(row.source || ''),
      signup_enabled: Boolean(row.signup_enabled ?? true),
      is_featured: Boolean(row.is_featured ?? false),
      price_label: row.price_label || null,
      free_trial: row.free_trial || null,
      created_at: row.created_at || null,
      updated_at: row.updated_at || null,
      business_relevancy: row.business_relevancy ?? null,
      restaurant_relevancy: row.restaurant_relevancy ?? null,
      fleet_relevancy: row.fleet_relevancy ?? null,
    }
  }

  const getRelevancyValue = (course: CourseWithRelevancy): number => {
    if (selectedTag === 'Business') return course.business_relevancy ?? course.priority ?? 999
    if (selectedTag === 'Restaurant') return course.restaurant_relevancy ?? course.priority ?? 999
    return course.fleet_relevancy ?? course.priority ?? 999
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0 || isSaving) return
    
    const newCourses = [...courses]
    const temp = newCourses[index]
    newCourses[index] = newCourses[index - 1]
    newCourses[index - 1] = temp

    // Update relevancy scores
    const relevancyColumn = selectedTag === 'Business' 
      ? 'business_relevancy' 
      : selectedTag === 'Restaurant' 
      ? 'restaurant_relevancy' 
      : 'fleet_relevancy'

    await saveRelevancyUpdates(newCourses, relevancyColumn)
  }

  const handleMoveDown = async (index: number) => {
    if (index === courses.length - 1 || isSaving) return
    
    const newCourses = [...courses]
    const temp = newCourses[index]
    newCourses[index] = newCourses[index + 1]
    newCourses[index + 1] = temp

    const relevancyColumn = selectedTag === 'Business' 
      ? 'business_relevancy' 
      : selectedTag === 'Restaurant' 
      ? 'restaurant_relevancy' 
      : 'fleet_relevancy'

    await saveRelevancyUpdates(newCourses, relevancyColumn)
  }

  const saveRelevancyUpdates = async (updatedCourses: CourseWithRelevancy[], relevancyColumn: string) => {
    try {
      setIsSaving(true)
      
      // Update each course with new relevancy score
      for (let idx = 0; idx < updatedCourses.length; idx++) {
        const course = updatedCourses[idx]
        const newRelevancy = idx + 1

        const { error } = await supabase
          .from('courses')
          .update({ [relevancyColumn]: newRelevancy })
          .eq('id', course.id)

        if (error) {
          console.error(`Error updating course ${course.id}:`, error)
          // Try updating priority as fallback
          await supabase
            .from('courses')
            .update({ priority: newRelevancy })
            .eq('id', course.id)
        }
      }

      // Refresh the list
      await fetchCourses()
      alert('Order updated successfully!')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order. Please check the console.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    if (!editingCourse) return

    try {
      setIsSaving(true)
      const { error } = await supabase
        .from('courses')
        .update({
          headline: courseData.headline || null,
          description: courseData.description || null,
          bullet_points: courseData.bullet_points || null,
          signup_enabled: courseData.signup_enabled ?? true,
          is_featured: courseData.is_featured ?? false,
        })
        .eq('id', editingCourse.id)

      if (error) throw error

      alert('Course updated successfully!')
      setEditingCourse(null)
      await fetchCourses()
    } catch (error) {
      console.error('Error saving course:', error)
      alert('Failed to save course. Please check the console.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleVisibility = async (courseId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ signup_enabled: !currentValue })
        .eq('id', courseId)

      if (error) throw error

      await fetchCourses()
    } catch (error) {
      console.error('Error toggling visibility:', error)
      alert('Failed to toggle visibility.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Landing Page Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage course order, visibility, and content for landing pages
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value as CourseTag)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
          >
            <option value="Business">Business Landing Page</option>
            <option value="Restaurant">Restaurant Landing Page</option>
            <option value="Fleet">Fleet Landing Page</option>
          </select>
        </div>
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <CourseEditModal
          course={editingCourse}
          onSave={handleSaveCourse}
          onCancel={() => setEditingCourse(null)}
          isSaving={isSaving}
        />
      )}

      {/* Course List */}
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
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Headline</div>
              <div className="col-span-1">Top 3</div>
              <div className="col-span-1">Visible</div>
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
                  {/* Rank */}
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

                  {/* Title */}
                  <div className="col-span-4">
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {course.description || 'No description'}
                    </div>
                  </div>

                  {/* Headline */}
                  <div className="col-span-2">
                    <div className="text-sm text-gray-700 truncate">
                      {course.headline || <span className="text-gray-400 italic">No headline</span>}
                    </div>
                  </div>

                  {/* Top 3 Indicator */}
                  <div className="col-span-1">
                    {index < 3 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Top {index + 1}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>

                  {/* Visibility Toggle */}
                  <div className="col-span-1">
                    <button
                      onClick={() => handleToggleVisibility(course.id, course.signup_enabled)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        course.signup_enabled
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {course.signup_enabled ? 'Yes' : 'No'}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex gap-2">
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="text-sm text-[#36498C] hover:text-[#36498C]/80 font-medium hover:underline"
                    >
                      Edit Content
                    </button>
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

interface CourseEditModalProps {
  course: Course
  onSave: (data: Partial<Course>) => void
  onCancel: () => void
  isSaving: boolean
}

function CourseEditModal({ course, onSave, onCancel, isSaving }: CourseEditModalProps) {
  const [formData, setFormData] = useState({
    headline: course.headline || '',
    description: course.description || '',
    bullet_points: course.bullet_points?.join('\n') || '',
    signup_enabled: course.signup_enabled ?? true,
    is_featured: course.is_featured ?? false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bulletPointsArray = formData.bullet_points
      ? formData.bullet_points.split('\n').filter((bp) => bp.trim())
      : null

    onSave({
      headline: formData.headline || undefined,
      description: formData.description || undefined,
      bullet_points: bulletPointsArray,
      signup_enabled: formData.signup_enabled,
      is_featured: formData.is_featured,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Edit Course Content</h3>
          <p className="text-sm text-gray-600 mt-1">{course.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Headline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Headline (max 60 chars)
            </label>
            <input
              type="text"
              maxLength={60}
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
              placeholder="Short, compelling headline"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.headline.length}/60 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description / Summary
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
              placeholder="Course description that appears on the landing page"
            />
          </div>

          {/* Bullet Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bullet Points (one per line)
            </label>
            <textarea
              value={formData.bullet_points}
              onChange={(e) => setFormData({ ...formData, bullet_points: e.target.value })}
              rows={5}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
              placeholder="Enter key features, one per line"
            />
            <p className="text-xs text-gray-500 mt-1">
              Each line will become a bullet point
            </p>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6 pt-4 border-t border-gray-200">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.signup_enabled}
                onChange={(e) => setFormData({ ...formData, signup_enabled: e.target.checked })}
                className="rounded border-gray-300 text-[#36498C] focus:ring-[#36498C]"
              />
              <span className="ml-2 text-sm text-gray-700">Visible on Landing Page</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded border-gray-300 text-[#36498C] focus:ring-[#36498C]"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Course</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-[#36498C] px-4 py-2 text-sm font-medium text-white hover:bg-[#36498C]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


