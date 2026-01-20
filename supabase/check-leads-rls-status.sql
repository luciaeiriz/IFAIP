-- ============================================
-- DIAGNOSTIC: CHECK LEADS RLS STATUS
-- Run this first to see what's currently configured
-- ============================================

-- Step 1: Check if RLS is enabled on leads table
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'leads';

-- Step 2: Check what policies exist on leads table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'leads'
ORDER BY policyname;

-- Step 3: Check if leads table exists and its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'leads'
ORDER BY ordinal_position;

-- Expected Results:
-- Step 1: Should show rls_enabled = true
-- Step 2: Should show at least one policy named "leads_insert_public" with cmd = "INSERT"
-- Step 3: Should show the table structure
