export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type CourseTag = 'General' | 'Restaurant' | 'Fleet'

export interface Course {
  id: string
  title: string
  description: string | null
  provider: string | null
  level: CourseLevel | null
  duration: string | null
  price_label: string | null
  tag: CourseTag
  external_url: string | null
  signup_enabled: boolean
  priority: number | null
  is_featured: boolean
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
  created_at: string
  updated_at: string
}

export interface DatabaseCourse {
  id: string
  title: string
  description: string | null
  provider: string | null
  level: CourseLevel | null
  duration: string | null
  price_label: string | null
  tag: CourseTag
  external_url: string | null
  signup_enabled: boolean
  priority: number | null
  is_featured: boolean
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
  created_at: string
  updated_at: string
}

