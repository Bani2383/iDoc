import { useState, useEffect } from 'react';
import { Search, FileText, Clock, Star, TrendingUp, Zap, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface Template {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  estimated_time_minutes: number;
  difficulty_level: string;
  views: number;
  purchases: number;
}

interface Category {
  code: string;
  icon: typeof FileText;
  color: string;
}

export function PublicMarketplace({ onSelectTemplate }: { onSelectTemplate: (id: string) => void }) {
  const { t, language } = useLanguage();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const categories: Category[] = [
    { code: 'cv_resume', icon: FileText, color: 'bg-blue-500' },
    { code: 'letters', icon: FileText, color: 'bg-green-500' },
    { code: 'contracts', icon: FileText, color: 'bg-purple-500' },
    { code: 'immigration', icon: Globe, color: 'bg-red-500' },
    { code: 'education', icon: Star, color: 'bg-yellow-500' },
    { code: 'business', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  useEffect(() => {
    fetchTemplates();
  }, [language]);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedCategory, templates]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .rpc('get_popular_templates', { limit_count: 50, lang_code: language });

      if (error) throw error;

      setTemplates(data || []);
      setFilteredTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  };

  const getDifficultyBadge = (level: string) => {
    const badges = {
      simple: { label: 'Simple', color: 'bg-green-100 text-green-800' },
      intermediate: { label: 'Intermédiaire', color: 'bg-yellow-100 text-yellow-800' },
      advanced: { label: 'Avancé', color: 'bg-red-100 text-red-800' }
    };
    return badges[level as keyof typeof badges] || badges.simple;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
              {t('marketplace.hero.title') || 'Documents professionnels en quelques minutes'}
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              {t('marketplace.hero.subtitle') || 'Plus de 50 modèles prêts à l\'emploi à partir de 1,99 $'}
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('marketplace.search.placeholder') || 'Rechercher un document...'}
                  className="w-full pl-14 pr-4 py-4 text-lg rounded-xl border-0 focus:ring-4 focus:ring-blue-300 text-gray-900 shadow-2xl"
                />
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
                <span className="text-blue-100">Populaires:</span>
                <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                  CV
                </button>
                <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                  Lettre de motivation
                </button>
                <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                  Bail
                </button>
                <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                  Visa
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Génération en 2 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>+10,000 documents créés</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>30+ langues disponibles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('marketplace.categories.title') || 'Parcourir par catégorie'}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.code;

              return (
                <button
                  key={cat.code}
                  onClick={() => setSelectedCategory(isActive ? null : cat.code)}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    isActive
                      ? 'border-blue-600 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 ${cat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className={`font-semibold text-sm ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                    {t(`categories.${cat.code}`) || cat.code}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('marketplace.noResults') || 'Aucun document trouvé'}
              </h3>
              <p className="text-gray-600">
                {t('marketplace.tryDifferent') || 'Essayez une autre recherche ou catégorie'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {filteredTemplates.length} document{filteredTemplates.length > 1 ? 's' : ''} trouvé{filteredTemplates.length > 1 ? 's' : ''}
                </p>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => {
                  const difficulty = getDifficultyBadge(template.difficulty_level);

                  return (
                    <div
                      key={template.id}
                      className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
                      onClick={() => onSelectTemplate(template.id)}
                    >
                      {/* Image Placeholder */}
                      <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileText className="w-16 h-16 text-white opacity-50 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficulty.color}`}>
                            {difficulty.label}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {template.title}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {template.description}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{template.estimated_time_minutes} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{template.purchases} achats</span>
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              {template.price.toFixed(2)} $
                            </span>
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors group-hover:scale-105 transform">
                            Créer
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Prêt à créer votre document?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez des milliers d'utilisateurs satisfaits
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl"
          >
            Parcourir les documents
          </button>
        </div>
      </section>
    </div>
  );
}
