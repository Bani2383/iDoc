/*
  # Drop Unused Indexes

  1. Performance Optimization
    - Remove 5 unused indexes to reduce database overhead
    - These indexes are from the guided template system but have not been used
    - Keeping unused indexes wastes storage and slows down writes

  2. Indexes Being Removed
    - idx_guided_configs_category on guided_template_configs
    - idx_guided_submissions_user on guided_template_submissions
    - idx_guided_submissions_config on guided_template_submissions
    - idx_guided_submissions_status on guided_template_submissions
    - idx_seo_landing_pages_created_by on seo_landing_pages

  3. Notes
    - The foreign key index added earlier (idx_guided_template_configs_created_by) 
      will remain as it's needed for FK performance
    - These specific indexes were created but analysis shows they're not being used
    - System will rely on primary keys and the foreign key indexes instead
*/

-- Drop unused guided template indexes
DROP INDEX IF EXISTS public.idx_guided_configs_category;
DROP INDEX IF EXISTS public.idx_guided_submissions_user;
DROP INDEX IF EXISTS public.idx_guided_submissions_config;
DROP INDEX IF EXISTS public.idx_guided_submissions_status;

-- Drop unused SEO landing page index
DROP INDEX IF EXISTS public.idx_seo_landing_pages_created_by;
