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

// Calculate priority based on relevance to each category
function calculatePriority(
  tag: 'Business' | 'Restaurant' | 'Fleet',
  csvTag: string,
  csvOrder: string | null
): number {
  // Base priority from CSV Order column (1-9, lower is better/higher priority)
  const basePriority = csvOrder ? parseInt(csvOrder.trim(), 10) : 100
  
  // If course has a specific tag, it gets high priority for that category
  // Otherwise, it gets lower priority (appears later)
  const csvTagNormalized = csvTag?.trim() || ''
  
  if (tag === 'Business') {
    // Business courses: General, Finance, HR, Sales, Marketing, Product Management get priority
    if (csvTagNormalized === 'General' || 
        csvTagNormalized === 'Finance' || 
        csvTagNormalized === 'HR' || 
        csvTagNormalized === 'Sales' || 
        csvTagNormalized === 'Marketing' || 
        csvTagNormalized === 'Product Management') {
      return basePriority // Use CSV order
    }
    // Restaurant/Fleet courses appear later in Business tab
    return basePriority + 50
  }
  
  if (tag === 'Restaurant') {
    // Restaurant courses get high priority
    if (csvTagNormalized === 'Restaurant') {
      return basePriority // Use CSV order
    }
    // Business courses appear later in Restaurant tab
    return basePriority + 50
  }
  
  if (tag === 'Fleet') {
    // Fleet courses get high priority
    if (csvTagNormalized === 'Fleet') {
      return basePriority // Use CSV order
    }
    // Business courses appear later in Fleet tab
    return basePriority + 50
  }
  
  return basePriority
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
  
  // Create courses for each relevant category
  const courses: any[] = []
  
  records.forEach((row, index) => {
    const csvTag = row.tag || ''
    const csvPriority = row.priority || null
    
    // Parse tag - convert "General" to "Business"
    const parsedTag = parseTag(csvTag)
    
    // Base course data - map CSV columns to database column names
    // Explicitly exclude id, created_at, updated_at (auto-generated by DB)
    const { id, created_at, updated_at, ...csvData } = row
    
    const baseCourse: Record<string, any> = {
      source: csvData.source || 'Unknown',
      title: csvData.title || '',
      signup_enabled: parseBoolean(csvData.signup_enabled),
      external_url: csvData.external_url || null,
      free_trial: csvData.free_trial || null,
      // Try 'course_type' first (matches migration file)
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
      // Note: id, created_at, updated_at are explicitly excluded - DB will auto-generate
    }
    
    // Double-check: explicitly remove these fields if they somehow got in
    delete baseCourse.id
    delete baseCourse.created_at
    delete baseCourse.updated_at
    
    // Determine primary tag
    const primaryTag = parsedTag
    
    // Create entries for all three categories with appropriate priorities
    const categories: Array<'Business' | 'Restaurant' | 'Fleet'> = ['Business', 'Restaurant', 'Fleet']
    
    categories.forEach((category) => {
      const priority = calculatePriority(category, csvTag, csvPriority)
      const courseEntry: Record<string, any> = {
        id: randomUUID(), // Generate UUID for each course entry
        ...baseCourse,
        tag: category,
        priority: priority,
        is_featured: category === primaryTag && priority <= 3, // Only feature in primary category
        // created_at and updated_at will be set by database defaults
      }
      
      // Ensure created_at and updated_at are NOT included (let DB set them)
      delete courseEntry.created_at
      delete courseEntry.updated_at
      
      courses.push(courseEntry)
    })
  })
  
  console.log(`Created ${courses.length} course entries across all categories`)
  
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
  
  // Log distribution by tag and priority
  const tagCounts = courses.reduce((acc, course) => {
    acc[course.tag] = (acc[course.tag] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  console.log('\nCourse distribution by tag:')
  Object.entries(tagCounts).forEach(([tag, count]) => {
    console.log(`  ${tag}: ${count} courses`)
  })
  
  console.log('\nTop courses by priority:')
  courses
    .sort((a, b) => (a.priority || 999) - (b.priority || 999))
    .slice(0, 10)
    .forEach((course) => {
      console.log(`  Priority ${course.priority}: ${course.title} (${course.tag})`)
    })
  
  console.log('Inserting courses into Supabase...')
  
  // Insert in batches to avoid overwhelming the database
  const batchSize = 10
  let successCount = 0
  let errorCount = 0
  
  // Log first course structure before inserting
  if (courses.length > 0) {
    console.log('\n📋 Sample course structure (first course):')
    const sample = courses[0]
    console.log(JSON.stringify(sample, null, 2))
    console.log('Column names:', Object.keys(sample))
    
    // Log what columns we're trying to insert
    console.log('📋 Columns being inserted:', Object.keys(sample))
    if ('course_type' in sample) {
      console.log('✅ course_type column included (will try this first)')
    }
  }

  // Try inserting without type/course_type first to see if that column exists
  let tryWithoutType = false
  
  for (let i = 0; i < courses.length; i += batchSize) {
    const batch = courses.slice(i, i + batchSize)
    
    // Log what we're about to insert
    if (i === 0) {
      console.log('\n📤 First batch structure:')
      console.log(JSON.stringify(batch[0], null, 2))
    }
    
    // If previous attempt failed due to type/course_type column, remove it
    let batchToInsert = batch
    if (tryWithoutType) {
      batchToInsert = batch.map(course => {
        const { course_type, type, ...rest } = course
        return rest
      })
      if (i === 0) {
        console.log('⚠️  Retrying without type/course_type column...')
      }
    }
    
    const { data, error } = await supabase
      .from('courses')
      .insert(batchToInsert)
      .select()
    
    if (error) {
      // If error is about type/course_type column and we haven't tried without it yet
      if ((error.message.includes("'type'") || error.message.includes("'course_type'")) && !tryWithoutType) {
        console.warn(`⚠️  Column type/course_type doesn't exist. Retrying without it...`)
        tryWithoutType = true
        // Retry this batch without the column
        i -= batchSize // Go back one batch
        continue
      }
      
      console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      console.error('Batch columns:', Object.keys(batchToInsert[0]))
      errorCount += batch.length
    } else {
      successCount += data?.length || 0
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${data?.length || 0} courses`)
    }
  }
  
  console.log('\n=== Import Summary ===')
  console.log(`Total courses: ${courses.length}`)
  console.log(`Successfully imported: ${successCount}`)
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

