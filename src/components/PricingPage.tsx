import React, { useState } from 'react';
import { Check, Zap, Crown, Building2, ArrowRight } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: any;
  color: string;
  highlighted?: boolean;
  cta: string;
}

export function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans: PricingPlan[] = [
    {
      name: 'Gratuit',
      price: '0',
      period: 'Toujours gratuit',
      description: 'Pour découvrir iDoc et créer vos premiers documents',
      icon: Zap,
      color: 'blue',
      features: [
        '5 documents par mois',
        'Accès à 50+ templates',
        'Génération PDF',
        'Signature électronique basique',
        'Stockage 30 jours',
        'Support email',
      ],
      cta: 'Commencer gratuitement',
    },
    {
      name: 'Pro',
      price: billingPeriod === 'monthly' ? '19' : '190',
      period: billingPeriod === 'monthly' ? '/ mois' : '/ an (2 mois offerts)',
      description: 'Pour professionnels et freelances actifs',
      icon: Crown,
      color: 'purple',
      highlighted: true,
      features: [
        'Documents illimités',
        'Tous les templates (107+)',
        'Génération intelligente IA',
        'Signatures multiples',
        'Stockage illimité',
        'Templates personnalisés',
        'Export Word, Excel, PDF',
        'Bibliothèque de clauses',
        'Support prioritaire',
        'Pas de publicité',
      ],
      cta: 'Essayer 14 jours gratuits',
    },
    {
      name: 'Entreprise',
      price: 'Sur mesure',
      period: 'Contactez-nous',
      description: 'Pour équipes et grandes organisations',
      icon: Building2,
      color: 'green',
      features: [
        'Tout du plan Pro',
        'Utilisateurs illimités',
        'API complète',
        'White-label possible',
        'Templates sur mesure',
        'Formation équipe',
        'Gestionnaire de compte dédié',
        'SLA garantie 99.9%',
        'Intégrations custom',
        'Support 24/7',
      ],
      cta: 'Contactez-nous',
    },
  ];

  const PlanCard = ({ plan }: { plan: PricingPlan }) => {
    const Icon = plan.icon;
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      green: 'bg-green-50 text-green-600 border-green-200',
    };

    return (
      <div
        className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
          plan.highlighted
            ? 'border-purple-500 scale-105 z-10'
            : 'border-gray-200'
        }`}
      >
        {plan.highlighted && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
              Le plus populaire
            </span>
          </div>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg ${
                colorClasses[plan.color as keyof typeof colorClasses]
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline">
              {plan.price !== 'Sur mesure' && (
                <span className="text-5xl font-bold text-gray-900">
                  {plan.price}€
                </span>
              )}
              {plan.price === 'Sur mesure' && (
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">{plan.period}</p>
            <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
          </div>

          {/* CTA Button */}
          <button
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all group flex items-center justify-center ${
              plan.highlighted
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {plan.cta}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Features */}
          <div className="mt-8 space-y-4">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Tarifs transparents pour tous
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Tous les plans
            incluent l'accès à notre plateforme sécurisée et nos templates
            professionnels.
          </p>

          {/* Billing Period Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600'
              }`}
            >
              Annuel
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">
            Questions fréquentes
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-gray-600">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout
                moment. Les changements prennent effet immédiatement et votre
                facturation sera ajustée au prorata.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Y a-t-il un engagement minimum ?
              </h3>
              <p className="text-gray-600">
                Aucun engagement. Vous pouvez annuler votre abonnement à tout
                moment. Si vous avez payé annuellement, le remboursement est
                calculé au prorata des mois non utilisés.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quels sont les moyens de paiement acceptés ?
              </h3>
              <p className="text-gray-600">
                Nous acceptons toutes les cartes bancaires (Visa, Mastercard,
                American Express) ainsi que les virements bancaires pour les
                plans Entreprise.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mes données sont-elles sécurisées ?
              </h3>
              <p className="text-gray-600">
                Absolument. Toutes vos données sont chiffrées en transit et au
                repos. Nous sommes conformes RGPD et hébergés sur des
                infrastructures certifiées ISO 27001.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à simplifier vos documents ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers de professionnels qui font confiance à iDoc
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
            Commencer gratuitement
          </button>
        </div>
      </div>
    </div>
  );
}
