-- MindBloom Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL,
  age_band VARCHAR(20) NOT NULL CHECK (age_band IN ('13-17', '18-24', '25-34', '35-44', '45+')),
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'parent', 'teacher')),
  avatar_level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_checkin TIMESTAMP WITH TIME ZONE,
  privacy_settings JSONB DEFAULT '{"anonymous": true, "share_wellness": false, "crisis_support": true}',
  wellness_metrics JSONB DEFAULT '{"calmness": 0.5, "energy": 0.5, "connection": 0.5}'
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_from_user BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  emotion JSONB,
  session_id UUID NOT NULL
);

-- Create wellness_sessions table
CREATE TABLE wellness_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('chat', 'breathing', 'journaling', 'exercise', 'micro_task')),
  duration INTEGER NOT NULL, -- in minutes
  xp_earned INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  metadata JSONB
);

-- Create peer_circles table
CREATE TABLE peer_circles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  theme VARCHAR(50) NOT NULL,
  max_capacity INTEGER DEFAULT 50,
  current_members INTEGER DEFAULT 0,
  rules TEXT[] DEFAULT ARRAY['No diagnosing', 'Listen and hold space', 'Use Get Help flow for crisis'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create circle_members table
CREATE TABLE circle_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  circle_id UUID REFERENCES peer_circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_anonymous BOOLEAN DEFAULT true,
  UNIQUE(circle_id, user_id)
);

-- Create stories table
CREATE TABLE stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  audio_url TEXT
);

-- Create challenges table
CREATE TABLE challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('community', 'individual', 'normalization')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  xp_reward INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB
);

-- Create community_garden table
CREATE TABLE community_garden (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  object_type VARCHAR(20) NOT NULL CHECK (object_type IN ('tree', 'bench', 'lantern', 'flower')),
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  xp_cost INTEGER NOT NULL
);

-- Create micro_tasks table
CREATE TABLE micro_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('breathing', 'journaling', 'mindfulness', 'gratitude')),
  duration INTEGER NOT NULL, -- in minutes
  xp_reward INTEGER NOT NULL,
  instructions TEXT[] NOT NULL,
  is_daily BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  xp_reward INTEGER NOT NULL,
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create crisis_reports table
CREATE TABLE crisis_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  keywords TEXT[] NOT NULL,
  action_taken VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Insert sample data
INSERT INTO peer_circles (name, description, theme, max_capacity) VALUES
('Exam Support', 'A safe space for students dealing with exam stress', 'academic', 30),
('First-gen Students', 'Support for first-generation college students', 'academic', 25),
('Night Owls', 'For those who struggle with sleep and late-night thoughts', 'wellness', 20),
('Parents of Teens', 'Support for parents navigating teen mental health', 'family', 15);

INSERT INTO micro_tasks (title, description, type, duration, xp_reward, instructions, is_daily) VALUES
('3-Minute Breathing', 'A quick breathing exercise to center yourself', 'breathing', 3, 10, ARRAY['Find a comfortable position', 'Breathe in for 4 counts', 'Hold for 4 counts', 'Breathe out for 6 counts', 'Repeat for 3 minutes'], true),
('Gratitude Journal', 'Write down three things you''re grateful for today', 'gratitude', 5, 15, ARRAY['Get a pen and paper', 'Write down 3 things you''re grateful for', 'Reflect on why each matters to you', 'Take a moment to appreciate them'], true),
('Mindful Moment', 'Take a mindful break to check in with yourself', 'mindfulness', 2, 8, ARRAY['Stop what you''re doing', 'Take 3 deep breaths', 'Notice how you feel right now', 'Acknowledge your emotions without judgment'], true);

INSERT INTO achievements (title, description, icon, xp_reward, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first wellness session', '🌟', 25, 'sessions_completed', 1),
('Streak Master', 'Maintain a 7-day streak', '🔥', 100, 'streak_days', 7),
('Community Helper', 'Send 10 supportive messages', '🤗', 75, 'supportive_messages', 10),
('Storyteller', 'Share your first story', '📖', 50, 'stories_shared', 1),
('Garden Keeper', 'Plant your first item in the community garden', '🌱', 30, 'garden_items', 1);

-- Create indexes for better performance
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_wellness_sessions_user_id ON wellness_sessions(user_id);
CREATE INDEX idx_wellness_sessions_type ON wellness_sessions(type);
CREATE INDEX idx_stories_category ON stories(category);
CREATE INDEX idx_stories_created_at ON stories(created_at);
CREATE INDEX idx_challenges_active ON challenges(is_active);
CREATE INDEX idx_community_garden_position ON community_garden(position_x, position_y);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions" ON wellness_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON wellness_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view active circles" ON peer_circles FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view their circle memberships" ON circle_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join circles" ON circle_members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view published stories" ON stories FOR SELECT USING (true);
CREATE POLICY "Users can insert their own stories" ON stories FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Anyone can view active challenges" ON challenges FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view community garden" ON community_garden FOR SELECT USING (true);
CREATE POLICY "Users can insert garden items" ON community_garden FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON user_achievements FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their crisis reports" ON crisis_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert crisis reports" ON crisis_reports FOR INSERT WITH CHECK (true);
