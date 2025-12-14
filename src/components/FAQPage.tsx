import { VisualExperienceSection } from './VisualExperienceSection';
import { FAQSection } from './FAQSection';
import { useTheme } from '../contexts/ThemeContext';
import { MessageCircle, Mail } from 'lucide-react';

interface FAQPageProps {
  onGetStarted: () => void;
}

export function FAQPage({ onGetStarted }: FAQPageProps) {
  const { theme } = useTheme();
  const isMinimal = theme === 'minimal';

  return (
    <div className={isMinimal ? 'min-h-screen bg-white' : 'min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'}>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1
            className={isMinimal ? 'text-5xl sm:text-6xl font-light text-black mb-6 tracking-tight' : 'text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight'}
            style={isMinimal ? { fontFamily: 'serif' } : {}}
          >
            {isMinimal ? 'AIDE &\nQUESTIONS' : 'Aide & Questions Fréquentes'}
          </h1>
          <p
            className={isMinimal ? 'text-xs text-gray-700 max-w-2xl mx-auto leading-loose tracking-wide' : 'text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed'}
            style={isMinimal ? { fontFamily: 'serif' } : {}}
          >
            Trouvez des réponses à vos questions et découvrez comment iDoc peut vous aider à créer vos documents PDF en toute simplicité.
          </p>
        </div>
      </section>

      {/* Visual Experience Section - Démo interactive */}
      <VisualExperienceSection onTryNow={onGetStarted} />

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FAQSection />
      </section>

      {/* Contact Section */}
      <section className={`py-16 sm:py-24 ${isMinimal ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={isMinimal ? 'border-2 border-black p-8 sm:p-12 text-center' : 'bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-center shadow-xl'}>
            <MessageCircle className={`w-16 h-16 mx-auto mb-6 ${isMinimal ? 'text-black' : 'text-white opacity-90'}`} />
            <h2
              className={isMinimal ? 'text-3xl sm:text-4xl font-light mb-4 tracking-tight' : 'text-3xl sm:text-4xl font-bold mb-4 text-white'}
              style={isMinimal ? { fontFamily: 'serif' } : {}}
            >
              Vous avez d'autres questions ?
            </h2>
            <p
              className={isMinimal ? 'text-xs mb-8 max-w-2xl mx-auto tracking-wide leading-loose text-gray-700' : 'text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white'}
              style={isMinimal ? { fontFamily: 'serif' } : {}}
            >
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question supplémentaire sur la génération de documents PDF.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className={isMinimal ? 'px-8 py-4 bg-black text-white text-xs tracking-[0.2em] hover:bg-gray-800 transition-colors border border-black' : 'px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                {isMinimal ? 'ESSAYER MAINTENANT' : 'Essayer maintenant'}
              </button>
              <a
                href="mailto:support@id0c.com"
                className={isMinimal ? 'px-8 py-4 bg-white text-black text-xs tracking-[0.2em] hover:bg-gray-50 transition-colors border border-black flex items-center space-x-2' : 'px-8 py-4 bg-blue-800 text-white text-lg font-semibold rounded-xl hover:bg-blue-900 transition-all transform hover:scale-105 flex items-center space-x-2'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                <Mail className="w-5 h-5" />
                <span>{isMinimal ? 'NOUS CONTACTER' : 'Nous contacter'}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 ${isMinimal ? 'border-t border-black pt-12' : ''}`}>
            <div className={isMinimal ? 'text-center' : 'text-center bg-white rounded-xl p-6 shadow-md'}>
              <h3
                className={isMinimal ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                Guide d'utilisation
              </h3>
              <p
                className={isMinimal ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-sm text-gray-600'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                Consultez nos guides pas à pas pour créer vos documents
              </p>
            </div>
            <div className={isMinimal ? 'text-center' : 'text-center bg-white rounded-xl p-6 shadow-md'}>
              <h3
                className={isMinimal ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                Support technique
              </h3>
              <p
                className={isMinimal ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-sm text-gray-600'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                Assistance rapide pour résoudre vos problèmes
              </p>
            </div>
            <div className={isMinimal ? 'text-center' : 'text-center bg-white rounded-xl p-6 shadow-md'}>
              <h3
                className={isMinimal ? 'text-sm font-light text-black mb-2 tracking-tight' : 'text-lg font-bold text-gray-900 mb-2'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                Base de connaissances
              </h3>
              <p
                className={isMinimal ? 'text-xs text-gray-600 tracking-wide leading-loose' : 'text-sm text-gray-600'}
                style={isMinimal ? { fontFamily: 'serif' } : {}}
              >
                Articles et tutoriels détaillés sur nos fonctionnalités
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
