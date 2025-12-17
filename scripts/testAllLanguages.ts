#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LOCALES_DIR = join(process.cwd(), 'src/locales');

interface TestResult {
  language: string;
  valid: boolean;
  keyCount: number;
  errors: string[];
}

const requiredKeys = [
  'common.search',
  'common.loading',
  'common.error',
  'nav.home',
  'nav.templates',
  'hero.title',
  'hero.subtitle',
  'stats.totalVisitors',
  'stats.documentsGenerated',
  'footer.copyright'
];

function testLanguageFile(filepath: string): TestResult {
  const language = filepath.split('/').pop()?.replace('.json', '') || 'unknown';
  const errors: string[] = [];
  let valid = true;
  let keyCount = 0;

  try {
    const content = readFileSync(filepath, 'utf-8');

    // Test 1: Valid JSON
    let translations: any;
    try {
      translations = JSON.parse(content);
    } catch (e) {
      errors.push('Invalid JSON format');
      valid = false;
      return { language, valid: false, keyCount: 0, errors };
    }

    // Test 2: Count keys
    function countKeys(obj: any, prefix = ''): number {
      let count = 0;
      for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          count += countKeys(obj[key], fullKey);
        } else {
          count++;
        }
      }
      return count;
    }
    keyCount = countKeys(translations);

    // Test 3: Check for required keys
    function hasKey(obj: any, path: string): boolean {
      const keys = path.split('.');
      let current = obj;
      for (const key of keys) {
        if (current[key] === undefined) {
          return false;
        }
        current = current[key];
      }
      return true;
    }

    const missingKeys = requiredKeys.filter(key => !hasKey(translations, key));
    if (missingKeys.length > 0) {
      errors.push(`Missing keys: ${missingKeys.join(', ')}`);
    }

    // Test 4: Check for empty values
    function checkEmptyValues(obj: any, prefix = ''): string[] {
      const empty: string[] = [];
      for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          empty.push(...checkEmptyValues(obj[key], fullKey));
        } else if (!obj[key] || obj[key].toString().trim() === '') {
          empty.push(fullKey);
        }
      }
      return empty;
    }

    const emptyValues = checkEmptyValues(translations);
    if (emptyValues.length > 0 && emptyValues.length < 10) {
      errors.push(`Empty values found: ${emptyValues.join(', ')}`);
    } else if (emptyValues.length >= 10) {
      errors.push(`${emptyValues.length} empty values found`);
    }

    if (errors.length > 0) {
      valid = false;
    }

  } catch (error) {
    errors.push(`Error reading file: ${error}`);
    valid = false;
  }

  return { language, valid, keyCount, errors };
}

function main() {
  console.log('🌍 Testing all language files...\n');

  const files = readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => join(LOCALES_DIR, f));

  const results: TestResult[] = files.map(testLanguageFile);

  const validCount = results.filter(r => r.valid).length;
  const totalCount = results.length;

  // Print results
  console.log('Language Test Results:');
  console.log('='.repeat(70));

  results.forEach(result => {
    const status = result.valid ? '✅' : '❌';
    console.log(`${status} ${result.language.padEnd(10)} | Keys: ${result.keyCount.toString().padStart(4)}`);

    if (result.errors.length > 0) {
      result.errors.forEach(error => {
        console.log(`   ⚠️  ${error}`);
      });
    }
  });

  console.log('='.repeat(70));
  console.log(`\n📊 Summary: ${validCount}/${totalCount} languages valid`);

  if (validCount === totalCount) {
    console.log('✅ All languages are valid!');
    process.exit(0);
  } else {
    console.log(`❌ ${totalCount - validCount} language(s) have issues`);
    process.exit(1);
  }
}

main();
