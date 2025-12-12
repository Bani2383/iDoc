import { useState, useEffect } from 'react';
import { X, Gift, Clock, Zap } from 'lucide-react';

interface ExitIntentOfferProps {
  onClaim: (code: string) => void;
}

export default function ExitIntentOffer({ onClaim }: ExitIntentOfferProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        localStorage.setItem('exitIntentShown', 'true');
      }
    };

    const checkSession = () => {
      const shown = localStorage.getItem('exitIntentShown');
      const showTime = localStorage.getItem('exitIntentTime');

      if (shown && showTime) {
        const timePassed = Date.now() - parseInt(showTime);
        if (timePassed < 24 * 60 * 60 * 1000) {
          setHasShown(true);
          return;
        }
      }
    };

    checkSession();

    if (!hasShown) {
      setTimeout(() => {
        document.addEventListener('mouseleave', handleMouseLeave);
      }, 5000);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleClaim = () => {
    const code = 'EXIT40';
    onClaim(code);
    localStorage.setItem('exitIntentTime', Date.now().toString());
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('exitIntentTime', Date.now().toString());
  };

  if (!isVisible) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform animate-slideUp">
        <div className="relative bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-8 rounded-t-2xl text-white text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-4">
            <Gift className="w-16 h-16 mx-auto mb-3 animate-bounce" />
            <h2 className="text-4xl font-bold mb-2">ATTENDEZ !</h2>
            <p className="text-xl">Ne partez pas les mains vides...</p>
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <div className="flex items-center justify-center text-5xl font-bold mb-2">
              <span>40</span>
              <span className="text-6xl">%</span>
            </div>
            <div className="text-lg font-semibold">DE RÉDUCTION</div>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-3">Offre Exclusive : 40% de Réduction</h3>
            <p className="text-lg text-gray-600 mb-4">
              Profitez de cette remise exceptionnelle sur votre premier document
            </p>

            <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 mb-4 inline-block">
              <div className="flex items-center justify-center text-red-800 font-bold text-xl mb-2">
                <Clock className="w-5 h-5 mr-2" />
                Offre limitée : {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-3xl font-bold text-red-600 bg-white rounded px-4 py-2">
                EXIT40
              </div>
              <div className="text-sm text-gray-600 mt-2">Code promo</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-semibold">Génération instantanée</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm font-semibold">Conforme légalement</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="text-sm font-semibold">100% sécurisé</div>
            </div>
          </div>

          <button
            onClick={handleClaim}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xl py-4 rounded-lg hover:shadow-2xl transition-all mb-4 flex items-center justify-center"
          >
            <Gift className="w-6 h-6 mr-2" />
            Profiter de l'offre maintenant
          </button>

          <div className="text-center">
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Non merci, je préfère payer le prix fort
            </button>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-gray-700 text-center">
              <strong>Plus de 15,000 clients satisfaits</strong> ont déjà généré leurs documents avec nous.
              Ne manquez pas cette opportunité unique !
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
