import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'
import { config } from 'dotenv'
import { randomUUID } from 'crypto'

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

interface CSVRow {
  id?: string
  source: string
  title: string
  priority: string
  tag: string
  signup_enabled: string
  external_url: string
  free_trial: string
  course_type: string  // CSV column name
  provider: string
  instructors: string
  rating: string
  reviews: string
  level: string
  duration: string
  effort: string
  languages: string
  modules: string
  description: string
  key_skills: string
  created_at?: string
  updated_at?: string
  is_featured: string
  price_label: string
}

function cleanReviews(reviews: string | null | undefined): number | null {
  if (!reviews || reviews.trim() === '') return null
  // Remove commas and convert to number
  const cleaned = reviews.replace(/,/g, '').trim()
  const num = parseInt(cleaned, 10)
  return isNaN(num) ? null : num
}

function parseRating(rating: string | null | undefined): number | null {
  if (!rating || rating.trim() === '') return null
  const num = parseFloat(rating.trim())
  return isNaN(num) ? null : num
}

function parseTag(tag: string | null | undefined): 'Business' | 'Restaurant' | 'Fleet' {
  if (!tag) return 'Business'
  const normalized = tag.trim()
  
  // Convert "General" to "Business"
  if (normalized === 'General') return 'Business'
  
  // Specific category tags
  if (normalized === 'Restaurant') return 'Restaurant'
  if (normalized === 'Fleet') return 'Fleet'
  
  // All other tags (Finance, HR, Sales, Marketing, Product Management) map to Business
  return 'Business'
}

// Calculate relevancy scores for all three categories
// Returns an object with business_relevancy, restaurant_relevancy, and fleet_relevancy
// Lower number = higher relevancy/priority
function calculateRelevancyScores(
  csvTag: string,
  csvOrder: string | null
): { business_relevancy: number; restaurant_relevancy: number; fleet_relevancy: number } {
  // Base priority from CSV Order column (1-9, lower is better/higher priority)
  const basePriority = csvOrder ? parseInt(csvOrder.trim(), 10) : 100
  const csvTagNormalized = csvTag?.trim() || ''
  
  // Initialize all relevancy scores
  let business_relevancy = basePriority
  let restaurant_relevancy = basePriority
  let fleet_relevancy = basePriority
  
  // Business relevancy: General, Finance, HR, Sales, Marketing, Product Management get high priority
  if (csvTagNormalized === 'General' || 
      csvTagNormalized === 'Finance' || 
      csvTagNormalized === 'HR' || 
      csvTagNormalized === 'Sales' || 
      csvTagNormalized === 'Marketing' || 
      csvTagNormalized === 'Product Management') {
    business_relevancy = basePriority
  } else {
    // Restaurant/Fleet courses appear later in Business tab
    business_relevancy = basePriority + 50
  }
  
  // Restaurant relevancy: Restaurant courses get high priority
  if (csvTagNormalized === 'Restaurant') {
    restaurant_relevancy = basePriority
  } else {
    // Business courses appear later in Restaurant tab
    restaurant_relevancy = basePriority + 50
  }
  
  // Fleet relevancy: Fleet courses get high priority
  if (csvTagNormalized === 'Fleet') {
    fleet_relevancy = basePriority
  } else {
    // Business courses appear later in Fleet tab
    fleet_relevancy = basePriority + 50
  }
  
  return {
    business_relevancy,
    restaurant_relevancy,
    fleet_relevancy
  }
}

function parseBoolean(value: string | null | undefined): boolean {
  if (!value) return false
  const trimmed = value.trim().toLowerCase()
  return trimmed === 'true' || trimmed === '1' || trimmed === 'yes'
}

function parsePriority(order: string | null | undefined): number | null {
  if (!order || order.trim() === '') return null
  const num = parseInt(order.trim(), 10)
  return isNaN(num) ? null : num
}

function parseLevel(level: string | null | undefined): 'Beginner' | 'Intermediate' | 'Advanced' | null {
  if (!level) return null
  const normalized = level.trim()
  if (normalized === 'Beginner' || normalized === 'Intermediate' || normalized === 'Advanced') {
    return normalized
  }
  return null
}

async function importCourses() {
  const csvPath = path.join(process.cwd(), 'data', 'business-courses.csv')
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSV file not found at ${csvPath}`)
    process.exit(1)
  }
  
  console.log('Reading CSV file...')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  
  // Parse CSV (using semicolon delimiter)
  const records: CSVRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    delimiter: ';', // CSV uses semicolons, not commas
  })
  
  console.log(`Found ${records.length} courses to import`)
  
  // Create one course entry per CSV row with relevancy scores for all three categories
  const courses: any[] = []
  
  records.forEach((row, index) => {
    const csvTag = row.tag || ''
    const csvPriority = row.priority || null
    
    // Parse tag - convert "General" to "Business" (for backward compatibility)
    const parsedTag = parseTag(csvTag)
    
    // Calculate relevancy scores for all three categories
    const relevancyScores = calculateRelevancyScores(csvTag, csvPriority)
    
    // Base course data - map CSV columns to database column names
    // Explicitly exclude id, created_at, updated_at (auto-generated by DB)
    const { id, created_at, updated_at, ...csvData } = row
    
    const courseEntry: Record<string, any> = {
      source: csvData.source || 'Unknown',
      title: csvData.title || '',
      signup_enabled: parseBoolean(csvData.signup_enabled),
      external_url: csvData.external_url || null,
      free_trial: csvData.free_trial || null,
      course_type: csvData.course_type || null,
      provider: csvData.provider || null,
      instructors: csvData.instructors || null,
      rating: parseRating(csvData.rating),
      reviews: cleanReviews(csvData.reviews),
      level: parseLevel(csvData.level),
      duration: csvData.duration || null,
      effort: csvData.effort || null,
      languages: csvData.languages || null,
      modules: csvData.modules || null,
      description: csvData.description || null,
      key_skills: csvData.key_skills || null,
      is_featured: parseBoolean(csvData.is_featured),
      price_label: csvData.price_label || null,
      // Add relevancy scores for all three categories
      business_relevancy: relevancyScores.business_relevancy,
      restaurant_relevancy: relevancyScores.restaurant_relevancy,
      fleet_relevancy: relevancyScores.fleet_relevancy,
      // Keep tag for backward compatibility (nullable now)
      tag: parsedTag,
      // Note: id, created_at, updated_at are explicitly excluded - DB will auto-generate
    }
    
    // Double-check: explicitly remove these fields if they somehow got in
    delete courseEntry.id
    delete courseEntry.created_at
    delete courseEntry.updated_at
    
    courses.push(courseEntry)
  })
  
  console.log(`Created ${courses.length} course entries with relevancy scores`)
  
  // Validate required fields
  const invalidCourses = courses.filter((course, index) => {
    if (!course.title || course.title.trim() === '') {
      console.warn(`Row ${index + 2}: Missing title`)
      return true
    }
    if (!course.source || course.source.trim() === '') {
      console.warn(`Row ${index + 2}: Missing source`)
      return true
    }
    return false
  })
  
  if (invalidCourses.length > 0) {
    console.error(`Found ${invalidCourses.length} courses with missing required fields`)
    process.exit(1)
  }
  
  // Log distribution by relevancy
  console.log('\nTop courses by business relevancy:')
  courses
    .sort((a, b) => (a.business_relevancy || 999) - (b.business_relevancy || 999))
    .slice(0, 5)
    .forEach((course) => {
      console.log(`  Business relevancy ${course.business_relevancy}: ${course.title}`)
    })
  
  console.log('\nTop courses by restaurant relevancy:')
  courses
    .sort((a, b) => (a.restaurant_relevancy || 999) - (b.restaurant_relevancy || 999))
    .slice(0, 5)
    .forEach((course) => {
      console.log(`  Restaurant relevancy ${course.restaurant_relevancy}: ${course.title}`)
    })
  
  console.log('\nTop courses by fleet relevancy:')
  courses
    .sort((a, b) => (a.fleet_relevancy || 999) - (b.fleet_relevancy || 999))
    .slice(0, 5)
    .forEach((course) => {
      console.log(`  Fleet relevancy ${course.fleet_relevancy}: ${course.title}`)
    })
  
  console.log('Upserting courses (insert new or update existing)...')
  
  // Log first course structure before upserting
  if (courses.length > 0) {
    console.log('\n📋 Sample course structure (first course):')
    const sample = courses[0]
    console.log(JSON.stringify(sample, null, 2))
    console.log('Column names:', Object.keys(sample))
  }
  
  // Upsert in batches to avoid overwhelming the database
  // Use source + title as the unique identifier for upsert
  const batchSize = 10
  let successCount = 0
  let updateCount = 0
  let insertCount = 0
  let errorCount = 0
  
  for (let i = 0; i < courses.length; i += batchSize) {
    const batch = courses.slice(i, i + batchSize)
    
    // For each course, try to upsert based on source + title
    for (const course of batch) {
      // First, check if course exists
      const { data: existing, error: fetchError } = await supabase
        .from('courses')
        .select('id')
        .eq('source', course.source)
        .eq('title', course.title)
        .limit(1)
      
      if (fetchError) {
        console.error(`❌ Error checking for existing course "${course.title}":`, fetchError)
        errorCount++
        continue
      }
      
      if (existing && existing.length > 0) {
        // Update existing course
        const { data, error } = await supabase
          .from('courses')
          .update(course)
          .eq('id', existing[0].id)
          .select()
        
        if (error) {
          console.error(`❌ Error updating course "${course.title}":`, error)
          errorCount++
        } else {
          updateCount++
          successCount++
          console.log(`✅ Updated: ${course.title}`)
        }
      } else {
        // Insert new course
        const { data, error } = await supabase
          .from('courses')
          .insert(course)
          .select()
        
        if (error) {
          console.error(`❌ Error inserting course "${course.title}":`, error)
          console.error('Error details:', JSON.stringify(error, null, 2))
          errorCount++
        } else {
          insertCount++
          successCount++
          console.log(`✅ Inserted: ${course.title}`)
        }
      }
    }
  }
  
  console.log('\n=== Import Summary ===')
  console.log(`Total courses from CSV: ${courses.length}`)
  console.log(`Successfully processed: ${successCount}`)
  console.log(`  - New courses inserted: ${insertCount}`)
  console.log(`  - Existing courses updated: ${updateCount}`)
  console.log(`Errors: ${errorCount}`)
}

// Run the import
importCourses()
  .then(() => {
    console.log('\nImport completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Import failed:', error)
    process.exit(1)
  })

