'use client'

import { useState, useEffect } from 'react'
import { Course, CourseTag } from '@/types/course'
import { getAllCourses } from '@/lib/courses'
import CourseForm from './CourseForm'
import CourseList from './CourseList'

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState<CourseTag | 'all'>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [featuredFilter, setFeaturedFilter] = useState<string>('all')

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchQuery, tagFilter, levelFilter, featuredFilter])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const allCourses = await getAllCourses()
      setCourses(allCourses)
    } catch (error) {
      console.error('Error fetching courses:', error)
      alert('Failed to load courses. Please check the console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = [...courses]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.provider?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Tag filter
    if (tagFilter !== 'all') {
      filtered = filtered.filter(course => course.tags?.includes(tagFilter))
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level === levelFilter)
    }

    // Featured filter
    if (featuredFilter !== 'all') {
      const isFeatured = featuredFilter === 'yes'
      filtered = filtered.filter(course => course.is_featured === isFeatured)
    }

    setFilteredCourses(filtered)
  }

  const handleCourseSaved = () => {
    fetchCourses()
    setShowForm(false)
    setEditingCourse(null)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCourse(null)
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete course')
      }

      await fetchCourses()
      alert('Course deleted successfully')
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Failed to delete course. Please check the console for details.')
    }
  }

  const handleExport = () => {
    const csv = [
      ['Title', 'Provider', 'Tag', 'Level', 'Priority', 'Featured', 'Rating', 'URL'],
      ...filteredCourses.map(c => [
        `"${c.title}"`,
        `"${c.provider || ''}"`,
        c.tags?.[0] || '',
        c.level || '',
        c.priority?.toString() || '',
        c.is_featured ? 'Yes' : 'No',
        c.rating?.toString() || '',
        c.external_url || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `courses-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredCourses.length} of {courses.length} courses
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={filteredCourses.length === 0}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-[#36498C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#36498C]/90"
          >
            Add New Course
          </button>
        </div>
      </div>

      {showForm ? (
        <CourseForm
          course={editingCourse}
          onSave={handleCourseSaved}
          onCancel={handleCancel}
        />
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tag
                </label>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value as CourseTag | 'all')}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
                >
                  <option value="all">All Tags</option>
                  <option value="Business">Business</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Fleet">Fleet</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Featured
                </label>
                <select
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
                >
                  <option value="all">All</option>
                  <option value="yes">Featured</option>
                  <option value="no">Not Featured</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course List */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-600">Loading courses...</div>
          ) : (
            <CourseList
              courses={filteredCourses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  )
}

