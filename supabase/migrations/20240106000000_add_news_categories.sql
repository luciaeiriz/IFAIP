-- Add new categories: technology, science, business
-- Keep existing categories for manual entry
ALTER TABLE news_items DROP CONSTRAINT IF EXISTS news_items_category_check;
ALTER TABLE news_items ADD CONSTRAINT news_items_category_check 
    CHECK (category IN ('news', 'blog', 'technology', 'science', 'business', 'researcher-spotlights', 'latest-research', 'events'));

-- Update comment
COMMENT ON COLUMN news_items.category IS 'Category: news, blog, technology, science, business (from NewsAPI), researcher-spotlights, latest-research, events (manual entry)';
