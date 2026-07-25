-- Supabase Database Setup Script for dtuSocksUnited

-- 1. Create societies table
CREATE TABLE IF NOT EXISTS societies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Stores UUIDs
    soc_name TEXT NOT NULL,
    soc_category TEXT[] NOT NULL,
    soc_about TEXT NOT NULL,
    soc_logo TEXT DEFAULT '_',
    soc_key_events JSONB DEFAULT '[]'::jsonb,
    soc_highlights TEXT[] DEFAULT '{}',
    soc_keyword TEXT[] DEFAULT '{}',
    soc_contact_team JSONB DEFAULT '[]'::jsonb,
    soc_socials JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Stores UUIDs
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    google_id TEXT UNIQUE,
    role TEXT DEFAULT 'User',
    account_verified BOOLEAN DEFAULT false,
    avatar_public_id TEXT,
    avatar_url TEXT,
    verification_code INTEGER,
    verification_code_expire TIMESTAMPTZ,
    reset_password_token TEXT,
    reset_password_expire TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    soc_id UUID REFERENCES societies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, soc_id)
);

-- 4. Create orientations table
CREATE TABLE IF NOT EXISTS orientations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    soc_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    name TEXT,
    event_date DATE NOT NULL,
    venue TEXT NOT NULL,
    event_time TEXT NOT NULL,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orientations_soc_id_idx ON orientations(soc_id);
CREATE INDEX IF NOT EXISTS orientations_event_date_idx ON orientations(event_date);

-- 5. Enable Row Level Security (RLS) if desired.
-- For maximum speed and simplicity matching their Express backend direct access,
-- we will access Supabase using the service_role key, bypassing RLS.
-- However, we can also enable RLS and write policies, but since the Node backend
-- is the only one communicating with the database right now (acting as the admin),
-- service_role key bypasses RLS and works perfectly.
