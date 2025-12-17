#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LOCALES_DIR = join(process.cwd(), 'src/locales');

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  pl: 'Polski',
  ru: 'Русский',
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
  fi: 'Suomi',
  cs: 'Čeština',
  ro: 'Română',
  hu: 'Magyar',
  el: 'Ελληνικά',
  he: 'עברית',
  ar: 'العربية',
  fa: 'فارسی',
  hi: 'हिन्दी',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  tr: 'Türkçe',
  uk: 'Українська'
};

function main() {
  console.log('\n🌍 MULTILINGUAL DEMO - iDoc Platform\n');
  console.log('═'.repeat(80));
  console.log('Displaying key translations across all supported languages');
  console.log('═'.repeat(80));

  const files = readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();

  const demoKeys = [
    'hero.title',
    'hero.subtitle',
    'common.search',
    'stats.documentsGenerated',
    'footer.copyright'
  ];

  files.forEach(filename => {
    const lang = filename.replace('.json', '');
    const filepath = join(LOCALES_DIR, filename);
    const content = readFileSync(filepath, 'utf-8');
    const translations = JSON.parse(content);

    const langName = LANGUAGE_NAMES[lang] || lang.toUpperCase();

    console.log(`\n▸ ${langName.padEnd(25)} [${lang}]`);
    console.log('─'.repeat(80));

    demoKeys.forEach(key => {
      const parts = key.split('.');
      let value: any = translations;

      for (const part of parts) {
        value = value?.[part];
      }

      if (value) {
        const shortKey = key.split('.').pop() || key;
        const displayValue = value.length > 60 ? value.substring(0, 57) + '...' : value;
        console.log(`  ${shortKey.padEnd(20)}: ${displayValue}`);
      }
    });
  });

  console.log('\n═'.repeat(80));
  console.log(`✨ Successfully displayed translations for ${files.length} languages\n`);
}

main();
