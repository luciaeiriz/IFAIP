-- ============================================
-- REMOVE DUPLICATE COURSES
-- Removes duplicate rows that have the same source and title
-- Keeps the row with the earliest created_at (or lowest id if created_at is the same)
-- ============================================

-- Step 1: Check for duplicates before deletion
-- This query shows you how many duplicates exist
SELECT 
    source,
    title,
    COUNT(*) as duplicate_count
FROM courses
GROUP BY source, title
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, source, title;

-- Step 2: Delete duplicates, keeping the oldest entry (earliest created_at)
-- If created_at is the same, keeps the one with the lowest id
DELETE FROM courses
WHERE id IN (
    SELECT id
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                PARTITION BY source, title 
                ORDER BY created_at ASC, id ASC
            ) as row_num
        FROM courses
    ) ranked
    WHERE row_num > 1
);

-- Step 3: Verify duplicates are removed
-- This should return 0 rows if all duplicates are removed
SELECT 
    source,
    title,
    COUNT(*) as count
FROM courses
GROUP BY source, title
HAVING COUNT(*) > 1;

-- Step 4: Show final course count
SELECT COUNT(*) as total_courses FROM courses;
SELECT COUNT(DISTINCT (source, title)) as unique_course_combinations FROM courses;
