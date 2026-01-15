import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force dynamic rendering - never cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET enabled landing pages only (public)
// Using supabaseAdmin to bypass RLS and ensure we get the latest data
// Filter at database level for reliability and performance
export async function GET(request: NextRequest) {
  try {
    console.log(`🔍 GET /api/landing-pages: Querying for enabled landing pages...`)
    
    // Query only enabled landing pages at the database level
    // This is more efficient and reliable than filtering in JavaScript
    const { data: enabledPages, error } = await supabaseAdmin
      .from('landing_pages')
      .select('id, tag, name, description, subtitle, bg_color, hero_title, is_enabled, display_order, created_at, updated_at')
      .eq('is_enabled', true)  // Filter at database level
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching landing pages:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch landing pages' },
        { status: 500 }
      )
    }

    console.log(`📊 GET /api/landing-pages: Found ${enabledPages?.length || 0} enabled landing pages`)
    if (enabledPages) {
      enabledPages.forEach((page) => {
        console.log(`  ✅ ${page.name} (${page.tag}): is_enabled=${page.is_enabled}`)
      })
    } else {
      console.log(`⚠️ No enabled landing pages found in database`)
    }

    // Transform to match the format expected by frontend components
    const landingPages = (enabledPages || []).map((page) => {
      return {
        tag: page.tag,
        name: page.name,
        href: `/courses/${page.tag}`,
        description: page.description || '',
        subtitle: page.subtitle || 'at IFAIP',
        bgColor: page.bg_color || '#2563eb',
        heroTitle: page.hero_title,
      }
    })

    console.log(`✅ Returning ${landingPages.length} enabled landing pages:`)
    landingPages.forEach(p => {
      console.log(`  - ${p.name} (${p.tag})`)
    })

    // Prevent caching to ensure disabled landing pages are immediately removed
    // Also add revalidate: 0 to ensure Next.js doesn't cache this route
    return NextResponse.json(
      { success: true, landingPages },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    )
  } catch (error) {
    console.error('Error in GET /api/landing-pages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
