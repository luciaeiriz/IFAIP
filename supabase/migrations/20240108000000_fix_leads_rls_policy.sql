-- ============================================
-- FIX LEADS RLS POLICY
-- This ensures the leads table has the correct RLS policy for public inserts
-- Run this migration if you're getting "new row violates row-level security policy" errors
-- ============================================

-- Step 1: Ensure RLS is enabled on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policy if it exists (to recreate it fresh)
DROP POLICY IF EXISTS "leads_insert_public" ON leads;

-- Step 3: Create RLS Policy for leads - PUBLIC INSERT
-- This allows anyone (including anonymous users) to insert leads
-- Explicitly allow 'anon' role (what Supabase uses for unauthenticated requests)
CREATE POLICY "leads_insert_public" ON leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Step 4: Verify the policy was created
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
AND tablename = 'leads'
AND policyname = 'leads_insert_public';
