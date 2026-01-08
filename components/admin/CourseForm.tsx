'use client'

import { useState, useEffect } from 'react'
import { Course, CourseTag, CourseLevel } from '@/types/course'

interface CourseFormProps {
  course?: Course | null
  onSave: () => void
  onCancel: () => void
}

export default function CourseForm({ course, onSave, onCancel }: CourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    headline: '',
    bullet_points: '',
    provider: '',
    level: '' as CourseLevel | '',
    duration: '',
    tag: '' as CourseTag | '',
    external_url: '',
    rating: '',
    reviews: '',
    course_type: '',
    key_skills: '',
    modules: '',
    instructors: '',
    effort: '',
    languages: '',
    free_trial: '',
    price_label: '',
    source: 'admin',
    signup_enabled: true,
  })

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        headline: course.headline || '',
        bullet_points: course.bullet_points?.join('\n') || '',
        provider: course.provider || '',
        level: course.level || '',
        duration: course.duration || '',
        tag: course.tags?.[0] || '',
        external_url: course.external_url || '',
        rating: course.rating?.toString() || '',
        reviews: course.reviews?.toString() || '',
        course_type: course.course_type || '',
        key_skills: course.key_skills || '',
        modules: course.modules || '',
        instructors: course.instructors || '',
        effort: course.effort || '',
        languages: course.languages || '',
        free_trial: course.free_trial || '',
        price_label: course.price_label || '',
        source: course.source || 'admin',
        signup_enabled: course.signup_enabled ?? true,
      })
    }
  }, [course])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const bulletPointsArray = formData.bullet_points
        ? formData.bullet_points.split('\n').filter((bp) => bp.trim())
        : null

      const courseData = {
        title: formData.title,
        description: formData.description || null,
        headline: formData.headline || null,
        bullet_points: bulletPointsArray,
        provider: formData.provider || null,
        level: formData.level || null,
        duration: formData.duration || null,
        tag: formData.tag || null,
        external_url: formData.external_url || null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        reviews: formData.reviews ? parseInt(formData.reviews) : null,
        course_type: formData.course_type || null,
        key_skills: formData.key_skills || null,
        modules: formData.modules || null,
        instructors: formData.instructors || null,
        effort: formData.effort || null,
        languages: formData.languages || null,
        free_trial: formData.free_trial || null,
        price_label: formData.price_label || null,
        source: formData.source,
        signup_enabled: formData.signup_enabled,
      }

      const url = course
        ? `/api/admin/courses/${course.id}`
        : '/api/admin/courses'
      const method = course ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save course')
      }

      alert(course ? 'Course updated successfully!' : 'Course created successfully!')
      onSave()
    } catch (error) {
      console.error('Error saving course:', error)
      alert(`Failed to save course: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {course ? 'Edit Course' : 'Add New Course'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

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
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider
            </label>
            <input
              type="text"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          {/* Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tag *
            </label>
            <select
              required
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value as CourseTag })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            >
              <option value="">Select a tag</option>
              <option value="Business">Business</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Fleet">Fleet</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevel })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              placeholder="e.g., 4 weeks, 8 hours"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          {/* External URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              External URL
            </label>
            <input
              type="url"
              value={formData.external_url}
              onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (1-5)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          {/* Reviews */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Reviews
            </label>
            <input
              type="number"
              value={formData.reviews}
              onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          {/* Price Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Label
            </label>
            <input
              type="text"
              placeholder="e.g., Free, $99, $199/month"
              value={formData.price_label}
              onChange={(e) => setFormData({ ...formData, price_label: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          {/* Free Trial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Free Trial
            </label>
            <input
              type="text"
              placeholder="e.g., 7-day free trial"
              value={formData.free_trial}
              onChange={(e) => setFormData({ ...formData, free_trial: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          {/* Bullet Points */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bullet Points (one per line)
            </label>
            <textarea
              value={formData.bullet_points}
              onChange={(e) => setFormData({ ...formData, bullet_points: e.target.value })}
              rows={4}
              placeholder="Enter bullet points, one per line"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          {/* Additional Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Type
            </label>
            <input
              type="text"
              value={formData.course_type}
              onChange={(e) => setFormData({ ...formData, course_type: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Skills
            </label>
            <input
              type="text"
              value={formData.key_skills}
              onChange={(e) => setFormData({ ...formData, key_skills: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modules
            </label>
            <input
              type="text"
              value={formData.modules}
              onChange={(e) => setFormData({ ...formData, modules: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructors
            </label>
            <input
              type="text"
              value={formData.instructors}
              onChange={(e) => setFormData({ ...formData, instructors: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effort
            </label>
            <input
              type="text"
              placeholder="e.g., 5 hours/week"
              value={formData.effort}
              onChange={(e) => setFormData({ ...formData, effort: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Languages
            </label>
            <input
              type="text"
              placeholder="e.g., English, Spanish"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#36498C] focus:outline-none focus:ring-1 focus:ring-[#36498C]"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.signup_enabled}
              onChange={(e) => setFormData({ ...formData, signup_enabled: e.target.checked })}
              className="rounded border-gray-300 text-[#36498C] focus:ring-[#36498C]"
            />
            <span className="ml-2 text-sm text-gray-700">Signup Enabled</span>
          </label>
        </div>

        {/* Form Actions */}
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
            disabled={isSubmitting}
            className="rounded-md bg-[#36498C] px-4 py-2 text-sm font-medium text-white hover:bg-[#36498C]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  )
}


