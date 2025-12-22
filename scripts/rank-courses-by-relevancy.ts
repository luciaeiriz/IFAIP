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

type Category = 'Business' | 'Restaurant' | 'Fleet'

interface RankedCourse {
  courseId: string
  rank: number
}

/**
 * Rank all courses for a specific category using OpenAI
 * Returns an array of course IDs ranked from most relevant (1) to least relevant (N)
 */
async function rankCoursesForCategory(
  courses: any[],
  category: Category
): Promise<RankedCourse[]> {
  const categoryContext = {
    Business: 'General business applications, strategy, management, operations, AI for business decision-making, enterprise AI solutions, finance, HR, sales, marketing, product management',
    Restaurant: 'Food service, hospitality, restaurant operations, customer service in dining, AI for restaurant management, food ordering systems, menu optimization, kitchen operations',
    Fleet: 'Transportation, logistics, vehicle management, delivery operations, AI for fleet optimization, route planning, vehicle maintenance, supply chain management'
  }

  const coursesList = courses.map((course, index) => ({
    index: index + 1,
    id: course.id,
    title: course.title,
    description: course.description || '',
    keySkills: course.key_skills || '',
    provider: course.provider || ''
  }))

  const prompt = `You are an expert at ranking educational courses by their relevance to specific business categories.

Category: ${category}
Context: ${categoryContext[category]}

You MUST rank ALL ${courses.length} courses below. Do not skip any courses.

Here are the ${courses.length} courses to rank:

${coursesList.map(c => `
Course ${c.index} of ${courses.length}:
Course ID: ${c.id}
Title: ${c.title}
${c.description ? `Description: ${c.description.substring(0, 200)}...` : 'No description'}
${c.keySkills ? `Key Skills: ${c.keySkills}` : ''}
${c.provider ? `Provider: ${c.provider}` : ''}
---`).join('\n')}

CRITICAL REQUIREMENTS:
1. You MUST rank ALL ${courses.length} courses - no exceptions
2. Rank 1 = most relevant, Rank ${courses.length} = least relevant
3. Every course must have a unique rank (no ties, no duplicates)
4. Use the EXACT courseId values shown above (copy them exactly)
5. Return rankings for ALL ${courses.length} courses

Return ONLY valid JSON in this exact format:
{
  "rankings": [
    { "courseId": "exact-uuid-from-above", "rank": 1 },
    { "courseId": "exact-uuid-from-above", "rank": 2 },
    { "courseId": "exact-uuid-from-above", "rank": 3 },
    ... continue for all ${courses.length} courses ...
  ]
}

Verify: Your response must contain exactly ${courses.length} entries in the rankings array.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at ranking educational courses. You MUST rank ALL courses provided - never skip any. Always return valid JSON only, no additional text. The rankings array must contain exactly ${courses.length} entries, one for each course provided. Each course must have a unique rank from 1 to ${courses.length}.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(content) as { rankings: RankedCourse[] }
    
    // Validate the response
    if (!parsed.rankings || !Array.isArray(parsed.rankings)) {
      throw new Error('Invalid response structure from OpenAI')
    }

    // Verify all course IDs are present
    const rankedIds = new Set(parsed.rankings.map(r => r.courseId))
    const courseIds = new Set(courses.map(c => c.id))
    const missingIds = [...courseIds].filter(id => !rankedIds.has(id))
    const extraIds = [...rankedIds].filter(id => !courseIds.has(id))
    
    if (missingIds.length > 0 || extraIds.length > 0) {
      console.error(`⚠️  Validation issue:`)
      if (missingIds.length > 0) {
        console.error(`   Missing course IDs in rankings: ${missingIds.slice(0, 5).join(', ')}${missingIds.length > 5 ? '...' : ''}`)
      }
      if (extraIds.length > 0) {
        console.error(`   Extra course IDs in rankings: ${extraIds.slice(0, 5).join(', ')}${extraIds.length > 5 ? '...' : ''}`)
      }
      console.error(`   Expected ${courses.length} courses, got ${parsed.rankings.length} rankings`)
      
      // If we're missing some, try to fill them in with high ranks (less relevant)
      if (missingIds.length > 0) {
        console.log(`   Attempting to fix by adding missing courses with rank ${courses.length + 1}...`)
        const maxRank = Math.max(...parsed.rankings.map(r => r.rank), 0)
        missingIds.forEach((id, index) => {
          parsed.rankings.push({
            courseId: id,
            rank: maxRank + index + 1
          })
        })
        console.log(`   Fixed: Added ${missingIds.length} missing courses`)
      }
      
      // Remove any extra IDs
      if (extraIds.length > 0) {
        parsed.rankings = parsed.rankings.filter(r => courseIds.has(r.courseId))
        console.log(`   Fixed: Removed ${extraIds.length} extra courses`)
      }
    }

    // Ensure we have exactly the right number
    if (parsed.rankings.length !== courses.length) {
      console.warn(`⚠️  Still have ${parsed.rankings.length} rankings for ${courses.length} courses after fixes`)
    }

    return parsed.rankings
  } catch (error) {
    console.error(`Error ranking courses for ${category}:`, error)
    throw error
  }
}

async function rankAndUpdateCourses() {
  console.log('🤖 === STARTING COURSE RANKING BY RELEVANCY ORDER ===\n')

  try {
    // Fetch all courses
    console.log('📥 Fetching all courses from database...')
    const { data: allCourses, error: fetchError } = await supabase
      .from('courses')
      .select('id, title, description, key_skills, provider, tag')
      .order('created_at', { ascending: true })

    if (fetchError) {
      throw new Error(`Failed to fetch courses: ${fetchError.message}`)
    }

    if (!allCourses || allCourses.length === 0) {
      console.log('⚠️  No courses found in database')
      return
    }

    console.log(`✅ Found ${allCourses.length} courses\n`)

    const categories: Category[] = ['Business', 'Restaurant', 'Fleet']

    for (const category of categories) {
      console.log(`\n${'='.repeat(60)}`)
      console.log(`📊 Ranking courses for category: ${category}`)
      console.log(`${'='.repeat(60)}\n`)

      // Get all courses (we'll rank all of them for each category)
      // You could filter by tag if you want, but ranking all gives better relative comparison
      const coursesToRank = allCourses

      if (coursesToRank.length === 0) {
        console.log(`⚠️  No courses to rank for ${category}`)
        continue
      }

      console.log(`Ranking ${coursesToRank.length} courses for ${category}...`)

      try {
        const rankings = await rankCoursesForCategory(coursesToRank, category)

        console.log(`✅ Received rankings for ${rankings.length} courses`)

        // Update database with rankings
        const relevancyColumn = category === 'Business' 
          ? 'business_relevancy' 
          : category === 'Restaurant' 
          ? 'restaurant_relevancy' 
          : 'fleet_relevancy'

        let successCount = 0
        let errorCount = 0

        for (const ranking of rankings) {
          const { error: updateError } = await supabase
            .from('courses')
            .update({ [relevancyColumn]: ranking.rank })
            .eq('id', ranking.courseId)

          if (updateError) {
            console.error(`  ❌ Error updating course ${ranking.courseId}:`, updateError)
            errorCount++
          } else {
            successCount++
          }
        }

        console.log(`\n✅ ${category} Category:`)
        console.log(`   Successfully updated: ${successCount} courses`)
        console.log(`   Errors: ${errorCount}`)

        // Show top 5 rankings
        console.log(`\n   Top 5 ranked courses:`)
        const top5 = rankings
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 5)
        top5.forEach((r, idx) => {
          const course = coursesToRank.find(c => c.id === r.courseId)
          console.log(`   ${idx + 1}. Rank ${r.rank}: ${course?.title || 'Unknown'}`)
        })

        // Add delay between categories to avoid rate limiting
        if (category !== categories[categories.length - 1]) {
          console.log('\n⏳ Waiting 2 seconds before next category...')
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      } catch (error) {
        console.error(`❌ Error ranking courses for ${category}:`, error)
        console.error('Continuing with next category...')
      }
    }

    console.log('\n\n✅ === RANKING COMPLETE ===')
    console.log('All courses have been ranked by relevancy order for each category.')

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the ranking
rankAndUpdateCourses()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

