import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AnalyticsEvent {
  event_type: string;
  template_id?: string;
  bundle_id?: string;
  page_url?: string;
  metadata?: Record<string, any>;
}

export function useAnalytics() {
  const { user } = useAuth();

  const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  };

  const getDeviceType = (): string => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  };

  const getBrowser = (): string => {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      const sessionId = getSessionId();
      const deviceType = getDeviceType();
      const browser = getBrowser();

      await supabase.from('analytics_events').insert({
        event_type: event.event_type,
        user_id: user?.id || null,
        session_id: sessionId,
        template_id: event.template_id || null,
        bundle_id: event.bundle_id || null,
        page_url: event.page_url || window.location.href,
        referrer: document.referrer || null,
        device_type: deviceType,
        browser: browser,
        language_code: navigator.language.split('-')[0],
        metadata: event.metadata || {}
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackPageView = () => {
    trackEvent({
      event_type: 'page_view',
      page_url: window.location.href
    });
  };

  const trackTemplateView = (templateId: string) => {
    trackEvent({
      event_type: 'template_view',
      template_id: templateId
    });

    supabase.rpc('increment_template_views', { template_uuid: templateId }).then();
  };

  const trackAddToCart = (templateId: string) => {
    trackEvent({
      event_type: 'add_to_cart',
      template_id: templateId
    });
  };

  const trackCheckoutStart = (templateId: string, price: number) => {
    trackEvent({
      event_type: 'checkout_start',
      template_id: templateId,
      metadata: { price }
    });
  };

  const trackPurchaseComplete = (templateId: string, price: number, purchaseId: string) => {
    trackEvent({
      event_type: 'purchase_complete',
      template_id: templateId,
      metadata: { price, purchase_id: purchaseId }
    });
  };

  const trackSearch = (query: string, resultsCount: number) => {
    trackEvent({
      event_type: 'search',
      metadata: { query, results_count: resultsCount }
    });
  };

  const trackCategoryClick = (category: string) => {
    trackEvent({
      event_type: 'category_click',
      metadata: { category }
    });
  };

  useEffect(() => {
    trackPageView();
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackTemplateView,
    trackAddToCart,
    trackCheckoutStart,
    trackPurchaseComplete,
    trackSearch,
    trackCategoryClick
  };
}
