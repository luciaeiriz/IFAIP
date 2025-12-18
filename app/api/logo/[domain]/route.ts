import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

async function getFallbackLogo(): Promise<Buffer> {
  try {
    const filePath = join(process.cwd(), 'public', 'logomark.png')
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
  { params }: { params: { domain: string } }
) {
  const domain = params.domain
  const apiKey = process.env.LOGO_DEV_API

  if (!apiKey) {
    console.warn('Logo.dev API key not configured, returning fallback logo')
    const fallbackImage = await getFallbackLogo()
    return new NextResponse(fallbackImage, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  }

  if (!domain) {
    const fallbackImage = await getFallbackLogo()
    return new NextResponse(fallbackImage, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  try {
    // Construct Logo.dev URL
    const logoUrl = `https://img.logo.dev/${domain}?token=${apiKey}&size=128&format=png&theme=light&fallback=404`
    
    // Fetch the logo from Logo.dev
    const response = await fetch(logoUrl, {
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    
    if (!response.ok) {
      console.log(`Logo.dev returned ${response.status} for domain: ${domain}, using fallback`)
      const fallbackImage = await getFallbackLogo()
      return new NextResponse(fallbackImage, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      })
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/png'

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    })
  } catch (error) {
    console.error(`Error fetching logo for domain ${domain}:`, error)
    // Return fallback logo instead of error
    const fallbackImage = await getFallbackLogo()
    return new NextResponse(fallbackImage, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  }
}
