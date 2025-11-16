import { useEffect } from 'react';

export interface DocumentEvent {
  eventType: 'view' | 'search' | 'preview' | 'fill_start' | 'payment_modal' | 'payment_success' | 'download';
  templateId?: string;
  templateName?: string;
  searchQuery?: string;
  source?: 'search' | 'popular' | 'category' | 'direct';
  sessionId: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

class DocumentTracker {
  private sessionId: string;
  private events: DocumentEvent[] = [];
  private endpoint = '/api/tracking';

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    const stored = sessionStorage.getItem('idoc_session_id');
    if (stored) return stored;

    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('idoc_session_id', newId);
    return newId;
  }

  track(event: Omit<DocumentEvent, 'sessionId' | 'timestamp'>) {
    const fullEvent: DocumentEvent = {
      ...event,
      sessionId: this.sessionId,
      timestamp: Date.now(),
    };

    this.events.push(fullEvent);

    if (import.meta.env.DEV) {
      console.log('[DocumentTracker]', fullEvent);
    }

    const win = window as { gtag?: (...args: unknown[]) => void };
    if (typeof window !== 'undefined' && win.gtag) {
      win.gtag('event', event.eventType, {
        template_id: event.templateId,
        template_name: event.templateName,
        source: event.source,
        search_query: event.searchQuery,
      });
    }

    this.flushIfNeeded();
  }

  private flushIfNeeded() {
    if (this.events.length >= 10) {
      this.flush();
    }
  }

  private flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.endpoint, JSON.stringify(eventsToSend));
    }
  }

  getSessionEvents(): DocumentEvent[] {
    return [...this.events];
  }

  clearSession() {
    this.events = [];
    sessionStorage.removeItem('idoc_session_id');
    this.sessionId = this.getOrCreateSessionId();
  }
}

const tracker = new DocumentTracker();

export function useDocumentTracking() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      const events = tracker.getSessionEvents();
      if (events.length > 0) {
        navigator.sendBeacon('/api/tracking', JSON.stringify(events));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const trackDocumentView = (templateId: string, templateName: string, source: DocumentEvent['source']) => {
    tracker.track({
      eventType: 'view',
      templateId,
      templateName,
      source,
    });
  };

  const trackSearch = (query: string, resultsCount: number) => {
    tracker.track({
      eventType: 'search',
      searchQuery: query,
      metadata: { resultsCount },
    });
  };

  const trackPreview = (templateId: string, templateName: string) => {
    tracker.track({
      eventType: 'preview',
      templateId,
      templateName,
    });
  };

  const trackFillStart = (templateId: string, templateName: string) => {
    tracker.track({
      eventType: 'fill_start',
      templateId,
      templateName,
    });
  };

  const trackPaymentModal = (templateId: string, templateName: string) => {
    tracker.track({
      eventType: 'payment_modal',
      templateId,
      templateName,
    });
  };

  const trackPaymentSuccess = (templateId: string, templateName: string, paymentMethod: string) => {
    tracker.track({
      eventType: 'payment_success',
      templateId,
      templateName,
      metadata: { paymentMethod },
    });
  };

  const trackDownload = (templateId: string, templateName: string) => {
    tracker.track({
      eventType: 'download',
      templateId,
      templateName,
    });
  };

  return {
    trackDocumentView,
    trackSearch,
    trackPreview,
    trackFillStart,
    trackPaymentModal,
    trackPaymentSuccess,
    trackDownload,
  };
}
