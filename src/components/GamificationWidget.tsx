import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Star, Award, TrendingUp, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserLevel {
  level: number;
  xp: number;
  next_level_xp: number;
  tier: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward_credits: number;
  rarity: string;
  earned?: boolean;
  earned_at?: string;
}

export default function GamificationWidget() {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showAllBadges, setShowAllBadges] = useState(false);

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = async () => {
    if (!user) return;

    try {
      const { data: levelData } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (levelData) setUserLevel(levelData);

      const { data: allBadges } = await supabase
        .from('badges')
        .select('*')
        .order('rarity', { ascending: false });

      const { data: userBadgesData } = await supabase
        .from('user_badges')
        .select('badge_id, earned_at')
        .eq('user_id', user.id);

      const earnedIds = new Set(userBadgesData?.map(b => b.badge_id) || []);
      setEarnedBadges(earnedIds);

      const badgesWithStatus = allBadges?.map(badge => ({
        ...badge,
        earned: earnedIds.has(badge.id),
        earned_at: userBadgesData?.find(b => b.badge_id === badge.id)?.earned_at
      })) || [];

      setBadges(badgesWithStatus);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-blue-300 to-blue-500';
      case 'diamond': return 'from-cyan-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !userLevel) {
    return null;
  }

  const xpProgress = (userLevel.xp / userLevel.next_level_xp) * 100;
  const displayedBadges = showAllBadges ? badges : badges.slice(0, 6);
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Progression
        </h3>
        <div className={`bg-gradient-to-r ${getTierColor(userLevel.tier)} text-white px-4 py-1 rounded-full font-bold`}>
          {userLevel.tier.toUpperCase()}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Niveau {userLevel.level}</span>
          <span className="text-sm text-gray-600">{userLevel.xp} / {userLevel.next_level_xp} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getTierColor(userLevel.tier)} transition-all duration-500 flex items-center justify-end pr-2`}
            style={{ width: `${xpProgress}%` }}
          >
            <Star className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            Badges ({earnedCount}/{badges.length})
          </h4>
          {badges.length > 6 && (
            <button
              onClick={() => setShowAllBadges(!showAllBadges)}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              {showAllBadges ? 'Voir moins' : 'Voir tout'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {displayedBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                badge.earned
                  ? `${getRarityColor(badge.rarity)} bg-opacity-10 border-current`
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              {!badge.earned && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-xl">
                  <Lock className="w-6 h-6 text-white" />
                </div>
              )}

              <div className="text-center">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="text-xs font-semibold mb-1">{badge.name}</div>
                <div className="text-xs text-gray-600">{badge.description}</div>
                {badge.reward_credits > 0 && (
                  <div className="mt-2 text-xs font-bold text-green-600">
                    +{badge.reward_credits} crédits
                  </div>
                )}
                <div className={`mt-2 text-xs ${getRarityColor(badge.rarity)} text-white px-2 py-1 rounded-full inline-block`}>
                  {badge.rarity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          <div className="flex-1">
            <div className="text-sm font-semibold">Continuez comme ça !</div>
            <div className="text-xs text-gray-600">
              Encore {userLevel.next_level_xp - userLevel.xp} XP pour atteindre le niveau {userLevel.level + 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
