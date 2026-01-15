import OpenAI from 'openai'
import { supabase } from './supabase'
import { supabaseAdmin } from './supabase-admin'

const openaiApiKey = process.env.OPENAI_API_KEY

if (!openaiApiKey) {
  console.warn('⚠️ OPENAI_API_KEY not set - relevancy scoring will be skipped')
}

const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null

type Category = 'Business' | 'Restaurant' | 'Fleet'

const categoryContext = {
  Business: 'General business applications, strategy, management, operations, AI for business decision-making, enterprise AI solutions, finance, HR, sales, marketing, product management',
  Restaurant: 'Food service, hospitality, restaurant operations, customer service in dining, AI for restaurant management, food ordering systems, menu optimization, kitchen operations',
  Fleet: 'Transportation, logistics, vehicle management, delivery operations, AI for fleet optimization, route planning, vehicle maintenance, supply chain management'
}

/**
 * Rank a single new course against existing courses for a specific category
 * Returns a relevancy rank (lower = more relevant)
 */
async function rankCourseForCategory(
  newCourse: {
    id: string
    title: string
    description: string | null
    key_skills: string | null
    provider: string | null
    tag: string | null
  },
  category: Category,
  existingCourses: Array<{
    id: string
    title: string
    description: string | null
    key_skills: string | null
    business_relevancy: number | null
    restaurant_relevancy: number | null
    fleet_relevancy: number | null
  }>
): Promise<number> {
  if (!openai) {
    // Fallback: assign a high rank (low relevancy) if OpenAI is not configured
    console.warn('⚠️ OpenAI not configured, assigning default rank 999')
    return 999
  }

  // Get existing courses with their relevancy scores for this category
  const relevancyColumn = category === 'Business' 
    ? 'business_relevancy' 
    : category === 'Restaurant' 
    ? 'restaurant_relevancy' 
    : 'fleet_relevancy'

  const rankedCourses = existingCourses
    .filter(c => c[relevancyColumn] !== null)
    .sort((a, b) => (a[relevancyColumn] || 999) - (b[relevancyColumn] || 999))
    .slice(0, 20) // Use top 20 for comparison

  const prompt = `You are an expert at ranking educational courses by their relevance to specific business categories.

Category: ${category}
Context: ${categoryContext[category]}

You need to rank a NEW course relative to ${rankedCourses.length} existing courses.

NEW COURSE TO RANK:
Course ID: ${newCourse.id}
Title: ${newCourse.title}
${newCourse.description ? `Description: ${newCourse.description.substring(0, 300)}` : 'No description'}
${newCourse.key_skills ? `Key Skills: ${newCourse.key_skills}` : ''}
${newCourse.provider ? `Provider: ${newCourse.provider}` : ''}
${newCourse.tag ? `Tag: ${newCourse.tag}` : ''}

EXISTING COURSES (for reference, ranked by relevancy):
${rankedCourses.map((c, idx) => `
${idx + 1}. Rank ${c[relevancyColumn]}: ${c.title}
   ${c.description ? c.description.substring(0, 150) + '...' : 'No description'}
`).join('\n')}

Based on the NEW COURSE's content and how it compares to the existing courses, determine its relevancy rank for the ${category} category.

Return ONLY a JSON object with a single number representing the rank:
{
  "rank": <number>
}

The rank should be:
- A number between 1 and ${Math.max(...rankedCourses.map(c => c[relevancyColumn] || 999), 100)}
- Lower number = more relevant (rank 1 = most relevant)
- If the new course is more relevant than existing courses, it could be rank 1
- If less relevant, it should be a higher number

Return ONLY the JSON, no additional text.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at ranking educational courses. Return ONLY valid JSON with a "rank" field containing a number.`
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

    const parsed = JSON.parse(content) as { rank: number }
    
    if (typeof parsed.rank !== 'number' || parsed.rank < 1) {
      throw new Error('Invalid rank value from OpenAI')
    }

    return parsed.rank
  } catch (error) {
    console.error(`Error ranking course for ${category}:`, error)
    // Fallback: assign a high rank (low relevancy)
    return 999
  }
}

/**
 * Rank a new course for all three categories and return relevancy scores
 */
export async function rankNewCourse(courseId: string): Promise<{
  business_relevancy: number
  restaurant_relevancy: number
  fleet_relevancy: number
}> {
  if (!openai) {
    console.warn('⚠️ OpenAI not configured, using default relevancy scores')
    return {
      business_relevancy: 999,
      restaurant_relevancy: 999,
      fleet_relevancy: 999
    }
  }

  try {
    // Fetch the new course
    const { data: newCourse, error: courseError } = await supabase
      .from('courses')
      .select('id, title, description, key_skills, provider, tag')
      .eq('id', courseId)
      .single()

    if (courseError || !newCourse) {
      throw new Error(`Failed to fetch new course: ${courseError?.message}`)
    }

    // Fetch existing courses for comparison
    const { data: existingCourses, error: existingError } = await supabase
      .from('courses')
      .select('id, title, description, key_skills, business_relevancy, restaurant_relevancy, fleet_relevancy')
      .neq('id', courseId) // Exclude the new course
      .order('created_at', { ascending: false })
      .limit(50) // Get recent courses for comparison

    if (existingError) {
      console.warn('⚠️ Failed to fetch existing courses for comparison:', existingError)
    }

    const courses = existingCourses || []

    console.log(`🤖 Ranking new course "${newCourse.title}" for all categories...`)

    // Rank for each category
    const [businessRank, restaurantRank, fleetRank] = await Promise.all([
      rankCourseForCategory(newCourse, 'Business', courses),
      rankCourseForCategory(newCourse, 'Restaurant', courses),
      rankCourseForCategory(newCourse, 'Fleet', courses)
    ])

    console.log(`✅ Relevancy scores: Business=${businessRank}, Restaurant=${restaurantRank}, Fleet=${fleetRank}`)

    return {
      business_relevancy: businessRank,
      restaurant_relevancy: restaurantRank,
      fleet_relevancy: fleetRank
    }
  } catch (error) {
    console.error('Error ranking new course:', error)
    // Return default high ranks (low relevancy) on error
    return {
      business_relevancy: 999,
      restaurant_relevancy: 999,
      fleet_relevancy: 999
    }
  }
}

/**
 * Rank all courses for a specific landing page tag
 * Updates the relevancy column for all courses
 */
export async function rankCoursesForLandingPage(
  tag: string,
  relevancyColumn: string,
  categoryContext: string
): Promise<{ success: boolean; ranked: number }> {
  if (!openai) {
    console.warn('⚠️ OpenAI not configured, skipping ranking')
    return { success: false, ranked: 0 }
  }

  try {
    // Fetch landing page to get context
    const { data: landingPage } = await supabaseAdmin
      .from('landing_pages')
      .select('name, description')
      .eq('tag', tag)
      .single()

    const context = categoryContext || landingPage?.description || `AI courses relevant to ${landingPage?.name || tag}`

    // Fetch all courses
    const { data: allCourses, error: fetchError } = await supabaseAdmin
      .from('courses')
      .select('id, title, description, key_skills, provider, tag')

    if (fetchError) {
      throw new Error(`Failed to fetch courses: ${fetchError.message}`)
    }

    if (!allCourses || allCourses.length === 0) {
      console.log('No courses to rank')
      return { success: true, ranked: 0 }
    }

    console.log(`🤖 Ranking ${allCourses.length} courses for landing page "${tag}"...`)

    // Rank courses in batches to avoid rate limits
    const batchSize = 10
    let rankedCount = 0

    for (let i = 0; i < allCourses.length; i += batchSize) {
      const batch = allCourses.slice(i, i + batchSize)
      
      const rankingPromises = batch.map(async (course) => {
        // Get existing ranked courses for comparison
        // Use select with dynamic column name - Supabase supports this
        const { data: existingCoursesData } = await supabaseAdmin
          .from('courses')
          .select(`id, title, description, key_skills, ${relevancyColumn}`)
          .not(relevancyColumn, 'is', null)
          .neq('id', course.id)
          .order(relevancyColumn, { ascending: true })
          .limit(20)

        const existingCourses = (existingCoursesData || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          key_skills: c.key_skills,
          [relevancyColumn]: c[relevancyColumn]
        }))

        const rankedCourses = (existingCourses || []).sort((a, b) => 
          (a[relevancyColumn] || 999) - (b[relevancyColumn] || 999)
        )

        const prompt = `You are an expert at ranking educational courses by their relevance to specific categories.

Category: ${tag}
Context: ${context}

You need to rank a course relative to ${rankedCourses.length} existing courses.

COURSE TO RANK:
Course ID: ${course.id}
Title: ${course.title}
${course.description ? `Description: ${course.description.substring(0, 300)}` : 'No description'}
${course.key_skills ? `Key Skills: ${course.key_skills}` : ''}
${course.provider ? `Provider: ${course.provider}` : ''}

EXISTING COURSES (for reference, ranked by relevancy):
${rankedCourses.map((c, idx) => `
${idx + 1}. Rank ${c[relevancyColumn]}: ${c.title}
   ${c.description ? c.description.substring(0, 150) + '...' : 'No description'}
`).join('\n')}

Based on the COURSE's content and how it compares to the existing courses, determine its relevancy rank for the ${tag} category.

Return ONLY a JSON object with a single number representing the rank:
{
  "rank": <number>
}

The rank should be:
- A number between 1 and ${Math.max(...rankedCourses.map(c => c[relevancyColumn] || 999), 100)}
- Lower number = more relevant (rank 1 = most relevant)
- If the course is more relevant than existing courses, it could be rank 1
- If less relevant, it should be a higher number

Return ONLY the JSON, no additional text.`

        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert at ranking educational courses. Return ONLY valid JSON with a "rank" field containing a number.`
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

          const parsed = JSON.parse(content) as { rank: number }
          
          if (typeof parsed.rank !== 'number' || parsed.rank < 1) {
            throw new Error('Invalid rank value from OpenAI')
          }

          // Update the course with the relevancy score
          const { error: updateError } = await supabaseAdmin
            .from('courses')
            .update({ [relevancyColumn]: parsed.rank })
            .eq('id', course.id)

          if (updateError) {
            console.error(`Error updating course ${course.id}:`, updateError)
            return false
          }

          rankedCount++
          return true
        } catch (error) {
          console.error(`Error ranking course ${course.id}:`, error)
          // Assign default high rank on error
          await supabaseAdmin
            .from('courses')
            .update({ [relevancyColumn]: 999 })
            .eq('id', course.id)
          return false
        }
      })

      await Promise.all(rankingPromises)
      
      // Small delay between batches to avoid rate limits
      if (i + batchSize < allCourses.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`✅ Successfully ranked ${rankedCount} courses for "${tag}"`)
    return { success: true, ranked: rankedCount }
  } catch (error) {
    console.error(`Error ranking courses for landing page ${tag}:`, error)
    return { success: false, ranked: 0 }
  }
}

