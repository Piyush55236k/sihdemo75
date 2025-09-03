-- Safe profiles table setup - handles existing table
-- This should be run in your Supabase SQL editor

-- First, let's check if we need to add any missing columns to existing profiles table
DO $$ 
BEGIN
  -- Check if profiles table exists, if not create it
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    -- Create the profiles table (full creation)
    CREATE TABLE profiles (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      
      -- Farming specific fields
      farm_size TEXT,
      farm_location TEXT,
      primary_crops TEXT[] DEFAULT '{}',
      experience_level TEXT DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
      
      -- Gamification fields
      level INTEGER DEFAULT 1,
      total_points INTEGER DEFAULT 0,
      completed_quests INTEGER DEFAULT 0,
      sustainability_score INTEGER DEFAULT 0 CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
      
      -- Preferences
      preferred_language TEXT DEFAULT 'en',
      notifications_enabled BOOLEAN DEFAULT true,
      
      -- Timestamps
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- Table exists, let's add missing columns if they don't exist
    
    -- Add username column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='username') THEN
      ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
    END IF;
    
    -- Add farming specific fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='farm_size') THEN
      ALTER TABLE profiles ADD COLUMN farm_size TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='farm_location') THEN
      ALTER TABLE profiles ADD COLUMN farm_location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='primary_crops') THEN
      ALTER TABLE profiles ADD COLUMN primary_crops TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='experience_level') THEN
      ALTER TABLE profiles ADD COLUMN experience_level TEXT DEFAULT 'beginner';
      ALTER TABLE profiles ADD CONSTRAINT experience_level_check CHECK (experience_level IN ('beginner', 'intermediate', 'advanced'));
    END IF;
    
    -- Add gamification fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='level') THEN
      ALTER TABLE profiles ADD COLUMN level INTEGER DEFAULT 1;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='total_points') THEN
      ALTER TABLE profiles ADD COLUMN total_points INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='completed_quests') THEN
      ALTER TABLE profiles ADD COLUMN completed_quests INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='sustainability_score') THEN
      ALTER TABLE profiles ADD COLUMN sustainability_score INTEGER DEFAULT 0;
      ALTER TABLE profiles ADD CONSTRAINT sustainability_score_check CHECK (sustainability_score >= 0 AND sustainability_score <= 100);
    END IF;
    
    -- Add preference fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='preferred_language') THEN
      ALTER TABLE profiles ADD COLUMN preferred_language TEXT DEFAULT 'en';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='notifications_enabled') THEN
      ALTER TABLE profiles ADD COLUMN notifications_enabled BOOLEAN DEFAULT true;
    END IF;
  END IF;
END $$;

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Function to update updated_at timestamp (replace if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup (replace if exists)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    'farmer_' || LOWER(SPLIT_PART(NEW.email, '@', 1)) || '_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 6),
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING; -- Don't create duplicate profiles
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Update existing profiles that don't have usernames
UPDATE profiles 
SET username = 'farmer_' || LOWER(SPLIT_PART(email, '@', 1)) || '_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 6)
WHERE username IS NULL OR username = '';

-- Ensure all profiles have the required NOT NULL fields
UPDATE profiles 
SET 
  email = COALESCE(email, 'unknown@example.com'),
  username = COALESCE(username, 'farmer_user_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 6)),
  full_name = COALESCE(full_name, 'Farmer User')
WHERE email IS NULL OR username IS NULL OR full_name IS NULL;

-- Add NOT NULL constraints safely (only if table was existing)
DO $$ 
BEGIN
  -- Only add NOT NULL if column exists and has no null values
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email' AND is_nullable='YES') THEN
    ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='username' AND is_nullable='YES') THEN
    ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;
  END IF;
END $$;

-- Final success message
DO $$ 
BEGIN
  RAISE NOTICE 'Profiles table setup completed successfully!';
  RAISE NOTICE 'All required columns, indexes, triggers, and policies are now in place.';
END $$;
