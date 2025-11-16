import { useState, useEffect } from 'react';

interface ViewedDocument {
  templateId: string;
  templateName: string;
  viewedAt: number;
  viewCount: number;
}

interface GuestSession {
  sessionId: string;
  startedAt: number;
  viewedDocuments: ViewedDocument[];
  lastActivity: number;
}

const STORAGE_KEY = 'idoc_guest_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export function useGuestBehavior() {
  const [session, setSession] = useState<GuestSession | null>(null);

  useEffect(() => {
    loadOrCreateSession();
  }, []);

  const loadOrCreateSession = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: GuestSession = JSON.parse(stored);

        if (Date.now() - parsed.lastActivity < SESSION_DURATION) {
          setSession(parsed);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading guest session:', error);
    }

    const newSession: GuestSession = {
      sessionId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startedAt: Date.now(),
      viewedDocuments: [],
      lastActivity: Date.now(),
    };

    saveSession(newSession);
    setSession(newSession);
  };

  const saveSession = (sessionData: GuestSession) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error saving guest session:', error);
    }
  };

  const trackDocumentView = (templateId: string, templateName: string) => {
    if (!session) return;

    const existingDoc = session.viewedDocuments.find((d) => d.templateId === templateId);

    const updatedSession: GuestSession = {
      ...session,
      lastActivity: Date.now(),
      viewedDocuments: existingDoc
        ? session.viewedDocuments.map((d) =>
            d.templateId === templateId
              ? { ...d, viewCount: d.viewCount + 1, viewedAt: Date.now() }
              : d
          )
        : [
            ...session.viewedDocuments,
            {
              templateId,
              templateName,
              viewedAt: Date.now(),
              viewCount: 1,
            },
          ],
    };

    saveSession(updatedSession);
    setSession(updatedSession);
  };

  const getDocumentBehavior = (templateId: string) => {
    if (!session) return null;

    const doc = session.viewedDocuments.find((d) => d.templateId === templateId);
    if (!doc) return null;

    const isReturning = doc.viewCount > 1;
    const lastViewMinutesAgo = Math.floor((Date.now() - doc.viewedAt) / (1000 * 60));

    return {
      isReturning,
      viewCount: doc.viewCount,
      lastViewMinutesAgo,
      shouldShowUrgency: isReturning && lastViewMinutesAgo < 60,
    };
  };

  const getAdaptiveCTA = (templateId: string, templateName: string) => {
    const behavior = getDocumentBehavior(templateId);

    if (!behavior) {
      return {
        text: `Créer ce document - 1,99$`,
        variant: 'default' as const,
        urgency: false,
      };
    }

    if (behavior.isReturning && behavior.lastViewMinutesAgo < 30) {
      return {
        text: `Vous êtes revenu ! Téléchargez "${templateName}" maintenant - 1,99$`,
        variant: 'urgent' as const,
        urgency: true,
      };
    }

    if (behavior.isReturning) {
      return {
        text: `Vous avez consulté ce document ${behavior.viewCount} fois. Prêt à le créer ? - 1,99$`,
        variant: 'returning' as const,
        urgency: false,
      };
    }

    return {
      text: `Créer ce document - 1,99$`,
      variant: 'default' as const,
      urgency: false,
    };
  };

  const getRecentDocuments = (limit = 5) => {
    if (!session) return [];

    return [...session.viewedDocuments]
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .slice(0, limit);
  };

  const clearSession = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
    } catch (error) {
      console.error('Error clearing guest session:', error);
    }
  };

  return {
    session,
    trackDocumentView,
    getDocumentBehavior,
    getAdaptiveCTA,
    getRecentDocuments,
    clearSession,
    isReturningGuest: session ? session.viewedDocuments.length > 0 : false,
  };
}
