#!/usr/bin/env tsx
/**
 * Run landing pages migrations
 * This script executes the SQL migrations to create the landing_pages table
 * and populate it with existing pages (Business, Restaurant, Fleet)
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { supabaseAdmin } from '../lib/supabase-admin'

async function runMigrations() {
  console.log('🚀 Starting landing pages migrations...\n')

  try {
    // Read migration files
    const migration1Path = join(process.cwd(), 'supabase/migrations/20240105000000_create_landing_pages.sql')
    const migration2Path = join(process.cwd(), 'supabase/migrations/20240105000001_migrate_existing_landing_pages.sql')

    console.log('📖 Reading migration files...')
    const migration1SQL = readFileSync(migration1Path, 'utf-8')
    const migration2SQL = readFileSync(migration2Path, 'utf-8')

    console.log('✅ Migration files read successfully\n')

    // Execute first migration (create table)
    console.log('📝 Executing migration 1: Create landing_pages table...')
    const { error: error1 } = await supabaseAdmin.rpc('exec_sql', {
      sql: migration1SQL
    })

    if (error1) {
      // If exec_sql doesn't exist, try direct query execution
      // Split by semicolons and execute each statement
      const statements1 = migration1SQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements1) {
        if (statement.trim()) {
          // Use raw query - Supabase doesn't support DDL via client, so we'll need to use the SQL editor
          console.log('⚠️  Direct SQL execution not supported via client.')
          console.log('📋 Please run the migrations manually in Supabase SQL Editor:\n')
          console.log('Migration 1:')
          console.log('─'.repeat(60))
          console.log(migration1SQL)
          console.log('─'.repeat(60))
          console.log('\nMigration 2:')
          console.log('─'.repeat(60))
          console.log(migration2SQL)
          console.log('─'.repeat(60))
          return
        }
      }
    }

    console.log('✅ Migration 1 completed successfully\n')

    // Execute second migration (populate existing pages)
    console.log('📝 Executing migration 2: Populate existing landing pages...')
    const { error: error2 } = await supabaseAdmin.rpc('exec_sql', {
      sql: migration2SQL
    })

    if (error2) {
      console.error('❌ Error executing migration 2:', error2)
      throw error2
    }

    console.log('✅ Migration 2 completed successfully\n')

    // Verify the migrations
    console.log('🔍 Verifying migrations...')
    const { data: landingPages, error: verifyError } = await supabaseAdmin
      .from('landing_pages')
      .select('*')
      .order('display_order', { ascending: true })

    if (verifyError) {
      console.error('❌ Error verifying migrations:', verifyError)
      throw verifyError
    }

    console.log(`✅ Successfully verified: Found ${landingPages?.length || 0} landing pages`)
    if (landingPages && landingPages.length > 0) {
      console.log('\n📋 Landing pages:')
      landingPages.forEach((page: any) => {
        console.log(`   - ${page.name} (${page.tag}) - ${page.is_enabled ? 'Enabled' : 'Disabled'}`)
      })
    }

    console.log('\n✅ All migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.log('\n📋 Please run the migrations manually in Supabase SQL Editor:')
    console.log('   1. Go to your Supabase project dashboard')
    console.log('   2. Navigate to SQL Editor')
    console.log('   3. Copy and paste the contents of:')
    console.log('      - supabase/migrations/20240105000000_create_landing_pages.sql')
    console.log('      - supabase/migrations/20240105000001_migrate_existing_landing_pages.sql')
    console.log('   4. Execute each file in order')
    process.exit(1)
  }
}

runMigrations()
