'use client'

import { useState, useEffect, useRef } from 'react'
import { CourseLevel } from '@/types/course'

interface CourseDiscoveryHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedLevels: CourseLevel[]
  onLevelsChange: (levels: CourseLevel[]) => void
  selectedTypes: string[]
  onTypesChange: (types: string[]) => void
  selectedProviders: string[]
  onProvidersChange: (providers: string[]) => void
  sortBy: string
  onSortChange: (sort: string) => void
  availableProviders: string[]
  tag?: string
}

export default function CourseDiscoveryHeader({
  searchQuery,
  onSearchChange,
  selectedLevels,
  onLevelsChange,
  selectedTypes,
  onTypesChange,
  selectedProviders,
  onProvidersChange,
  sortBy,
  onSortChange,
  availableProviders,
  tag = 'Business',
}: CourseDiscoveryHeaderProps) {
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const levelRef = useRef<HTMLDivElement>(null)
  const typeRef = useRef<HTMLDivElement>(null)
  const providerRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (levelRef.current && !levelRef.current.contains(event.target as Node)) {
        setLevelDropdownOpen(false)
      }
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setTypeDropdownOpen(false)
      }
      if (providerRef.current && !providerRef.current.contains(event.target as Node)) {
        setProviderDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const allLevels: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced']
  const allTypes = ['Course', 'Certificate', 'Specialisation']

  const toggleLevel = (level: CourseLevel) => {
    if (selectedLevels.includes(level)) {
      onLevelsChange(selectedLevels.filter((l) => l !== level))
    } else {
      onLevelsChange([...selectedLevels, level])
    }
  }

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const toggleProvider = (provider: string) => {
    if (selectedProviders.includes(provider)) {
      onProvidersChange(selectedProviders.filter((p) => p !== provider))
    } else {
      onProvidersChange([...selectedProviders, provider])
    }
  }

  return (
    <div className="sticky top-[50px] z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Title and Subtitle */}
        <div className="mb-6">
          <h1 className="text-[48px] font-bold leading-none" style={{ color: '#181716', fontFamily: 'EuclidCircularB, sans-serif', margin: '0px 0px 2px' }}>
            AI Courses for {tag === 'Business' ? 'Business' : tag === 'Restaurant' ? 'Restaurants' : 'Fleet Management'}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Curated selection of the best AI training programs to advance your career
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-4">
            {/* Level Filter */}
            <div className="relative" ref={levelRef}>
              <button
                onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Level
                {selectedLevels.length > 0 && (
                  <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">
                    {selectedLevels.length}
                  </span>
                )}
                <svg
                  className={`h-4 w-4 transition-transform ${
                    levelDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {levelDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {allLevels.map((level) => (
                      <label
                        key={level}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level)}
                          onChange={() => toggleLevel(level)}
                          className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Type Filter */}
            <div className="relative" ref={typeRef}>
              <button
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Product Type
                {selectedTypes.length > 0 && (
                  <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">
                    {selectedTypes.length}
                  </span>
                )}
                <svg
                  className={`h-4 w-4 transition-transform ${
                    typeDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {typeDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {allTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                          className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Provider Filter */}
            <div className="relative" ref={providerRef}>
              <button
                onClick={() => setProviderDropdownOpen(!providerDropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Provider
                {selectedProviders.length > 0 && (
                  <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">
                    {selectedProviders.length}
                  </span>
                )}
                <svg
                  className={`h-4 w-4 transition-transform ${
                    providerDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {providerDropdownOpen && (
                <div className="absolute left-0 z-50 mt-2 max-h-64 w-64 overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {availableProviders.map((provider) => (
                      <label
                        key={provider}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProviders.includes(provider)}
                          onChange={() => toggleProvider(provider)}
                          className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{provider}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative ml-auto">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="Recommended">Recommended</option>
                <option value="Most Popular">Most Popular</option>
                <option value="Shortest Duration">Shortest Duration</option>
                <option value="Highest Rated">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

