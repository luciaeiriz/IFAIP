import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rankNewCourse } from '@/lib/rank-course'
import { randomUUID } from 'crypto'
import { validateLength } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.tag) {
      return NextResponse.json(
        { error: 'Title and tag are required' },
        { status: 400 }
      )
    }

    // Validate input lengths
    const titleValidation = validateLength(body.title, 500, 'Title')
    if (!titleValidation.isValid) {
      return NextResponse.json(
        { error: titleValidation.error },
        { status: 400 }
      )
    }

    if (body.description) {
      const descValidation = validateLength(body.description, 5000, 'Description')
      if (!descValidation.isValid) {
        return NextResponse.json(
          { error: descValidation.error },
          { status: 400 }
        )
      }
    }

    if (body.headline) {
      const headlineValidation = validateLength(body.headline, 200, 'Headline')
      if (!headlineValidation.isValid) {
        return NextResponse.json(
          { error: headlineValidation.error },
          { status: 400 }
        )
      }
    }

    // Validate tag is one of allowed values
    const validTags = ['Business', 'Restaurant', 'Fleet']
    if (!validTags.includes(body.tag)) {
      return NextResponse.json(
        { error: `Tag must be one of: ${validTags.join(', ')}` },
        { status: 400 }
      )
    }

    // Prepare the course data for database
    // Generate UUID client-side to ensure it's set (database default might not work with admin client)
    const courseData: any = {
      id: randomUUID(), // Generate UUID client-side
      title: body.title,
      description: body.description || null,
      headline: body.headline || null,
      bullet_points: body.bullet_points || null,
      provider: body.provider || null,
      level: body.level || null,
      duration: body.duration || null,
      tag: body.tag,
      external_url: body.external_url || null,
      rating: body.rating || null,
      reviews: body.reviews || null,
      course_type: body.course_type || null,
      key_skills: body.key_skills || null,
      modules: body.modules || null,
      instructors: body.instructors || null,
      effort: body.effort || null,
      languages: body.languages || null,
      free_trial: body.free_trial || null,
      price_label: body.price_label || null,
      source: body.source || 'admin',
      signup_enabled: body.signup_enabled ?? true,
    }

    // Insert the course first (using admin client to bypass RLS)
    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert([courseData])
      .select()
      .single()

    if (error) {
      console.error('Error creating course:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create course' },
        { status: 500 }
      )
    }

    // Rank the new course using OpenAI
    try {
      console.log('🤖 Ranking new course with OpenAI...')
      const relevancyScores = await rankNewCourse(data.id)
      
      // Update the course with relevancy scores (using admin client to bypass RLS)
      const { error: updateError } = await supabaseAdmin
        .from('courses')
        .update({
          business_relevancy: relevancyScores.business_relevancy,
          restaurant_relevancy: relevancyScores.restaurant_relevancy,
          fleet_relevancy: relevancyScores.fleet_relevancy,
        })
        .eq('id', data.id)

      if (updateError) {
        console.error('Error updating relevancy scores:', updateError)
        // Don't fail the request, just log the error
      } else {
        console.log('✅ Relevancy scores updated successfully')
        // Fetch the updated course
        const { data: updatedCourse } = await supabaseAdmin
          .from('courses')
          .select()
          .eq('id', data.id)
          .single()
        
        if (updatedCourse) {
          return NextResponse.json({ success: true, course: updatedCourse }, { status: 201 })
        }
      }
    } catch (rankingError) {
      console.error('Error ranking course:', rankingError)
      // Don't fail the request if ranking fails, just log it
    }

    return NextResponse.json({ success: true, course: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


