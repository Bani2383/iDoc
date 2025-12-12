import React, { useState, useEffect } from 'react';
import {
  Users, TrendingUp, Zap, Clock, Eye, Star,
  Award, Target, Sparkles, Flame, CheckCircle2,
  Timer, ShoppingCart, Gift, ArrowRight
} from 'lucide-react';

type NotificationType = 'purchase' | 'generation' | 'review' | 'trending' | 'urgency' | 'success' | 'milestone';

interface FOMONotification {
  id: string;
  type: NotificationType;
  message: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  timeAgo: string;
  location?: string;
}

const NOTIFICATION_TEMPLATES = [
  // Achats récents
  { type: 'purchase', messages: [
    { main: '{name} a acheté {item}', sub: 'Paiement sécurisé confirmé' },
    { main: '{name} vient de prendre {item}', sub: 'Transaction réussie' },
    { main: '{item} commandé par {name}', sub: '{location}' },
  ], icon: ShoppingCart, color: 'blue', gradient: 'from-blue-500 to-blue-600' },

  // Générations en temps réel
  { type: 'generation', messages: [
    { main: '{name} génère un document', sub: '{item} en cours...' },
    { main: '📄 Nouveau document créé', sub: '{item} par {name}' },
    { main: '{name} utilise l\'IA', sub: 'Génération de {item}' },
  ], icon: Sparkles, color: 'purple', gradient: 'from-purple-500 to-purple-600' },

  // Avis et succès
  { type: 'review', messages: [
    { main: '⭐ 5/5 par {name}', sub: '"{item}" - Excellent service!' },
    { main: '{name} recommande iDoc', sub: 'Gain de temps incroyable' },
    { main: '💯 Succès confirmé', sub: '{name} a validé son {item}' },
  ], icon: Star, color: 'yellow', gradient: 'from-yellow-500 to-orange-500' },

  // Tendances et popularité
  { type: 'trending', messages: [
    { main: '🔥 {item} en tendance', sub: '+{count} générations aujourd\'hui' },
    { main: '📈 Pic d\'activité', sub: '{count} personnes utilisent {item}' },
    { main: '⚡ Document populaire', sub: '{item} - #{count} cette semaine' },
  ], icon: TrendingUp, color: 'orange', gradient: 'from-orange-500 to-red-500' },

  // Urgence et rareté
  { type: 'urgency', messages: [
    { main: '⏰ Plus que {count} places', sub: 'Offre limitée - Agissez maintenant' },
    { main: '🎯 {count}% de réduction', sub: 'Se termine dans {time}' },
    { main: '⚡ Stock limité', sub: 'Plus que {count} crédits à ce prix' },
  ], icon: Timer, color: 'red', gradient: 'from-red-500 to-red-600' },

  // Succès clients
  { type: 'success', messages: [
    { main: '✅ {name} a validé son dossier', sub: 'Immigration réussie avec iDoc' },
    { main: '🎉 {name} embauché(e)!', sub: 'Grâce à son CV iDoc' },
    { main: '💼 Signature validée', sub: '{name} - Contrat signé numériquement' },
  ], icon: CheckCircle2, color: 'green', gradient: 'from-green-500 to-emerald-600' },

  // Milestones
  { type: 'milestone', messages: [
    { main: '🎊 {count}ème document généré!', sub: 'Objectif atteint aujourd\'hui' },
    { main: '🏆 Nouveau record', sub: '{count} utilisateurs actifs' },
    { main: '🌟 {count} clients satisfaits', sub: 'Merci pour votre confiance!' },
  ], icon: Award, color: 'indigo', gradient: 'from-indigo-500 to-purple-600' },
];

const SAMPLE_DATA = {
  names: ['Sophie', 'Alexandre', 'Marie', 'Thomas', 'Julie', 'Lucas', 'Emma', 'Maxime', 'Léa', 'Hugo', 'Camille', 'Nathan', 'Inès', 'Louis', 'Chloé'],
  locations: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille'],
  items: [
    'CV Professionnel', 'Lettre de Motivation', 'Pack 10 crédits', 'Contrat CDI',
    'Attestation', 'Pack Immigration', 'Bail Commercial', 'Procuration',
    'Pack 25 crédits', 'CV + Lettre', 'Contrat Freelance', 'Dossier complet'
  ],
};

function generateNotification(): FOMONotification {
  const template = NOTIFICATION_TEMPLATES[Math.floor(Math.random() * NOTIFICATION_TEMPLATES.length)];
  const messageTemplate = template.messages[Math.floor(Math.random() * template.messages.length)];

  const name = SAMPLE_DATA.names[Math.floor(Math.random() * SAMPLE_DATA.names.length)];
  const location = SAMPLE_DATA.locations[Math.floor(Math.random() * SAMPLE_DATA.locations.length)];
  const item = SAMPLE_DATA.items[Math.floor(Math.random() * SAMPLE_DATA.items.length)];
  const count = Math.floor(Math.random() * 50) + 10;
  const time = ['2h', '3h', '5h', '24h'][Math.floor(Math.random() * 4)];
  const minutesAgo = Math.floor(Math.random() * 15) + 1;

  const message = messageTemplate.main
    .replace('{name}', name)
    .replace('{item}', item)
    .replace('{count}', count.toString())
    .replace('{time}', time);

  const subtitle = messageTemplate.sub
    ?.replace('{name}', name)
    .replace('{item}', item)
    .replace('{location}', location)
    .replace('{count}', count.toString())
    .replace('{time}', time);

  return {
    id: Math.random().toString(36),
    type: template.type,
    message,
    subtitle,
    icon: template.icon,
    color: template.color,
    gradient: template.gradient,
    timeAgo: `${minutesAgo} min`,
    location: Math.random() > 0.5 ? location : undefined,
  };
}

interface StatsDisplay {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
}

export default function DynamicFOMOSystem() {
  const [currentNotification, setCurrentNotification] = useState<FOMONotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<StatsDisplay>({
    label: 'Documents générés aujourd\'hui',
    value: 147,
    icon: Sparkles,
    gradient: 'from-blue-600 to-blue-700'
  });

  const [statsVariant, setStatsVariant] = useState(0);

  const STATS_VARIANTS: StatsDisplay[] = [
    {
      label: 'Documents générés aujourd\'hui',
      value: 147,
      icon: Sparkles,
      gradient: 'from-blue-600 to-blue-700'
    },
    {
      label: 'Utilisateurs actifs maintenant',
      value: 23,
      icon: Users,
      gradient: 'from-green-600 to-emerald-700'
    },
    {
      label: 'Nouveaux clients cette semaine',
      value: 89,
      icon: Target,
      gradient: 'from-purple-600 to-purple-700'
    },
    {
      label: 'Avis 5 étoiles ce mois',
      value: 234,
      icon: Star,
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      label: 'Temps moyen gagné',
      value: 45,
      icon: Clock,
      gradient: 'from-indigo-600 to-indigo-700',
      suffix: 'min'
    },
  ];

  useEffect(() => {
    const showNotification = () => {
      const notif = generateNotification();
      setCurrentNotification(notif);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    // Show first notification after 2s
    const initialTimeout = setTimeout(showNotification, 2000);

    // Then show every 15s
    const notifInterval = setInterval(showNotification, 15000);

    // Update stats every 30s
    const statsInterval = setInterval(() => {
      setStatsVariant((prev) => (prev + 1) % STATS_VARIANTS.length);
      const newStats = STATS_VARIANTS[(statsVariant + 1) % STATS_VARIANTS.length];
      setStats({
        ...newStats,
        value: newStats.value + Math.floor(Math.random() * 5)
      });
    }, 30000);

    // Increment stats slowly
    const incrementInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        value: prev.value + Math.floor(Math.random() * 2)
      }));
    }, 45000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(notifInterval);
      clearInterval(statsInterval);
      clearInterval(incrementInterval);
    };
  }, [statsVariant]);

  const Icon = currentNotification?.icon || Zap;
  const StatsIcon = stats.icon;

  return (
    <>
      {/* Notification popup - Bottom Left */}
      <div
        className={`fixed bottom-6 left-6 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-sm transform transition-all duration-500 z-40 ${
          isVisible ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-full opacity-0 scale-95'
        }`}
      >
        {currentNotification && (
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${currentNotification.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight">
                {currentNotification.message}
              </p>
              {currentNotification.subtitle && (
                <p className="text-gray-600 text-xs mt-1 leading-tight">
                  {currentNotification.subtitle}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  Il y a {currentNotification.timeAgo}
                </span>
                {currentNotification.location && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{currentNotification.location}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Counter - Bottom Right */}
      <div
        className={`fixed bottom-6 right-6 bg-gradient-to-br ${stats.gradient} text-white rounded-2xl shadow-2xl p-5 max-w-xs z-40 transition-all duration-500 hover:scale-105`}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
            <StatsIcon className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/80 font-medium uppercase tracking-wide">
              {stats.label}
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <p className="text-4xl font-black tabular-nums">
                {stats.value}
              </p>
              {(stats as any).suffix && (
                <span className="text-lg font-semibold text-white/80">
                  {(stats as any).suffix}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pulse effect */}
        <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse"></div>
      </div>

      {/* Optional: Add a subtle CTA button that appears sometimes */}
      {currentNotification?.type === 'urgency' && isVisible && (
        <div className="fixed bottom-24 left-6 z-39">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm font-semibold animate-bounce">
            <Gift className="w-4 h-4" />
            Profiter de l'offre
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
