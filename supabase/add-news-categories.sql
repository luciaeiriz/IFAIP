-- ============================================
-- UPDATE NEWS CATEGORIES: Remove blog category
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop the old constraint
ALTER TABLE news_items DROP CONSTRAINT IF EXISTS news_items_category_check;

-- Add the new constraint with only supported categories
ALTER TABLE news_items ADD CONSTRAINT news_items_category_check 
    CHECK (category IN ('news', 'technology', 'science', 'business'));

-- Update comment
COMMENT ON COLUMN news_items.category IS 'Category: news, technology, science, business (from NewsAPI)';

-- Verify the constraint was updated
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'news_items'::regclass
AND conname = 'news_items_category_check';
