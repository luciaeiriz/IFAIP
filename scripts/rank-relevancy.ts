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

// Calculate relevancy scores for all three categories
// Returns an object with business_relevancy, restaurant_relevancy, and fleet_relevancy
// Lower number = higher relevancy/priority
function calculateRelevancyScores(
  tag: string | null,
  priority: number | null
): { business_relevancy: number; restaurant_relevancy: number; fleet_relevancy: number } {
  // Base priority from priority field (1-9, lower is better/higher priority)
  // If no priority, default to 100 (low priority)
  const basePriority = priority !== null && priority !== undefined ? priority : 100
  const tagNormalized = tag?.trim() || ''
  
  // Initialize all relevancy scores
  let business_relevancy = basePriority
  let restaurant_relevancy = basePriority
  let fleet_relevancy = basePriority
  
  // Business relevancy: Business tag gets high priority
  if (tagNormalized === 'Business') {
    business_relevancy = basePriority
  } else {
    // Restaurant/Fleet courses appear later in Business tab
    business_relevancy = basePriority + 50
  }
  
  // Restaurant relevancy: Restaurant courses get high priority
  if (tagNormalized === 'Restaurant') {
    restaurant_relevancy = basePriority
  } else {
    // Business/Fleet courses appear later in Restaurant tab
    restaurant_relevancy = basePriority + 50
  }
  
  // Fleet relevancy: Fleet courses get high priority
  if (tagNormalized === 'Fleet') {
    fleet_relevancy = basePriority
  } else {
    // Business/Restaurant courses appear later in Fleet tab
    fleet_relevancy = basePriority + 50
  }
  
  return {
    business_relevancy,
    restaurant_relevancy,
    fleet_relevancy
  }
}

async function rankRelevancy() {
  console.log('🔍 Fetching all courses...')
  
  // Fetch all courses
  const { data: courses, error: fetchError } = await supabase
    .from('courses')
    .select('id, title, tag, priority, business_relevancy, restaurant_relevancy, fleet_relevancy')
    .order('created_at', { ascending: true })
  
  if (fetchError) {
    console.error('❌ Error fetching courses:', fetchError)
    process.exit(1)
  }
  
  if (!courses || courses.length === 0) {
    console.log('✅ No courses found in database')
    return
  }
  
  console.log(`📊 Found ${courses.length} courses to rank`)
  
  let updatedCount = 0
  let errorCount = 0
  const batchSize = 20
  
  // Process courses in batches
  for (let i = 0; i < courses.length; i += batchSize) {
    const batch = courses.slice(i, i + batchSize)
    
    for (const course of batch) {
      // Calculate new relevancy scores
      const relevancyScores = calculateRelevancyScores(course.tag, course.priority)
      
      // Check if scores need updating
      const needsUpdate = 
        course.business_relevancy !== relevancyScores.business_relevancy ||
        course.restaurant_relevancy !== relevancyScores.restaurant_relevancy ||
        course.fleet_relevancy !== relevancyScores.fleet_relevancy
      
      if (!needsUpdate) {
        continue // Skip if scores are already correct
      }
      
      // Update the course with new relevancy scores
      const { error: updateError } = await supabase
        .from('courses')
        .update({
          business_relevancy: relevancyScores.business_relevancy,
          restaurant_relevancy: relevancyScores.restaurant_relevancy,
          fleet_relevancy: relevancyScores.fleet_relevancy
        })
        .eq('id', course.id)
      
      if (updateError) {
        console.error(`❌ Error updating course "${course.title}" (${course.id}):`, updateError.message)
        errorCount++
      } else {
        updatedCount++
        console.log(`✅ Updated: ${course.title}`)
        console.log(`   Business: ${relevancyScores.business_relevancy}, Restaurant: ${relevancyScores.restaurant_relevancy}, Fleet: ${relevancyScores.fleet_relevancy}`)
      }
    }
  }
  
  // Fetch updated courses and show rankings
  console.log('\n📊 Fetching updated courses for ranking display...')
  const { data: updatedCourses, error: displayError } = await supabase
    .from('courses')
    .select('id, title, tag, priority, business_relevancy, restaurant_relevancy, fleet_relevancy')
    .order('created_at', { ascending: true })
  
  if (displayError) {
    console.error('⚠️  Error fetching courses for display:', displayError)
  } else if (updatedCourses) {
    console.log('\n🏆 Top 10 courses by Business Relevancy:')
    updatedCourses
      .sort((a, b) => (a.business_relevancy || 999) - (b.business_relevancy || 999))
      .slice(0, 10)
      .forEach((course, index) => {
        console.log(`   ${index + 1}. [${course.business_relevancy}] ${course.title} (${course.tag || 'N/A'})`)
      })
    
    console.log('\n🍽️  Top 10 courses by Restaurant Relevancy:')
    updatedCourses
      .sort((a, b) => (a.restaurant_relevancy || 999) - (b.restaurant_relevancy || 999))
      .slice(0, 10)
      .forEach((course, index) => {
        console.log(`   ${index + 1}. [${course.restaurant_relevancy}] ${course.title} (${course.tag || 'N/A'})`)
      })
    
    console.log('\n🚗 Top 10 courses by Fleet Relevancy:')
    updatedCourses
      .sort((a, b) => (a.fleet_relevancy || 999) - (b.fleet_relevancy || 999))
      .slice(0, 10)
      .forEach((course, index) => {
        console.log(`   ${index + 1}. [${course.fleet_relevancy}] ${course.title} (${course.tag || 'N/A'})`)
      })
  }
  
  console.log('\n=== Ranking Summary ===')
  console.log(`Total courses processed: ${courses.length}`)
  console.log(`Courses updated: ${updatedCount}`)
  console.log(`Errors: ${errorCount}`)
}

// Run the ranking
rankRelevancy()
  .then(() => {
    console.log('\n✅ Relevancy ranking completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error during relevancy ranking:', error)
    process.exit(1)
  })
