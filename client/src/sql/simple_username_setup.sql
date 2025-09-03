-- Simple and tested script to add username functionality
-- Run this in your Supabase SQL Editor

-- Step 1: Add username column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Step 2: Add email column if it doesn't exist (needed for our system)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Step 3: Add full_name column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Step 4: Get email from auth.users for existing profiles
UPDATE profiles 
SET email = auth_users.email
FROM auth.users AS auth_users 
WHERE profiles.id = auth_users.id 
  AND (profiles.email IS NULL OR profiles.email = '');

-- Step 5: Get full_name from auth.users for existing profiles
UPDATE profiles 
SET full_name = COALESCE(auth_users.raw_user_meta_data->>'name', SPLIT_PART(auth_users.email, '@', 1))
FROM auth.users AS auth_users 
WHERE profiles.id = auth_users.id 
  AND (profiles.full_name IS NULL OR profiles.full_name = '');

-- Step 6: Generate usernames for existing profiles
UPDATE profiles 
SET username = 'farmer_' || LOWER(SPLIT_PART(email, '@', 1)) || '_' || SUBSTR(MD5(RANDOM()::TEXT), 1, 6)
WHERE username IS NULL OR username = '';

-- Step 7: Make username NOT NULL and UNIQUE
ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS profiles_username_unique UNIQUE (username);

-- Step 8: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Step 9: Create function for new user signup
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
    email = EXCLUDED.email,
    username = COALESCE(profiles.username, EXCLUDED.username),
    full_name = COALESCE(profiles.full_name, EXCLUDED.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 11: Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 12: Create RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Final success message
SELECT 'Username functionality added successfully!' as message;
