/**
 * Analytics Service
 *
 * @description Centralized analytics and event tracking
 */


interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

interface UserProperties {
  userId?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

class AnalyticsService {
  private userId: string | null = null;
  private sessionId: string;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialize analytics service
   */
  init() {
    if (this.isInitialized) return;

    // Initialize Google Analytics
    if (import.meta.env.PROD && import.meta.env.VITE_GA_ID) {
      this.initGoogleAnalytics(import.meta.env.VITE_GA_ID);
    }

    // Track page views
    this.trackPageView();

    // Track performance metrics
    this.trackPerformanceMetrics();

    this.isInitialized = true;
  }

  /**
   * Initialize Google Analytics
   */
  private initGoogleAnalytics(measurementId: string) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    interface WindowWithDataLayer extends Window {
      dataLayer: unknown[];
      gtag: (...args: unknown[]) => void;
    }

    const win = window as unknown as WindowWithDataLayer;
    win.dataLayer = win.dataLayer || [];
    function gtag(...args: unknown[]) {
      win.dataLayer.push(args);
    }
    win.gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false, // We'll handle page views manually
    });
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set user ID
   */
  setUserId(userId: string) {
    this.userId = userId;

    const win = window as { gtag?: (...args: unknown[]) => void };
    if (win.gtag) {
      win.gtag('set', { user_id: userId });
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties) {
    const win = window as { gtag?: (...args: unknown[]) => void };
    if (win.gtag) {
      win.gtag('set', 'user_properties', properties);
    }
  }

  /**
   * Track event
   */
  trackEvent(event: AnalyticsEvent) {
    const eventData = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
    };

    // Log in development
    if (import.meta.env.DEV) {
      console.log('[Analytics] Event:', eventData);
    }

    // Send to Google Analytics
    const win = window as { gtag?: (...args: unknown[]) => void };
    if (win.gtag) {
      win.gtag('event', event.name, event.properties);
    }

    // Send to custom endpoint
    this.sendToEndpoint('/api/analytics/events', eventData);
  }

  /**
   * Track page view
   */
  trackPageView(path?: string) {
    const pagePath = path || window.location.pathname;

    this.trackEvent({
      name: 'page_view',
      properties: {
        page_path: pagePath,
        page_title: document.title,
      },
    });
  }

  /**
   * Track performance metrics
   */
  private trackPerformanceMetrics() {
    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.trackEvent({
          name: 'performance',
          properties: {
            metric: entry.name,
            value: entry.startTime,
            rating: this.getPerformanceRating(entry.name, entry.startTime),
          },
        });
      }
    });

    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
  }

  /**
   * Get performance rating
   */
  private getPerformanceRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, [number, number]> = {
      'largest-contentful-paint': [2500, 4000],
      'first-contentful-paint': [1800, 3000],
      'time-to-interactive': [3800, 7300],
    };

    const [good, poor] = thresholds[metric] || [0, 0];

    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, unknown>) {
    this.trackEvent({
      name: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    });
  }

  /**
   * Track conversion
   */
  trackConversion(conversionName: string, value?: number) {
    this.trackEvent({
      name: 'conversion',
      properties: {
        conversion_name: conversionName,
        value,
      },
    });
  }

  /**
   * Track user action
   */
  trackAction(action: string, category: string, label?: string, value?: number) {
    this.trackEvent({
      name: action,
      properties: {
        event_category: category,
        event_label: label,
        value,
      },
    });
  }

  /**
   * Send data to endpoint
   */
  private sendToEndpoint(endpoint: string, data: unknown) {
    if (!import.meta.env.PROD) return;

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(data));
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {
        // Silently fail
      });
    }
  }
}

// Export singleton
export const analytics = new AnalyticsService();

// Auto-initialize
if (typeof window !== 'undefined') {
  analytics.init();

  // Track page changes
  let lastPath = location.pathname;
  const observer = new MutationObserver(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      analytics.trackPageView();
    }
  });

  observer.observe(document.body, { subtree: true, childList: true });
}
