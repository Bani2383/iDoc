import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Zap } from 'lucide-react';

interface PurchaseNotification {
  id: string;
  name: string;
  document: string;
  timeAgo: string;
  location: string;
}

const SAMPLE_NOTIFICATIONS: PurchaseNotification[] = [
  { id: '1', name: 'Sarah M.', document: 'CV Professionnel', timeAgo: '2 min', location: 'Paris' },
  { id: '2', name: 'Thomas L.', document: 'Contrat CDI', timeAgo: '5 min', location: 'Lyon' },
  { id: '3', name: 'Marie D.', document: 'Lettre de Motivation', timeAgo: '8 min', location: 'Marseille' },
  { id: '4', name: 'Lucas R.', document: 'Pack Immigration', timeAgo: '12 min', location: 'Toulouse' },
  { id: '5', name: 'Emma B.', document: 'Attestation', timeAgo: '15 min', location: 'Nice' },
  { id: '6', name: 'Alexandre P.', document: 'CV + Lettre', timeAgo: '18 min', location: 'Nantes' },
  { id: '7', name: 'Sophie T.', document: 'Contrat Freelance', timeAgo: '22 min', location: 'Bordeaux' },
  { id: '8', name: 'Julien M.', document: 'Statuts SARL', timeAgo: '25 min', location: 'Lille' }
];

export default function FOMONotification() {
  const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [todayCount, setTodayCount] = useState(147);

  useEffect(() => {
    const showNotification = () => {
      const randomNotif = SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)];
      setCurrentNotification(randomNotif);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    const interval = setInterval(showNotification, 15000);
    setTimeout(showNotification, 3000);

    const countInterval = setInterval(() => {
      setTodayCount(prev => prev + Math.floor(Math.random() * 3));
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(countInterval);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed bottom-6 left-6 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 max-w-sm transform transition-all duration-500 z-40 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        {currentNotification && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">
                {currentNotification.name} vient d'acheter
              </p>
              <p className="text-gray-600 text-sm truncate">{currentNotification.document}</p>
              <p className="text-gray-400 text-xs mt-1">
                {currentNotification.location} · Il y a {currentNotification.timeAgo}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-2xl p-4 max-w-xs z-40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-blue-100">Documents générés aujourd'hui</p>
            <p className="text-3xl font-bold">{todayCount}</p>
          </div>
        </div>
      </div>
    </>
  );
}
