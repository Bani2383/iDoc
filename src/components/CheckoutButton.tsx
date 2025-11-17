import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Vous devez être connecté pour effectuer un achat');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      let endpoint: string;
      let body: Record<string, unknown>;

      if (mode === 'model') {
        if (!templateId) {
          throw new Error('templateId est requis pour l\'achat de modèle');
        }
        endpoint = `${supabaseUrl}/functions/v1/checkout-model`;
        body = {
          templateId,
          customerEmail,
          successUrl: successUrl || `${window.location.origin}/success`,
          cancelUrl: cancelUrl || window.location.href,
        };
      } else {
        endpoint = `${supabaseUrl}/functions/v1/checkout-subscription`;
        body = {
          customerEmail,
          planId: planId || 'pro',
          successUrl: successUrl || `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: cancelUrl || `${window.location.origin}/pricing`,
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': anonKey,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session de paiement');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (err) {
      console.error('Checkout error:', err);
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
