import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET all news items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabaseAdmin
      .from('news_items')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching news items:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch news items' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, newsItems: data || [] })
  } catch (error) {
    console.error('Error in GET /api/admin/news:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new news item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.href || !body.category || !body.label) {
      return NextResponse.json(
        { error: 'Title, href, category, and label are required' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['news', 'blog', 'researcher-spotlights', 'latest-research', 'events']
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: `Category must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Prepare the news item data
    const newsItemData = {
      category: body.category,
      label: body.label,
      title: body.title,
      description: body.description || null,
      date: body.date || null,
      time: body.time || null,
      href: body.href,
      image_color: body.imageColor || 'from-blue-900 to-blue-700',
      display_order: body.display_order || 0,
    }

    const { data, error } = await supabaseAdmin
      .from('news_items')
      .insert([newsItemData])
      .select()
      .single()

    if (error) {
      console.error('Error creating news item:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to create news item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, newsItem: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/news:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update news item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Validate category if provided
    if (body.category) {
      const validCategories = ['news', 'blog', 'researcher-spotlights', 'latest-research', 'events']
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          { error: `Category must be one of: ${validCategories.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {}
    if (body.category !== undefined) updateData.category = body.category
    if (body.label !== undefined) updateData.label = body.label
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.date !== undefined) updateData.date = body.date
    if (body.time !== undefined) updateData.time = body.time
    if (body.href !== undefined) updateData.href = body.href
    if (body.imageColor !== undefined) updateData.image_color = body.imageColor
    if (body.display_order !== undefined) updateData.display_order = body.display_order

    const { data, error } = await supabaseAdmin
      .from('news_items')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating news item:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update news item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, newsItem: data })
  } catch (error) {
    console.error('Error in PUT /api/admin/news:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

