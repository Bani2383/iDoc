import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface TrackActivityParams {
  activityType: string;
  pageUrl?: string;
  metadata?: Record<string, unknown>;
}

export const useActivityTracker = () => {
  const { user } = useAuth();

  const trackActivity = async ({
    activityType,
    pageUrl,
    metadata = {},
  }: TrackActivityParams) => {
    if (!user) return;

    try {
      // Obtenir l'IP et user agent (si disponibles)
      const userAgent = navigator.userAgent;
      const currentPageUrl = pageUrl || window.location.href;

      await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_activity_type: activityType,
        p_page_url: currentPageUrl,
        p_user_agent: userAgent,
        p_metadata: metadata,
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  const trackPageVisit = () => {
    trackActivity({
      activityType: 'visit',
      pageUrl: window.location.href,
    });
  };

  const trackLogin = async () => {
    if (!user) return;

    try {
      // Incrémenter le compteur de login
      await supabase.rpc('increment_login_count', {
        user_uuid: user.id,
      });

      // Logger l'activité
      await trackActivity({
        activityType: 'login',
        metadata: {
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error tracking login:', error);
    }
  };

  const trackPayment = async (purchaseId: string, amount: number) => {
    await trackActivity({
      activityType: 'payment',
      metadata: {
        purchaseId,
        amount,
      },
    });
  };

  const trackDocumentGeneration = async (templateId: string, documentType: string) => {
    await trackActivity({
      activityType: 'generate-document',
      metadata: {
        templateId,
        documentType,
      },
    });
  };

  const trackDocumentView = async (documentId: string) => {
    await trackActivity({
      activityType: 'view-document',
      metadata: {
        documentId,
      },
    });
  };

  // Track page visits automatiquement
  useEffect(() => {
    if (user) {
      trackPageVisit();
    }
  }, [user, window.location.pathname]);

  return {
    trackActivity,
    trackPageVisit,
    trackLogin,
    trackPayment,
    trackDocumentGeneration,
    trackDocumentView,
  };
};
