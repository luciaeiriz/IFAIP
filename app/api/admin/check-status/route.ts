import { NextRequest, NextResponse } from 'next/server'
import { isAdminServer } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/admin/check-status/route.ts:4',message:'check-status API entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  try {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/admin/check-status/route.ts:6',message:'before isAdminServer',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const isAdmin = await isAdminServer(request)
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/admin/check-status/route.ts:8',message:'after isAdminServer',data:{isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/admin/check-status/route.ts:10',message:'before returning response',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return NextResponse.json({ isAdmin })
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/admin/check-status/route.ts:12',message:'check-status API error',data:{errorMessage:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    console.error('Error in /api/admin/check-status:', error)
    return NextResponse.json(
      { error: 'Failed to check admin status', isAdmin: false },
      { status: 500 }
    )
  }
}
