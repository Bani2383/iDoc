export const SUPPORTED_LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'he', name: 'עברית', flag: '🇮🇱', rtl: true },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', rtl: true },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export interface Translation {
  [key: string]: string | Translation;
}

class I18n {
  private currentLanguage: LanguageCode = 'fr';
  private translations: Map<LanguageCode, Translation> = new Map();
  private listeners: Set<(lang: LanguageCode) => void> = new Set();

  constructor() {
    const urlLang = this.getLanguageFromURL();
    const savedLang = localStorage.getItem('language') as LanguageCode;
    const browserLang = navigator.language.split('-')[0] as LanguageCode;

    const isURLSupported = urlLang && SUPPORTED_LANGUAGES.some(l => l.code === urlLang);
    const isSupported = SUPPORTED_LANGUAGES.some(l => l.code === savedLang);
    const isBrowserSupported = SUPPORTED_LANGUAGES.some(l => l.code === browserLang);

    if (isURLSupported) {
      this.currentLanguage = urlLang;
      localStorage.setItem('language', urlLang);
    } else if (savedLang && isSupported) {
      this.currentLanguage = savedLang;
    } else if (isBrowserSupported) {
      this.currentLanguage = browserLang;
    }
  }

  private getLanguageFromURL(): LanguageCode | null {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    return langParam as LanguageCode | null;
  }

  async loadTranslations(lang: LanguageCode): Promise<void> {
    if (this.translations.has(lang)) {
      return;
    }

    try {
      const module = await import(`../locales/${lang}.json`);
      this.translations.set(lang, module.default);
    } catch (error) {
      console.warn(`Failed to load translations for ${lang}`);
      const fallback = await import(`../locales/en.json`);
      this.translations.set(lang, fallback.default);
    }
  }

  setLanguage(lang: LanguageCode): void {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);

    const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    if (langConfig && 'rtl' in langConfig && langConfig.rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    document.documentElement.setAttribute('lang', lang);

    this.notifyListeners();
  }

  getLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  t(key: string, params?: Record<string, string>): string {
    const translations = this.translations.get(this.currentLanguage);
    if (!translations) {
      return key;
    }

    const keys = key.split('.');
    let value: Record<string, unknown> | string = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k] as Record<string, unknown> | string;
      } else {
        return key;
      }
    }

    let result = typeof value === 'string' ? value : key;

    if (params) {
      Object.entries(params).forEach(([param, val]) => {
        result = result.replace(`{{${param}}}`, val);
      });
    }

    return result;
  }

  subscribe(listener: (lang: LanguageCode) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }
}

export const i18n = new I18n();
