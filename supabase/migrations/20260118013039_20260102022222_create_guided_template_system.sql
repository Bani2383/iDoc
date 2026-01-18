/*
  # Create Guided Template System

  ## New Tables
    - `guided_template_configs` - Stores JSON configurations for guided templates
      - `id` (uuid, primary key)
      - `name` (text) - Template name
      - `description` (text) - Template description
      - `category` (text) - Category (immigration, legal, business, etc.)
      - `config` (jsonb) - Full JSON configuration with steps, variants, rules
      - `is_active` (boolean) - Whether template is active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid) - Reference to user_profiles

    - `guided_template_submissions` - Stores user submissions
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Reference to user_profiles
      - `config_id` (uuid) - Reference to guided_template_configs
      - `form_data` (jsonb) - User's form responses
      - `selected_variant` (text) - Which variant was selected
      - `generated_content` (text) - Final generated document
      - `status` (text) - draft, completed, paid
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  ## Security
    - Enable RLS on both tables
    - Admins can manage configs
    - Users can view active configs
    - Users can manage their own submissions

  ## Important Notes
    - This is a NEW system that coexists with existing document_templates
    - Does NOT replace any existing functionality
    - Provides advanced conditional logic and rule-based document generation
*/

-- Create guided_template_configs table
CREATE TABLE IF NOT EXISTS public.guided_template_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  config jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL
);

-- Create guided_template_submissions table
CREATE TABLE IF NOT EXISTS public.guided_template_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  config_id uuid REFERENCES public.guided_template_configs(id) ON DELETE CASCADE NOT NULL,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  selected_variant text,
  generated_content text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'paid')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_guided_configs_category ON public.guided_template_configs(category);
CREATE INDEX IF NOT EXISTS idx_guided_configs_active ON public.guided_template_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_guided_submissions_user ON public.guided_template_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_guided_submissions_config ON public.guided_template_submissions(config_id);
CREATE INDEX IF NOT EXISTS idx_guided_submissions_status ON public.guided_template_submissions(status);

-- Enable RLS
ALTER TABLE public.guided_template_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guided_template_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for guided_template_configs
CREATE POLICY "Anyone can view active guided configs"
  ON public.guided_template_configs
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage guided configs"
  ON public.guided_template_configs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Policies for guided_template_submissions
CREATE POLICY "Users can view own guided submissions"
  ON public.guided_template_submissions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own guided submissions"
  ON public.guided_template_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own guided submissions"
  ON public.guided_template_submissions
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own guided submissions"
  ON public.guided_template_submissions
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Admins can view all guided submissions"
  ON public.guided_template_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_guided_configs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_guided_configs_updated_at_trigger
  BEFORE UPDATE ON public.guided_template_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_guided_configs_updated_at();

CREATE OR REPLACE FUNCTION public.update_guided_submissions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_guided_submissions_updated_at_trigger
  BEFORE UPDATE ON public.guided_template_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_guided_submissions_updated_at();