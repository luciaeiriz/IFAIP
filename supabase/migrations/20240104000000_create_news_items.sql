-- Create news_items table
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

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_news_items_category ON news_items(category);
CREATE INDEX IF NOT EXISTS idx_news_items_display_order ON news_items(category, display_order);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_news_items_updated_at BEFORE UPDATE ON news_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (same pattern as courses)
CREATE POLICY "news_items_select_public" ON news_items
    FOR SELECT USING (true);

-- Note: Admin operations (INSERT, UPDATE, DELETE) are handled via supabaseAdmin
-- which bypasses RLS, so no additional policies are needed for admin operations

-- Add comment for documentation
COMMENT ON TABLE news_items IS 'Stores news items displayed in the Latest section of the homepage';
COMMENT ON COLUMN news_items.category IS 'Category: news, blog, researcher-spotlights, latest-research, or events';
COMMENT ON COLUMN news_items.display_order IS 'Order within category (lower numbers appear first)';

