import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api-middleware'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isValidUUID } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = params

    // Validate UUID format
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid UUID format' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact submission:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete contact submission' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/contact-submissions/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
