-- Add logo_url column to courses table
-- This stores the Logo.dev API URL for the course provider logo
-- Once fetched, we can reuse it without making additional API calls

-- Check if courses table exists before adding column
DO $$
BEGIN
    -- Check if courses table exists
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'courses'
    ) THEN
        -- Add logo_url column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'courses' 
            AND column_name = 'logo_url'
        ) THEN
            ALTER TABLE courses ADD COLUMN logo_url TEXT;
            RAISE NOTICE '✅ Added logo_url column to courses table';
        ELSE
            RAISE NOTICE '✅ logo_url column already exists in courses table';
        END IF;
        
        -- Create index for faster lookups by logo_url (if it doesn't exist)
        IF NOT EXISTS (
            SELECT FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND tablename = 'courses' 
            AND indexname = 'idx_courses_logo_url'
        ) THEN
            CREATE INDEX idx_courses_logo_url ON courses(logo_url) WHERE logo_url IS NOT NULL;
            RAISE NOTICE '✅ Created index idx_courses_logo_url';
        ELSE
            RAISE NOTICE '✅ Index idx_courses_logo_url already exists';
        END IF;
    ELSE
        RAISE WARNING '⚠️ courses table does not exist. Please run the initial schema migration first.';
    END IF;
END $$;

-- Add comment to column (only if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'courses'
    ) THEN
        COMMENT ON COLUMN courses.logo_url IS 'Cached Logo.dev API URL for the provider logo. Stored to avoid repeated API calls.';
    END IF;
END $$;

