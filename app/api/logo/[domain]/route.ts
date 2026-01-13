import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { supabaseAdmin } from '@/lib/supabase-admin'

async function getFallbackLogo(): Promise<Buffer> {
  try {
    const filePath = join(process.cwd(), 'public', 'cognite_logo.png')
    return await readFile(filePath)
  } catch (error) {
    console.error('Error reading fallback logo:', error)
    // Return a 1x1 transparent PNG as ultimate fallback
    return Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> | { domain: string } }
) {
  // Handle both sync and async params (Next.js 14 vs 15+)
  const resolvedParams = await Promise.resolve(params)
  const domain = resolvedParams.domain
  const apiKey = process.env.LOGO_DEV_API
  const publicApiKey = process.env.LOGO_DEV_PUBLIC_API

  console.log(`[Logo API] ===== REQUEST RECEIVED =====`)
  console.log(`[Logo API] Domain: ${domain}`)
  console.log(`[Logo API] Secret Key (LOGO_DEV_API) present: ${apiKey ? 'YES' : 'NO'}`)
  console.log(`[Logo API] Secret Key value: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET'}`)
  console.log(`[Logo API] Public Key (LOGO_DEV_PUBLIC_API) present: ${publicApiKey ? 'YES' : 'NO'}`)
  console.log(`[Logo API] Public Key value: ${publicApiKey ? publicApiKey.substring(0, 10) + '...' : 'NOT SET'}`)
  console.log(`[Logo API] All LOGO_DEV env vars:`, Object.keys(process.env).filter(k => k.includes('LOGO_DEV')))
  console.log(`[Logo API] Request URL: ${request.url}`)
  
  // Logo.dev image CDN typically uses public keys, so try public key first
  // Fallback to secret key if public key not available
  const keyToUse = publicApiKey || apiKey
  const keyType = publicApiKey ? 'PUBLIC (pk_)' : (apiKey ? 'SECRET (sk_)' : 'NONE')

  if (!keyToUse) {
    console.warn('[Logo API] ⚠️ Logo.dev API key not configured, returning fallback logo')
    console.warn('[Logo API] ⚠️ Please set LOGO_DEV_API or LOGO_DEV_PUBLIC_API environment variable in Vercel')
    // Return fallback logo instead of 404 so logos still display
    const fallbackLogoBuffer = await getFallbackLogo()
    // Convert Buffer to ArrayBuffer for NextResponse compatibility
    const fallbackLogo: ArrayBuffer = new Uint8Array(fallbackLogoBuffer).buffer
    return new NextResponse(fallbackLogo, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  }

  if (!domain) {
    console.warn('[Logo API] ⚠️ No domain provided, returning 404')
    // Return 404 so Image component's onError handler fires
    return new NextResponse(null, {
      status: 404,
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  try {
    // Step 1: Check database for existing logo_url for this domain
    // Find courses that match this domain (via external_url or provider)
    console.log(`[Logo API] Checking database for cached logo_url for domain: ${domain}`)
    
    const { data: coursesWithLogo, error: dbError } = await supabaseAdmin
      .from('courses')
      .select('id, logo_url, external_url, provider')
      .or(`external_url.ilike.%${domain}%,provider.ilike.%${domain}%`)
      .not('logo_url', 'is', null)
      .limit(1)
    
    if (dbError) {
      console.warn(`[Logo API] Database query error (non-fatal):`, dbError)
    }
    
    // If we found a cached logo_url, use it
    if (coursesWithLogo && coursesWithLogo.length > 0 && coursesWithLogo[0].logo_url) {
      const cachedLogoUrl = coursesWithLogo[0].logo_url
      console.log(`[Logo API] ✅ Found cached logo_url in database: ${cachedLogoUrl.substring(0, 50)}...`)
      
      // Fetch the logo from the cached URL (Logo.dev CDN will handle caching)
      try {
        const cachedResponse = await fetch(cachedLogoUrl, {
          signal: AbortSignal.timeout(10000),
          headers: {
            'User-Agent': 'IFAIP-Logo-Fetcher/1.0',
          },
        })
        
        if (cachedResponse.ok) {
          const imageBuffer = await cachedResponse.arrayBuffer()
          const contentType = cachedResponse.headers.get('content-type') || 'image/png'
          const imageSize = imageBuffer.byteLength
          
          console.log(`[Logo API] ✅ Successfully fetched logo from cache (${imageSize} bytes / ${(imageSize / 1024).toFixed(2)}KB)`)
          return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
            },
          })
        } else {
          console.log(`[Logo API] ⚠️ Cached URL returned ${cachedResponse.status}, fetching fresh logo`)
        }
      } catch (cacheError) {
        console.warn(`[Logo API] ⚠️ Error fetching cached logo (non-fatal):`, cacheError)
        // Continue to fetch fresh logo below
      }
    } else {
      console.log(`[Logo API] No cached logo_url found in database, fetching fresh logo`)
    }
    
    // Step 2: Fetch fresh logo from Logo.dev API
    // Construct Logo.dev URL
    // Logo.dev uses 'token' parameter for both public (pk_) and secret (sk_) keys
    const logoUrl = `https://img.logo.dev/${domain}?token=${keyToUse}&size=128&format=png&theme=light&fallback=404`
    
    console.log(`[Logo API] Fetching logo for domain: ${domain}`)
    console.log(`[Logo API] Using key type: ${keyType}`)
    console.log(`[Logo API] Logo.dev URL: ${logoUrl.replace(keyToUse, '***')}`)
    
    // Fetch the logo from Logo.dev
    const response = await fetch(logoUrl, {
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout (increased from 5)
      headers: {
        'User-Agent': 'IFAIP-Logo-Fetcher/1.0',
      },
    })
    
    console.log(`[Logo API] Response status: ${response.status} for domain: ${domain}`)
    console.log(`[Logo API] Response OK: ${response.ok}`)
    
    if (!response.ok) {
      // If secret key failed and we have a public key, try with public key
      console.log(`[Logo API] Checking fallback conditions:`)
      console.log(`[Logo API]   - Status is 401: ${response.status === 401}`)
      console.log(`[Logo API]   - apiKey exists: ${!!apiKey}`)
      console.log(`[Logo API]   - publicApiKey exists: ${!!publicApiKey}`)
      console.log(`[Logo API]   - keyToUse === apiKey: ${keyToUse === apiKey}`)
      
      // If public key failed and we have a secret key, try with secret key
      // Or if secret key failed and we have a public key, try with public key
      if (response.status === 401 && ((publicApiKey && keyToUse === publicApiKey && apiKey) || (apiKey && keyToUse === apiKey && publicApiKey))) {
        const fallbackKey = keyToUse === publicApiKey ? apiKey : publicApiKey
        const fallbackKeyType = fallbackKey === publicApiKey ? 'PUBLIC (pk_)' : 'SECRET (sk_)'
        console.log(`[Logo API] ✅ All conditions met! ${keyType} returned 401, trying ${fallbackKeyType} for domain: ${domain}`)
        const fallbackLogoUrl = `https://img.logo.dev/${domain}?token=${fallbackKey}&size=128&format=png&theme=light&fallback=404`
        console.log(`[Logo API] Fallback URL: ${fallbackLogoUrl.replace(fallbackKey, '***')}`)
        const publicResponse = await fetch(fallbackLogoUrl, {
          signal: AbortSignal.timeout(10000),
          headers: {
            'User-Agent': 'IFAIP-Logo-Fetcher/1.0',
          },
        })
        
        console.log(`[Logo API] Fallback ${fallbackKeyType} response status: ${publicResponse.status}`)
        console.log(`[Logo API] Fallback ${fallbackKeyType} response OK: ${publicResponse.ok}`)
        
        if (publicResponse.ok) {
          console.log(`[Logo API] ✅ Fallback ${fallbackKeyType} worked! Using ${fallbackKeyType} for domain: ${domain}`)
          // Continue with publicResponse instead
          const imageBuffer = await publicResponse.arrayBuffer()
          const contentType = publicResponse.headers.get('content-type') || 'image/png'
          const imageSize = imageBuffer.byteLength
          
          console.log(`[Logo API] ✅ Successfully fetched logo for domain: ${domain} (${imageSize} bytes / ${(imageSize / 1024).toFixed(2)}KB)`)
          return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          })
        } else {
          console.log(`[Logo API] ❌ Fallback ${fallbackKeyType} also failed with status ${publicResponse.status}`)
        }
      } else {
        console.log(`[Logo API] ⚠️ Fallback conditions not met, skipping fallback attempt`)
      }
      
      // If we get a 401 (authentication error), return fallback logo instead of 404
      if (response.status === 401) {
        console.log(`[Logo API] ⚠️ Authentication failed (401) for domain: ${domain}, returning fallback logo`)
        console.log(`[Logo API] ⚠️ Please check your LOGO_DEV_API or LOGO_DEV_PUBLIC_API key in .env.local`)
        const fallbackLogoBuffer = await getFallbackLogo()
        // Convert Buffer to ArrayBuffer for NextResponse compatibility
        const fallbackLogo: ArrayBuffer = new Uint8Array(fallbackLogoBuffer).buffer
        return new NextResponse(fallbackLogo, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          },
        })
      }
      
      console.log(`[Logo API] Logo.dev returned ${response.status} for domain: ${domain}, returning 404`)
      // Return 404 so Image component's onError handler fires
      // Components will handle showing nothing for courses with external_url
      return new NextResponse(null, {
        status: 404,
        headers: {
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      })
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/png'
    const imageSize = imageBuffer.byteLength
    
    console.log(`[Logo API] ✅ Successfully fetched logo for domain: ${domain} (${imageSize} bytes / ${(imageSize / 1024).toFixed(2)}KB)`)
    
    // Step 3: Save logo_url to database for all courses matching this domain
    // This avoids future API calls for the same domain
    try {
      // Find all courses that match this domain
      const { data: matchingCourses, error: findError } = await supabaseAdmin
        .from('courses')
        .select('id, external_url, provider')
        .or(`external_url.ilike.%${domain}%,provider.ilike.%${domain}%`)
      
      if (!findError && matchingCourses && matchingCourses.length > 0) {
        // Update all matching courses with the logo_url
        const courseIds = matchingCourses.map(c => c.id)
        const { error: updateError } = await supabaseAdmin
          .from('courses')
          .update({ logo_url: logoUrl })
          .in('id', courseIds)
        
        if (updateError) {
          console.warn(`[Logo API] ⚠️ Failed to save logo_url to database (non-fatal):`, updateError)
        } else {
          console.log(`[Logo API] ✅ Saved logo_url to ${matchingCourses.length} course(s) in database`)
        }
      } else if (findError) {
        console.warn(`[Logo API] ⚠️ Error finding courses to update (non-fatal):`, findError)
      }
    } catch (saveError) {
      console.warn(`[Logo API] ⚠️ Error saving logo_url to database (non-fatal):`, saveError)
      // Don't fail the request if saving fails - logo still works
    }
    
    console.log(`[Logo API] ===== REQUEST COMPLETE =====`)
    
    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    })
  } catch (error) {
    console.error(`[Logo API] ❌ Error fetching logo for domain ${domain}:`, error)
    if (error instanceof Error) {
      console.error(`[Logo API] Error message: ${error.message}`)
      console.error(`[Logo API] Error stack: ${error.stack}`)
    }
    // Return 404 so Image component's onError handler fires
    // Components will handle showing nothing for courses with external_url
    return new NextResponse(null, {
      status: 404,
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  }
}

