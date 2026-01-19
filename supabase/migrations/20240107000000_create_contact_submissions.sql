-- ============================================
-- CREATE CONTACT SUBMISSIONS TABLE
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policy for contact_submissions - PUBLIC INSERT
-- This allows anyone to insert contact submissions
DROP POLICY IF EXISTS "contact_submissions_insert_public" ON contact_submissions;
CREATE POLICY "contact_submissions_insert_public" ON contact_submissions
    FOR INSERT
    WITH CHECK (true);

-- Step 5: Create RLS Policy for contact_submissions - ADMIN SELECT
-- This allows admins to read contact submissions
-- Note: Admin access is handled via service role key in admin API routes
DROP POLICY IF EXISTS "contact_submissions_select_admin" ON contact_submissions;
CREATE POLICY "contact_submissions_select_admin" ON contact_submissions
    FOR SELECT
    USING (true);

-- Step 6: Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
