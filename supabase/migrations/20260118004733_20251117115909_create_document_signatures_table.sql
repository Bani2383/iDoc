/*
  # Create document_signatures table

  1. New Tables
    - `document_signatures`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users) - optional for guests
      - `document_id` (uuid, references user_documents) - optional
      - `signature_data` (text) - base64 encoded signature image
      - `signature_type` (text) - 'electronic' or 'manual'
      - `signature_method` (text) - 'draw', 'type', 'upload'
      - `original_filename` (text) - if signing uploaded PDF
      - `signed_pdf_url` (text) - URL to signed PDF in storage
      - `payment_status` (text) - 'pending', 'completed', 'failed'
      - `payment_amount` (numeric) - amount paid
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `document_signatures` table
    - Add policies for users to manage their own signatures
    - Allow anonymous signatures with session tracking
*/

CREATE TABLE IF NOT EXISTS document_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id uuid REFERENCES user_documents(id) ON DELETE SET NULL,
  signature_data text NOT NULL,
  signature_type text NOT NULL DEFAULT 'electronic',
  signature_method text NOT NULL DEFAULT 'draw',
  original_filename text,
  signed_pdf_url text,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_amount numeric(10,2) DEFAULT 1.99,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE document_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own signatures"
  ON document_signatures
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own signatures"
  ON document_signatures
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own signatures"
  ON document_signatures
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own signatures"
  ON document_signatures
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users can create signatures"
  ON document_signatures
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE INDEX IF NOT EXISTS idx_document_signatures_user_id ON document_signatures(user_id);
CREATE INDEX IF NOT EXISTS idx_document_signatures_document_id ON document_signatures(document_id);
CREATE INDEX IF NOT EXISTS idx_document_signatures_created_at ON document_signatures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_signatures_payment_status ON document_signatures(payment_status);