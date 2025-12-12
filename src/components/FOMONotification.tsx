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
  { id: '2', name: 'Thomas L.', document: '10 crédits', timeAgo: '3 min', location: 'Lyon' },
  { id: '3', name: 'Marie D.', document: 'Lettre de Motivation', timeAgo: '5 min', location: 'Marseille' },
  { id: '4', name: 'Lucas R.', document: 'Pack 25 crédits', timeAgo: '7 min', location: 'Toulouse' },
  { id: '5', name: 'Emma B.', document: 'Attestation', timeAgo: '9 min', location: 'Nice' },
  { id: '6', name: 'Alexandre P.', document: 'CV + Lettre', timeAgo: '11 min', location: 'Nantes' },
  { id: '7', name: 'Sophie T.', document: '5 crédits', timeAgo: '13 min', location: 'Bordeaux' },
  { id: '8', name: 'Julien M.', document: 'Contrat CDI', timeAgo: '15 min', location: 'Lille' },
  { id: '9', name: 'Camille V.', document: 'Pack 50 crédits', timeAgo: '17 min', location: 'Strasbourg' },
  { id: '10', name: 'Antoine B.', document: 'Attestation', timeAgo: '19 min', location: 'Rennes' },
  { id: '11', name: 'Léa F.', document: '10 crédits', timeAgo: '21 min', location: 'Montpellier' },
  { id: '12', name: 'Hugo D.', document: 'CV Professionnel', timeAgo: '23 min', location: 'Grenoble' },
  { id: '13', name: 'Chloé R.', document: 'Lettre Motivation', timeAgo: '25 min', location: 'Dijon' },
  { id: '14', name: 'Maxime P.', document: '25 crédits', timeAgo: '27 min', location: 'Angers' },
  { id: '15', name: 'Inès K.', document: 'Contrat Freelance', timeAgo: '29 min', location: 'Nîmes' },
  { id: '16', name: 'Nathan G.', document: 'Pack Immigration', timeAgo: '31 min', location: 'Tours' },
  { id: '17', name: 'Manon L.', document: '5 crédits', timeAgo: '33 min', location: 'Limoges' },
  { id: '18', name: 'Théo W.', document: 'CV + Lettre', timeAgo: '35 min', location: 'Clermont' },
  { id: '19', name: 'Jade S.', document: '10 crédits', timeAgo: '37 min', location: 'Le Havre' },
  { id: '20', name: 'Louis M.', document: 'Attestation', timeAgo: '39 min', location: 'Reims' }
];

export default function FOMONotification() {
  const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [todayCount, setTodayCount] = useState(147);

  useEffect(() => {
    const showNotification = () => {
      const randomNotif = SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)];

      const now = new Date();
      const minutesAgo = Math.floor(Math.random() * 40) + 1;
      randomNotif.timeAgo = minutesAgo < 5
        ? `${minutesAgo} min`
        : minutesAgo < 60
        ? `${minutesAgo} min`
        : '1h';

      setCurrentNotification(randomNotif);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    const interval = setInterval(showNotification, 15000);
    setTimeout(showNotification, 2000);

    const countInterval = setInterval(() => {
      setTodayCount(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 45000);

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
