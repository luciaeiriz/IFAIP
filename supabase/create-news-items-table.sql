-- ============================================
-- CREATE NEWS ITEMS TABLE
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create news_items table
CREATE TABLE IF NOT EXISTS news_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('news', 'blog', 'researcher-spotlights', 'latest-research', 'events')),
    label TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    time TEXT,
    href TEXT NOT NULL,
    image_color TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create indexes for faster filtering and ordering
CREATE INDEX IF NOT EXISTS idx_news_items_category ON news_items(category);
CREATE INDEX IF NOT EXISTS idx_news_items_display_order ON news_items(category, display_order);

-- Step 4: Create function to update updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 5: Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_news_items_updated_at ON news_items;
CREATE TRIGGER update_news_items_updated_at BEFORE UPDATE ON news_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Enable Row Level Security
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop existing policy if it exists (to recreate fresh)
DROP POLICY IF EXISTS "news_items_select_public" ON news_items;

-- Step 8: Create policy for public read access (same pattern as courses)
CREATE POLICY "news_items_select_public" ON news_items
    FOR SELECT USING (true);

-- Step 9: Verify table was created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'news_items'
ORDER BY ordinal_position;

-- Step 10: Refresh schema cache (this helps Supabase recognize the new table)
NOTIFY pgrst, 'reload schema';

