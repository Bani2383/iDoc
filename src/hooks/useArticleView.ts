import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function useArticleView(articleSlug: string | null, enabled: boolean = true) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!articleSlug || !enabled || hasTrackedRef.current) return;

    const trackView = async () => {
      try {
        const { error } = await supabase.rpc('increment_article_views', {
          article_slug: articleSlug
        });

        if (error) {
          console.error('Error tracking article view:', error);
          return;
        }

        hasTrackedRef.current = true;
      } catch (error) {
        console.error('Error tracking article view:', error);
      }
    };

    const timer = setTimeout(trackView, 3000);

    return () => clearTimeout(timer);
  }, [articleSlug, enabled]);
}
