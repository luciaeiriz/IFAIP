-- ============================================
-- RLS POLICIES FOR IFAIP DATABASE
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('courses', 'leads', 'signups');

-- Step 2: Enable RLS if not already enabled
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies if they exist (to recreate fresh)
DROP POLICY IF EXISTS "courses_select_public" ON courses;
DROP POLICY IF EXISTS "leads_insert_public" ON leads;
DROP POLICY IF EXISTS "signups_insert_public" ON signups;

-- Step 4: Create RLS Policy for courses - PUBLIC READ (SELECT)
-- This allows anyone to read courses
CREATE POLICY "courses_select_public" ON courses
    FOR SELECT
    USING (true);

-- Step 5: Create RLS Policy for leads - PUBLIC INSERT
-- This allows anyone to insert leads
CREATE POLICY "leads_insert_public" ON leads
    FOR INSERT
    WITH CHECK (true);

-- Step 6: Create RLS Policy for signups - PUBLIC INSERT
-- This allows anyone to insert signups
CREATE POLICY "signups_insert_public" ON signups
    FOR INSERT
    WITH CHECK (true);

-- Step 7: Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('courses', 'leads', 'signups')
ORDER BY tablename, policyname;

-- Step 8: Test query (should return course count)
SELECT COUNT(*) as total_courses FROM courses;
SELECT COUNT(*) as business_courses FROM courses WHERE tag = 'Business';
SELECT COUNT(*) as restaurant_courses FROM courses WHERE tag = 'Restaurant';
SELECT COUNT(*) as fleet_courses FROM courses WHERE tag = 'Fleet';

