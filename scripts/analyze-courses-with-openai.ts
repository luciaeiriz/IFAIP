import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import * as path from 'path'
import OpenAI from 'openai'

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

if (!openaiApiKey) {
  console.error('❌ Missing OPENAI_API_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const openai = new OpenAI({ apiKey: openaiApiKey })

interface CourseAnalysis {
  business: {
    relevance: number // 0-100
    shouldFeature: boolean
  }
  restaurant: {
    relevance: number // 0-100
    shouldFeature: boolean
  }
  fleet: {
    relevance: number // 0-100
    shouldFeature: boolean
  }
}

/**
 * Maps subcategory tags to main category tags
 * Similar to parseTag function in import-courses.ts
 */
function mapTagToMainCategory(tag: string | null | undefined): 'Business' | 'Restaurant' | 'Fleet' | null {
  if (!tag) return null
  const normalized = tag.trim()
  
  // Direct matches
  if (normalized === 'Business') return 'Business'
  if (normalized === 'Restaurant') return 'Restaurant'
  if (normalized === 'Fleet') return 'Fleet'
  
  // Convert "General" to "Business"
  if (normalized === 'General') return 'Business'
  
  // All other subcategory tags (Finance, HR, Sales, Marketing, Product Management) map to Business
  return 'Business'
}

async function analyzeCourseWithOpenAI(
  title: string,
  description: string | null,
  keySkills: string | null,
  provider: string | null
): Promise<CourseAnalysis> {
  const courseInfo = `
Title: ${title}
${description ? `Description: ${description}` : ''}
${keySkills ? `Key Skills: ${keySkills}` : ''}
${provider ? `Provider: ${provider}` : ''}
`.trim()

  const prompt = `Analyze this AI course and determine its relevance to three categories: Business, Restaurant, and Fleet.

Course Information:
${courseInfo}

For each category, provide:
1. A relevance score from 0-100 (where 100 is highly relevant and 0 is not relevant)
2. Whether this course should be featured in the "Top 3 Providers" section for that category (true/false)

Consider:
- Business: General business applications, strategy, management, operations, AI for business decision-making, enterprise AI solutions
- Restaurant: Food service, hospitality, restaurant operations, customer service in dining, AI for restaurant management, food ordering systems
- Fleet: Transportation, logistics, vehicle management, delivery operations, AI for fleet optimization, route planning, vehicle maintenance

Return ONLY valid JSON in this exact format:
{
  "business": { "relevance": 85, "shouldFeature": true },
  "restaurant": { "relevance": 20, "shouldFeature": false },
  "fleet": { "relevance": 15, "shouldFeature": false }`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for cost efficiency, can use gpt-4 for better results
      messages: [
        {
          role: 'system',
          content: 'You are an expert at categorizing educational courses. Always return valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const analysis = JSON.parse(content) as CourseAnalysis
    
    // Validate the response structure
    if (!analysis.business || !analysis.restaurant || !analysis.fleet) {
      throw new Error('Invalid response structure from OpenAI')
    }

    return analysis
  } catch (error) {
    console.error(`Error analyzing course "${title}":`, error)
    // Return default low relevance for all categories on error
    return {
      business: { relevance: 0, shouldFeature: false },
      restaurant: { relevance: 0, shouldFeature: false },
      fleet: { relevance: 0, shouldFeature: false }
    }
  }
}

async function analyzeAndUpdateCourses() {
  console.log('🤖 === STARTING OPENAI COURSE ANALYSIS ===\n')

  try {
    // Fetch all unique courses (grouped by source + title to avoid duplicates)
    console.log('📥 Fetching unique courses from database...')
    const { data: allCourses, error: fetchError } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true })

    if (fetchError) {
      throw new Error(`Failed to fetch courses: ${fetchError.message}`)
    }

    if (!allCourses || allCourses.length === 0) {
      console.log('⚠️  No courses found in database')
      return
    }

    console.log(`✅ Found ${allCourses.length} total course entries\n`)

    // Group by source + title to get unique courses
    const uniqueCoursesMap = new Map<string, any>()
    for (const course of allCourses) {
      const key = `${course.source}|||${course.title}`
      if (!uniqueCoursesMap.has(key)) {
        uniqueCoursesMap.set(key, course)
      }
    }

    const uniqueCourses = Array.from(uniqueCoursesMap.values())
    console.log(`📊 Found ${uniqueCourses.length} unique courses to analyze\n`)

    // Track analysis results
    const analysisResults: Map<string, CourseAnalysis> = new Map()

    // Analyze each unique course
    for (let i = 0; i < uniqueCourses.length; i++) {
      const course = uniqueCourses[i]
      const key = `${course.source}|||${course.title}`
      
      console.log(`\n[${i + 1}/${uniqueCourses.length}] Analyzing: "${course.title}"`)
      
      const analysis = await analyzeCourseWithOpenAI(
        course.title,
        course.description,
        course.key_skills,
        course.provider
      )

      analysisResults.set(key, analysis)
      
      console.log(`  Business: ${analysis.business.relevance}/100 ${analysis.business.shouldFeature ? '⭐ FEATURED' : ''}`)
      console.log(`  Restaurant: ${analysis.restaurant.relevance}/100 ${analysis.restaurant.shouldFeature ? '⭐ FEATURED' : ''}`)
      console.log(`  Fleet: ${analysis.fleet.relevance}/100 ${analysis.fleet.shouldFeature ? '⭐ FEATURED' : ''}`)

      // Add delay to avoid rate limiting (adjust as needed)
      if (i < uniqueCourses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
      }
    }

    console.log('\n\n📝 === UPDATING DATABASE ===\n')

    // Collect all courses that need updating, grouped by category
    const updatesByCategory: {
      Business: Array<{ id: string; priority: number; is_featured: boolean }>
      Restaurant: Array<{ id: string; priority: number; is_featured: boolean }>
      Fleet: Array<{ id: string; priority: number; is_featured: boolean }>
    } = {
      Business: [],
      Restaurant: [],
      Fleet: []
    }

    // Process all course entries and prepare updates
    for (const course of allCourses) {
      const key = `${course.source}|||${course.title}`
      const analysis = analysisResults.get(key)

      if (!analysis) continue

      // Map subcategory tag to main category
      const mappedCategory = mapTagToMainCategory(course.tag)
      
      if (!mappedCategory) {
        console.warn(`⚠️  Skipping course "${course.title}" - could not map tag: ${course.tag}`)
        continue
      }
      
      const category = mappedCategory

      const categoryKey = category.toLowerCase() as keyof CourseAnalysis
      const categoryAnalysis = analysis[categoryKey]

      if (!categoryAnalysis) {
        console.warn(`⚠️  Skipping course "${course.title}" - missing analysis for category: ${category}`)
        continue
      }

      // Convert relevance (0-100) to priority (lower = more relevant)
      // Higher relevance = lower priority number
      const priority = 100 - categoryAnalysis.relevance

      updatesByCategory[category].push({
        id: course.id,
        priority: Math.round(priority),
        is_featured: false // Will be set to true for top 3 after sorting
      })
    }

    // Sort by relevance (most relevant first) and limit featured to top 3 per category
    for (const category of ['Business', 'Restaurant', 'Fleet'] as const) {
      const updates = updatesByCategory[category]
      
      // Sort by priority (ascending = most relevant first)
      updates.sort((a, b) => a.priority - b.priority)

      // Top 3 should be featured
      updates.forEach((update, index) => {
        update.is_featured = index < 3
      })

      console.log(`\n📋 ${category} Category:`)
      console.log(`   Total courses: ${updates.length}`)
      console.log(`   Featured courses: ${updates.filter(u => u.is_featured).length}`)
    }

    // Update database in batches
    console.log('\n💾 Updating database...')
    let successCount = 0
    let errorCount = 0

    for (const course of allCourses) {
      const key = `${course.source}|||${course.title}`
      const analysis = analysisResults.get(key)

      if (!analysis) {
        errorCount++
        continue
      }

      // Map subcategory tag to main category
      const mappedCategory = mapTagToMainCategory(course.tag)
      
      if (!mappedCategory) {
        errorCount++
        console.warn(`⚠️  Skipping course "${course.title}" - could not map tag: ${course.tag}`)
        continue
      }
      
      const category = mappedCategory

      const categoryKey = category.toLowerCase() as keyof CourseAnalysis
      const categoryAnalysis = analysis[categoryKey]

      if (!categoryAnalysis) {
        errorCount++
        console.warn(`⚠️  Skipping course "${course.title}" - missing analysis for category: ${category}`)
        continue
      }

      // Find the update info for this course
      const updateInfo = updatesByCategory[category].find(u => u.id === course.id)
      if (!updateInfo) {
        errorCount++
        console.warn(`⚠️  Skipping course "${course.title}" - no update info found for category: ${category}`)
        continue
      }

      // Update priority and is_featured
      const { error: updateError } = await supabase
        .from('courses')
        .update({
          priority: updateInfo.priority,
          is_featured: updateInfo.is_featured
        })
        .eq('id', course.id)

      if (updateError) {
        console.error(`❌ Error updating course ${course.id}:`, updateError)
        errorCount++
      } else {
        successCount++
      }
    }

    console.log('\n✅ === ANALYSIS COMPLETE ===')
    console.log(`✅ Successfully updated: ${successCount} course entries`)
    console.log(`❌ Errors: ${errorCount}`)

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the analysis
analyzeAndUpdateCourses()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
