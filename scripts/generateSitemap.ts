/**
 * Script de génération de sitemap.xml dynamique
 * Usage: npx tsx scripts/generateSitemap.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = 'https://id0c.com';

interface Template {
  slug: string;
  name: string;
  name_en: string;
  category: string;
  updated_at: string;
}

async function generateSitemap() {
  console.log('🚀 Génération du sitemap.xml...\n');

  try {
    // Récupérer tous les templates publiés
    const { data: templates, error } = await supabase
      .from('document_templates')
      .select('slug, name, name_en, category, updated_at')
      .eq('review_status', 'published')
      .eq('is_active', true)
      .order('slug');

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    if (!templates || templates.length === 0) {
      throw new Error('Aucun template trouvé!');
    }

    console.log(`✓ ${templates.length} templates trouvés\n`);

    // Construire le sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Page d'accueil
    xml += generateUrl(SITE_URL, '1.0', 'daily', new Date().toISOString());

    // Pages principales
    const mainPages = [
      { path: '/ai', priority: '0.9' },
      { path: '/faq', priority: '0.8' },
      { path: '/signature', priority: '0.7' },
    ];

    mainPages.forEach(page => {
      xml += generateUrl(`${SITE_URL}${page.path}`, page.priority, 'weekly', new Date().toISOString());
    });

    // Pages catégories
    const categories = ['professional', 'personal', 'academic', 'immigration'];
    categories.forEach(cat => {
      xml += generateUrl(`${SITE_URL}/categorie/${cat}`, '0.9', 'daily', new Date().toISOString());
    });

    // Pages templates FR
    templates.forEach((template: Template) => {
      const updatedAt = template.updated_at || new Date().toISOString();
      xml += generateUrl(`${SITE_URL}/modele/${template.slug}`, '0.8', 'weekly', updatedAt);
    });

    // Pages templates EN
    templates.forEach((template: Template) => {
      const updatedAt = template.updated_at || new Date().toISOString();
      xml += generateUrl(`${SITE_URL}/model/${template.slug}`, '0.8', 'weekly', updatedAt);
    });

    // Pages Quick vocales
    templates.forEach((template: Template) => {
      const updatedAt = template.updated_at || new Date().toISOString();
      xml += generateUrl(`${SITE_URL}/quick/${template.slug}`, '0.7', 'monthly', updatedAt);
    });

    xml += '</urlset>';

    // Sauvegarder dans public/sitemap.xml
    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, xml, 'utf-8');

    console.log('✅ Sitemap généré avec succès!\n');
    console.log(`📁 Fichier: ${outputPath}`);

    // Stats
    const totalUrls = 1 + mainPages.length + categories.length + (templates.length * 3);
    console.log(`📊 Total URLs: ${totalUrls}`);
    console.log(`   - Pages principales: ${1 + mainPages.length}`);
    console.log(`   - Catégories: ${categories.length}`);
    console.log(`   - Templates FR: ${templates.length}`);
    console.log(`   - Templates EN: ${templates.length}`);
    console.log(`   - Pages Quick: ${templates.length}`);
    console.log('\n🌐 URLs à soumettre:');
    console.log('   - Google Search Console: https://search.google.com/search-console');
    console.log('   - Bing Webmaster: https://www.bing.com/webmasters');
    console.log(`\n📄 Sitemap URL: ${SITE_URL}/sitemap.xml\n`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

function generateUrl(
  loc: string,
  priority: string,
  changefreq: string,
  lastmod: string
): string {
  const date = new Date(lastmod).toISOString().split('T')[0];
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
}

// Exécution
generateSitemap();
