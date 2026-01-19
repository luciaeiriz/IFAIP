import { NextRequest, NextResponse } from 'next/server'
import { isAdminServer } from './admin-auth'

/**
 * Middleware to require admin access for API routes
 * Returns NextResponse with 401 if not admin, or null if admin
 * 
 * Usage:
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const authError = await requireAdmin(request)
 *   if (authError) return authError
 *   
 *   // ... rest of route logic
 * }
 * ```
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const isAdmin = await isAdminServer(request)
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Admin access required.' },
      { status: 401 }
    )
  }
  
  return null
}
