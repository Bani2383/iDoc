import React, { useState, useEffect } from 'react';
import { Flame, Clock } from 'lucide-react';

interface Activity {
  id: string;
  userName: string;
  location: string;
  documentName: string;
  timestamp: string;
  timeAgo: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', userName: 'Sophie', location: 'Paris, FR', documentName: 'Contrat de Location', timestamp: new Date().toISOString(), timeAgo: '14s' },
  { id: '2', userName: 'Alexandre', location: 'Montréal, CA', documentName: 'Lettre de Résiliation', timestamp: new Date().toISOString(), timeAgo: '28s' },
  { id: '3', userName: 'Marie', location: 'Lyon, FR', documentName: 'Bail Commercial', timestamp: new Date().toISOString(), timeAgo: '45s' },
  { id: '4', userName: 'Thomas', location: 'Québec, CA', documentName: 'Contrat de Travail', timestamp: new Date().toISOString(), timeAgo: '1m' },
  { id: '5', userName: 'Julie', location: 'Bruxelles, BE', documentName: 'Procuration', timestamp: new Date().toISOString(), timeAgo: '2m' },
];

const FomoWidget: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MOCK_ACTIVITIES.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentActivity = MOCK_ACTIVITIES[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      <div
        className={`bg-white rounded-xl shadow-2xl p-4 border-l-4 border-orange-500 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              <span className="text-orange-600">{currentActivity.userName}</span>{' '}
              <span className="text-gray-500 font-normal">({currentActivity.location})</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              a généré <span className="font-medium text-blue-600">"{currentActivity.documentName}"</span>
            </p>
            <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                il y a {currentActivity.timeAgo}
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-3 text-white text-center">
        <p className="text-sm font-bold">
          <Flame className="w-4 h-4 inline mr-1" />
          156 documents générés cette semaine
        </p>
      </div>
    </div>
  );
};

export default FomoWidget;
