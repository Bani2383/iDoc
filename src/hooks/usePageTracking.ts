import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageTrackingOptions {
  enabled?: boolean;
  trackAnonymous?: boolean;
  metadata?: Record<string, unknown>;
}

export function usePageTracking(
  pageName?: string,
  options: PageTrackingOptions = {}
) {
  const { user } = useAuth();
  const { enabled = true, trackAnonymous = false, metadata = {} } = options;
  const startTime = useRef<number>(Date.now());
  const tracked = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;
    if (!user && !trackAnonymous) return;
    if (tracked.current) return;

    const trackVisit = async () => {
      try {
        const pageUrl = pageName || window.location.pathname;

        const trackingData = {
          user_id: user?.id || null,
          activity_type: 'page_view',
          page_url: pageUrl,
          ip_address: null,
          user_agent: navigator.userAgent,
          metadata: {
            ...metadata,
            referrer: document.referrer,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            timestamp: new Date().toISOString(),
          },
        };

        const { error } = await supabase
          .from('user_activity')
          .insert(trackingData);

        if (error) {
          console.error('Error tracking page visit:', error);
        } else {
          tracked.current = true;
        }
      } catch (error) {
        console.error('Error in page tracking:', error);
      }
    };

    trackVisit();

    return () => {
      if (tracked.current) {
        const duration = Math.floor((Date.now() - startTime.current) / 1000);

        const trackDuration = async () => {
          try {
            const pageUrl = pageName || window.location.pathname;
            await supabase.from('user_activity').insert({
              user_id: user?.id || null,
              activity_type: 'page_duration',
              page_url: pageUrl,
              metadata: {
                duration_seconds: duration,
              },
            });
          } catch (error) {
            console.error('Error tracking page duration:', error);
          }
        };

        trackDuration();
      }
    };
  }, [user, pageName, enabled, trackAnonymous, metadata]);
}

export function trackEvent(
  eventType: string,
  eventData?: Record<string, unknown>
) {
  return async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const trackingData = {
        user_id: user?.id || null,
        activity_type: eventType,
        page_url: window.location.pathname,
        metadata: {
          ...eventData,
          timestamp: new Date().toISOString(),
        },
      };

      const { error } = await supabase
        .from('user_activity')
        .insert(trackingData);

      if (error) {
        console.error('Error tracking event:', error);
      }
    } catch (error) {
      console.error('Error in event tracking:', error);
    }
  };
}
