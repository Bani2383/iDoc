/*
  # Add login logs table

  1. New Table
    - `login_logs`
      - `id` (uuid, primary key) - Unique log identifier
      - `user_id` (uuid, references auth.users) - User who logged in
      - `login_at` (timestamptz) - Login timestamp
      - `ip_address` (text, nullable) - User IP address
      - `user_agent` (text, nullable) - Browser/device info
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on login_logs table
    - Only admins can view login logs
    - Users can only view their own login history

  3. Indexes
    - Index on user_id for quick user lookups
    - Index on login_at for time-based queries
*/

CREATE TABLE IF NOT EXISTS login_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  login_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_login_at ON login_logs(login_at);

ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own login history"
  ON login_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all login logs"
  ON login_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert login logs"
  ON login_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);