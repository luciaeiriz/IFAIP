-- Add new categories: technology, science, business
-- Remove old categories: researcher-spotlights, latest-research, events, blog
ALTER TABLE news_items DROP CONSTRAINT IF EXISTS news_items_category_check;
ALTER TABLE news_items ADD CONSTRAINT news_items_category_check 
    CHECK (category IN ('news', 'technology', 'science', 'business'));

-- Update comment
COMMENT ON COLUMN news_items.category IS 'Category: news, technology, science, business (from NewsAPI)';
