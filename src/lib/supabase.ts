import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.DEV
  ? window.location.origin + '/supabase'
  : import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TemplateVariable {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  options: string[];
  description: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: 'professional' | 'personal';
  description: string | null;
  slug: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  template_content: string | null;
  template_variables: TemplateVariable[];
  instructions: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'client';
  professional_status: string | null;
  profession: string | null;
  housing_status: string | null;
  company_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentFolder {
  id: string;
  user_id: string;
  name: string;
  parent_folder_id: string | null;
  color: string | null;
  icon: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentView {
  id: string;
  user_id: string | null;
  session_id: string;
  template_id: string;
  viewed_at: string;
  duration_seconds: number | null;
  source: 'search' | 'category' | 'recommendation' | 'direct';
}

export interface RecommendationRule {
  id: string;
  source_template_id: string;
  recommended_template_id: string;
  rule_type: 'similar' | 'complementary' | 'popular';
  weight: number;
  is_active: boolean;
  created_at: string;
}

export interface SignatureWorkflow {
  id: string;
  document_id: string;
  created_by: string;
  workflow_type: 'sequential' | 'parallel';
  status: 'draft' | 'sent' | 'in_progress' | 'completed' | 'declined' | 'expired';
  expires_at: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface WorkflowSigner {
  id: string;
  workflow_id: string;
  email: string;
  full_name: string;
  role: 'signer' | 'approver' | 'witness' | 'cc';
  order_index: number;
  status: 'pending' | 'sent' | 'opened' | 'signed' | 'declined';
  signed_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
  signature_data: string | null;
  access_token: string | null;
  opened_at: string | null;
  declined_reason: string | null;
  created_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  content: Record<string, unknown>;
  pdf_url: string | null;
  file_size: number | null;
  changes_summary: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  key_hash: string;
  name: string;
  permissions: string[];
  rate_limit: number;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface ApiLog {
  id: string;
  api_key_id: string | null;
  endpoint: string;
  method: string;
  status_code: number | null;
  request_body: Record<string, unknown> | null;
  response_body: Record<string, unknown> | null;
  ip_address: string | null;
  duration_ms: number | null;
  created_at: string;
}

export interface Jurisdiction {
  id: string;
  code: string;
  name: string;
  country: string;
  region: string | null;
  is_active: boolean;
  created_at: string;
}

export interface LegalRule {
  id: string;
  template_id: string;
  jurisdiction_id: string;
  clause_key: string;
  clause_text: string;
  legal_reference: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface BulkCampaign {
  id: string;
  user_id: string;
  name: string;
  template_id: string | null;
  total_count: number;
  success_count: number;
  error_count: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  csv_mapping: Record<string, unknown> | null;
  created_at: string;
  completed_at: string | null;
}

export interface BulkSend {
  id: string;
  campaign_id: string;
  recipient_email: string;
  recipient_data: Record<string, unknown> | null;
  document_id: string | null;
  status: 'pending' | 'sent' | 'failed';
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_cents: number;
  currency: string;
  type: 'document' | 'subscription' | 'api';
  document_id: string | null;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Affiliate {
  id: string;
  user_id: string;
  referral_code: string;
  commission_rate: number;
  total_earnings_cents: number;
  total_referrals: number;
  payout_email: string | null;
  payout_method: 'paypal' | 'stripe' | 'bank_transfer' | null;
  is_active: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  affiliate_id: string;
  referred_user_id: string | null;
  transaction_id: string | null;
  commission_cents: number | null;
  status: 'pending' | 'paid' | 'canceled';
  paid_at: string | null;
  created_at: string;
}
