import { useState } from 'react';
import { X, CreditCard, Check, AlertCircle, Loader } from 'lucide-react';

interface ExpressPaymentModalProps {
  documentName: string;
  price: number;
  onClose: () => void;
  onSuccess: (documentId: string) => void;
}

export function ExpressPaymentModal({
  documentName,
  price,
  onClose,
  onSuccess,
}: ExpressPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'google' | 'card' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState('');

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

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2) + '$';
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center animate-scale-in">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Paiement réussi!</h3>
          <p className="text-gray-600 mb-6">
            Votre document <strong>{documentName}</strong> est prêt
          </p>
          <div className="animate-pulse">
            <Loader className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="text-sm text-gray-500 mt-2">Préparation de votre document...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Paiement Express</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={processing}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">{documentName}</span>
              <span className="text-2xl font-bold text-blue-600">{formatPrice(price)}</span>
            </div>
            <div className="text-sm text-gray-600">
              <Check className="w-4 h-4 inline mr-1 text-green-600" />
              Document disponible immédiatement
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-900">Méthodes de paiement express</h4>

            <button
              onClick={() => handlePayment('apple')}
              disabled={processing}
              className="w-full bg-black text-white rounded-xl py-4 font-semibold hover:bg-gray-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing && paymentMethod === 'apple' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">􀣺</span>
                  <span>Apple Pay</span>
                </>
              )}
            </button>

            <button
              onClick={() => handlePayment('google')}
              disabled={processing}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 rounded-xl py-4 font-semibold hover:border-gray-400 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing && paymentMethod === 'google' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">G</span>
                  <span>Google Pay</span>
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (pour recevoir le reçu)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none transition"
                disabled={processing}
              />
            </div>

            <button
              onClick={() => handlePayment('card')}
              disabled={processing || !email}
              className="w-full bg-blue-600 text-white rounded-xl py-4 font-semibold hover:bg-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing && paymentMethod === 'card' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Payer par carte - {formatPrice(price)}</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900 mb-1">
                  Créez un compte après achat (optionnel)
                </p>
                <p>
                  Enregistrez votre document dans votre DocVault personnel et accédez-y à tout
                  moment
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Check className="w-4 h-4 text-green-600" />
            <span>Paiement 100% sécurisé par Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
