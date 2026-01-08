import { NextRequest, NextResponse } from 'next/server'
import { getCoursesByTag } from '@/src/data/courses'
import { CourseTag } from '@/types/course'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tag = searchParams.get('tag') as CourseTag | null

    if (!tag || !['Business', 'Restaurant', 'Fleet'].includes(tag)) {
      return NextResponse.json(
        { error: 'Invalid tag. Must be Business, Restaurant, or Fleet' },
        { status: 400 }
      )
    }

    // Use the EXACT same function that course pages use
    const courses = await getCoursesByTag(tag)

    return NextResponse.json({
      tag,
      count: courses.length,
      courses,
    })
  } catch (error) {
    console.error('Error fetching courses by tag:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

