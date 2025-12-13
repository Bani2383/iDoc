import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Zap, Globe, Settings, Play, Pause, RefreshCw, Download } from 'lucide-react';

interface ToolCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  view: string;
  status: 'active' | 'inactive' | 'running';
  color: string;
}

interface QuickAction {
  label: string;
  action: () => void;
  icon: React.ReactNode;
  color: string;
}

export default function TrafficControlCenter() {
  const [activeTools, setActiveTools] = useState<string[]>(['traffic', 'analytics']);

  const tools: ToolCard[] = [
    {
      id: 'traffic',
      name: 'Dashboard Trafic',
      description: 'Surveillance en temps réel des visiteurs',
      icon: <BarChart3 size={32} />,
      view: 'traffic',
      status: 'active',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'analytics',
      name: 'Analytics Avancées',
      description: 'Métriques détaillées et ROI',
      icon: <TrendingUp size={32} />,
      view: 'analytics',
      status: 'active',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Page ultra-conversion',
      icon: <Target size={32} />,
      view: 'ultra-landing',
      status: 'active',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'google-ads',
      name: 'Google Ads',
      description: '5 campagnes prêtes à lancer',
      icon: <Zap size={32} />,
      view: 'google-ads',
      status: 'inactive',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'seo',
      name: 'SEO Automation',
      description: 'Génération automatique de contenu',
      icon: <Globe size={32} />,
      view: 'seo-automation',
      status: 'inactive',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      label: 'Lancer Campagne Google Ads',
      action: () => navigateToView('google-ads'),
      icon: <Play />,
      color: 'bg-gradient-to-r from-blue-600 to-cyan-600'
    },
    {
      label: 'Générer 30 Articles SEO',
      action: () => navigateToView('seo-automation'),
      icon: <Zap />,
      color: 'bg-gradient-to-r from-green-600 to-emerald-600'
    },
    {
      label: 'Voir Analytics',
      action: () => navigateToView('analytics'),
      icon: <BarChart3 />,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600'
    },
    {
      label: 'Rafraîchir Données',
      action: () => window.location.reload(),
      icon: <RefreshCw />,
      color: 'bg-gradient-to-r from-gray-600 to-gray-700'
    }
  ];

  const navigateToView = (view: string) => {
    window.history.pushState({}, '', `?view=${view}`);
    window.location.reload();
  };

  const toggleTool = (toolId: string) => {
    setActiveTools(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <Settings className="text-yellow-400 animate-spin-slow" />
            Centre de Contrôle Trafic
          </h1>
          <p className="text-xl text-blue-200">
            Gérez tous vos outils de génération de trafic depuis un seul endroit
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Outils Actifs"
            value={activeTools.length}
            total={tools.length}
            color="text-green-400"
          />
          <StatCard
            label="Trafic Aujourd'hui"
            value="2,847"
            subtitle="visiteurs"
            color="text-blue-400"
          />
          <StatCard
            label="Conversions"
            value="127"
            subtitle="taux: 4.5%"
            color="text-purple-400"
          />
          <StatCard
            label="Revenus"
            value="1,245€"
            subtitle="aujourd'hui"
            color="text-yellow-400"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8">
          <h2 className="text-3xl font-black text-white mb-6">Actions Rapides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className={`${action.color} text-white p-6 rounded-2xl hover:scale-105 transform transition-all shadow-xl`}
              >
                <div className="flex flex-col items-center gap-3">
                  {action.icon}
                  <span className="font-bold text-center">{action.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <h2 className="text-3xl font-black text-white mb-6">Outils Disponibles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 bg-gradient-to-br ${tool.color} rounded-xl text-white`}>
                    {tool.icon}
                  </div>
                  <button
                    onClick={() => toggleTool(tool.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      activeTools.includes(tool.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {activeTools.includes(tool.id) ? 'ACTIF' : 'INACTIF'}
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{tool.description}</p>
                <button
                  onClick={() => navigateToView(tool.view)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-semibold transition-all"
                >
                  Ouvrir
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border border-yellow-500/30">
          <h2 className="text-3xl font-black text-white mb-4 text-center">
            Prochaines Étapes Recommandées
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <StepCard
              number={1}
              title="Lancer Google Ads"
              description="Commencez avec la campagne Haute Intention (50€/jour)"
              status="recommended"
            />
            <StepCard
              number={2}
              title="Générer Articles SEO"
              description="Créez 30 articles pour booster le trafic organique"
              status="recommended"
            />
            <StepCard
              number={3}
              title="Surveiller Analytics"
              description="Analysez les résultats et optimisez quotidiennement"
              status="ongoing"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, total, subtitle, color }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="text-gray-300 text-sm mb-2">{label}</div>
      <div className={`text-4xl font-black ${color} mb-1`}>
        {value}
        {total && <span className="text-2xl text-gray-400">/{total}</span>}
      </div>
      {subtitle && <div className="text-gray-400 text-sm">{subtitle}</div>}
    </div>
  );
}

function StepCard({ number, title, description, status }: any) {
  return (
    <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-black">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </div>
      <div className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
        status === 'recommended' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
      }`}>
        {status === 'recommended' ? 'RECOMMANDÉ' : 'EN COURS'}
      </div>
    </div>
  );
}
