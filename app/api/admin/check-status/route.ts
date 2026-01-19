import { NextRequest, NextResponse } from 'next/server'
import { isAdminServer } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAdminServer(request)
    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error('Error in /api/admin/check-status:', error)
    // Log more details in production for debugging
    if (process.env.NODE_ENV === 'production') {
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        // Don't log sensitive info, but log if service role key is missing
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      })
    }
    return NextResponse.json(
      { error: 'Failed to check admin status', isAdmin: false },
      { status: 500 }
    )
  }
}
