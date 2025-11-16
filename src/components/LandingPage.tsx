import { SignedDocumentShowcase } from './SignedDocumentShowcase';
import { StatsCounter } from './StatsCounter';
import { useStatsTracker } from '../hooks/useStatsTracker';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { t } = useLanguage();
  useStatsTracker();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight animate-fade-in-up">
            {t('hero.title').split('<br />').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed animate-fade-in-up-delay-1">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up-delay-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              {t('hero.ctaMain')}
            </button>
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 text-sm sm:text-base font-semibold rounded-xl hover:bg-gray-50 hover:scale-105 transition-all border-2 border-blue-600"
            >
              {t('hero.ctaAI')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
              {t('landing.feature1Title')}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('landing.feature1Desc')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
              {t('landing.feature2Title')}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('landing.feature2Desc')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
              {t('landing.feature3Title')}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('landing.feature3DescAlt')}
            </p>
          </div>
        </div>

        <section className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            {t('landing.howToTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{t('landing.step1Title')}</h3>
              <p className="text-sm text-gray-600">
                {t('landing.step1Desc')}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{t('landing.step2Title')}</h3>
              <p className="text-sm text-gray-600">
                {t('landing.step2DescAlt')}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{t('landing.step3Title')}</h3>
              <p className="text-sm text-gray-600">
                {t('landing.step3DescAlt')}
              </p>
            </div>
          </div>
        </section>
      </section>

      <StatsCounter />

      <SignedDocumentShowcase />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            {t('landing.templatesTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { title: t('landing.template1Title'), desc: t('landing.template1Desc') },
              { title: t('landing.template2Title'), desc: t('landing.template2Desc') },
              { title: t('landing.template3Title'), desc: t('landing.template3Desc') },
              { title: t('landing.template4Title'), desc: t('landing.template4Desc') },
              { title: t('landing.template5Title'), desc: t('landing.template5Desc') },
              { title: t('landing.template6Title'), desc: t('landing.template6Desc') }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 sm:p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100 group cursor-pointer">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            {t('landing.whyTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{t('landing.whyFeature0')}</h3>
              <p className="text-sm text-gray-600">{t('landing.whyFeature0Desc')}</p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{t('landing.whyFeature1')}</h3>
              <p className="text-sm text-gray-600">{t('landing.whyFeature1Desc')}</p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{t('landing.whyFeature2')}</h3>
              <p className="text-sm text-gray-600">{t('landing.whyFeature2Desc')}</p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{t('landing.whyFeature3')}</h3>
              <p className="text-sm text-gray-600">{t('landing.whyFeature3Desc')}</p>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
