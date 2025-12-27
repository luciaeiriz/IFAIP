-- ============================================
-- ADD RELEVANCY COLUMNS FOR LANDING PAGE MANAGEMENT
-- Run this in Supabase SQL Editor
-- Safe to run multiple times (uses IF NOT EXISTS)
-- ============================================

-- Add relevancy columns if they don't exist
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS business_relevancy INTEGER,
ADD COLUMN IF NOT EXISTS restaurant_relevancy INTEGER,
ADD COLUMN IF NOT EXISTS fleet_relevancy INTEGER;

-- Initialize relevancy based on priority for existing courses
-- Business courses get business_relevancy = priority
UPDATE courses 
SET business_relevancy = priority 
WHERE tag = 'Business' 
  AND business_relevancy IS NULL 
  AND priority IS NOT NULL;

-- Restaurant courses get restaurant_relevancy = priority
UPDATE courses 
SET restaurant_relevancy = priority 
WHERE tag = 'Restaurant' 
  AND restaurant_relevancy IS NULL 
  AND priority IS NOT NULL;

-- Fleet courses get fleet_relevancy = priority
UPDATE courses 
SET fleet_relevancy = priority 
WHERE tag = 'Fleet' 
  AND fleet_relevancy IS NULL 
  AND priority IS NOT NULL;

-- For courses that don't match their tag, set higher relevancy (appear later)
-- Business courses in Restaurant/Fleet pages
UPDATE courses 
SET restaurant_relevancy = COALESCE(priority, 999) + 50
WHERE tag = 'Business' 
  AND restaurant_relevancy IS NULL;

UPDATE courses 
SET fleet_relevancy = COALESCE(priority, 999) + 50
WHERE tag = 'Business' 
  AND fleet_relevancy IS NULL;

-- Restaurant courses in Business/Fleet pages
UPDATE courses 
SET business_relevancy = COALESCE(priority, 999) + 50
WHERE tag = 'Restaurant' 
  AND business_relevancy IS NULL;

UPDATE courses 
SET fleet_relevancy = COALESCE(priority, 999) + 50
WHERE tag = 'Restaurant' 
  AND fleet_relevancy IS NULL;

-- Fleet courses in Business/Restaurant pages
UPDATE courses 
SET business_relevancy = COALESCE(priority, 999) + 50
WHERE tag = 'Fleet' 
  AND business_relevancy IS NULL;

UPDATE courses 
SET restaurant_relevancy = COALESCE(priority, 999) + 50
WHERE tag = 'Fleet' 
  AND restaurant_relevancy IS NULL;

-- Set default values for any remaining NULL values
UPDATE courses 
SET business_relevancy = 999 
WHERE business_relevancy IS NULL;

UPDATE courses 
SET restaurant_relevancy = 999 
WHERE restaurant_relevancy IS NULL;

UPDATE courses 
SET fleet_relevancy = 999 
WHERE fleet_relevancy IS NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_business_relevancy ON courses(business_relevancy);
CREATE INDEX IF NOT EXISTS idx_courses_restaurant_relevancy ON courses(restaurant_relevancy);
CREATE INDEX IF NOT EXISTS idx_courses_fleet_relevancy ON courses(fleet_relevancy);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Relevancy columns added successfully!';
  RAISE NOTICE '✅ All courses have been initialized with relevancy scores';
  RAISE NOTICE '✅ Indexes created for better performance';
END $$;

