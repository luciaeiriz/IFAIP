import { NextRequest, NextResponse } from 'next/server'
import { isAdminServer } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isAdminServer(request)
    
    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error('Error in /api/admin/check-status:', error)
    return NextResponse.json(
      { error: 'Failed to check admin status', isAdmin: false },
      { status: 500 }
    )
  }
}
