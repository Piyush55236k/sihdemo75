# Supabase Setup Instructions

## Setting up User Profiles Table

To fix the user data persistence issue, you need to create a profiles table in your Supabase database.

### Steps:

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Open your project: `hxglrinjwqdqbzgfgjfu`

2. **Open SQL Editor**
   - Navigate to "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the SQL Script**
   - Copy and paste the entire contents of `src/sql/create_profiles_table.sql`
   - Click "Run" to execute the script

4. **Verify Table Creation**
   - Go to "Table Editor" in the left sidebar
   - You should see a new "profiles" table with all the fields

### What this creates:

- **profiles table** - Stores user profile data with proper relationships
- **RLS policies** - Ensures users can only access their own data
- **Triggers** - Automatically creates profile when user signs up
- **Indexes** - For better performance

### Features Added:

1. **Username Generation** - Unique usernames like "farmer_john_abc123"
2. **Username Editing** - Users can change their username from profile page
3. **Data Persistence** - All user data now saves to Supabase
4. **Better Navbar** - Shows username instead of long email

### Current Status:

- ✅ User service created
- ✅ AuthProvider updated to use profiles
- ✅ Profile page updated with username editing
- ✅ Navbar shows username instead of email
- ⚠️ **Requires Supabase table setup** (run SQL script)

After running the SQL script, all user data will be properly saved and the username system will work perfectly!
