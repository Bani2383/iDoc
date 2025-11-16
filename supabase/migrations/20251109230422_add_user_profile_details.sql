/*
  # Add user profile details for billing and address

  1. Changes
    - Add postal_address column to user_profiles table
    - Add phone_number column to user_profiles table
    - Add billing_email column to user_profiles table (optional, defaults to auth email)
    
  2. Notes
    - Uses IF NOT EXISTS pattern to safely add columns
    - All fields are optional with reasonable defaults
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'postal_address'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN postal_address text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN phone_number text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'billing_email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN billing_email text;
  END IF;
END $$;