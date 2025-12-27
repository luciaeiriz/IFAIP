import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Generate logo URL from provider name or external_url (same logic as in components)
// Priority: Provider name first (more accurate), then external_url domain
function getLogoUrl(provider: string | null, externalUrl: string | null): string | null {
  // First, try provider name mapping (most accurate)
  if (provider && provider.trim() !== '') {
    const normalizedProvider = provider.toLowerCase().trim().replace(/\s+/g, ' ')
    
    const providerDomainMap: Record<string, string> = {
      'oxford university': 'ox.ac.uk',
      'university of oxford': 'ox.ac.uk',
      'oxford': 'ox.ac.uk',
      'mit': 'mit.edu',
      'massachusetts institute of technology': 'mit.edu',
      'harvard university': 'harvard.edu',
      'harvard': 'harvard.edu',
      'harvard business school': 'hbs.edu',
      'stanford university': 'stanford.edu',
      'stanford': 'stanford.edu',
      'university of pennsylvania': 'upenn.edu',
      'wharton': 'wharton.upenn.edu',
      'lund university': 'lu.se',
      'coursera': 'coursera.org',
      'edx': 'edx.org',
      'udemy': 'udemy.com',
      'linkedin learning': 'linkedin.com',
      'linkedin': 'linkedin.com',
      'pluralsight': 'pluralsight.com',
      'udacity': 'udacity.com',
      'google': 'google.com',
      'ibm': 'ibm.com',
      'openai': 'openai.com',
    }

    if (providerDomainMap[normalizedProvider]) {
      return `/api/logo/${encodeURIComponent(providerDomainMap[normalizedProvider])}`
    }

    for (const [key, domain] of Object.entries(providerDomainMap)) {
      if (normalizedProvider.includes(key) || key.includes(normalizedProvider)) {
        return `/api/logo/${encodeURIComponent(domain)}`
      }
    }

    if (normalizedProvider.includes('.')) {
      return `/api/logo/${encodeURIComponent(normalizedProvider)}`
    }
  }

  // Fall back to extracting domain from external_url (for cases where provider is not mapped)
  if (externalUrl) {
    try {
      const url = new URL(externalUrl)
      const hostname = url.hostname
      // Remove 'www.' prefix if present
      const domain = hostname.replace(/^www\./, '')
      if (domain) {
        return `/api/logo/${encodeURIComponent(domain)}`
      }
    } catch (e) {
      // If URL parsing fails, return null
    }
  }

  return null
}

async function testLogoFetch(logoUrl: string, provider: string): Promise<{ success: boolean; size: number; isMonogram: boolean }> {
  try {
    // Use localhost API endpoint for testing
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const fullUrl = logoUrl.startsWith('http') ? logoUrl : `${baseUrl}${logoUrl}`
    
    const response = await fetch(fullUrl, {
      signal: AbortSignal.timeout(5000),
    })
    
    if (!response.ok) {
      return { success: false, size: 0, isMonogram: false }
    }
    
    const imageBuffer = await response.arrayBuffer()
    const imageSize = imageBuffer.byteLength
    const isMonogram = imageSize < 15000
    
    return { success: true, size: imageSize, isMonogram }
  } catch (error) {
    return { success: false, size: 0, isMonogram: false }
  }
}

async function testAllLogos() {
  console.log('🔍 Fetching all courses from database...')
  
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, provider, external_url')
    .not('provider', 'is', null)
  
  if (error) {
    console.error('❌ Error fetching courses:', error)
    process.exit(1)
  }
  
  if (!courses || courses.length === 0) {
    console.log('✅ No courses found')
    return
  }
  
  console.log(`📊 Found ${courses.length} courses with providers`)
  
  // Get unique providers
  const uniqueProviders = new Map<string, { provider: string; external_url: boolean }>()
  
  courses.forEach(course => {
    if (course.provider && course.provider.trim()) {
      const key = course.provider.toLowerCase().trim()
      if (!uniqueProviders.has(key)) {
        uniqueProviders.set(key, {
          provider: course.provider,
          external_url: !!(course.external_url && course.external_url.trim())
        })
      }
    }
  })
  
  console.log(`\n🔍 Testing logos for ${uniqueProviders.size} unique providers...\n`)
  
  const results: Array<{
    provider: string
    hasExternalUrl: boolean
    logoUrl: string | null
    success: boolean
    size: number
    isMonogram: boolean
  }> = []
  
  for (const [key, info] of uniqueProviders.entries()) {
    // Get a sample course with this provider to get external_url
    const sampleCourse = courses.find(c => 
      c.provider && c.provider.toLowerCase().trim() === key
    )
    const externalUrl = sampleCourse?.external_url || null
    const logoUrl = getLogoUrl(info.provider, externalUrl)
    
    console.log(`\nProvider: ${info.provider}`)
    console.log(`  - Has external_url: ${info.external_url ? 'YES' : 'NO'}`)
    if (externalUrl) {
      console.log(`  - external_url: ${externalUrl}`)
    }
    console.log(`  - Logo URL: ${logoUrl || 'NONE'}`)
    
    if (logoUrl) {
      console.log(`  Testing logo fetch...`)
      const result = await testLogoFetch(logoUrl, info.provider)
      results.push({
        provider: info.provider,
        hasExternalUrl: info.external_url,
        logoUrl,
        ...result
      })
      
      if (result.success) {
        if (result.isMonogram) {
          console.log(`  ⚠️  Logo found but detected as monogram (${result.size} bytes)`)
        } else {
          console.log(`  ✅ Valid logo (${result.size} bytes)`)
        }
      } else {
        console.log(`  ❌ Logo fetch failed`)
      }
    } else {
      if (!info.external_url) {
        console.log(`  ℹ️  No external_url - will use cognite_logo.jpeg`)
      } else if (!logoUrl) {
        console.log(`  ⚠️  Could not generate logo URL`)
      }
    }
  }
  
  console.log('\n=== Summary ===')
  const withExternalUrl = results.filter(r => r.hasExternalUrl)
  const validLogos = withExternalUrl.filter(r => r.success && !r.isMonogram)
  const monogramLogos = withExternalUrl.filter(r => r.success && r.isMonogram)
  const failedLogos = withExternalUrl.filter(r => !r.success)
  
  console.log(`Total providers with external_url: ${withExternalUrl.length}`)
  console.log(`✅ Valid logos: ${validLogos.length}`)
  console.log(`⚠️  Monogram logos (blocked): ${monogramLogos.length}`)
  console.log(`❌ Failed logos: ${failedLogos.length}`)
  
  if (monogramLogos.length > 0) {
    console.log('\n⚠️  Providers with monogram logos (will be blocked):')
    monogramLogos.forEach(r => {
      console.log(`  - ${r.provider} (${r.size} bytes)`)
    })
  }
  
  if (failedLogos.length > 0) {
    console.log('\n❌ Providers with failed logo fetches:')
    failedLogos.forEach(r => {
      console.log(`  - ${r.provider}`)
    })
  }
}

testAllLogos()
  .then(() => {
    console.log('\n✅ Logo testing completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error during logo testing:', error)
    process.exit(1)
  })
