import { useState, useEffect } from 'react';
import { Search, Check, Zap, Shield, Clock } from 'lucide-react';
import { supabase, DocumentTemplate } from '../lib/supabase';
import { useTemplateSearch } from '../hooks/useTemplateSearch';
import { useGuestBehavior } from '../hooks/useGuestBehavior';
import { useDocumentTracking } from '../hooks/useDocumentTracking';
import { StatsCounter } from './StatsCounter';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { DocumentFOMOBadge } from './DocumentFOMOBadge';

interface ConversionLandingPageProps {
  onTemplateSelect: (templateId: string) => void;
}

export function ConversionLandingPage({ onTemplateSelect }: ConversionLandingPageProps) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);
  const { results, isSearching, hasResults } = useTemplateSearch(templates, searchQuery);
  const { trackDocumentView, trackSearch, trackPreview } = useDocumentTracking();
  const { trackDocumentView: trackBehavior, getRecentDocuments } = useGuestBehavior();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const popularTemplates = templates.slice(0, 6);
  const displayTemplates = hasResults ? results : popularTemplates;
  const recentDocuments = getRecentDocuments(3);

  useEffect(() => {
    if (searchQuery.length > 2) {
      trackSearch(searchQuery, results.length);
    }
  }, [searchQuery, results.length]);

  const handleTemplateClick = (template: DocumentTemplate, source: 'search' | 'popular' | 'recent') => {
    trackDocumentView(template.id, template.name, source);
    trackBehavior(template.id, template.name);
    setPreviewTemplate(template);
  };

  const handlePreviewClose = () => {
    setPreviewTemplate(null);
  };

  const handleStartFilling = () => {
    if (previewTemplate) {
      trackPreview(previewTemplate.id, previewTemplate.name);
      onTemplateSelect(previewTemplate.id);
      setPreviewTemplate(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-32 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Vos documents légaux.<br />
            <span className="text-yellow-300">Instantanés. 1,99$.</span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-blue-100">
            Remplissez. Payez 1,99$. Téléchargez.
          </p>

          <div className="max-w-2xl mx-auto relative">
            <div
              className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
                isFocused ? 'ring-4 ring-yellow-300' : ''
              }`}
            >
              <div className="flex items-center p-4">
                <Search className="w-6 h-6 text-gray-400 ml-2" />
                <input
                  type="text"
                  placeholder="Rechercher un document... (ex: contrat de location, NDA, facture)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  className="flex-1 px-4 py-4 text-xl text-gray-900 placeholder-gray-400 focus:outline-none"
                  autoFocus
                />
                {isSearching && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                )}
              </div>
            </div>

            {(isFocused || searchQuery) && displayTemplates.length > 0 && (
              <div className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
                {displayTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      handleTemplateClick(template, hasResults ? 'search' : 'popular');
                      setSearchQuery('');
                    }}
                    className="w-full px-6 py-4 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                          {template.name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {template.description}
                        </p>
                      </div>
                      <span className="ml-4 text-blue-600 font-bold whitespace-nowrap">1,99$</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Check className="w-5 h-5 text-green-300" />
              <span>Pas de compte nécessaire</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span>Paiement Express Apple/Google Pay</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield className="w-5 h-5 text-blue-300" />
              <span>100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 mb-16">
        {recentDocuments.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-600" />
              Vous avez récemment consulté
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentDocuments.map((doc) => {
                const template = templates.find((t) => t.id === doc.templateId);
                if (!template) return null;
                return (
                  <button
                    key={doc.templateId}
                    onClick={() => handleTemplateClick(template, 'recent')}
                    className="text-left p-4 bg-white rounded-xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold text-gray-900 mb-1">{doc.templateName}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Consulté {doc.viewCount} fois
                    </p>
                    <span className="text-xl font-bold text-orange-600">1,99$</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Documents les plus populaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template, 'popular')}
                className="text-left p-6 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group"
              >
                <DocumentFOMOBadge templateId={template.id} variant="compact" />
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 mb-2 text-lg mt-3">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">1,99$</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3 inline mr-1" />
                    5 min
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <StatsCounter />

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Pourquoi iDoc?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Ultra Rapide</h3>
              <p className="text-gray-600 text-sm">
                Votre document prêt en moins de 5 minutes
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">100% Sécurisé</h3>
              <p className="text-gray-600 text-sm">
                Vos données sont cryptées et protégées
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Légalement Valide</h3>
              <p className="text-gray-600 text-sm">
                Documents conformes aux normes légales
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 text-center text-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Prêt à créer votre document?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Des milliers de documents générés chaque jour
          </p>
          <button
            onClick={() => {
              document.getElementById('search-bar')?.focus();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-yellow-400 text-gray-900 px-12 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl"
          >
            Commencer maintenant - 1,99$
          </button>
        </div>
      </div>

      {previewTemplate && (
        <DocumentPreviewModal
          template={previewTemplate}
          onClose={handlePreviewClose}
          onStartFilling={handleStartFilling}
          viewCount={Math.floor(Math.random() * 200) + 50}
          recentDownloads={Math.floor(Math.random() * 100) + 25}
        />
      )}
    </div>
  );
}
