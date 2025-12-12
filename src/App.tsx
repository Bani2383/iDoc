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
const UpsellModal = lazy(() => import('./components/UpsellModal'));

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
  const [currentView, setCurrentView] = useState<'landing' | 'conversion' | 'classic' | 'signature' | 'faq' | 'improved' | 'pdf-sign' | 'seo-demo' | 'articles' | 'article-detail' | 'credits' | 'subscriptions' | 'referrals' | 'affiliate' | 'revenue' | 'flash-deals' | 'gamification'>('improved');
  const [showPDFSignatureEditor, setShowPDFSignatureEditor] = useState(false);
  const [articleSlug, setArticleSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const { view, slug } = event.detail;
      if (view === 'articles') {
        setCurrentView('articles');
      } else if (view === 'article' && slug) {
        setArticleSlug(slug);
        setCurrentView('article-detail');
      } else if (view === 'improved') {
        setCurrentView('improved');
      }
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
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
        <GuestFlowDemo
          onBack={() => setShowFlowDemo(false)}
          onLogin={() => setShowAuthModal(true)}
        />
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
