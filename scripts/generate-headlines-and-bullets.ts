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

interface GeneratedContent {
  headline: string
  bulletPoints: string[]
}

async function generateHeadlineAndBullets(
  title: string,
  description: string | null,
  keySkills: string | null
): Promise<GeneratedContent> {
  const courseInfo = `
Title: ${title}
${description ? `Description: ${description}` : ''}
${keySkills ? `Key Skills: ${keySkills}` : ''}
`.trim()

  const prompt = `Generate content for this course:

Course Information:
${courseInfo}

Generate:
1. A short headline/tagline (maximum 60 characters) that captures the essence of what this course teaches. Make it compelling and concise.
2. A list of 3-5 bullet points that break down the key learning outcomes or what students will learn. Each bullet point should be a complete sentence ending with a period.

Return ONLY valid JSON in this exact format:
{
  "headline": "Short compelling headline here",
  "bulletPoints": [
    "First key learning outcome.",
    "Second key learning outcome.",
    "Third key learning outcome."
  ]
}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating compelling course descriptions. Always return valid JSON only, no additional text. Headlines must be 60 characters or less.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(content) as { headline: string; bulletPoints: string[] }
    
    // Validate the response structure
    if (!parsed.headline || !Array.isArray(parsed.bulletPoints)) {
      throw new Error('Invalid response structure from OpenAI')
    }

    // Ensure headline is max 60 characters
    const headline = parsed.headline.length > 60 
      ? parsed.headline.substring(0, 57).trim() + '...'
      : parsed.headline.trim()

    // Ensure bullet points are clean (trimmed, non-empty)
    const bulletPoints = parsed.bulletPoints
      .map(bp => bp.trim())
      .filter(bp => bp.length > 0)
      .slice(0, 5) // Max 5 bullet points

    return {
      headline,
      bulletPoints
    }
  } catch (error) {
    console.error(`Error generating content for course "${title}":`, error)
    // Return fallback content
    const fallbackHeadline = description 
      ? description.substring(0, 57).trim() + '...'
      : title.substring(0, 60)
    
    const fallbackBullets = description
      ? description.split('.').filter(s => s.trim()).slice(0, 3).map(s => s.trim() + '.')
      : []

    return {
      headline: fallbackHeadline,
      bulletPoints: fallbackBullets
    }
  }
}

async function generateAndUpdateCourses() {
  console.log('🤖 === STARTING HEADLINE AND BULLET POINTS GENERATION ===\n')

  try {
    // Fetch all courses that don't have headline or bullet_points yet
    console.log('📥 Fetching courses from database...')
    const { data: courses, error: fetchError } = await supabase
      .from('courses')
      .select('id, title, description, key_skills, headline, bullet_points')
      .order('created_at', { ascending: true })

    if (fetchError) {
      throw new Error(`Failed to fetch courses: ${fetchError.message}`)
    }

    if (!courses || courses.length === 0) {
      console.log('⚠️  No courses found in database')
      return
    }

    console.log(`✅ Found ${courses.length} courses\n`)

    // Filter courses that need generation (missing headline or bullet_points)
    const coursesToUpdate = courses.filter(
      course => !course.headline || !course.bullet_points || course.bullet_points.length === 0
    )

    if (coursesToUpdate.length === 0) {
      console.log('✅ All courses already have headlines and bullet points!')
      return
    }

    console.log(`📊 Found ${coursesToUpdate.length} courses that need content generation\n`)

    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    // Process each course
    for (let i = 0; i < coursesToUpdate.length; i++) {
      const course = coursesToUpdate[i]
      
      // Skip if no description available
      if (!course.description || course.description.trim().length === 0) {
        console.log(`\n[${i + 1}/${coursesToUpdate.length}] ⏭️  Skipping "${course.title}" - no description`)
        skippedCount++
        continue
      }

      console.log(`\n[${i + 1}/${coursesToUpdate.length}] Generating content for: "${course.title}"`)
      
      try {
        const generated = await generateHeadlineAndBullets(
          course.title,
          course.description,
          course.key_skills
        )

        console.log(`  📝 Headline: ${generated.headline}`)
        console.log(`  📋 Bullet Points: ${generated.bulletPoints.length}`)
        generated.bulletPoints.forEach((bp, idx) => {
          console.log(`     ${idx + 1}. ${bp}`)
        })

        // Update the course in database
        const { error: updateError } = await supabase
          .from('courses')
          .update({
            headline: generated.headline,
            bullet_points: generated.bulletPoints
          })
          .eq('id', course.id)

        if (updateError) {
          console.error(`  ❌ Error updating course:`, updateError)
          errorCount++
        } else {
          console.log(`  ✅ Successfully updated`)
          successCount++
        }

        // Add delay to avoid rate limiting (1 second between requests)
        if (i < coursesToUpdate.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error(`  ❌ Error processing course:`, error)
        errorCount++
      }
    }

    console.log('\n\n✅ === GENERATION COMPLETE ===')
    console.log(`✅ Successfully updated: ${successCount} courses`)
    console.log(`⏭️  Skipped: ${skippedCount} courses`)
    console.log(`❌ Errors: ${errorCount}`)

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the generation
generateAndUpdateCourses()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })


