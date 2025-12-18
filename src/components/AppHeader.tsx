/**
 * AppHeader Component
 *
 * @description Main navigation header with responsive design
 * @component
 */

import { useState, startTransition } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

type ViewType = 'landing' | 'conversion' | 'classic' | 'signature' | 'faq' | 'improved' | 'pdf-sign' | 'seo-demo' | 'articles' | 'article-detail' | 'generators' | 'generator-form' | 'credits' | 'subscriptions' | 'referrals' | 'affiliate' | 'revenue' | 'flash-deals' | 'gamification' | 'control-center' | 'ab-testing' | 'email-automation' | 'reporting' | 'study-permit-landing' | 'ircc-refusal-landing' | 'business-automation-landing' | 'terms' | 'privacy';

interface AppHeaderProps {
  /** Current view state */
  currentView: ViewType;
  /** Function to change current view */
  onViewChange: (view: ViewType) => void;
  /** Function to show authentication modal */
  onShowAuth: () => void;
}

/**
 * Renders the main application header with navigation
 *
 * @param {AppHeaderProps} props - Component props
 * @returns {JSX.Element} Header navigation UI
 */
export function AppHeader({ currentView, onViewChange, onShowAuth }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const handleViewChange = (view: ViewType) => {
    startTransition(() => onViewChange(view));
    setMobileMenuOpen(false);

    if (view === 'classic') {
      setTimeout(() => {
        document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navButtonClass = 'text-gray-700 hover:text-blue-600 transition-colors';

  return (
    <header
      className="border-b border-gray-200 bg-white sticky top-0 z-50"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => handleViewChange('landing')}
            className="flex items-center cursor-pointer"
            aria-label="Retour à l'accueil"
          >
            <span className="text-2xl font-bold text-gray-900">
              i<span className="text-blue-600">Doc</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navigation principale">
            <button
              onClick={() => handleViewChange('landing')}
              className={navButtonClass}
              aria-current={currentView === 'landing' ? 'page' : undefined}
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => handleViewChange('classic')}
              className={navButtonClass}
              aria-current={currentView === 'classic' ? 'page' : undefined}
            >
              {t('nav.documents')}
            </button>
            <button
              onClick={() => handleViewChange('signature')}
              className={navButtonClass}
              aria-current={currentView === 'signature' ? 'page' : undefined}
            >
              {t('nav.signature')}
            </button>
            <button
              onClick={() => handleViewChange('faq')}
              className={navButtonClass}
              aria-current={currentView === 'faq' ? 'page' : undefined}
            >
              {t('nav.faq')}
            </button>
            <button
              onClick={() => handleViewChange('articles')}
              className={navButtonClass}
              aria-current={currentView === 'articles' ? 'page' : undefined}
            >
              Blog
            </button>
            <button
              onClick={() => handleViewChange('generators')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === 'generators' || currentView === 'generator-form'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-current={currentView === 'generators' || currentView === 'generator-form' ? 'page' : undefined}
            >
              {t('nav.generators')}
            </button>
            <button
              onClick={onShowAuth}
              className={`${navButtonClass} flex items-center space-x-2`}
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span>{t('nav.login')}</span>
            </button>
            <LanguageSelector />
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-4 border-t border-gray-200"
            role="navigation"
            aria-label="Navigation mobile"
          >
            <nav className="flex flex-col space-y-3">
              <button
                onClick={() => handleViewChange('landing')}
                className={`${navButtonClass} py-2 text-left`}
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => handleViewChange('classic')}
                className={`${navButtonClass} py-2 text-left`}
              >
                {t('nav.documents')}
              </button>
              <button
                onClick={() => handleViewChange('signature')}
                className={`${navButtonClass} py-2 text-left`}
              >
                {t('nav.signature')}
              </button>
              <button
                onClick={() => handleViewChange('faq')}
                className={`${navButtonClass} py-2 text-left`}
              >
                {t('nav.faq')}
              </button>
              <button
                onClick={() => handleViewChange('articles')}
                className={`${navButtonClass} py-2 text-left`}
              >
                Blog
              </button>
              <button
                onClick={() => handleViewChange('generators')}
                className={`${navButtonClass} py-2 text-left`}
              >
                {t('nav.generators')}
              </button>
              <button
                onClick={() => {
                  onShowAuth();
                  setMobileMenuOpen(false);
                }}
                className={`${navButtonClass} py-2 flex items-center space-x-2`}
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>{t('nav.login')}</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
