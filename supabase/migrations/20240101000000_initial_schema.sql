-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    provider TEXT,
    level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    duration TEXT,
    price_label TEXT,
    tag TEXT NOT NULL CHECK (tag IN ('Business', 'Restaurant', 'Fleet')),
    external_url TEXT,
    signup_enabled BOOLEAN DEFAULT true,
    priority INTEGER,
    is_featured BOOLEAN DEFAULT false,
    rating NUMERIC,
    reviews INTEGER,
    course_type TEXT,
    key_skills TEXT,
    modules TEXT,
    instructors TEXT,
    effort TEXT,
    languages TEXT,
    free_trial TEXT,
    source TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    role TEXT,
    landing_tag TEXT NOT NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create signups table
CREATE TABLE signups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    landing_tag TEXT NOT NULL,
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on courses
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- RLS Policy: courses - public read-only
CREATE POLICY "courses_select_public" ON courses
    FOR SELECT
    USING (true);

-- RLS Policy: leads - public insert-only
CREATE POLICY "leads_insert_public" ON leads
    FOR INSERT
    WITH CHECK (true);

-- RLS Policy: signups - public insert-only
CREATE POLICY "signups_insert_public" ON signups
    FOR INSERT
    WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_courses_tag ON courses(tag);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_is_featured ON courses(is_featured);
CREATE INDEX idx_courses_source ON courses(source);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_landing_tag ON leads(landing_tag);
CREATE INDEX idx_signups_course_id ON signups(course_id);
CREATE INDEX idx_signups_email ON signups(email);
CREATE INDEX idx_signups_landing_tag ON signups(landing_tag);

