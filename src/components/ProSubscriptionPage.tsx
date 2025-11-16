import React, { useState } from 'react';
import {
  CheckCircle,
  Zap,
  Shield,
  FolderOpen,
  FileCheck,
  Sparkles,
  Globe,
  Users,
  ArrowRight,
  X
} from 'lucide-react';

interface ProSubscriptionPageProps {
  onClose?: () => void;
  trigger?: 'volume' | 'feature' | 'profile';
}

export default function ProSubscriptionPage({ onClose, trigger }: ProSubscriptionPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    { icon: Zap, title: 'Documents illimités', description: 'Générez autant de documents que vous voulez' },
    { icon: FileCheck, title: 'Signatures électroniques', description: 'Workflow multi-parties avec SignFlow' },
    { icon: FolderOpen, title: 'DocVault illimité', description: 'Organisez tous vos documents dans des dossiers' },
    { icon: Sparkles, title: 'Pré-remplissage automatique', description: 'SmartFill complète vos formulaires' },
    { icon: Shield, title: 'Vérification d\'erreurs', description: 'CompliancE-Check avant finalisation' },
    { icon: Globe, title: 'Conformité juridique', description: 'RegulaSmart adapte vos documents' },
    { icon: Users, title: 'Support prioritaire', description: 'Assistance dédiée par email et chat' },
  ];

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'volume':
        return {
          title: 'Vous générez beaucoup de documents !',
          subtitle: 'Économisez avec iDoc Pro : documents illimités pour 9,99$/mois',
          highlight: 'À partir du 5e document, vous économisez avec Pro'
        };
      case 'feature':
        return {
          title: 'Cette fonctionnalité est réservée à iDoc Pro',
          subtitle: 'Débloquez toutes les fonctionnalités avancées',
          highlight: 'Essai gratuit de 7 jours, sans engagement'
        };
      case 'profile':
        return {
          title: 'iDoc Pro : Fait pour les professionnels',
          subtitle: 'Automatisez votre gestion documentaire',
          highlight: 'Signature électronique + Conformité légale + Support dédié'
        };
      default:
        return {
          title: 'Passez à iDoc Pro',
          subtitle: 'Tous les outils dont vous avez besoin',
          highlight: 'Essai gratuit de 7 jours'
        };
    }
  };

  const message = getTriggerMessage();
  const monthlyPrice = 9.99;
  const yearlyPrice = 99.99;
  const yearlyMonthlyEquivalent = (yearlyPrice / 12).toFixed(2);
  const yearlySavings = ((monthlyPrice * 12) - yearlyPrice).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="mb-4 p-2 rounded-lg hover:bg-white/50 transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        )}

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{message.highlight}</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {message.title}
          </h1>
          <p className="text-xl text-gray-600">
            {message.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md transition ${
                  billingPeriod === 'monthly'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md transition relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Annuel
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  -17%
                </span>
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {billingPeriod === 'monthly' ? (
                <>
                  {monthlyPrice.toFixed(2)}$ <span className="text-2xl text-gray-600">/mois</span>
                </>
              ) : (
                <>
                  {yearlyMonthlyEquivalent}$ <span className="text-2xl text-gray-600">/mois</span>
                </>
              )}
            </div>
            {billingPeriod === 'yearly' && (
              <div className="text-gray-600">
                Facturé {yearlyPrice}$/an • Économisez {yearlySavings}$
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg hover:bg-blue-50 transition"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => alert('Intégration Stripe à venir')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span>Essayer gratuitement 7 jours</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-600 mt-4">
              Aucune carte requise pour l'essai • Annulez à tout moment
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Comparaison des plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6">Fonctionnalité</th>
                  <th className="text-center py-4 px-6">
                    <div className="font-semibold text-gray-900">Standard</div>
                    <div className="text-sm text-gray-600">1,99$/document</div>
                  </th>
                  <th className="text-center py-4 px-6 bg-blue-50 rounded-t-lg">
                    <div className="font-semibold text-blue-600">Pro</div>
                    <div className="text-sm text-gray-600">9,99$/mois</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">Documents illimités</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6 bg-blue-50">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">DocVault</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6 bg-blue-50">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">SmartFill</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6 bg-blue-50">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">CompliancE-Check</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6 bg-blue-50">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">SignFlow (signatures multi-parties)</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6 bg-blue-50">
                    <div className="text-sm text-gray-600">10 workflows/mois</div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">ProofStamp (horodatage)</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6 bg-blue-50">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-6">DocHistory (versions)</td>
                  <td className="text-center py-4 px-6">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-6 bg-blue-50">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6">Support</td>
                  <td className="text-center py-4 px-6 text-sm text-gray-600">Documentation</td>
                  <td className="text-center py-4 px-6 bg-blue-50 text-sm text-gray-900 font-medium">
                    Prioritaire (Email + Chat)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p>Sans engagement • Annulez quand vous voulez</p>
        </div>
      </div>
    </div>
  );
}
