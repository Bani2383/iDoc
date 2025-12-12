import React, { useState, useEffect } from 'react';
import { Trophy, Star, Gift, Zap, TrendingUp, Award, Target, Crown } from 'lucide-react';

interface CreditsGamificationProps {
  currentCredits: number;
  totalTransactions: number;
  onClaimReward: (credits: number) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  threshold: number;
  reward: number;
  unlocked: boolean;
}

interface DailyStreak {
  current: number;
  maxStreak: number;
  lastLogin: Date;
}

const LOYALTY_TIERS = [
  { name: 'Bronze', threshold: 0, color: 'from-orange-400 to-orange-600', bonus: 0 },
  { name: 'Silver', threshold: 20, color: 'from-gray-400 to-gray-600', bonus: 10 },
  { name: 'Gold', threshold: 50, color: 'from-yellow-400 to-yellow-600', bonus: 20 },
  { name: 'Platinum', threshold: 100, color: 'from-blue-400 to-blue-600', bonus: 30 }
];

export default function CreditsGamification({
  currentCredits,
  totalTransactions,
  onClaimReward
}: CreditsGamificationProps) {
  const [dailyStreak, setDailyStreak] = useState<DailyStreak>({
    current: 3,
    maxStreak: 7,
    lastLogin: new Date()
  });

  const [availableRewards, setAvailableRewards] = useState<number[]>([1, 2]);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const achievements: Achievement[] = [
    {
      id: 'first_doc',
      title: 'Premier pas',
      description: '1er document généré',
      icon: <Star className="w-6 h-6" />,
      threshold: 1,
      reward: 1,
      unlocked: totalTransactions >= 1
    },
    {
      id: 'productive',
      title: 'Productif',
      description: '5 documents générés',
      icon: <Zap className="w-6 h-6" />,
      threshold: 5,
      reward: 2,
      unlocked: totalTransactions >= 5
    },
    {
      id: 'professional',
      title: 'Professionnel',
      description: '20 documents générés',
      icon: <Trophy className="w-6 h-6" />,
      threshold: 20,
      reward: 5,
      unlocked: totalTransactions >= 20
    },
    {
      id: 'expert',
      title: 'Expert',
      description: '50 documents générés',
      icon: <Award className="w-6 h-6" />,
      threshold: 50,
      reward: 10,
      unlocked: totalTransactions >= 50
    },
    {
      id: 'legend',
      title: 'Légende',
      description: '100 documents générés',
      icon: <Crown className="w-6 h-6" />,
      threshold: 100,
      reward: 20,
      unlocked: totalTransactions >= 100
    }
  ];

  const currentTier = LOYALTY_TIERS.reduce((tier, current) =>
    totalTransactions >= current.threshold ? current : tier
  , LOYALTY_TIERS[0]);

  const nextTier = LOYALTY_TIERS.find(tier => tier.threshold > totalTransactions);

  const progressToNextTier = nextTier
    ? ((totalTransactions - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100
    : 100;

  const handleClaimDaily = () => {
    const creditsToday = Math.min(dailyStreak.current, 5);
    onClaimReward(creditsToday);
    setShowRewardModal(true);
    setTimeout(() => setShowRewardModal(false), 3000);
  };

  return (
    <div className="space-y-6">
      {showRewardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Récompense réclamée!</h3>
            <p className="text-gray-600">
              Tu as reçu <span className="font-bold text-green-600">{dailyStreak.current} crédits</span>
            </p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Tes Crédits</h3>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <span className="text-3xl font-bold text-blue-600">{currentCredits}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Utilise tes crédits pour générer des documents sans limite
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            Série Quotidienne
          </h3>
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-orange-600">{dailyStreak.current} jours</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div
                key={day}
                className={`flex-1 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-semibold ${
                  day <= dailyStreak.current
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <div className="text-lg">{day === 7 ? '🎁' : '🔥'}</div>
                <div>+{day}cr</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleClaimDaily}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            Réclamer {dailyStreak.current} crédits aujourd'hui
          </button>

          <p className="text-xs text-center text-gray-500">
            Connecte-toi chaque jour pour augmenter ta série et gagner plus de crédits!
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Niveau de Fidélité
          </h3>
          <div className={`px-4 py-1 rounded-full bg-gradient-to-r ${currentTier.color} text-white font-bold`}>
            {currentTier.name}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progression</span>
              {nextTier ? (
                <span className="font-semibold text-gray-900">
                  {totalTransactions} / {nextTier.threshold} documents
                </span>
              ) : (
                <span className="font-semibold text-purple-600">Niveau MAX atteint!</span>
              )}
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${nextTier?.color || currentTier.color} transition-all duration-500`}
                style={{ width: `${progressToNextTier}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {LOYALTY_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`text-center p-3 rounded-xl border-2 transition-all ${
                  totalTransactions >= tier.threshold
                    ? `border-transparent bg-gradient-to-br ${tier.color} text-white`
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}
              >
                <div className="text-xs font-bold mb-1">{tier.name}</div>
                <div className="text-xs">+{tier.bonus}%</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">Avantage actuel</span>
            </div>
            <p className="text-sm text-purple-800">
              Bonus de <span className="font-bold">+{currentTier.bonus}%</span> sur tous tes achats de crédits
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Achievements
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.unlocked
                  ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                    {achievement.unlocked && (
                      <div className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        Débloqué
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-blue-600 font-bold">
                    <Zap className="w-4 h-4" />
                    <span>+{achievement.reward}</span>
                  </div>
                  <div className="text-xs text-gray-500">{totalTransactions}/{achievement.threshold}</div>
                </div>
              </div>

              {!achievement.unlocked && (
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                      style={{ width: `${Math.min((totalTransactions / achievement.threshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Parrainage</h3>
            <p className="text-sm text-gray-600">Gagne des crédits en invitant tes amis</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm text-gray-700">Tu invites un ami</span>
            <span className="font-bold text-green-600">+3 crédits</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm text-gray-700">Ton ami s'inscrit</span>
            <span className="font-bold text-green-600">+3 crédits pour lui</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-sm text-gray-700">Ton ami achète</span>
            <span className="font-bold text-green-600">+5 crédits bonus</span>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105">
          Inviter des amis
        </button>
      </div>
    </div>
  );
}
