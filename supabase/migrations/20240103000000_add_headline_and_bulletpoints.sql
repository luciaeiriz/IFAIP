-- Add headline column (short tagline/headline)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS headline TEXT;

-- Add bullet_points column (JSON array of bullet points)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS bullet_points TEXT[];

-- Add comment to columns for documentation
COMMENT ON COLUMN courses.headline IS 'Short headline/tagline generated from course description (max 60 chars)';
COMMENT ON COLUMN courses.bullet_points IS 'Array of bullet points breaking down the course description';


