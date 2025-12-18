-- ============================================
-- FIX SCHEMA AND SETUP RLS POLICIES
-- This handles the case where courses.id might be TEXT instead of UUID
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check current courses.id column type
SELECT 
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'courses'
AND column_name = 'id';

-- Step 2: If courses.id is TEXT, convert it to UUID
-- First, check if we need to convert
DO $$
DECLARE
    current_type TEXT;
BEGIN
    SELECT data_type INTO current_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'courses'
    AND column_name = 'id';
    
    IF current_type = 'text' OR current_type = 'character varying' THEN
        -- Convert TEXT id to UUID
        -- First, ensure all existing IDs are valid UUIDs
        -- Then alter the column type
        ALTER TABLE courses 
        ALTER COLUMN id TYPE UUID USING id::uuid;
        
        RAISE NOTICE 'Converted courses.id from TEXT to UUID';
    ELSE
        RAISE NOTICE 'courses.id is already UUID or different type: %', current_type;
    END IF;
END $$;

-- Step 3: Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 4: Create leads table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    role TEXT,
    landing_tag TEXT NOT NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Drop signups table if it exists (to recreate with correct foreign key)
DROP TABLE IF EXISTS signups CASCADE;

-- Step 6: Create signups table with correct UUID foreign key
CREATE TABLE signups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    landing_tag TEXT NOT NULL,
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create function to update updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 8: Create trigger for courses updated_at (drop first if exists)
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Enable Row Level Security on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Step 10: Drop existing policies if they exist (to recreate fresh)
DROP POLICY IF EXISTS "courses_select_public" ON courses;
DROP POLICY IF EXISTS "leads_insert_public" ON leads;
DROP POLICY IF EXISTS "signups_insert_public" ON signups;

-- Step 11: Create RLS Policy for courses - PUBLIC READ (SELECT)
CREATE POLICY "courses_select_public" ON courses
    FOR SELECT
    USING (true);

-- Step 12: Create RLS Policy for leads - PUBLIC INSERT
CREATE POLICY "leads_insert_public" ON leads
    FOR INSERT
    WITH CHECK (true);

-- Step 13: Create RLS Policy for signups - PUBLIC INSERT
CREATE POLICY "signups_insert_public" ON signups
    FOR INSERT
    WITH CHECK (true);

-- Step 14: Create indexes (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_courses_tag ON courses(tag);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_source ON courses(source);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_landing_tag ON leads(landing_tag);
CREATE INDEX IF NOT EXISTS idx_signups_course_id ON signups(course_id);
CREATE INDEX IF NOT EXISTS idx_signups_email ON signups(email);
CREATE INDEX IF NOT EXISTS idx_signups_landing_tag ON signups(landing_tag);

-- Step 15: Verify tables exist and have correct types
SELECT 
    t.tablename,
    c.column_name,
    c.data_type,
    c.character_maximum_length
FROM pg_tables t
LEFT JOIN information_schema.columns c ON c.table_name = t.tablename AND c.table_schema = 'public'
WHERE t.schemaname = 'public'
AND t.tablename IN ('courses', 'leads', 'signups')
AND (c.column_name = 'id' OR c.column_name = 'course_id' OR c.column_name IS NULL)
ORDER BY t.tablename, c.column_name;

-- Step 16: Verify RLS is enabled
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('courses', 'leads', 'signups')
ORDER BY tablename;

-- Step 17: Verify policies were created
SELECT 
    tablename,
    policyname,
    cmd as command
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('courses', 'leads', 'signups')
ORDER BY tablename, policyname;

-- Step 18: Test queries (should work now)
SELECT COUNT(*) as total_courses FROM courses;
SELECT COUNT(*) as business_courses FROM courses WHERE tag = 'Business';
SELECT COUNT(*) as restaurant_courses FROM courses WHERE tag = 'Restaurant';
SELECT COUNT(*) as fleet_courses FROM courses WHERE tag = 'Fleet';
