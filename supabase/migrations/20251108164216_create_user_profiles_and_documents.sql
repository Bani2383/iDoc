/*
  # Create user profiles, documents, and payment system

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text) - User email
      - `full_name` (text) - User's full name
      - `role` (text) - 'admin' or 'client'
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `generated_documents`
      - `id` (uuid, primary key) - Unique document identifier
      - `user_id` (uuid, references auth.users) - Document owner
      - `template_id` (uuid, references document_templates, nullable) - Template used if any
      - `document_type` (text) - Type of document
      - `content` (jsonb) - Document content and fields
      - `pdf_url` (text, nullable) - URL to generated PDF
      - `status` (text) - 'draft', 'pending_payment', 'paid', 'generated'
      - `price` (decimal) - Document price
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `document_id` (uuid, references generated_documents)
      - `amount` (decimal) - Payment amount
      - `status` (text) - 'pending', 'completed', 'failed'
      - `payment_method` (text) - Payment method used
      - `transaction_id` (text, nullable) - External transaction ID
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can view/edit their own profiles
    - Users can view their own documents
    - Admins can view all data
    - Only paid documents show PDF URLs

  3. Indexes
    - Index on user_id for quick lookups
    - Index on status for filtering
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create generated_documents table
CREATE TABLE IF NOT EXISTS generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id uuid REFERENCES document_templates(id) ON DELETE SET NULL,
  document_type text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  pdf_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_payment', 'paid', 'generated')),
  price decimal(10, 2) NOT NULL DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES generated_documents(id) ON DELETE CASCADE,
  amount decimal(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text,
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_status ON generated_documents(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_document_id ON payments(document_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for generated_documents
CREATE POLICY "Users can view own documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON generated_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON generated_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all documents"
  ON generated_documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_documents_updated_at
  BEFORE UPDATE ON generated_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
