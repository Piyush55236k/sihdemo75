-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    farm_name TEXT,
    farm_address TEXT,
    farm_size TEXT,
    farm_type TEXT DEFAULT 'mixed',
    farming_experience TEXT,
    main_crops TEXT[] DEFAULT '{}',
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges TEXT[] DEFAULT '{}',
    profile_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('weather', 'market', 'pest', 'quest', 'alert', 'info', 'reminder')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    category TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    weather_alerts BOOLEAN DEFAULT TRUE,
    market_updates BOOLEAN DEFAULT TRUE,
    quest_reminders BOOLEAN DEFAULT TRUE,
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quests table
CREATE TABLE IF NOT EXISTS quests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    estimated_time TEXT,
    location TEXT,
    points INTEGER DEFAULT 0,
    badge TEXT,
    category TEXT,
    steps TEXT[] DEFAULT '{}',
    tips TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_quest_completions table
CREATE TABLE IF NOT EXISTS user_quest_completions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quest_id UUID REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, quest_id)
);

-- Row Level Security Policies

-- User profiles: Users can only access their own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: Users can only access their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Community posts: All authenticated users can read, only authors can update/delete
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view posts" ON community_posts FOR SELECT USING (TRUE);
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- Post likes: All authenticated users can read and manage their own likes
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view likes" ON post_likes FOR SELECT USING (TRUE);
CREATE POLICY "Users can manage own likes" ON post_likes FOR ALL USING (auth.uid() = user_id);

-- Post comments: All authenticated users can read, only authors can update/delete
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON post_comments FOR SELECT USING (TRUE);
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);

-- User settings: Users can only access their own settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quests: All authenticated users can read
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active quests" ON quests FOR SELECT USING (active = TRUE);

-- Quest completions: Users can only access their own completions
ALTER TABLE user_quest_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own completions" ON user_quest_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own completions" ON user_quest_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions and Triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON post_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update post counts when likes/comments change
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'post_likes' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'post_comments' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE community_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
        END IF;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

-- Apply triggers for post counts
CREATE TRIGGER update_likes_count AFTER INSERT OR DELETE ON post_likes FOR EACH ROW EXECUTE FUNCTION update_post_counts();
CREATE TRIGGER update_comments_count AFTER INSERT OR DELETE ON post_comments FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Insert some sample quests
INSERT INTO quests (title, description, difficulty, estimated_time, location, points, badge, category, steps, tips) VALUES
('Mulching Marathon', 'Apply organic mulch to your crops to improve soil health and water retention', 'easy', '2-3 hours', 'Your farm', 50, 'Mulch Master', 'Soil Health', 
 ARRAY['Gather crop residue, leaves, or straw', 'Clean the area around your plants', 'Spread the mulch 2-3 inches thick around the base', 'Keep mulch away from plant stems', 'Water lightly to help mulch settle'],
 ARRAY['Use organic materials like straw, leaves, or grass clippings', 'Avoid using diseased plant material', 'Replenish mulch as it decomposes']),

('Water Conservation Challenge', 'Set up drip irrigation system to reduce water waste and improve crop yield', 'medium', '4-6 hours', 'Your farm', 100, 'Water Warrior', 'Water Management',
 ARRAY['Plan your irrigation layout', 'Purchase drip irrigation supplies', 'Install main water line', 'Connect drip emitters to plants', 'Test the system thoroughly'],
 ARRAY['Start with a small section first', 'Check for leaks regularly', 'Adjust flow rates based on plant needs']),

('Solar Panel Installation', 'Install solar panels to power your farm operations sustainably', 'hard', '1-2 days', 'Your farm', 200, 'Solar Champion', 'Renewable Energy',
 ARRAY['Assess your energy needs', 'Choose appropriate solar panel system', 'Install mounting hardware', 'Connect solar panels', 'Set up battery storage', 'Connect to inverter'],
 ARRAY['Consult with a professional installer', 'Check local regulations and permits', 'Consider battery backup for cloudy days']);