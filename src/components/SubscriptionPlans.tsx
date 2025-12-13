import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check, Crown, Zap, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../lib/logger';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly_cents: number;
  price_yearly_cents: number;
  features: string[];
  is_popular: boolean;
  unlimited_generations: boolean;
  priority_support: boolean;
  exclusive_templates: boolean;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSub, setUserSub] = useState<UserSubscription | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
    if (user) {
      loadUserSubscription();
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      const { data } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (data) setPlans(data);
    } catch (error) {
      logger.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSubscription = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (data) setUserSub(data);
    } catch (error) {
      logger.error('Error loading subscription:', error);
    }
  };

  const subscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      alert('Connectez-vous pour souscrire');
      return;
    }

    setSubscribing(plan.id);
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          status: 'active',
          billing_cycle: billingCycle,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;

      alert('Abonnement souscrit avec succès !');
      await loadUserSubscription();
    } catch (error) {
      logger.error('Error subscribing:', error);
      alert('Erreur lors de la souscription');
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Plans d'Abonnement</h1>
        <p className="text-xl text-gray-600 mb-8">
          Générez autant de documents que vous voulez avec nos plans premium
        </p>

        <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white shadow-md font-semibold'
                : 'text-gray-600'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full transition-all ${
              billingCycle === 'yearly'
                ? 'bg-white shadow-md font-semibold'
                : 'text-gray-600'
            }`}
          >
            Annuel
            <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      {userSub && (
        <div className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <div className="font-bold text-lg">Abonnement actif</div>
                <div className="text-sm text-gray-600">
                  Renouvellement le {new Date(userSub.current_period_end).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">
              Gérer mon abonnement
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly'
            ? plan.price_monthly_cents
            : plan.price_yearly_cents;
          const priceEur = (price / 100).toFixed(2);
          const monthlyPrice = billingCycle === 'yearly'
            ? (price / 12 / 100).toFixed(2)
            : priceEur;

          const Icon = plan.name.toLowerCase().includes('enterprise')
            ? Building2
            : plan.name.toLowerCase().includes('business')
            ? Crown
            : Zap;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                plan.is_popular
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-blue-500 shadow-2xl scale-105'
                  : 'bg-white border-2 border-gray-200 shadow-lg'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    LE PLUS POPULAIRE
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <Icon className={`w-12 h-12 mx-auto mb-4 ${
                  plan.is_popular ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                <div className="mb-2">
                  <span className="text-5xl font-bold">{monthlyPrice}€</span>
                  <span className="text-gray-600">/mois</span>
                </div>

                {billingCycle === 'yearly' && (
                  <div className="text-sm text-gray-600">
                    Facturé {priceEur}€ annuellement
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => subscribe(plan)}
                disabled={subscribing === plan.id || (userSub?.plan_id === plan.id)}
                className={`w-full py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.is_popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {subscribing === plan.id ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Souscription...
                  </span>
                ) : userSub?.plan_id === plan.id ? (
                  'Abonnement actif'
                ) : (
                  'Souscrire maintenant'
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-gray-50 rounded-xl">
          <Zap className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold mb-2">Génération illimitée</h3>
          <p className="text-sm text-gray-600">Créez autant de documents que nécessaire</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-xl">
          <Crown className="w-10 h-10 text-purple-600 mx-auto mb-3" />
          <h3 className="font-bold mb-2">Templates exclusifs</h3>
          <p className="text-sm text-gray-600">Accès à tous les templates premium</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-xl">
          <svg className="w-10 h-10 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="font-bold mb-2">Support prioritaire</h3>
          <p className="text-sm text-gray-600">Réponse garantie sous 2h</p>
        </div>
      </div>

      <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Garantie satisfait ou remboursé 30 jours</h3>
        <p className="text-gray-700">
          Essayez sans risque. Si vous n'êtes pas satisfait, nous vous remboursons intégralement.
        </p>
      </div>
    </div>
  );
}
