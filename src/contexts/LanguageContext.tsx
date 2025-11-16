import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { i18n, LanguageCode, SUPPORTED_LANGUAGES } from '../lib/i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string>) => string;
  languages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(i18n.getLanguage());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadInitialLanguage = async () => {
      await i18n.loadTranslations(language);
      setIsLoaded(true);
    };

    loadInitialLanguage();

    const unsubscribe = i18n.subscribe((newLang) => {
      setLanguageState(newLang);
    });

    return unsubscribe;
  }, [language]);

  const setLanguage = async (lang: LanguageCode) => {
    await i18n.loadTranslations(lang);
    i18n.setLanguage(lang);
  };

  const t = (key: string, params?: Record<string, string>) => {
    return i18n.t(key, params);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
