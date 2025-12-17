import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Users, FileText, PenTool, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface Statistic {
  metric_name: string;
  metric_value: number;
}

interface LiveActivity {
  message: string;
  timestamp: number;
  location: string;
}

export const StatsCounter = memo(function StatsCounter() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Statistic[]>([]);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [recentActivity, setRecentActivity] = useState<LiveActivity[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const loadStatistics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_statistics')
        .select('metric_name, metric_value')
        .in('metric_name', ['total_visitors', 'documents_generated', 'active_users', 'signatures_created']);

      if (error) throw error;

      if (data) {
        setStats(data);

        const initial: Record<string, number> = {};
        data.forEach(stat => {
          initial[stat.metric_name] = 0;
        });
        setAnimatedValues(initial);

        data.forEach(stat => {
          animateValue(stat.metric_name, stat.metric_value);
        });
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
    generateLiveActivity();
  }, [loadStatistics]);

  useEffect(() => {
    if (recentActivity.length > 0) {
      const interval = setInterval(() => {
        setCurrentActivityIndex((prev) => (prev + 1) % recentActivity.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [recentActivity]);

  const generateLiveActivity = useCallback(() => {
    const locations = ['Montréal, QC', 'Toronto, ON', 'Vancouver, BC', 'Paris, FR', 'Québec, QC', 'Lyon, FR'];
    const documents = ['Contrat de Location', 'Bail Commercial', 'Contrat de Travail', 'NDA', 'Facture', 'Reçu'];

    const activities: LiveActivity[] = [];
    for (let i = 0; i < 6; i++) {
      const minutesAgo = Math.floor(Math.random() * 15) + 1;
      activities.push({
        message: `${documents[Math.floor(Math.random() * documents.length)]} généré`,
        timestamp: Date.now() - minutesAgo * 60000,
        location: locations[Math.floor(Math.random() * locations.length)],
      });
    }

    setRecentActivity(activities.sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  const getTimeAgo = useCallback((timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'À l\'instant';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} min`;
    return `Il y a ${Math.floor(minutes / 60)}h`;
  }, []);

  const animateValue = useCallback((key: string, end: number) => {
    const duration = 2000;
    const start = 0;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);

      setAnimatedValues(prev => ({ ...prev, [key]: current }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const formatNumber = useCallback((num: number): string => {
    return num.toLocaleString('fr-FR');
  }, []);

  const getStatConfig = useCallback((metricName: string) => {
    switch (metricName) {
      case 'total_visitors':
        return {
          icon: Users,
          label: t('stats.totalVisitors') || 'Visiteurs',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        };
      case 'documents_generated':
        return {
          icon: FileText,
          label: t('stats.documentsGenerated') || 'Documents Créés',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        };
      case 'active_users':
        return {
          icon: TrendingUp,
          label: t('stats.activeUsers') || 'Utilisateurs Actifs',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
        };
      case 'signatures_created':
        return {
          icon: PenTool,
          label: t('stats.signaturesCreated') || 'Signatures',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
        };
      default:
        return {
          icon: TrendingUp,
          label: metricName,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
        };
    }
  }, [t]);

  const currentActivity = useMemo(() =>
    recentActivity[currentActivityIndex],
    [recentActivity, currentActivityIndex]
  );

  if (stats.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('stats.title') || 'Ils nous font confiance'}
          </h2>
          <p className="text-gray-600">
            {t('stats.subtitle') || 'Rejoignez des milliers d\'utilisateurs satisfaits'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const config = getStatConfig(stat.metric_name);
            const Icon = config.icon;
            const displayValue = animatedValues[stat.metric_name] || 0;

            return (
              <div
                key={stat.metric_name}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${config.bgColor} mb-4`}>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatNumber(displayValue)}+
                </div>

                <div className="text-sm text-gray-600 font-medium">
                  {config.label}
                </div>
              </div>
            );
          })}
        </div>

        {recentActivity.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                <Zap className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold">
                    {currentActivity?.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentActivity?.location}
                  </p>
                </div>
              </div>
              <span className="text-gray-500 text-sm font-medium whitespace-nowrap ml-4">
                {currentActivity && getTimeAgo(currentActivity.timestamp)}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>{t('stats.liveUpdate') || 'Mis à jour en temps réel'}</span>
          </p>
        </div>
      </div>
    </div>
  );
});
