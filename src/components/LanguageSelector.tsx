import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage, LanguageCode } from '../contexts/LanguageContext';

export function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === language);

  const handleLanguageChange = async (langCode: string) => {
    await setLanguage(langCode as LanguageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLang?.flag} {currentLang?.name}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-2 grid grid-cols-1 gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors ${
                    language === lang.code
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </div>
                  {language === lang.code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
