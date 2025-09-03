-- First, let's see what columns exist in your profiles table
-- Run this to check your current table structure

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
