import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') })

// Also try loading from .env as fallback
config({ path: path.join(process.cwd(), '.env') })

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Use service role key for imports (bypasses RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables')
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('⚠️  Using ANON_KEY - this may fail due to RLS policies')
    console.error('💡 For imports, set SUPABASE_SERVICE_ROLE_KEY in .env.local (bypasses RLS)')
  }
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function removeDuplicates() {
  console.log('🔍 Fetching all courses...')
  
  // Fetch all courses
  const { data: courses, error: fetchError } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (fetchError) {
    console.error('❌ Error fetching courses:', fetchError)
    process.exit(1)
  }
  
  if (!courses || courses.length === 0) {
    console.log('✅ No courses found in database')
    return
  }
  
  console.log(`📊 Found ${courses.length} total courses`)
  
  // Group courses by title and source (common duplicate criteria)
  const courseMap = new Map<string, any[]>()
  
  courses.forEach((course) => {
    // Create a key from title and source (normalized)
    const key = `${(course.title || '').toLowerCase().trim()}_${(course.source || '').toLowerCase().trim()}`
    
    if (!courseMap.has(key)) {
      courseMap.set(key, [])
    }
    courseMap.get(key)!.push(course)
  })
  
  // Find duplicates (groups with more than one course)
  const duplicates: Array<{ key: string; courses: any[] }> = []
  
  courseMap.forEach((courseList, key) => {
    if (courseList.length > 1) {
      duplicates.push({ key, courses: courseList })
    }
  })
  
  if (duplicates.length === 0) {
    console.log('✅ No duplicates found!')
    return
  }
  
  console.log(`\n🔍 Found ${duplicates.length} groups of duplicate courses`)
  
  let totalDuplicates = 0
  let deletedCount = 0
  let errorCount = 0
  
  // Process each duplicate group
  for (const duplicate of duplicates) {
    const { courses: duplicateCourses } = duplicate
    
    // Sort by created_at (keep the oldest) or by data completeness
    duplicateCourses.sort((a, b) => {
      // Prefer courses with more complete data
      const aCompleteness = calculateCompleteness(a)
      const bCompleteness = calculateCompleteness(b)
      
      if (aCompleteness !== bCompleteness) {
        return bCompleteness - aCompleteness // Higher completeness first
      }
      
      // If same completeness, keep the oldest
      const aDate = new Date(a.created_at || 0).getTime()
      const bDate = new Date(b.created_at || 0).getTime()
      return aDate - bDate
    })
    
    // Keep the first one (most complete or oldest), delete the rest
    const toKeep = duplicateCourses[0]
    const toDelete = duplicateCourses.slice(1)
    
    totalDuplicates += toDelete.length
    
    console.log(`\n📋 Duplicate group: "${toKeep.title}" (${toKeep.source})`)
    console.log(`   Keeping: ${toKeep.id} (created: ${toKeep.created_at || 'unknown'})`)
    console.log(`   Deleting ${toDelete.length} duplicate(s):`)
    
    for (const course of toDelete) {
      console.log(`     - ${course.id} (created: ${course.created_at || 'unknown'})`)
      
      const { error: deleteError } = await supabase
        .from('courses')
        .delete()
        .eq('id', course.id)
      
      if (deleteError) {
        console.error(`     ❌ Error deleting ${course.id}:`, deleteError.message)
        errorCount++
      } else {
        deletedCount++
        console.log(`     ✅ Deleted ${course.id}`)
      }
    }
  }
  
  console.log('\n=== Removal Summary ===')
  console.log(`Total duplicate groups found: ${duplicates.length}`)
  console.log(`Total duplicate courses to delete: ${totalDuplicates}`)
  console.log(`Successfully deleted: ${deletedCount}`)
  console.log(`Errors: ${errorCount}`)
}

// Calculate data completeness score (higher = more complete)
function calculateCompleteness(course: any): number {
  let score = 0
  
  if (course.title) score += 2
  if (course.description) score += 2
  if (course.provider) score += 1
  if (course.level) score += 1
  if (course.external_url) score += 1
  if (course.rating !== null && course.rating !== undefined) score += 1
  if (course.reviews !== null && course.reviews !== undefined) score += 1
  if (course.course_type) score += 1
  if (course.key_skills) score += 1
  if (course.modules) score += 1
  if (course.instructors) score += 1
  
  return score
}

// Run the removal
removeDuplicates()
  .then(() => {
    console.log('\n✅ Duplicate removal completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error during duplicate removal:', error)
    process.exit(1)
  })
