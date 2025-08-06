/*
  # YOUTRAIT Database Schema

  1. Tables Created
    - `profiles` - User profiles with basic info
    - `skills` - Master skills table with categories
    - `user_skills` - User's skills with experience and endorsement count
    - `endorsements` - Track who endorsed whom for which skill
    - `skill_categories` - Categorize skills by profession/field
    - `conversations` - Chat conversations between users
    - `messages` - Chat messages
    - `notifications` - User notifications

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
    - Secure data access based on user relationships

  3. Storage
    - Create buckets for profile pictures and resumes
    - Set up appropriate security policies
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  profile_picture_url text,
  profession text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skill categories table
CREATE TABLE IF NOT EXISTS skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  color text DEFAULT '#8B5CF6',
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category_id uuid REFERENCES skill_categories(id),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  years_experience integer DEFAULT 0,
  endorsement_count integer DEFAULT 0,
  skill_level text DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'expert', 'godmode')),
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Create endorsements table
CREATE TABLE IF NOT EXISTS endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endorser_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  endorsed_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(endorser_id, endorsed_user_id, skill_id)
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant_2 uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(participant_1, participant_2)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('endorsement', 'message', 'skill_update', 'achievement')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Insert default skill categories
INSERT INTO skill_categories (name, description, color) VALUES
  ('Technology', 'Programming, software development, and technical skills', '#3B82F6'),
  ('Design', 'UI/UX, graphic design, and creative skills', '#EC4899'),
  ('Marketing', 'Digital marketing, content creation, and growth', '#10B981'),
  ('Business', 'Management, strategy, and business development', '#F59E0B'),
  ('Data', 'Data science, analytics, and machine learning', '#8B5CF6'),
  ('Communication', 'Writing, speaking, and interpersonal skills', '#EF4444')
ON CONFLICT (name) DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name, category_id) VALUES
  ('JavaScript', (SELECT id FROM skill_categories WHERE name = 'Technology')),
  ('React', (SELECT id FROM skill_categories WHERE name = 'Technology')),
  ('Node.js', (SELECT id FROM skill_categories WHERE name = 'Technology')),
  ('Python', (SELECT id FROM skill_categories WHERE name = 'Technology')),
  ('UI/UX Design', (SELECT id FROM skill_categories WHERE name = 'Design')),
  ('Figma', (SELECT id FROM skill_categories WHERE name = 'Design')),
  ('Digital Marketing', (SELECT id FROM skill_categories WHERE name = 'Marketing')),
  ('Content Strategy', (SELECT id FROM skill_categories WHERE name = 'Marketing')),
  ('Project Management', (SELECT id FROM skill_categories WHERE name = 'Business')),
  ('Data Analysis', (SELECT id FROM skill_categories WHERE name = 'Data')),
  ('Machine Learning', (SELECT id FROM skill_categories WHERE name = 'Data')),
  ('Technical Writing', (SELECT id FROM skill_categories WHERE name = 'Communication'))
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for skill_categories and skills (public read)
CREATE POLICY "Anyone can view skill categories"
  ON skill_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_skills
CREATE POLICY "Users can view all user skills"
  ON user_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own skills"
  ON user_skills FOR ALL
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for endorsements
CREATE POLICY "Users can view all endorsements"
  ON endorsements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create endorsements"
  ON endorsements FOR INSERT
  TO authenticated
  WITH CHECK (endorser_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    participant_1 IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    participant_2 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    participant_1 IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    participant_2 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in own conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE participant_1 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
         OR participant_2 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Functions and triggers for automatic skill level updates
CREATE OR REPLACE FUNCTION update_skill_level()
RETURNS TRIGGER AS $$
BEGIN
  -- Update skill level based on endorsement count
  NEW.skill_level = CASE
    WHEN NEW.endorsement_count >= 300 THEN 'godmode'
    WHEN NEW.endorsement_count >= 100 THEN 'expert'
    WHEN NEW.endorsement_count >= 50 THEN 'intermediate'
    ELSE 'beginner'
  END;
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_skill_level_trigger
  BEFORE UPDATE ON user_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_skill_level();

-- Function to increment endorsement count
CREATE OR REPLACE FUNCTION increment_endorsement_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_skills 
  SET endorsement_count = endorsement_count + 1
  WHERE user_id = NEW.endorsed_user_id AND skill_id = NEW.skill_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_endorsement_trigger
  AFTER INSERT ON endorsements
  FOR EACH ROW
  EXECUTE FUNCTION increment_endorsement_count();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-pictures', 'profile-pictures', true),
  ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile pictures
CREATE POLICY "Anyone can view profile pictures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-pictures');

CREATE POLICY "Authenticated users can upload profile pictures"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-pictures' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile pictures"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for resumes
CREATE POLICY "Users can view own resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);