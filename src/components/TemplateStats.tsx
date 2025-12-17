import { useState, useEffect, memo, useCallback } from 'react';
import { FileText, TrendingUp, Globe, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StatCard {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color: string;
  gradient: string;
}

const TemplateStats = memo(function TemplateStats() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const { data: templates, error } = await supabase
        .from('document_templates')
        .select('id, category, language')
        .eq('is_active', true);

      if (error) throw error;

      const totalTemplates = templates?.length || 0;
      const categories = new Set(templates?.map(t => t.category)).size;
      const languages = new Set(templates?.map(t => t.language)).size;

      const newStats: StatCard[] = [
        {
          icon: FileText,
          value: totalTemplates,
          label: 'Modèles disponibles',
          color: 'text-blue-600',
          gradient: 'from-blue-500 to-indigo-600',
        },
        {
          icon: Sparkles,
          value: categories,
          label: 'Catégories',
          color: 'text-purple-600',
          gradient: 'from-purple-500 to-pink-600',
        },
        {
          icon: Globe,
          value: languages,
          label: 'Langues',
          color: 'text-green-600',
          gradient: 'from-green-500 to-emerald-600',
        },
        {
          icon: TrendingUp,
          value: '+7',
          label: 'Cette semaine',
          color: 'text-orange-600',
          gradient: 'from-orange-500 to-red-600',
        },
      ];

      setStats(newStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [loadStats]);

  if (loading) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Une bibliothèque en constante évolution
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Découvrez notre collection de documents professionnels, mise à jour régulièrement pour répondre à tous vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const delay = index * 100;

            return (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${delay}ms both`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>

                <div className="relative">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform origin-left">
                    {stat.value}
                  </div>

                  <div className="text-blue-100 text-lg font-medium">
                    {stat.label}
                  </div>

                  <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full group-hover:scale-150 transition-transform"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">Mise à jour en temps réel</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="text-white">
            <div className="text-3xl font-bold mb-2">12,450+</div>
            <div className="text-blue-200">Documents générés</div>
          </div>

          <div className="text-white">
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-blue-200">Satisfaction client</div>
          </div>

          <div className="text-white">
            <div className="text-3xl font-bold mb-2">&lt;2 min</div>
            <div className="text-blue-200">Temps moyen</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
});

export default TemplateStats;
