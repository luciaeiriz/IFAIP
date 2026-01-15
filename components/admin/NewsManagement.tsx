'use client'

import { useState, useEffect } from 'react'

interface NewsItem {
  id: string
  category: 'news' | 'blog' | 'researcher-spotlights' | 'latest-research' | 'events'
  label: string
  title: string
  description?: string
  date?: string
  time?: string
  href: string
  image_color: string
  display_order: number
  created_at?: string
  updated_at?: string
}

type NewsCategory = 'news' | 'blog' | 'researcher-spotlights' | 'latest-research' | 'events'

export default function NewsManagement() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all')
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null)

  useEffect(() => {
    fetchNewsItems()
  }, [])

  const fetchNewsItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/news')
      if (!response.ok) throw new Error('Failed to fetch news items')
      const data = await response.json()
      setNewsItems(data.newsItems || [])
    } catch (error) {
      console.error('Error fetching news items:', error)
      alert('Failed to load news items. Please check the console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshFromAPI = async (category: NewsCategory) => {
    if (!confirm(`This will replace all existing ${category} items with fresh news from NewsAPI. Continue?`)) {
      return
    }

    try {
      setIsRefreshing(category)
      const response = await fetch('/api/admin/news/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, limit: 4 })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to refresh news')
      }

      const data = await response.json()
      alert(data.message || `Successfully refreshed ${category} news`)
      await fetchNewsItems()
    } catch (error: any) {
      console.error('Error refreshing news:', error)
      alert(`Failed to refresh news: ${error.message}`)
    } finally {
      setIsRefreshing(null)
    }
  }

  const handleSave = async (itemData: Partial<NewsItem>) => {
    try {
      const url = editingItem
        ? '/api/admin/news'
        : '/api/admin/news'
      
      const method = editingItem ? 'PUT' : 'POST'
      const body = editingItem
        ? { ...itemData, id: editingItem.id }
        : itemData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save news item')
      }

      await fetchNewsItems()
      setShowForm(false)
      setEditingItem(null)
    } catch (error: any) {
      console.error('Error saving news item:', error)
      alert(`Failed to save news item: ${error.message}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete news item')
      }

      await fetchNewsItems()
      alert('News item deleted successfully')
    } catch (error) {
      console.error('Error deleting news item:', error)
      alert('Failed to delete news item. Please check the console for details.')
    }
  }

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  const categories: Array<{ value: NewsCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Categories' },
    { value: 'news', label: 'News' },
    { value: 'blog', label: 'Blog' },
    { value: 'researcher-spotlights', label: 'Researcher Spotlights' },
    { value: 'latest-research', label: 'Latest Research' },
    { value: 'events', label: 'Events' },
  ]

  const filteredItems = selectedCategory === 'all'
    ? newsItems
    : newsItems.filter(item => item.category === selectedCategory)

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, NewsItem[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredItems.length} news items
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleRefreshFromAPI('news')}
            disabled={isRefreshing === 'news'}
            className="rounded-lg border border-[#36498C] px-4 py-2 text-sm font-medium text-[#36498C] hover:bg-[#36498C]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing === 'news' ? 'Refreshing...' : 'Refresh News from API'}
          </button>
          <button
            onClick={() => handleRefreshFromAPI('blog')}
            disabled={isRefreshing === 'blog'}
            className="rounded-lg border border-[#36498C] px-4 py-2 text-sm font-medium text-[#36498C] hover:bg-[#36498C]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing === 'blog' ? 'Refreshing...' : 'Refresh Blog from API'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-[#36498C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#36498C]/90"
          >
            Add New Item
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-[#36498C] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <NewsItemForm
          item={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* News Items List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-600">Loading news items...</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {category.replace('-', ' ')} ({items.length})
                </h3>
                {(category === 'news' || category === 'blog') && (
                  <button
                    onClick={() => handleRefreshFromAPI(category as NewsCategory)}
                    disabled={isRefreshing === category}
                    className="rounded-lg border border-[#36498C] px-4 py-2 text-sm font-medium text-[#36498C] hover:bg-[#36498C]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRefreshing === category ? 'Refreshing...' : 'Refresh from NewsAPI'}
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {items
                  .sort((a, b) => a.display_order - b.display_order)
                  .map(item => (
                    <NewsItemCard
                      key={item.id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No news items found. Add your first item above.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function NewsItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: NewsItem
  onEdit: (item: NewsItem) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">
              {item.label}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">Order: {item.display_order}</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
          {item.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {item.date && <span>{item.date}</span>}
            {item.time && <span>{item.time}</span>}
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#36498C] hover:underline"
            >
              View Link →
            </a>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(item)}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function NewsItemForm({
  item,
  onSave,
  onCancel,
}: {
  item: NewsItem | null
  onSave: (data: Partial<NewsItem>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    category: (item?.category || 'news') as NewsCategory,
    label: item?.label || '',
    title: item?.title || '',
    description: item?.description || '',
    date: item?.date || '',
    time: item?.time || '',
    href: item?.href || '',
    imageColor: item?.image_color || 'from-blue-900 to-blue-700',
    display_order: item?.display_order || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const categories: NewsCategory[] = ['news', 'blog', 'researcher-spotlights', 'latest-research', 'events']
  const colors = [
    'from-blue-900 to-blue-700',
    'from-indigo-600 to-indigo-800',
    'from-purple-600 to-purple-800',
    'from-teal-600 to-teal-800',
    'from-green-600 to-green-800',
    'from-cyan-600 to-cyan-800',
    'from-amber-600 to-amber-800',
    'from-orange-600 to-orange-800',
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {item ? 'Edit News Item' : 'Add New News Item'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as NewsCategory })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="e.g., Monday 20 Jan 2025"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g., Time: 09:00 - 17:00"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              URL (href) *
            </label>
            <input
              type="url"
              value={formData.href}
              onChange={(e) => setFormData({ ...formData, href: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image Color (gradient)
            </label>
            <select
              value={formData.imageColor}
              onChange={(e) => setFormData({ ...formData, imageColor: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            >
              {colors.map(color => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#36498C] focus:ring-1 focus:ring-[#36498C]"
            />
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
            {item ? 'Update' : 'Create'} News Item
          </button>
        </div>
      </form>
    </div>
  )
}

