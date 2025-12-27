-- Migration: Add relevancy columns for Business, Restaurant, and Fleet
-- This allows each course to have a relevancy rank for each user type

-- Add relevancy columns (INTEGER, lower number = higher relevancy/priority)
ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS business_relevancy INTEGER,
  ADD COLUMN IF NOT EXISTS restaurant_relevancy INTEGER,
  ADD COLUMN IF NOT EXISTS fleet_relevancy INTEGER;

-- Make tag column nullable (we'll use relevancy columns instead)
ALTER TABLE courses 
  ALTER COLUMN tag DROP NOT NULL;

-- Add indexes for better query performance when filtering by relevancy
CREATE INDEX IF NOT EXISTS idx_courses_business_relevancy ON courses(business_relevancy) WHERE business_relevancy IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_courses_restaurant_relevancy ON courses(restaurant_relevancy) WHERE restaurant_relevancy IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_courses_fleet_relevancy ON courses(fleet_relevancy) WHERE fleet_relevancy IS NOT NULL;

-- Add comment to explain the columns
COMMENT ON COLUMN courses.business_relevancy IS 'Relevancy rank for business owners (lower number = higher relevancy)';
COMMENT ON COLUMN courses.restaurant_relevancy IS 'Relevancy rank for restaurant owners (lower number = higher relevancy)';
COMMENT ON COLUMN courses.fleet_relevancy IS 'Relevancy rank for fleet managers (lower number = higher relevancy)';
