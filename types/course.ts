export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type CourseTag = 'Business' | 'Restaurant' | 'Fleet'

export interface Course {
  id: string
  title: string
  description: string
  headline: string | null  // Short headline/tagline (max 60 chars)
  bullet_points: string[] | null  // Array of bullet points
  provider: string | null
  level: CourseLevel
  duration: string
  tags: CourseTag[]  // Array of tags
  external_url: string | null
  priority: number
  rating: number | null
  reviews: number | null
  course_type: string | null
  key_skills: string | null
  modules: string | null
  instructors: string | null
  effort: string | null
  languages: string | null
  price: string | undefined  // From free_trial
  source: string
  signup_enabled: boolean
  is_featured: boolean
  price_label: string | null
  free_trial: string | null
  logo_url: string | null  // Cached Logo.dev API URL for provider logo
  created_at: string | null
  updated_at: string | null
}

export interface DatabaseCourse {
  id: string
  title: string
  description: string | null
  headline: string | null  // Short headline/tagline (max 60 chars)
  bullet_points: string[] | null  // Array of bullet points
  provider: string | null
  level: CourseLevel | null
  duration: string | null
  tag: CourseTag | null  // Single tag in DB (nullable for backward compatibility)
  external_url: string | null
  priority: number | null
  rating: number | null
  reviews: number | null
  course_type: string | null
  key_skills: string | null
  modules: string | null
  instructors: string | null
  effort: string | null
  languages: string | null
  free_trial: string | null
  source: string
  signup_enabled: boolean
  is_featured: boolean
  price_label: string | null
  logo_url: string | null  // Cached Logo.dev API URL for provider logo
  business_relevancy: number | null  // Relevancy rank for business owners (lower = higher relevancy)
  restaurant_relevancy: number | null  // Relevancy rank for restaurant owners (lower = higher relevancy)
  fleet_relevancy: number | null  // Relevancy rank for fleet managers (lower = higher relevancy)
  created_at: string | null
  updated_at: string | null
}

