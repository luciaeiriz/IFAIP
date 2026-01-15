-- Create landing_pages table
CREATE TABLE IF NOT EXISTS landing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    hero_title TEXT,
    subtitle TEXT DEFAULT 'at IFAIP',
    bg_color TEXT NOT NULL DEFAULT '#2563eb',
    header_image_url TEXT,
    relevancy_column TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_landing_pages_tag ON landing_pages(tag);
CREATE INDEX IF NOT EXISTS idx_landing_pages_is_enabled ON landing_pages(is_enabled);
CREATE INDEX IF NOT EXISTS idx_landing_pages_display_order ON landing_pages(display_order);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON landing_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only enabled pages)
CREATE POLICY "landing_pages_select_public" ON landing_pages
    FOR SELECT USING (is_enabled = true);

-- Note: Admin operations (INSERT, UPDATE, DELETE) are handled via supabaseAdmin
-- which bypasses RLS, so no additional policies are needed for admin operations

-- Add comments for documentation
COMMENT ON TABLE landing_pages IS 'Stores metadata for course landing pages';
COMMENT ON COLUMN landing_pages.tag IS 'URL-friendly identifier (e.g., "healthcare", "education")';
COMMENT ON COLUMN landing_pages.relevancy_column IS 'Database column name for relevancy scores (e.g., "healthcare_relevancy")';
COMMENT ON COLUMN landing_pages.is_enabled IS 'Visibility toggle - only enabled pages appear in navigation';
COMMENT ON COLUMN landing_pages.display_order IS 'Order in dropdowns (lower numbers appear first)';

-- Create function to safely add relevancy columns
CREATE OR REPLACE FUNCTION add_relevancy_column(column_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate column name to prevent SQL injection
  IF column_name !~ '^[a-z0-9_]+$' THEN
    RAISE EXCEPTION 'Invalid column name: %', column_name;
  END IF;
  
  -- Add column if it doesn't exist
  EXECUTE format('ALTER TABLE courses ADD COLUMN IF NOT EXISTS %I INTEGER', column_name);
END;
$$;

-- Grant execute permission to authenticated users (for admin API)
GRANT EXECUTE ON FUNCTION add_relevancy_column(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION add_relevancy_column(TEXT) TO service_role;
