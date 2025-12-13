import { useEffect, useState } from 'react';
import { FileText, Download, Clock, CheckCircle, Shield, Plus, Sparkles, Home, User, CreditCard, LogOut, Settings, RefreshCw, X, Users, TrendingUp, Edit3 } from 'lucide-react';
import { supabase, DocumentTemplate } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useGuestFormRestore } from '../hooks/useGuestFormRestore';
import { ProtectedDocumentViewer } from './ProtectedDocumentViewer';
import { LiveDocumentGenerator } from './LiveDocumentGenerator';
import { AIDocumentGenerator } from './AIDocumentGenerator';
import { ClientHomePage } from './ClientHomePage';
import { ClientProfilePage } from './ClientProfilePage';
import { ClientBillingPage } from './ClientBillingPage';
import ProSubscriptionPage from './ProSubscriptionPage';
import AffiliateDashboard from './AffiliateDashboard';
import { PDFSignatureEditor } from './PDFSignatureEditor';
import { logger } from '../lib/logger';

interface GeneratedDocument {
  id: string;
  document_type: string;
  status: string;
  price: number;
  pdf_url: string | null;
  created_at: string;
}

export function ClientDashboard() {
  const { user, profile, signOut } = useAuth();
  const { theme } = useTheme();
  const { savedData, clearSavedData } = useGuestFormRestore();

  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showPDFSignatureEditor, setShowPDFSignatureEditor] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'billing' | 'documents' | 'pro' | 'affiliate'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  useEffect(() => {
    if (savedData) {
      setShowRestorePrompt(true);
    }
  }, [savedData]);

  const colors = theme === 'minimal' ? {
    primary: 'bg-black hover:bg-gray-800',
    primaryText: 'text-black',
    primaryBorder: 'border-black',
    primaryLight: 'bg-gray-100 text-gray-900',
    accent: 'text-black',
    accentBg: 'bg-gray-900',
    hoverBg: 'hover:bg-gray-100',
    borderColor: 'border-black',
    iconColor: 'text-black',
    tabActive: 'border-black text-black',
    tabInactive: 'border-transparent text-gray-500 hover:text-gray-900',
  } : {
    primary: 'bg-blue-600 hover:bg-blue-700',
    primaryText: 'text-blue-600',
    primaryBorder: 'border-blue-600',
    primaryLight: 'bg-blue-100 text-blue-700',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-600',
    hoverBg: 'hover:bg-blue-50 hover:border-blue-600',
    borderColor: 'border-blue-600',
    iconColor: 'text-blue-600',
    tabActive: 'border-blue-600 text-blue-600',
    tabInactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
  };

  useEffect(() => {
    fetchDocuments();
    fetchTemplates();
  }, []);

  const handleNavigation = (page: string) => {
    if (page === 'documents-new') {
      setCurrentPage('documents');
      setShowTemplates(true);
    } else if (page === 'documents-ai') {
      setCurrentPage('documents');
      setShowAIGenerator(true);
    } else if (page === 'sign-pdf') {
      setShowPDFSignatureEditor(true);
    } else {
      setCurrentPage(page as 'home' | 'profile' | 'billing' | 'documents' | 'pro' | 'affiliate');
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      logger.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      logger.error('Error fetching templates:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { icon: Clock, text: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
      pending_payment: { icon: Clock, text: 'En attente de paiement', color: 'bg-yellow-100 text-yellow-700' },
      paid: { icon: CheckCircle, text: 'Payé', color: 'bg-green-100 text-green-700' },
      generated: { icon: CheckCircle, text: 'Disponible', color: 'bg-blue-100 text-blue-700' },
    };

    const badge = badges[status as keyof typeof badges] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.text}
      </span>
    );
  };

  if (showPDFSignatureEditor) {
    logger.debug('Rendering PDFSignatureEditor');
    return (
      <PDFSignatureEditor
        onClose={() => {
          logger.debug('PDFSignatureEditor onClose called');
          setShowPDFSignatureEditor(false);
          fetchDocuments();
        }}
        onComplete={(signedPdfBlob) => {
          logger.debug('PDF signé créé:', signedPdfBlob.size, 'bytes');
          setShowPDFSignatureEditor(false);
          fetchDocuments();
        }}
      />
    );
  }

  if (showAIGenerator) {
    return (
      <AIDocumentGenerator
        onClose={() => {
          setShowAIGenerator(false);
          fetchDocuments();
        }}
      />
    );
  }

  if (selectedTemplateId) {
    const initialData = savedData?.templateId === selectedTemplateId ? {
      formData: savedData.formData,
      currentStep: savedData.currentStep
    } : undefined;

    return (
      <LiveDocumentGenerator
        templateId={selectedTemplateId}
        initialData={initialData}
        onBack={() => {
          setSelectedTemplateId(null);
          fetchDocuments();
          if (initialData) {
            clearSavedData(selectedTemplateId);
          }
        }}
      />
    );
  }

  if (selectedDocument) {
    return (
      <ProtectedDocumentViewer
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    );
  }

  const navItems = [
    { id: 'home' as const, label: 'Accueil', icon: Home },
    { id: 'documents' as const, label: 'Mes Documents', icon: FileText },
    { id: 'profile' as const, label: 'Mon Compte', icon: User },
    { id: 'billing' as const, label: 'Facturation', icon: CreditCard }
  ];

  return (
    <div className={theme === 'minimal' ? 'min-h-screen bg-white' : 'min-h-screen bg-gray-50'}>
      <header className={theme === 'minimal' ? 'bg-white border-b border-black' : 'bg-white border-b border-gray-200'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DocGen Pro</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm text-gray-600">
                  {profile?.full_name || user?.email}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  profile?.role === 'admin'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {profile?.role === 'admin' ? 'Administrateur' : 'Client'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {profile?.role === 'admin' && (
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.reload();
                  }}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Mode Admin</span>
                </a>
              )}
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>

          <nav className="flex space-x-1 -mb-px">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  aria-label={`Naviguer vers ${item.label}`}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                    isActive
                      ? colors.tabActive
                      : colors.tabInactive
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? (theme === 'minimal' ? 'text-black' : 'text-blue-600') : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main>
        {currentPage === 'home' && (
          <ClientHomePage
            onNavigate={handleNavigation}
            documentsCount={documents.length}
          />
        )}

        {currentPage === 'profile' && <ClientProfilePage />}

        {currentPage === 'billing' && <ClientBillingPage />}

        {currentPage === 'pro' && <ProSubscriptionPage onClose={() => setCurrentPage('home')} />}

        {currentPage === 'affiliate' && <AffiliateDashboard />}

        {currentPage === 'documents' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {showRestorePrompt && savedData && (
              <div className="mb-6 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <RefreshCw className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Reprendre votre document en cours
                      </h3>
                      <p className="text-sm text-blue-700 mb-4">
                        Vous avez un formulaire en cours de remplissage. Souhaitez-vous reprendre là où vous vous êtes arrêté ?
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedTemplateId(savedData.templateId);
                            setShowTemplates(false);
                            setShowRestorePrompt(false);
                          }}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reprendre
                        </button>
                        <button
                          onClick={() => {
                            clearSavedData();
                            setShowRestorePrompt(false);
                          }}
                          className="bg-white text-gray-700 px-6 py-2 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Ignorer
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRestorePrompt(false)}
                    className="text-blue-400 hover:text-blue-600 ml-4"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mes Documents</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    logger.debug('Bouton "Signer un PDF" cliqué, state actuel:', showPDFSignatureEditor);
                    setShowPDFSignatureEditor(true);
                    logger.debug('State mis à jour à true');
                  }}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Signer un PDF</span>
                </button>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className={`flex items-center space-x-2 ${colors.primary} text-white px-4 py-2 rounded-lg transition-colors`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau document</span>
                </button>
              </div>
            </div>

            {showTemplates && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Choisir un modèle</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowTemplates(false);
                    setShowAIGenerator(true);
                  }}
                  className={`flex items-center space-x-2 ${colors.primary} text-white px-4 py-2 rounded-lg transition-colors`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Générer avec IA</span>
                </button>
                <button
                  onClick={() => {
                    setShowTemplates(false);
                    setSearchQuery('');
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Fermer
                </button>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Rechercher un modèle... (ex: contrat, lettre, facture)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>

            <div className="space-y-6">
              {['professional', 'personal'].map((category) => {
                const categoryTemplates = templates.filter(t => {
                  const matchesCategory = t.category === category;
                  const matchesSearch = searchQuery === '' ||
                    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
                  return matchesCategory && matchesSearch;
                });

                if (categoryTemplates.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {category === 'professional' ? 'Documents professionnels' :
                       'Documents personnels'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            logger.debug('Template clicked:', template.id, template.name);
                            setSelectedTemplateId(template.id);
                            setShowTemplates(false);
                            setSearchQuery('');
                          }}
                          className={`text-left p-4 border border-gray-200 rounded-lg ${colors.hoverBg} transition-colors`}
                        >
                          <div className="flex items-start space-x-3">
                            <FileText className={`w-5 h-5 ${colors.iconColor} mt-0.5 flex-shrink-0`} />
                            <div>
                              <span className="text-sm font-semibold text-gray-900">{template.name}</span>
                              {template.description && (
                                <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {templates.filter(t =>
                searchQuery === '' ||
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length === 0 && searchQuery !== '' && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Aucun modèle trouvé pour "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        )}

            <div className={`${theme === 'minimal' ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 mb-6 flex items-start space-x-3`}>
              <Shield className={`w-5 h-5 ${colors.iconColor} mt-0.5 flex-shrink-0`} />
              <div className={`text-sm ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-900'}`}>
                <strong>Protection des documents:</strong> Vos documents sont protégés contre la copie et les captures d'écran pour garantir leur sécurité.
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className={`inline-block w-8 h-8 border-4 ${theme === 'minimal' ? 'border-black' : 'border-blue-600'} border-t-transparent rounded-full animate-spin`}></div>
                <p className="mt-4 text-gray-600">Chargement de vos documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun document</h3>
                <p className="text-gray-600">Vous n'avez pas encore de documents générés.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <FileText className="w-10 h-10 text-blue-600" />
                      {getStatusBadge(doc.status)}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.document_type}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Créé le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    </p>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-gray-700">Prix:</span>
                        <span className="text-lg font-bold text-blue-600">{doc.price.toFixed(2)} $</span>
                      </div>

                      {doc.status === 'generated' && doc.pdf_url ? (
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Télécharger</span>
                        </button>
                      ) : doc.status === 'pending_payment' ? (
                        <button className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
                          Payer maintenant
                        </button>
                      ) : (
                        <button className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-semibold cursor-not-allowed">
                          Non disponible
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAIGenerator && (
              <AIDocumentGenerator
                onClose={() => setShowAIGenerator(false)}
                onSuccess={fetchDocuments}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
