-- Add image_url column to news_items table
-- This allows storing custom uploaded images or NewsAPI images
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update comment
COMMENT ON COLUMN news_items.image_url IS 'URL to news item image. Can be custom uploaded image (Supabase Storage) or NewsAPI image URL. Falls back to gradient if null.';
