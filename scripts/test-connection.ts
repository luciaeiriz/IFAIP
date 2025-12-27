import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import * as path from 'path'

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('URL:', supabaseUrl ? '✅' : '❌')
  console.error('Key:', supabaseKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🧪 === TESTING SUPABASE CONNECTION ===\n')
  console.log('URL:', supabaseUrl.substring(0, 30) + '...')
  console.log('Key:', supabaseKey.substring(0, 20) + '...\n')

  try {
    // Test 1: Count
    console.log('📊 Test 1: Counting courses...')
    const { count, error: countError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Count error:', countError)
    } else {
      console.log(`✅ Found ${count} courses\n`)
    }

    // Test 2: Fetch one row
    console.log('📋 Test 2: Fetching one course...')
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Fetch error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
    } else {
      if (data && data.length > 0) {
        console.log('✅ Successfully fetched course:')
        console.log('Columns:', Object.keys(data[0]))
        console.log('Sample data:', JSON.stringify(data[0], null, 2))
      } else {
        console.log('⚠️  No courses found in database')
      }
    }

    // Test 3: Check RLS
    console.log('\n🔒 Test 3: Checking RLS policies...')
    const { data: rlsData, error: rlsError } = await supabase
      .from('courses')
      .select('id')
      .limit(1)

    if (rlsError) {
      console.error('❌ RLS Error:', rlsError)
      if (rlsError.code === 'PGRST301' || rlsError.message.includes('permission')) {
        console.error('⚠️  This looks like an RLS policy issue!')
        console.error('Make sure you have a SELECT policy on the courses table.')
      }
    } else {
      console.log('✅ RLS policies appear to be working')
    }

  } catch (error: any) {
    console.error('❌ Exception:', error)
  }
}

testConnection()
  .then(() => {
    console.log('\n✅ Test complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })

