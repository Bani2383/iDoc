import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { callCheckout, validateApiInput } from '../lib/apiService';
import { logger } from '../lib/logger';

interface CheckoutButtonProps {
  mode: 'model' | 'subscription';
  templateId?: string;
  planId?: string;
  customerEmail: string;
  label?: string;
  className?: string;
  successUrl?: string;
  cancelUrl?: string;
  disabled?: boolean;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  mode,
  templateId,
  planId,
  customerEmail,
  label,
  className,
  successUrl,
  cancelUrl,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      let body: Record<string, unknown>;
      let checkoutType: 'model' | 'subscription';

      if (mode === 'model') {
        if (!templateId) {
          throw new Error('templateId est requis pour l\'achat de modèle');
        }
        checkoutType = 'model';
        body = {
          templateId,
          customerEmail,
          successUrl: successUrl || `${window.location.origin}/success`,
          cancelUrl: cancelUrl || window.location.href,
        };

        // Validate required fields
        const validation = validateApiInput(body, ['templateId', 'customerEmail']);
        if (!validation.valid) {
          throw new Error(validation.error || 'Données invalides');
        }
      } else {
        checkoutType = 'subscription';
        body = {
          customerEmail,
          planId: planId || 'pro',
          successUrl: successUrl || `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: cancelUrl || `${window.location.origin}/pricing`,
        };

        // Validate required fields
        const validation = validateApiInput(body, ['customerEmail']);
        if (!validation.valid) {
          throw new Error(validation.error || 'Données invalides');
        }
      }

      const { data, error: apiError } = await callCheckout(checkoutType, body);

      if (apiError || !data) {
        throw new Error(apiError?.message || 'Erreur lors de la création de la session de paiement');
      }

      if ((data as { url?: string }).url) {
        window.location.href = (data as { url: string }).url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (err) {
      logger.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const defaultLabel = mode === 'model' ? 'Acheter maintenant' : 'S\'abonner';

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={disabled || loading}
        className={
          className ||
          `flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
            loading ? 'opacity-75' : ''
          }`
        }
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Redirection...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>{label || defaultLabel}</span>
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
