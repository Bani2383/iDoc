import { useState, useEffect } from 'react';
import { X, CreditCard, Check, AlertCircle, Loader, Zap, Gift } from 'lucide-react';

interface ExpressPaymentModalProps {
  documentName: string;
  price: number;
  onClose: () => void;
  onSuccess: (documentId: string) => void;
}

const CREDIT_PACKAGES = [
  { credits: 1, price: 0.49, popular: false, bonus: 0 },
  { credits: 5, price: 1.99, popular: false, bonus: 0, savings: 20 },
  { credits: 10, price: 2.99, popular: true, bonus: 1, savings: 40 },
  { credits: 25, price: 5.99, popular: false, bonus: 3, savings: 50 },
  { credits: 50, price: 8.99, popular: false, bonus: 10, savings: 60 }
];

export function ExpressPaymentModal({
  documentName,
  price,
  onClose,
  onSuccess,
}: ExpressPaymentModalProps) {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[0]);
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'google' | 'card' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [recentPurchases, setRecentPurchases] = useState(234);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecentPurchases(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = async (method: 'apple' | 'google' | 'card') => {
    setPaymentMethod(method);
    setProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessing(false);
    setShowSuccess(true);

    setTimeout(() => {
      onSuccess('mock-document-id-' + Date.now());
    }, 1500);
  };

  const formatPrice = (amount: number) => {
    return amount.toFixed(2) + '€';
  };

  const totalCredits = selectedPackage.credits + selectedPackage.bonus;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Paiement réussi!</h3>
          <p className="text-gray-600 mb-2">
            Tu as reçu <strong>{totalCredits} crédits</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Ton document <strong>{documentName}</strong> est prêt
          </p>
          <div className="animate-pulse">
            <Loader className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="text-sm text-gray-500 mt-2">Téléchargement en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
            disabled={processing}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Document prêt!</h3>
              <p className="text-blue-100 text-sm">{documentName}</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg px-3 py-2 text-sm inline-flex items-center gap-2 mt-2">
            <Check className="w-4 h-4" />
            <span>{recentPurchases} téléchargements aujourd'hui</span>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-amber-900">Inscris-toi et reçois 3 crédits gratuits!</span>
            </div>
            <p className="text-sm text-amber-700">
              Essaie gratuitement, paye seulement si tu es satisfait
            </p>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Choisis ton pack:</h4>
            <div className="space-y-2">
              {CREDIT_PACKAGES.map((pkg) => (
                <button
                  key={pkg.credits}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all relative ${
                    selectedPackage.credits === pkg.credits
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-0.5 rounded-full text-xs font-bold">
                      ⭐ POPULAIRE
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPackage.credits === pkg.credits
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPackage.credits === pkg.credits && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {pkg.credits} {pkg.credits === 1 ? 'crédit' : 'crédits'}
                          {pkg.bonus > 0 && (
                            <span className="ml-2 text-green-600 text-sm">+{pkg.bonus} bonus</span>
                          )}
                        </div>
                        {pkg.savings && (
                          <div className="text-xs text-green-600 font-semibold">
                            -{pkg.savings}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{formatPrice(pkg.price)}</div>
                      {pkg.credits + pkg.bonus > 1 && (
                        <div className="text-xs text-gray-500">
                          {(pkg.price / (pkg.credits + pkg.bonus)).toFixed(2)}€/crédit
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900">Paiement express (10 sec):</h4>

            <button
              onClick={() => handlePayment('apple')}
              disabled={processing}
              className="w-full bg-black text-white rounded-xl py-3.5 font-semibold hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing && paymentMethod === 'apple' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <span>Pay</span>
                  <span>•</span>
                  <span>{formatPrice(selectedPackage.price)}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handlePayment('google')}
              disabled={processing}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 rounded-xl py-3.5 font-semibold hover:border-gray-400 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing && paymentMethod === 'google' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <span className="font-bold text-lg">G</span>
                  <span>Pay</span>
                  <span>•</span>
                  <span>{formatPrice(selectedPackage.price)}</span>
                </>
              )}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">ou carte bancaire</span>
              </div>
            </div>

            <button
              onClick={() => handlePayment('card')}
              disabled={processing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3.5 font-bold transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {processing && paymentMethod === 'card' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Acheter {totalCredits} crédits - {formatPrice(selectedPackage.price)}</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center space-y-2 mb-4">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 text-green-600" />
                Paiement sécurisé
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 text-green-600" />
                Téléchargement instant
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Crédits valables 6 mois • Remboursement sous 24h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
