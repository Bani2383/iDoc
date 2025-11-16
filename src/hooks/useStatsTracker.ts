import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function useStatsTracker() {
  const hasTrackedVisit = useRef(false);

  useEffect(() => {
    if (!hasTrackedVisit.current) {
      trackVisitor();
      hasTrackedVisit.current = true;
    }
  }, []);

  const trackVisitor = async () => {
    try {
      const lastVisit = localStorage.getItem('last_visit_time');
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (!lastVisit || now - parseInt(lastVisit) > oneHour) {
        await supabase.rpc('increment_statistic', {
          stat_name: 'total_visitors',
          increment_by: 1,
        });

        localStorage.setItem('last_visit_time', now.toString());
      }
    } catch (error) {
      console.error('Error tracking visitor:', error);
    }
  };

  const trackDocumentGeneration = async () => {
    try {
      await supabase.rpc('increment_statistic', {
        stat_name: 'documents_generated',
        increment_by: 1,
      });
    } catch (error) {
      console.error('Error tracking document generation:', error);
    }
  };

  const trackSignature = async () => {
    try {
      await supabase.rpc('increment_statistic', {
        stat_name: 'signatures_created',
        increment_by: 1,
      });
    } catch (error) {
      console.error('Error tracking signature:', error);
    }
  };

  const trackActiveUser = async () => {
    try {
      await supabase.rpc('increment_statistic', {
        stat_name: 'active_users',
        increment_by: 1,
      });
    } catch (error) {
      console.error('Error tracking active user:', error);
    }
  };

  return {
    trackDocumentGeneration,
    trackSignature,
    trackActiveUser,
  };
}
