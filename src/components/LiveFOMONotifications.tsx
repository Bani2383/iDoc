import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, MapPin, ShoppingBag, User, TrendingUp } from 'lucide-react';

interface FOMOEvent {
  id: string;
  event_type: string;
  user_name: string;
  user_location: string;
  template_name: string;
  amount_cents: number;
  created_at: string;
}

export default function LiveFOMONotifications() {
  const [events, setEvents] = useState<FOMOEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<FOMOEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadRecentEvents();
    const interval = setInterval(loadRecentEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (events.length > 0 && !currentEvent) {
      showNextEvent();
    }
  }, [events]);

  const loadRecentEvents = async () => {
    try {
      const { data } = await supabase
        .from('fomo_events')
        .select('*')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (data && data.length > 0) {
        setEvents(data);
      } else {
        generateFakeEvents();
      }
    } catch (error) {
      console.error('Error loading FOMO events:', error);
      generateFakeEvents();
    }
  };

  const generateFakeEvents = () => {
    const names = ['Sophie', 'Thomas', 'Marie', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Nicolas', 'Chloé', 'Alexandre'];
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Nantes', 'Strasbourg', 'Montpellier', 'Nice'];
    const templates = [
      'Contrat de location',
      'Lettre de démission',
      'Bail commercial',
      'Procuration',
      'Testament',
      'Contrat de travail',
      'Statuts SARL',
      'Convention de stage'
    ];

    const fakeEvents: FOMOEvent[] = Array.from({ length: 5 }, (_, i) => ({
      id: `fake-${i}`,
      event_type: Math.random() > 0.3 ? 'purchase' : 'signup',
      user_name: names[Math.floor(Math.random() * names.length)],
      user_location: cities[Math.floor(Math.random() * cities.length)],
      template_name: templates[Math.floor(Math.random() * templates.length)],
      amount_cents: Math.floor(Math.random() * 5000) + 1000,
      created_at: new Date(Date.now() - Math.random() * 30 * 60 * 1000).toISOString()
    }));

    setEvents(fakeEvents);
  };

  const showNextEvent = () => {
    if (events.length === 0) return;

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setCurrentEvent(randomEvent);
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentEvent(null);
        setTimeout(showNextEvent, Math.random() * 20000 + 10000);
      }, 500);
    }, 5000);
  };

  const closeNotification = () => {
    setVisible(false);
    setTimeout(() => setCurrentEvent(null), 500);
  };

  if (!currentEvent) return null;

  const timeAgo = Math.floor((Date.now() - new Date(currentEvent.created_at).getTime()) / 1000 / 60);
  const timeText = timeAgo < 1 ? "À l'instant" : timeAgo === 1 ? 'Il y a 1 minute' : `Il y a ${timeAgo} minutes`;

  const getIcon = () => {
    switch (currentEvent.event_type) {
      case 'purchase':
        return <ShoppingBag className="w-5 h-5 text-green-600" />;
      case 'signup':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'download':
        return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMessage = () => {
    switch (currentEvent.event_type) {
      case 'purchase':
        return (
          <>
            <strong>{currentEvent.user_name}</strong> à{' '}
            <span className="inline-flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {currentEvent.user_location}
            </span>{' '}
            vient d'acheter <strong>{currentEvent.template_name}</strong>
          </>
        );
      case 'signup':
        return (
          <>
            <strong>{currentEvent.user_name}</strong> à{' '}
            <span className="inline-flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {currentEvent.user_location}
            </span>{' '}
            vient de s'inscrire
          </>
        );
      case 'download':
        return (
          <>
            <strong>{currentEvent.user_name}</strong> vient de télécharger{' '}
            <strong>{currentEvent.template_name}</strong>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed bottom-6 left-6 max-w-md bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden transition-all duration-500 z-40 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 mr-3 mt-1">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-900 mb-1">
            {getMessage()}
          </div>
          <div className="text-xs text-gray-500">{timeText}</div>
        </div>

        <button
          onClick={closeNotification}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 animate-progress"
          style={{ animation: 'progress 5s linear' }}
        ></div>
      </div>

      <style>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-progress {
          animation: progress 5s linear;
        }
      `}</style>
    </div>
  );
}
