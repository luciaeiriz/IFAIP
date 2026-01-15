import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET enabled landing pages only (public)
// Using supabaseAdmin to bypass RLS and ensure we get the latest data
// We filter by is_enabled=true in JavaScript to avoid Supabase query issues
export async function GET(request: NextRequest) {
  try {
    console.log(`🔍 GET /api/landing-pages: Querying for enabled landing pages...`)
    
    // Query ALL landing pages first, then filter in JavaScript
    // This avoids potential Supabase query filter issues and ensures we get all data
    // Use a fresh query with explicit cache-busting and force fresh connection
    // Add a small delay to ensure any recent deletions are committed
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const { data: allPages, error } = await supabaseAdmin
      .from('landing_pages')
      .select('id, tag, name, description, subtitle, bg_color, hero_title, is_enabled, display_order, created_at, updated_at')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching landing pages:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch landing pages' },
        { status: 500 }
      )
    }

    console.log(`📋 All landing pages in database (${allPages?.length || 0} total):`)
    if (allPages) {
      allPages.forEach((page) => {
        console.log(`  - ${page.name} (${page.tag}): is_enabled=${page.is_enabled} (type: ${typeof page.is_enabled})`)
      })
      
      // Check if Healthcare exists
      const healthcare = allPages.find(p => p.tag === 'healthcare')
      if (healthcare) {
        console.log(`⚠️ Healthcare still exists in database:`, {
          id: healthcare.id,
          name: healthcare.name,
          tag: healthcare.tag,
          is_enabled: healthcare.is_enabled,
          is_enabled_type: typeof healthcare.is_enabled
        })
      } else {
        console.log(`✅ Healthcare NOT found in database (correctly deleted)`)
      }
    } else {
      console.log(`⚠️ No landing pages found in database`)
    }

    // Filter enabled pages in JavaScript - handle all possible true values
    // This ensures we catch enabled pages regardless of how the boolean is stored
    const enabledPages = (allPages || []).filter((page) => {
      // Handle boolean true, string "true", number 1, and any truthy value that represents enabled
      const isEnabled = page.is_enabled === true || 
                       page.is_enabled === 'true' || 
                       page.is_enabled === 1 ||
                       (typeof page.is_enabled === 'string' && page.is_enabled.toLowerCase() === 'true')
      
      // Log detailed information for debugging
      if (isEnabled) {
        console.log(`✅ Page ${page.name} (${page.tag}) PASSED filter - is_enabled=${page.is_enabled} (type: ${typeof page.is_enabled})`)
      } else {
        console.log(`❌ Page ${page.name} (${page.tag}) FILTERED OUT - is_enabled=${page.is_enabled} (type: ${typeof page.is_enabled})`)
      }
      
      return isEnabled
    })

    console.log(`📊 GET /api/landing-pages: Found ${enabledPages.length} enabled landing pages (filtered from ${allPages?.length || 0} total)`)
    enabledPages.forEach((page) => {
      console.log(`  ✅ ${page.name} (${page.tag}): is_enabled=${page.is_enabled}`)
    })

    // Transform to match the format expected by frontend components
    const landingPages = enabledPages.map((page) => {
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
    return NextResponse.json(
      { success: true, landingPages },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
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
