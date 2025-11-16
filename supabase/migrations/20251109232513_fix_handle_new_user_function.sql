/*
  # Fix user profile creation function

  1. Changes
    - Update handle_new_user() function to handle missing or malformed metadata
    - Add better error handling for JSON parsing
    - Safely extract full_name from raw_user_meta_data
*/

-- Drop and recreate the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_full_name text;
BEGIN
  -- Safely extract full_name from metadata
  BEGIN
    user_full_name := COALESCE(new.raw_user_meta_data->>'full_name', '');
  EXCEPTION WHEN OTHERS THEN
    user_full_name := '';
  END;

  -- Insert user profile
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, COALESCE(new.email, ''), user_full_name)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the user creation
  RAISE WARNING 'Error creating user profile: %', SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;