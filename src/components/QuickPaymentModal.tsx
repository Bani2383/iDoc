import React, { useState, useEffect } from 'react';
import { X, CreditCard, Check, Clock, Users, Zap } from 'lucide-react';

interface QuickPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentType: string;
  onPaymentSuccess: () => void;
}

const PRICING = {
  single: 1.99,
  pack5: 9.99,
  proMonthly: 19.99
};

export default function QuickPaymentModal({
  isOpen,
  onClose,
  documentTitle,
  documentType,
  onPaymentSuccess
}: QuickPaymentModalProps) {
  const [selectedOption, setSelectedOption] = useState<'single' | 'pack5' | 'pro'>('single');
  const [timeLeft, setTimeLeft] = useState(900);
  const [recentPurchases, setRecentPurchases] = useState(47);
  const [limitedSlots, setLimitedSlots] = useState(3);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    const purchaseTimer = setInterval(() => {
      setRecentPurchases(prev => prev + Math.floor(Math.random() * 3));
    }, 45000);

    return () => {
      clearInterval(timer);
      clearInterval(purchaseTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handlePayment = async () => {
    onPaymentSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Ton document est prêt!</h2>
              <p className="text-blue-100 text-sm">{documentTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4" />
              <span>{recentPurchases} téléchargements aujourd'hui</span>
            </div>
            <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-full animate-pulse">
              <Clock className="w-4 h-4" />
              <span>Plus que {limitedSlots} à ce prix</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-amber-900">Offre spéciale expire dans:</span>
              <span className="text-2xl font-bold text-amber-600 tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
            <p className="text-sm text-amber-700">
              Prix réduit de lancement - Profite maintenant avant augmentation!
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <button
              onClick={() => setSelectedOption('single')}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                selectedOption === 'single'
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === 'single' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedOption === 'single' && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <h3 className="font-bold text-lg">Ce document uniquement</h3>
                  </div>
                  <ul className="ml-9 space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      PDF haute qualité sans watermark
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Signature électronique incluse
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Téléchargement immédiat
                    </li>
                  </ul>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-400 line-through">2.99€</div>
                  <div className="text-3xl font-bold text-blue-600">1.99€</div>
                  <div className="text-xs text-green-600 font-semibold">-33%</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedOption('pack5')}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all relative ${
                selectedOption === 'pack5'
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-gray-200 hover:border-green-200'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                ⭐ POPULAIRE - Économise 50%
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === 'pack5' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {selectedOption === 'pack5' && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <h3 className="font-bold text-lg">Pack 5 documents</h3>
                  </div>
                  <ul className="ml-9 space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      5 crédits documents au choix
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Valable 6 mois
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Support prioritaire
                    </li>
                  </ul>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-400 line-through">19.95€</div>
                  <div className="text-3xl font-bold text-green-600">9.99€</div>
                  <div className="text-xs text-green-600 font-semibold">-50%</div>
                  <div className="text-xs text-gray-500 mt-1">2€/document</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedOption('pro')}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                selectedOption === 'pro'
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === 'pro' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                    }`}>
                      {selectedOption === 'pro' && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <h3 className="font-bold text-lg">Abonnement Pro</h3>
                  </div>
                  <ul className="ml-9 space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Documents illimités
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Signatures électroniques illimitées
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Templates exclusifs
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Support prioritaire 24/7
                    </li>
                  </ul>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-400 line-through">29.99€</div>
                  <div className="text-3xl font-bold text-purple-600">19.99€</div>
                  <div className="text-xs text-purple-600 font-semibold">/mois</div>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3"
          >
            <CreditCard className="w-5 h-5" />
            Télécharger maintenant - {PRICING[selectedOption]}€
          </button>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Paiement sécurisé
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Remboursement 24h
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm underline"
          >
            Télécharger avec watermark (gratuit)
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-b-2xl border-t">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">
                VISA
              </div>
              <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">
                MC
              </div>
            </div>
            <span>Paiement géré par Stripe</span>
            <span className="text-green-600 font-semibold">SSL Sécurisé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
