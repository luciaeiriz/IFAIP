import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'

// DELETE news item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('news_items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting news item:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete news item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/news/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

