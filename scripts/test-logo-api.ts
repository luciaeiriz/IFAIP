import { config } from 'dotenv'
import * as path from 'path'

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const apiKey = process.env.LOGO_DEV_API

if (!apiKey) {
  console.error('❌ LOGO_DEV_API not found in environment variables')
  process.exit(1)
}

async function testLogoDomain(domain: string) {
  const logoUrl = `https://img.logo.dev/${domain}?token=${apiKey}&size=128&format=png&theme=light&fallback=404`
  
  try {
    console.log(`\n🔍 Testing domain: ${domain}`)
    console.log(`   URL: ${logoUrl.replace(apiKey, '***')}`)
    
    const response = await fetch(logoUrl, {
      signal: AbortSignal.timeout(5000),
    })
    
    console.log(`   Status: ${response.status}`)
    
    // Log all headers
    console.log(`   Headers:`)
    response.headers.forEach((value, key) => {
      console.log(`     ${key}: ${value}`)
    })
    
    if (response.ok) {
      const imageBuffer = await response.arrayBuffer()
      const imageSize = imageBuffer.byteLength
      console.log(`   Image size: ${imageSize} bytes`)
      
      // Check if it's likely a monogram
      const xLogoFallback = response.headers.get('x-logo-fallback')
      const xLogoSource = response.headers.get('x-logo-source')
      const cacheControl = response.headers.get('cache-control')
      
      const isLikelyMonogram = 
        xLogoFallback === 'monogram' || 
        xLogoSource === 'monogram' || 
        imageSize < 8000 ||
        (imageSize < 15000 && cacheControl?.includes('max-age=86400'))
      
      if (isLikelyMonogram) {
        console.log(`   ⚠️  DETECTED AS MONOGRAM/FALLBACK`)
        console.log(`      - Fallback header: ${xLogoFallback}`)
        console.log(`      - Source header: ${xLogoSource}`)
        console.log(`      - Cache-Control: ${cacheControl}`)
        console.log(`      - Size threshold: ${imageSize < 8000 ? 'TOO SMALL' : 'OK'} (< 8KB)`)
      } else {
        console.log(`   ✅ Valid logo detected`)
      }
    } else {
      console.log(`   ❌ Request failed with status ${response.status}`)
    }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
  }
}

async function testLogos() {
  // Test some common provider domains
  const testDomains = [
    'coursera.org',
    'edx.org',
    'udemy.com',
    'mit.edu',
    'ox.ac.uk',
    'harvard.edu',
    'stanford.edu',
    'google.com',
    'ibm.com',
    'openai.com',
  ]
  
  console.log('🧪 Testing Logo.dev API for various domains...')
  console.log(`   API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`)
  
  for (const domain of testDomains) {
    await testLogoDomain(domain)
  }
  
  console.log('\n✅ Logo API testing completed')
}

testLogos()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
