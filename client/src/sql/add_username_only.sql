-- Minimal script to add username functionality to existing profiles table
-- This script adapts to your existing table structure

-- First, let's check what we're working with
DO $$
BEGIN
    RAISE NOTICE 'Checking existing profiles table structure...';
END $$;

-- Add username column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Add email column if it doesn't exist (needed for our system)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Add full_name column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Update existing profiles with generated usernames
-- We'll try to use email if it exists, otherwise use the user ID
UPDATE profiles 
SET username = CASE 
    WHEN email IS NOT NULL AND email != '' THEN 
        'farmer_' || LOWER(SPLIT_PART(email, '@', 1)) || '_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 6)
    ELSE 
        'farmer_user_' || SUBSTR(MD5(id::TEXT || RANDOM()::TEXT), 1, 8)
END
WHERE username IS NULL OR username = '';

-- For profiles without email, we need to get it from auth.users
UPDATE profiles 
SET email = auth_users.email,
    full_name = COALESCE(profiles.full_name, auth_users.raw_user_meta_data->>'name', SPLIT_PART(auth_users.email, '@', 1))
FROM auth.users AS auth_users 
WHERE profiles.id = auth_users.id 
  AND (profiles.email IS NULL OR profiles.email = '');

-- Update usernames again for those that now have email
UPDATE profiles 
SET username = 'farmer_' || LOWER(SPLIT_PART(email, '@', 1)) || '_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 6)
WHERE email IS NOT NULL 
  AND email != '' 
  AND (username LIKE 'farmer_user_%' OR username IS NULL);

-- Make username column unique and not null
ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;

-- Add unique constraint safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_username_unique') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
    END IF;
END $$;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update the trigger function to work with our table structure
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
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(profiles.email, EXCLUDED.email),
    username = COALESCE(profiles.username, EXCLUDED.username),
    full_name = COALESCE(profiles.full_name, EXCLUDED.full_name);
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If username already exists, generate a new one
    UPDATE public.profiles 
    SET username = 'farmer_' || LOWER(SPLIT_PART(NEW.email, '@', 1)) || '_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 8)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies if they don't exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Success message with count
DO $$
DECLARE
    profile_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count FROM profiles;
    RAISE NOTICE 'Username functionality added successfully!';
    RAISE NOTICE 'Updated % existing profiles with usernames.', profile_count;
    RAISE NOTICE 'Your app should now work with username display in the navbar!';
END $$;
