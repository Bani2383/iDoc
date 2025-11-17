import React, { useState, useEffect } from 'react';
import { FileText, Clock, Globe, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Template {
  id: string;
  name: string;
  category: string;
  description?: string;
  language?: string;
}

interface AnimatedTemplateShowcaseProps {
  onSelectTemplate?: (template: Template) => void;
  maxDisplay?: number;
}

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  professional: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'bg-blue-100' },
  personal: { bg: 'bg-green-50', text: 'text-green-700', icon: 'bg-green-100' },
  academic: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'bg-purple-100' },
  immigration: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'bg-orange-100' },
};

const AnimatedTemplateShowcase: React.FC<AnimatedTemplateShowcaseProps> = ({
  onSelectTemplate,
  maxDisplay = 12
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [displayedTemplates, setDisplayedTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (templates.length > 0) {
      shuffleTemplates();
      const interval = setInterval(() => {
        shuffleTemplates();
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [templates]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('id, name, category, description, language')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      setTemplates(data || []);
    } catch (err) {
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const shuffleTemplates = () => {
    const shuffled = [...templates]
      .sort(() => Math.random() - 0.5)
      .slice(0, maxDisplay);

    setDisplayedTemplates(shuffled);
    setAnimationKey(prev => prev + 1);
  };

  const getCategoryStyle = (category: string) => {
    return categoryColors[category] || categoryColors.professional;
  };

  const getLanguageFlag = (lang?: string) => {
    const flags: Record<string, string> = {
      fr: '🇫🇷',
      en: '🇬🇧',
      es: '🇪🇸',
      de: '🇩🇪',
      it: '🇮🇹',
      pt: '🇵🇹',
    };
    return flags[lang || 'fr'] || '🌐';
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des modèles...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="documents-section" className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Explorez nos {templates.length} modèles de documents
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Des contrats professionnels aux documents d'immigration, trouvez le modèle parfait pour votre besoin.
          Nouveaux modèles ajoutés régulièrement.
        </p>

        <div className="flex items-center justify-center space-x-8 mt-8">
          <div className="flex items-center space-x-2 text-gray-700">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-bold text-2xl">{templates.length}</div>
              <div className="text-sm text-gray-500">Modèles</div>
            </div>
          </div>

          <div className="w-px h-12 bg-gray-300"></div>

          <div className="flex items-center space-x-2 text-gray-700">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-bold text-2xl">+{Math.floor(templates.length / 10)}</div>
              <div className="text-sm text-gray-500">Cette semaine</div>
            </div>
          </div>

          <div className="w-px h-12 bg-gray-300"></div>

          <div className="flex items-center space-x-2 text-gray-700">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-bold text-2xl">Multi-langues</div>
              <div className="text-sm text-gray-500">FR • EN • ES</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedTemplates.map((template, index) => {
          const style = getCategoryStyle(template.category);
          const delay = index * 50;

          return (
            <div
              key={`${template.id}-${animationKey}`}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
              style={{
                animation: `fadeInUp 0.6s ease-out ${delay}ms both`
              }}
              onClick={() => onSelectTemplate?.(template)}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${style.bg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${style.icon} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <FileText className={`w-6 h-6 ${style.text}`} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getLanguageFlag(template.language)}</span>
                    <span className={`text-xs font-semibold ${style.text} ${style.bg} px-2 py-1 rounded-full`}>
                      {template.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>

                {template.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {template.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>2 min</span>
                  </div>

                  <button className="text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Utiliser →
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/5 transition-all pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={shuffleTemplates}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          Voir d'autres modèles
        </button>

        <p className="mt-4 text-gray-500 text-sm">
          {templates.length} modèles disponibles • Mise à jour automatique toutes les 8 secondes
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default AnimatedTemplateShowcase;
