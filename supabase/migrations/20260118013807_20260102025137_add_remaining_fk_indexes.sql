/*
  # Add Remaining Foreign Key Indexes

  1. Performance Optimization
    - Add indexes for 3 missing foreign key columns
    - These were missed in the initial indexing passes

  2. Tables Covered
    - guided_template_submissions: 2 indexes (config_id, user_id)
    - seo_landing_pages: 1 index (created_by)

  3. Notes
    - These tables were created more recently
    - Foreign keys need indexes for optimal performance
    - Improves JOIN and RLS policy evaluation
*/

-- guided_template_submissions
CREATE INDEX IF NOT EXISTS idx_guided_template_submissions_config_id 
  ON public.guided_template_submissions(config_id);

CREATE INDEX IF NOT EXISTS idx_guided_template_submissions_user_id 
  ON public.guided_template_submissions(user_id);

-- seo_landing_pages
CREATE INDEX IF NOT EXISTS idx_seo_landing_pages_created_by 
  ON public.seo_landing_pages(created_by);
