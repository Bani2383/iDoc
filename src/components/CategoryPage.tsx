import { useState, useEffect } from 'react';
import { FileText, Search, TrendingUp, Clock, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useAnalytics } from '../hooks/useAnalytics';

interface CategoryPageProps {
  categorySlug: string;
  onSelectTemplate: (slug: string) => void;
}

interface Template {
  id: string;
  slug: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  category: string;
  keywords: string[];
}

const CATEGORIES = {
  'professional': {
    title_fr: 'Documents professionnels',
    title_en: 'Professional Documents',
    description_fr: 'CV, lettres de motivation, contrats, factures et documents d\'entreprise',
    description_en: 'Resumes, cover letters, contracts, invoices and business documents',
    icon: '💼',
    color: 'blue'
  },
  'personal': {
    title_fr: 'Documents personnels',
    title_en: 'Personal Documents',
    description_fr: 'Attestations, résiliations, plaintes et démarches personnelles',
    description_en: 'Certificates, cancellations, complaints and personal procedures',
    icon: '📄',
    color: 'green'
  },
  'academic': {
    title_fr: 'Documents académiques',
    title_en: 'Academic Documents',
    description_fr: 'Stages, bourses, admissions et documents étudiants',
    description_en: 'Internships, scholarships, admissions and student documents',
    icon: '🎓',
    color: 'purple'
  },
  'immigration': {
    title_fr: 'Immigration & Visas',
    title_en: 'Immigration & Visas',
    description_fr: 'Documents pour visas, immigration et voyages internationaux',
    description_en: 'Documents for visas, immigration and international travel',
    icon: '✈️',
    color: 'red'
  }
};

export function CategoryPage({ categorySlug, onSelectTemplate }: CategoryPageProps) {
  const { language } = useLanguage();
  const { trackCategoryClick } = useAnalytics();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const category = CATEGORIES[categorySlug as keyof typeof CATEGORIES];

  useEffect(() => {
    if (category) {
      trackCategoryClick(categorySlug);
      fetchTemplates();
    }
  }, [categorySlug, language]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = templates.filter(t => {
        const name = language === 'en' ? t.name_en : t.name;
        const desc = language === 'en' ? t.description_en : t.description;
        const query = searchQuery.toLowerCase();
        return name?.toLowerCase().includes(query) || desc?.toLowerCase().includes(query);
      });
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates(templates);
    }
  }, [searchQuery, templates, language]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('document_templates')
        .select('id, slug, name, name_en, description, description_en, category, keywords')
        .eq('category', categorySlug)
        .eq('is_active', true)
        .eq('review_status', 'published')
        .order('name');

      if (error) throw error;

      setTemplates(data || []);
      setFilteredTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Catégorie non trouvée</h1>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('navigate', {
                detail: { view: 'improved' }
              }));
            }}
            className="text-blue-600 hover:text-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const colorClasses = {
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    purple: 'from-purple-600 to-purple-800',
    red: 'from-red-600 to-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`bg-gradient-to-r ${colorClasses[category.color]} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'en' ? category.title_en : category.title_fr}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              {language === 'en' ? category.description_en : category.description_fr}
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'en' ? 'Search documents...' : 'Rechercher un document...'}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-0 text-gray-900 focus:ring-4 focus:ring-white/30"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 flex justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>{filteredTemplates.length} documents</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>2 min {language === 'en' ? 'average' : 'en moyenne'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>1,99 $ {language === 'en' ? 'per document' : 'par document'}</span>
              </div>
            </div>
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
                {language === 'en' ? 'No documents found' : 'Aucun document trouvé'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' ? 'Try a different search' : 'Essayez une autre recherche'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  {filteredTemplates.length} document{filteredTemplates.length > 1 ? 's' : ''} {language === 'en' ? 'found' : 'trouvé'}
                  {filteredTemplates.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template.slug)}
                    className="bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer p-6 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[category.color]} rounded-lg flex items-center justify-center`}>
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        1,99 $
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {language === 'en' ? template.name_en || template.name : template.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {language === 'en' ? template.description_en || template.description : template.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>2-3 min</span>
                      </div>

                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors group-hover:scale-105 transform">
                        {language === 'en' ? 'Create' : 'Créer'}
                      </button>
                    </div>

                    {template.keywords && template.keywords.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {template.keywords.slice(0, 3).map((keyword, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Popular in Category */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Most Popular' : 'Les plus populaires'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {filteredTemplates.slice(0, 3).map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template.slug)}
                className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-300"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {language === 'en' ? template.name_en || template.name : template.name}
                </h3>
                <p className="text-sm text-gray-600">1,99 $ • 2 min</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 bg-gradient-to-r ${colorClasses[category.color]} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Ready to create your document?' : 'Prêt à créer votre document?'}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {language === 'en'
              ? 'Professional templates, instant generation, $1.99 per document'
              : 'Modèles professionnels, génération instantanée, 1,99$ par document'}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
          >
            {language === 'en' ? 'Browse Documents' : 'Parcourir les documents'}
          </button>
        </div>
      </section>
    </div>
  );
}
