import React, { useState, useEffect, Suspense, lazy } from 'react';
import EnhancedSearchBar from './EnhancedSearchBar';
import SmartFillStudio from './SmartFillStudio';
import AnimatedTemplateShowcase from './AnimatedTemplateShowcase';
import TemplateCarousel from './TemplateCarousel';
import DynamicTemplateGrid from './DynamicTemplateGrid';
import TemplateStats from './TemplateStats';
import { Zap, Shield, Download, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { pdfGenerator } from '../lib/pdfGenerator';
import { useAuth } from '../contexts/AuthContext';

const FomoWidget = lazy(() => import('./FomoWidget'));
const DocVaultPromo = lazy(() => import('./DocVaultPromo'));

interface Template {
  id: string;
  name: string;
  category: string;
  popularity: number;
}

interface ImprovedHomepageProps {
  onLogin?: () => void;
  onSignPDF?: () => void;
}

const ImprovedHomepage: React.FC<ImprovedHomepageProps> = ({ onLogin, onSignPDF }) => {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showSmartFill, setShowSmartFill] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('id, name, category')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      const templatesWithPopularity = (data || []).map((template, index) => ({
        ...template,
        category: template.category || 'Général',
        popularity: Math.max(100 - index * 5, 20),
      }));

      setTemplates(templatesWithPopularity);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setTemplates([
        { id: '1', name: 'Contrat de Location', category: 'Immobilier', popularity: 95 },
        { id: '2', name: 'Lettre de Résiliation', category: 'Administratif', popularity: 87 },
        { id: '3', name: 'Bail Commercial', category: 'Immobilier', popularity: 73 },
        { id: '4', name: 'Contrat de Travail', category: 'RH', popularity: 68 },
        { id: '5', name: 'Procuration', category: 'Juridique', popularity: 62 },
      ]);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setShowSmartFill(true);
  };

  const handleSmartFillComplete = async (data: Record<string, string>) => {
    if (!selectedTemplate) {
      console.error('No template selected');
      return;
    }

    try {
      setGeneratingPDF(true);
      console.log('Starting PDF generation for template:', selectedTemplate.id);
      console.log('User authenticated:', !!user, user?.email);
      console.log('Form data:', data);

      const { data: templateData, error: templateError } = await supabase
        .from('document_templates')
        .select('template_content')
        .eq('id', selectedTemplate.id)
        .maybeSingle();

      if (templateError) {
        console.error('Template fetch error:', templateError);
        throw new Error(`Erreur de chargement du template: ${templateError.message}`);
      }

      if (!templateData) {
        throw new Error('Template introuvable');
      }

      console.log('Template loaded, generating content...');

      let content = templateData.template_content || '';
      Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        content = content.replace(regex, value);
      });

      console.log('Content prepared, generating PDF...');

      const pdfBlob = await pdfGenerator.generatePDF({
        title: selectedTemplate.name,
        content: content,
        fields: data,
        metadata: {
          author: user?.email || 'iDoc User',
          subject: selectedTemplate.name
        },
        signatureData: data.signature
      });

      console.log('PDF generated, size:', pdfBlob.size);

      if (user) {
        console.log('Saving document to database...');
        try {
          const { error: insertError } = await supabase.from('user_documents').insert({
            user_id: user.id,
            template_id: selectedTemplate.id,
            document_name: selectedTemplate.name,
            filled_data: data,
            status: 'completed'
          });

          if (insertError) {
            console.error('Database insert error:', insertError);
          } else {
            console.log('Document saved to database successfully');
          }
        } catch (dbError) {
          console.error('Error saving document to database:', dbError);
        }
      } else {
        console.warn('User not authenticated, document not saved to database');
      }

      console.log('Downloading PDF...');
      await pdfGenerator.downloadPDF(pdfBlob, `${selectedTemplate.name}-${Date.now()}`);

      setShowSmartFill(false);
      setSelectedTemplate(null);

      console.log('PDF generation completed successfully');
      alert('✅ Votre document a été généré avec succès!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`❌ Erreur lors de la génération du document: ${errorMessage}`);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleSmartFillCancel = () => {
    setShowSmartFill(false);
    setSelectedTemplate(null);
  };

  if (generatingPDF) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-12 text-center max-w-md">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Génération en cours...</h2>
          <p className="text-gray-600 mb-2">Création de votre document PDF</p>
          <p className="text-sm text-gray-500">Veuillez patienter quelques instants</p>
        </div>
      </div>
    );
  }

  if (showSmartFill && selectedTemplate) {
    return (
      <SmartFillStudio
        templateId={selectedTemplate.id}
        templateName={selectedTemplate.name}
        onComplete={handleSmartFillComplete}
        onCancel={handleSmartFillCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header role="banner" className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo simplifié */}
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-gray-900">i</span>
                <span className="text-blue-600">Doc</span>
              </span>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Navigation principale">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="Retour en haut"
              >
                Accueil
              </button>
              <button
                onClick={() => document.getElementById('documents-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="Voir les documents"
              >
                Documents
              </button>
              <button
                onClick={onSignPDF}
                className="text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="Signer un PDF"
              >
                Signer un PDF
              </button>
              <button
                onClick={onLogin}
                className="text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="FAQ et démo"
              >
                FAQ & Démo
              </button>
              <button
                onClick={onLogin}
                className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
                aria-label="Se connecter"
              >
                <span>Connexion</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                  mobileMenu.classList.toggle('hidden');
                }
              }}
              aria-label="Ouvrir le menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div id="mobile-menu" className="hidden md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="text-gray-700 hover:text-blue-600 py-2 text-left"
              >
                Accueil
              </button>
              <button
                onClick={() => {
                  document.getElementById('documents-section')?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="text-gray-700 hover:text-blue-600 py-2 text-left"
              >
                Documents
              </button>
              <button
                onClick={() => {
                  onSignPDF?.();
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="text-gray-700 hover:text-blue-600 py-2 text-left"
              >
                Signer un PDF
              </button>
              <button
                onClick={() => {
                  onLogin?.();
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="text-gray-700 hover:text-blue-600 py-2 text-left"
              >
                FAQ & Démo
              </button>
              <button
                onClick={() => {
                  onLogin?.();
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
                className="text-blue-600 font-semibold py-2 text-left"
              >
                Connexion
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main role="main">
        <section className="max-w-6xl mx-auto px-4 py-16 text-center" aria-labelledby="hero-title">
          <h1 id="hero-title" className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
            Vos documents légaux.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Instantanés. 1,99$.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Créez, remplissez et téléchargez vos documents professionnels en moins de 2 minutes.
            Sans inscription. Paiement sécurisé.
          </p>

          <div className="mb-8">
            {loadingTemplates ? (
              <div className="text-center text-gray-500">Chargement des templates...</div>
            ) : (
              <EnhancedSearchBar templates={templates} onSelectTemplate={handleTemplateSelect} />
            )}
          </div>

          <div className="flex items-center justify-center space-x-8 mb-16">
            <div className="flex items-center space-x-2 text-gray-700">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-semibold">12,450</span>
              <span className="text-sm">documents</span>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="flex items-center space-x-2 text-gray-700">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">👥</span>
              </div>
              <span className="font-semibold">2,340</span>
              <span className="text-sm">utilisateurs actifs</span>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="flex items-center space-x-2 text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Live</span>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            C'est aussi simple que 1-2-3
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Recherchez</h3>
                <p className="text-gray-600">
                  Trouvez le document dont vous avez besoin parmi plus de 50 modèles validés
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Remplissez</h3>
                <p className="text-gray-600">
                  Complétez le formulaire intelligent avec pré-remplissage automatique
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Téléchargez</h3>
                <p className="text-gray-600">
                  Payez 1,99$ et recevez votre PDF prêt à l'emploi instantanément
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Pourquoi choisir iDoc?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ultra-rapide</h3>
                <p className="text-gray-600">
                  Créez vos documents en moins de 2 minutes. Formulaire intelligent avec auto-complétion.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Sécurisé</h3>
                <p className="text-gray-600">
                  Paiement crypté par Stripe. Vos données sont protégées et jamais partagées.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <Download className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Téléchargement instantané</h3>
                <p className="text-gray-600">
                  PDF haute qualité disponible immédiatement. Copie par email automatique.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">
              Une solution pour chaque besoin
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all">
                <h3 className="text-2xl font-bold mb-4">iDoc Pro</h3>
                <p className="text-blue-100 mb-6">
                  Documents illimités, signature électronique, IA juridique RegulaSmart
                </p>
                <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all">
                  Découvrir iDoc Pro
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all">
                <h3 className="text-2xl font-bold mb-4">iDoc Connect (API)</h3>
                <p className="text-blue-100 mb-6">
                  Intégrez la génération de PDF dans vos applications via API RESTful
                </p>
                <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all">
                  Documentation API
                </button>
              </div>
            </div>
          </div>
        </section>

        <TemplateStats />

        <TemplateCarousel onSelectTemplate={handleTemplateSelect} />

        <DynamicTemplateGrid onSelectTemplate={handleTemplateSelect} />

        <AnimatedTemplateShowcase onSelectTemplate={handleTemplateSelect} />

        <Suspense fallback={<div className="h-40"></div>}>
          <DocVaultPromo />
        </Suspense>

        <section className="bg-gradient-to-br from-blue-600 to-indigo-600 py-20 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">
              Prêt à créer votre document?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez les milliers d'utilisateurs qui nous font confiance
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-12 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:shadow-2xl hover:scale-105 transition-all"
              aria-label="Commencer la création de document"
            >
              Commencer maintenant - 1,99$
            </button>
          </div>
        </section>
      </main>

      <footer role="contentinfo" className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">© 2025 iDoc. Tous droits réservés.</p>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <FomoWidget />
      </Suspense>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ImprovedHomepage;
