import React, { useState, useEffect } from 'react';
import { FlaskConical, TrendingUp, Users, Target, CheckCircle, XCircle, Play, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
  winner?: string;
}

interface Variant {
  id: string;
  name: string;
  description: string;
  traffic: number;
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

export default function ABTestingSystem() {
  const [tests, setTests] = useState<ABTest[]>([
    {
      id: 'test-1',
      name: 'Page Accueil - Titre Principal',
      description: 'Test de différentes variations du titre principal',
      status: 'running',
      variants: [
        {
          id: 'a',
          name: 'Contrôle (Original)',
          description: 'Créez Vos Documents en 2 Minutes',
          traffic: 50,
          visitors: 1247,
          conversions: 87,
          conversionRate: 6.98,
          revenue: 2610
        },
        {
          id: 'b',
          name: 'Variante B',
          description: 'Documents Professionnels Instantanés',
          traffic: 50,
          visitors: 1203,
          conversions: 112,
          conversionRate: 9.31,
          revenue: 3360
        }
      ]
    },
    {
      id: 'test-2',
      name: 'CTA Principal - Couleur',
      description: 'Test de couleurs différentes pour le bouton principal',
      status: 'running',
      variants: [
        {
          id: 'a',
          name: 'Bleu (Original)',
          description: 'Bouton bleu gradient',
          traffic: 33,
          visitors: 823,
          conversions: 45,
          conversionRate: 5.47,
          revenue: 1350
        },
        {
          id: 'b',
          name: 'Vert',
          description: 'Bouton vert gradient',
          traffic: 33,
          visitors: 831,
          conversions: 52,
          conversionRate: 6.26,
          revenue: 1560
        },
        {
          id: 'c',
          name: 'Orange',
          description: 'Bouton orange gradient',
          traffic: 34,
          visitors: 846,
          conversions: 61,
          conversionRate: 7.21,
          revenue: 1830
        }
      ]
    },
    {
      id: 'test-3',
      name: 'Pricing Page - Structure',
      description: 'Test de différentes présentations des prix',
      status: 'draft',
      variants: [
        {
          id: 'a',
          name: '3 Colonnes',
          description: 'Présentation classique 3 colonnes',
          traffic: 50,
          visitors: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0
        },
        {
          id: 'b',
          name: 'Table Comparative',
          description: 'Tableau comparatif détaillé',
          traffic: 50,
          visitors: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0
        }
      ]
    }
  ]);

  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);

  const toggleTestStatus = (testId: string) => {
    setTests(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          status: test.status === 'running' ? 'paused' : 'running'
        };
      }
      return test;
    }));
  };

  const declareWinner = (testId: string, variantId: string) => {
    setTests(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          status: 'completed',
          winner: variantId,
          endDate: new Date()
        };
      }
      return test;
    }));
  };

  const getWinningVariant = (test: ABTest) => {
    return test.variants.reduce((prev, current) =>
      current.conversionRate > prev.conversionRate ? current : prev
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <FlaskConical className="text-purple-400" />
            Système A/B Testing
          </h1>
          <p className="text-xl text-purple-200">
            Optimisez vos conversions avec des tests scientifiques
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Play className="text-green-400" />}
            label="Tests Actifs"
            value={tests.filter(t => t.status === 'running').length}
            color="text-green-400"
          />
          <StatCard
            icon={<Users className="text-blue-400" />}
            label="Total Visiteurs"
            value="3,950"
            color="text-blue-400"
          />
          <StatCard
            icon={<TrendingUp className="text-yellow-400" />}
            label="Amélioration Moyenne"
            value="+34%"
            color="text-yellow-400"
          />
        </div>

        <div className="space-y-6">
          {tests.map((test) => {
            const winner = getWinningVariant(test);
            const hasSignificantWinner = test.variants.some(v =>
              v.conversionRate > 0 && Math.abs(v.conversionRate - winner.conversionRate) > 2
            );

            return (
              <div
                key={test.id}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-3xl font-black text-white">{test.name}</h2>
                      <StatusBadge status={test.status} />
                    </div>
                    <p className="text-purple-200">{test.description}</p>
                  </div>
                  <button
                    onClick={() => toggleTestStatus(test.id)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                      test.status === 'running'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    disabled={test.status === 'completed'}
                  >
                    {test.status === 'running' ? (
                      <>
                        <Pause size={20} />
                        Pause
                      </>
                    ) : test.status === 'completed' ? (
                      'Terminé'
                    ) : (
                      <>
                        <Play size={20} />
                        Démarrer
                      </>
                    )}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {test.variants.map((variant) => {
                    const isWinner = variant.id === test.winner ||
                                   (test.status === 'running' && variant.id === winner.id);
                    const confidence = variant.visitors > 100 ?
                      Math.min(95, (variant.visitors / 1000) * 95) : 0;

                    return (
                      <div
                        key={variant.id}
                        className={`bg-white/5 rounded-2xl p-6 border transition-all ${
                          isWinner
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {variant.name}
                            </h3>
                            <p className="text-gray-400 text-sm">{variant.description}</p>
                          </div>
                          {isWinner && test.status === 'completed' && (
                            <CheckCircle className="text-green-400" size={24} />
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Trafic</span>
                            <span className="text-white font-bold">{variant.traffic}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Visiteurs</span>
                            <span className="text-white font-bold">{variant.visitors.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Conversions</span>
                            <span className="text-white font-bold">{variant.conversions}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Taux de Conv.</span>
                            <span className={`font-black text-xl ${
                              variant.conversionRate === winner.conversionRate
                                ? 'text-green-400'
                                : 'text-white'
                            }`}>
                              {variant.conversionRate.toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Revenus</span>
                            <span className="text-yellow-400 font-bold">{variant.revenue}€</span>
                          </div>

                          {confidence > 0 && (
                            <div className="pt-3 border-t border-white/10">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 text-sm">Confiance</span>
                                <span className={`font-bold ${
                                  confidence >= 95 ? 'text-green-400' :
                                  confidence >= 80 ? 'text-yellow-400' : 'text-gray-400'
                                }`}>
                                  {confidence.toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    confidence >= 95 ? 'bg-green-500' :
                                    confidence >= 80 ? 'bg-yellow-500' : 'bg-gray-500'
                                  }`}
                                  style={{ width: `${confidence}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {test.status === 'running' && variant.id === winner.id && hasSignificantWinner && confidence >= 95 && (
                          <button
                            onClick={() => declareWinner(test.id, variant.id)}
                            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-all"
                          >
                            Déclarer Gagnant
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {test.status === 'running' && hasSignificantWinner && (
                  <div className="mt-6 bg-green-500/20 border border-green-500/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="text-green-400" size={24} />
                      <h3 className="text-xl font-bold text-white">
                        Variante Gagnante Détectée !
                      </h3>
                    </div>
                    <p className="text-green-200">
                      La variante <strong>{winner.name}</strong> performe {
                        ((winner.conversionRate / test.variants[0].conversionRate - 1) * 100).toFixed(1)
                      }% mieux que la version originale.
                      Confiance statistique suffisante pour déclarer un gagnant.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
          <h2 className="text-3xl font-black text-white mb-6 text-center">
            Guide A/B Testing
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-white">
            <div>
              <h3 className="font-bold text-xl mb-3">1. Créer un Test</h3>
              <ul className="space-y-2 text-gray-200">
                <li>• Définir l'élément à tester</li>
                <li>• Créer 2-3 variantes</li>
                <li>• Répartir le trafic équitablement</li>
                <li>• Lancer le test</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-3">2. Collecter les Données</h3>
              <ul className="space-y-2 text-gray-200">
                <li>• Attendre minimum 1000 visiteurs</li>
                <li>• Surveiller les conversions</li>
                <li>• Vérifier la confiance statistique</li>
                <li>• Minimum 7 jours de test</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-3">3. Déclarer un Gagnant</h3>
              <ul className="space-y-2 text-gray-200">
                <li>• Confiance &gt; 95% requise</li>
                <li>• Amélioration &gt; 10% recommandée</li>
                <li>• Implémenter la variante gagnante</li>
                <li>• Créer un nouveau test</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-gray-300 text-sm mb-2">{label}</div>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    draft: 'bg-gray-500/20 text-gray-300',
    running: 'bg-green-500/20 text-green-300',
    paused: 'bg-yellow-500/20 text-yellow-300',
    completed: 'bg-blue-500/20 text-blue-300'
  };

  const labels = {
    draft: 'BROUILLON',
    running: 'EN COURS',
    paused: 'PAUSÉ',
    completed: 'TERMINÉ'
  };

  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold ${colors[status as keyof typeof colors]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}
