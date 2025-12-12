import React, { useState, useEffect } from 'react';
import { X, Gift, Clock, Zap } from 'lucide-react';

interface ExitIntentPopupProps {
  onClose: () => void;
  onAccept: () => void;
}

export default function ExitIntentPopup({ onClose, onAccept }: ExitIntentPopupProps) {
  const [timeLeft, setTimeLeft] = useState(600);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible) {
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const handleAccept = () => {
    setIsVisible(false);
    onAccept();
  };

  if (!isVisible) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Gift className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Attends! 🎁
          </h2>

          <p className="text-xl text-gray-700 mb-2">
            Profite de <span className="text-amber-600 font-bold">-50%</span> sur ton premier document
          </p>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-900">
                Cette offre expire dans:
              </span>
            </div>
            <div className="text-4xl font-bold text-amber-600 tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Document PDF premium</span>
              <span className="text-gray-400 line-through">1.99€</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-gray-900">Avec le code RESTE50</span>
              <span className="text-green-600">0.99€</span>
            </div>
          </div>

          <button
            onClick={handleAccept}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 mb-4"
          >
            <Zap className="w-5 h-5" />
            J'en profite maintenant!
          </button>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-sm underline"
          >
            Non merci, je préfère payer plein tarif
          </button>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>✅ Sans engagement</span>
            <span>✅ Paiement sécurisé</span>
            <span>✅ Remboursement 24h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
