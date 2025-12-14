/*
  # Fix login_logs foreign key to enable Supabase relation

  1. Changes
    - Drop existing foreign key to auth.users
    - Add foreign key to user_profiles for proper Supabase join syntax
    
  2. Why
    - Supabase's join syntax `user_profiles(email, full_name)` requires
      a foreign key relationship between tables
    - Currently login_logs references auth.users, not user_profiles
    - This prevents the automatic join from working
    
  3. Security
    - Maintains all existing RLS policies
    - No security impact, just enables proper joins
*/

-- Drop the existing foreign key constraint to auth.users
ALTER TABLE login_logs
  DROP CONSTRAINT IF EXISTS login_logs_user_id_fkey;

-- Add foreign key to user_profiles instead
-- Note: user_profiles.id is already linked to auth.users.id
ALTER TABLE login_logs
  ADD CONSTRAINT login_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES user_profiles(id) 
  ON DELETE CASCADE;

-- Verify the constraint was added
COMMENT ON CONSTRAINT login_logs_user_id_fkey ON login_logs IS 
  'Links login logs to user profiles for Supabase join syntax support';
