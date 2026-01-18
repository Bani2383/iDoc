/*
  # Enable RLS on Tables with Policies
  
  1. Security Improvements
    - Enable RLS on tables that have policies but RLS disabled
    - Ensures policies are actually enforced
  
  2. Tables Updated
    - ab_test_conversions
    - ab_test_variants
    - achievements
    - affiliate_clicks
    - cart_recovery_campaigns
    - email_campaigns
    - email_sequences
    - flash_deal_purchases
    - team_members
    - upsell_conversions
*/

-- Enable RLS on tables with policies but RLS disabled
ALTER TABLE public.ab_test_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_recovery_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_deal_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upsell_conversions ENABLE ROW LEVEL SECURITY;
