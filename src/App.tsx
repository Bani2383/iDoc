/**
 * App Component
 *
 * @description Main application component with routing and state management
 * @component
 */

import { useState, lazy, Suspense, startTransition, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { ConversionLandingPage } from './components/ConversionLandingPage';
import { LanguageSEO } from './components/LanguageSEO';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AppHeader } from './components/AppHeader';
import { ClassicView } from './components/ClassicView';
import DynamicFOMOSystem from './components/DynamicFOMOSystem';
import { usePageTracking } from './hooks/usePageTracking';
import { SupabaseDiagnostic } from './components/SupabaseDiagnostic';

// Lazy loaded components for better performance
const AIDocumentGenerator = lazy(() => import('./components/AIDocumentGenerator').then(m => ({ default: m.AIDocumentGenerator })));
const AuthModal = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const GuestDocumentGenerator = lazy(() => import('./components/GuestDocumentGenerator').then(m => ({ default: m.GuestDocumentGenerator })));
const ClientDashboard = lazy(() => import('./components/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const GuestFlowDemo = lazy(() => import('./components/GuestFlowDemo'));
const InitialSetup = lazy(() => import('./components/InitialSetup').then(m => ({ default: m.InitialSetup })));
const FAQPage = lazy(() => import('./components/FAQPage').then(m => ({ default: m.FAQPage })));
const SignatureFeaturePage = lazy(() => import('./components/SignatureFeaturePage').then(m => ({ default: m.SignatureFeaturePage })));
const ImprovedHomepage = lazy(() => import('./components/ImprovedHomepage'));
const PDFSignatureEditor = lazy(() => import('./components/PDFSignatureEditor').then(m => ({ default: m.PDFSignatureEditor })));
const SEODemoPage = lazy(() => import('./components/SEODemoPage').then(m => ({ default: m.SEODemoPage })));
const ArticlesList = lazy(() => import('./components/ArticlesList'));
const ArticleDetail = lazy(() => import('./components/ArticleDetail'));
const CreditsSystem = lazy(() => import('./components/CreditsSystem'));
const SubscriptionPlans = lazy(() => import('./components/SubscriptionPlans'));
const ReferralSystem = lazy(() => import('./components/ReferralSystem'));
const AffiliateDashboardEnhanced = lazy(() => import('./components/AffiliateDashboardEnhanced'));
const RevenueAnalyticsDashboard = lazy(() => import('./components/RevenueAnalyticsDashboard'));
const FlashDealsWidget = lazy(() => import('./components/FlashDealsWidget'));
const GamificationWidget = lazy(() => import('./components/GamificationWidget'));
const CommercialChatbot = lazy(() => import('./components/CommercialChatbot'));
const LiveFOMONotifications = lazy(() => import('./components/LiveFOMONotifications'));
const ExitIntentOffer = lazy(() => import('./components/ExitIntentOffer'));
const TrafficControlCenter = lazy(() => import('./components/TrafficControlCenter'));
const ABTestingSystem = lazy(() => import('./components/ABTestingSystem'));
const EmailAutomation = lazy(() => import('./components/EmailAutomation'));
const AutomatedReporting = lazy(() => import('./components/AutomatedReporting'));
const StudyPermitLetterLanding = lazy(() => import('./components/StudyPermitLetterLanding').then(m => ({ default: m.StudyPermitLetterLanding })));
const IRCCRefusalLetterLanding = lazy(() => import('./components/IRCCRefusalLetterLanding').then(m => ({ default: m.IRCCRefusalLetterLanding })));
const BusinessAutomationLanding = lazy(() => import('./components/BusinessAutomationLanding').then(m => ({ default: m.BusinessAutomationLanding })));
const TermsOfSale = lazy(() => import('./components/LegalPages').then(m => ({ default: m.TermsOfSale })));
const PrivacyPolicy = lazy(() => import('./components/LegalPages').then(m => ({ default: m.PrivacyPolicy })));
const GeneratorBrowser = lazy(() => import('./components/GeneratorBrowser').then(m => ({ default: m.GeneratorBrowser })));
const GeneratorForm = lazy(() => import('./components/GeneratorForm').then(m => ({ default: m.GeneratorForm })));
const GuidedTemplateFlow = lazy(() => import('./components/GuidedTemplateFlow').then(m => ({ default: m.GuidedTemplateFlow })));
const IdocWizard = lazy(() => import('./components/IdocWizard').then(m => ({ default: m.IdocWizard })));
const SeoModelPage = lazy(() => import('./components/SeoModelPage'));

/**
 * Main application component
 *
 * @returns {JSX.Element} Application UI
 */
function App() {
  const { user, profile, loading } = useAuth();
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGuestGenerator, setShowGuestGenerator] = useState(false);
  const [showFlowDemo, setShowFlowDemo] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'conversion' | 'classic' | 'signature' | 'faq' | 'improved' | 'pdf-sign' | 'seo-demo' | 'articles' | 'article-detail' | 'credits' | 'subscriptions' | 'referrals' | 'affiliate' | 'revenue' | 'flash-deals' | 'gamification' | 'control-center' | 'ab-testing' | 'email-automation' | 'reporting' | 'study-permit-landing' | 'ircc-refusal-landing' | 'business-automation-landing' | 'terms' | 'privacy' | 'generators' | 'generator-form' | 'guided-templates' | 'idoc-wizard' | 'seo-model'>('improved');
  const [showPDFSignatureEditor, setShowPDFSignatureEditor] = useState(false);
  const [articleSlug, setArticleSlug] = useState<string | null>(null);
  const [selectedGeneratorId, setSelectedGeneratorId] = useState<string | null>(null);
  const [seoModelSlug, setSeoModelSlug] = useState<string | null>(null);

  usePageTracking(currentView, {
    enabled: true,
    trackAnonymous: true,
    metadata: {
      userRole: profile?.role || 'guest',
      isAuthenticated: !!user
    }
  });

  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const { view, slug } = event.detail;
      if (view === 'articles') {
        setCurrentView('articles');
      } else if (view === 'article' && slug) {
        setArticleSlug(slug);
        setCurrentView('article-detail');
      } else if (view === 'seo-model' && slug) {
        setSeoModelSlug(slug);
        setCurrentView('seo-model');
      } else if (view === 'improved') {
        setCurrentView('improved');
      } else if (view === 'subscriptions') {
        setCurrentView('subscriptions');
      } else if (view === 'faq') {
        setCurrentView('faq');
      } else if (view === 'generators') {
        setCurrentView('generators');
      } else if (view === 'guided-templates') {
        setCurrentView('guided-templates');
      }
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/modele/')) {
      const slug = path.replace('/modele/', '');
      setSeoModelSlug(slug);
      setCurrentView('seo-model');
    }
  }, []);

  /**
   * Handles template selection for guest users
   * @param {string} templateId - Selected template ID
   */
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowGuestGenerator(true);
  };

  /**
   * Handles guest login transition
   */
  const handleGuestLogin = () => {
    setShowGuestGenerator(false);
    setShowAuthModal(true);
  };

  /**
   * Handles navigation to documents section
   */
  const handleGetStarted = () => {
    startTransition(() => setCurrentView('classic'));
    setTimeout(() => {
      document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSignatureStart = () => {
    setShowPDFSignatureEditor(true);
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner text="Chargement de l'application..." />;
  }

  // Authenticated user view
  if (user && profile) {
    if (profile.role === 'admin') {
      return (
        <Suspense fallback={<LoadingSpinner text="Chargement du panneau admin..." />}>
          <AdminDashboard />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<LoadingSpinner text="Chargement de votre espace..." />}>
        <ClientDashboard />
      </Suspense>
    );
  }

  // Guest user flow - Show guest document generator
  if (showGuestGenerator && selectedTemplateId) {
    return (
      <Suspense fallback={<LoadingSpinner text="Chargement du générateur..." />}>
        <GuestDocumentGenerator
          templateId={selectedTemplateId}
          onClose={() => {
            setShowGuestGenerator(false);
            setSelectedTemplateId(null);
          }}
          onLogin={handleGuestLogin}
        />
      </Suspense>
    );
  }

  // Guest user flow - Show flow demo
  if (showFlowDemo) {
    return (
      <Suspense fallback={<LoadingSpinner text="Chargement de la démo..." />}>
        <GuestFlowDemo />
      </Suspense>
    );
  }

  // Guest user flow - Show AI generator
  if (showAIGenerator) {
    return (
      <Suspense fallback={<LoadingSpinner text="Chargement du générateur IA..." />}>
        <AIDocumentGenerator onClose={() => setShowAIGenerator(false)} />
      </Suspense>
    );
  }

  // PDF Signature Editor
  if (showPDFSignatureEditor) {
    return (
      <Suspense fallback={<LoadingSpinner text="Chargement de l'éditeur de signature..." />}>
        <PDFSignatureEditor
          onClose={() => setShowPDFSignatureEditor(false)}
        />
      </Suspense>
    );
  }

  // Main application layout for guest users
  return (
    <div className="min-h-screen bg-white">
      <SupabaseDiagnostic />
      <LanguageSEO />

      <Suspense fallback={<LoadingSpinner text="Initialisation..." />}>
        <InitialSetup />
      </Suspense>

      <AppHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        onShowAuth={() => setShowAuthModal(true)}
      />

      <main role="main">
        {currentView === 'credits' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <CreditsSystem />
          </Suspense>
        ) : currentView === 'subscriptions' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <SubscriptionPlans />
          </Suspense>
        ) : currentView === 'referrals' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <ReferralSystem />
          </Suspense>
        ) : currentView === 'affiliate' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <AffiliateDashboardEnhanced />
          </Suspense>
        ) : currentView === 'revenue' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <RevenueAnalyticsDashboard />
          </Suspense>
        ) : currentView === 'flash-deals' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <FlashDealsWidget />
          </Suspense>
        ) : currentView === 'gamification' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <GamificationWidget />
          </Suspense>
        ) : currentView === 'control-center' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <TrafficControlCenter />
          </Suspense>
        ) : currentView === 'ab-testing' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <ABTestingSystem />
          </Suspense>
        ) : currentView === 'email-automation' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <EmailAutomation />
          </Suspense>
        ) : currentView === 'reporting' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <AutomatedReporting />
          </Suspense>
        ) : currentView === 'articles' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement des articles..." />}>
            <ArticlesList />
          </Suspense>
        ) : currentView === 'article-detail' && articleSlug ? (
          <Suspense fallback={<LoadingSpinner text="Chargement de l'article..." />}>
            <ArticleDetail slug={articleSlug} />
          </Suspense>
        ) : currentView === 'seo-demo' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement de la démo SEO..." />}>
            <SEODemoPage />
          </Suspense>
        ) : currentView === 'improved' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement de la nouvelle interface..." />}>
            <ImprovedHomepage
              onLogin={() => setShowAuthModal(true)}
              onSignPDF={() => setShowPDFSignatureEditor(true)}
            />
          </Suspense>
        ) : currentView === 'conversion' ? (
          <ConversionLandingPage onTemplateSelect={handleTemplateSelect} />
        ) : currentView === 'landing' ? (
          <LandingPage onGetStarted={handleGetStarted} />
        ) : currentView === 'signature' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <SignatureFeaturePage onGetStarted={handleSignatureStart} />
          </Suspense>
        ) : currentView === 'faq' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <FAQPage onGetStarted={handleGetStarted} />
          </Suspense>
        ) : currentView === 'study-permit-landing' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <StudyPermitLetterLanding onGetStarted={() => setShowGuestGenerator(true)} />
          </Suspense>
        ) : currentView === 'ircc-refusal-landing' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <IRCCRefusalLetterLanding onGetStarted={() => setShowGuestGenerator(true)} />
          </Suspense>
        ) : currentView === 'business-automation-landing' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <BusinessAutomationLanding onGetStarted={() => setShowAuthModal(true)} />
          </Suspense>
        ) : currentView === 'terms' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <TermsOfSale />
          </Suspense>
        ) : currentView === 'privacy' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement..." />}>
            <PrivacyPolicy />
          </Suspense>
        ) : currentView === 'generators' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement des générateurs..." />}>
            <GeneratorBrowser
              onSelectGenerator={(generatorId) => {
                setSelectedGeneratorId(generatorId);
                setCurrentView('generator-form');
              }}
            />
          </Suspense>
        ) : currentView === 'generator-form' && selectedGeneratorId ? (
          <Suspense fallback={<LoadingSpinner text="Chargement du formulaire..." />}>
            <GeneratorForm
              generatorId={selectedGeneratorId}
              onBack={() => {
                setSelectedGeneratorId(null);
                setCurrentView('generators');
              }}
            />
          </Suspense>
        ) : currentView === 'guided-templates' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement des modèles guidés..." />}>
            <GuidedTemplateFlow
              onClose={() => setCurrentView('improved')}
            />
          </Suspense>
        ) : currentView === 'idoc-wizard' ? (
          <Suspense fallback={<LoadingSpinner text="Chargement du générateur iDoc..." />}>
            <IdocWizard
              onComplete={(inputs) => {
                console.log('iDoc wizard completed:', inputs);
                setCurrentView('improved');
              }}
              onCancel={() => setCurrentView('improved')}
            />
          </Suspense>
        ) : currentView === 'seo-model' && seoModelSlug ? (
          <Suspense fallback={<LoadingSpinner text="Chargement du modèle..." />}>
            <SeoModelPage slug={seoModelSlug} />
          </Suspense>
        ) : (
          <ClassicView
            onShowAIGenerator={() => setShowAIGenerator(true)}
            onTemplateSelect={handleTemplateSelect}
          />
        )}
      </main>

      {showAuthModal && (
        <Suspense fallback={null}>
          <AuthModal onClose={() => setShowAuthModal(false)} />
        </Suspense>
      )}

      <DynamicFOMOSystem />

      <Suspense fallback={null}>
        <LiveFOMONotifications />
      </Suspense>

      <Suspense fallback={null}>
        <CommercialChatbot />
      </Suspense>

      <Suspense fallback={null}>
        <ExitIntentOffer onClaim={(code) => alert(`Code promo ${code} appliqué !`)} />
      </Suspense>
    </div>
  );
}

export default App;
