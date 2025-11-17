import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Star, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Template {
  id: string;
  name: string;
  category: string;
  description?: string;
  language?: string;
}

interface DynamicTemplateGridProps {
  onSelectTemplate?: (template: Template) => void;
}

const DynamicTemplateGrid: React.FC<DynamicTemplateGridProps> = ({ onSelectTemplate }) => {
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [visibleTemplates, setVisibleTemplates] = useState<Template[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [filter, allTemplates]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('id, name, category, description, language')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllTemplates(data || []);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const filterTemplates = () => {
    setIsAnimating(true);

    let filtered = allTemplates;
    if (filter !== 'all') {
      filtered = allTemplates.filter(t => t.category === filter);
    }

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setVisibleTemplates(shuffled);

    setTimeout(() => setIsAnimating(false), 100);
  };

  const categories = [
    { key: 'all', label: 'Tous', icon: Sparkles, count: allTemplates.length },
    { key: 'professional', label: 'Professionnel', icon: FileText, count: allTemplates.filter(t => t.category === 'professional').length },
    { key: 'immigration', label: 'Immigration', icon: Zap, count: allTemplates.filter(t => t.category === 'immigration').length },
    { key: 'personal', label: 'Personnel', icon: Star, count: allTemplates.filter(t => t.category === 'personal').length },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      professional: 'from-blue-500 to-indigo-600',
      immigration: 'from-orange-500 to-red-600',
      personal: 'from-green-500 to-emerald-600',
      academic: 'from-purple-500 to-pink-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Bibliothèque complète de documents
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explorez notre collection de {allTemplates.length} modèles professionnels, mise à jour en temps réel
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = filter === cat.key;

            return (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{cat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-sm ${
                  isActive ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleTemplates.map((template, index) => {
            const delay = isAnimating ? 0 : index * 30;
            const gradientClass = getCategoryColor(template.category);

            return (
              <div
                key={template.id}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-3 hover:rotate-1"
                style={{
                  animation: `slideInScale 0.5s ease-out ${delay}ms both`,
                }}
                onClick={() => onSelectTemplate?.(template)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-gradient-to-br ${gradientClass} p-3 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all`}>
                      <FileText className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      {template.language && (
                        <span className="text-lg">
                          {template.language === 'fr' ? '🇫🇷' : template.language === 'en' ? '🇬🇧' : '🌐'}
                        </span>
                      )}
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wide">
                        {template.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
                    {template.name}
                  </h3>

                  {template.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 min-h-[4rem]">
                      {template.description}
                    </p>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500 font-medium">Disponible</span>
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-blue-600 font-bold text-sm">Utiliser</span>
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
              </div>
            );
          })}
        </div>

        {visibleTemplates.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl text-gray-600">Aucun modèle trouvé dans cette catégorie</p>
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={filterTemplates}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Mélanger les modèles</span>
          </button>

          <p className="mt-4 text-gray-500 text-sm">
            {visibleTemplates.length} modèle{visibleTemplates.length > 1 ? 's' : ''} affiché{visibleTemplates.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.9) rotate(-3deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
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

export default DynamicTemplateGrid;
