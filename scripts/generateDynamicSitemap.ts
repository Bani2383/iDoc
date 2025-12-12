// Dynamic sitemap generator for all content
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = 'https://idoc.com'; // À remplacer par votre domaine

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

async function generateSitemap() {
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];

  // Pages statiques principales
  urls.push(
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'daily', priority: 1.0 },
    { loc: `${SITE_URL}/templates`, lastmod: today, changefreq: 'daily', priority: 0.9 },
    { loc: `${SITE_URL}/pricing`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/blog`, lastmod: today, changefreq: 'daily', priority: 0.8 },
    { loc: `${SITE_URL}/faq`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/about`, lastmod: today, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/contact`, lastmod: today, changefreq: 'monthly', priority: 0.6 }
  );

  try {
    // Récupérer tous les templates actifs
    const { data: templates, error: templatesError } = await supabase
      .from('document_templates')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (templatesError) throw templatesError;

    // Ajouter chaque template au sitemap
    templates?.forEach(template => {
      urls.push({
        loc: `${SITE_URL}/template/${template.slug}`,
        lastmod: template.updated_at?.split('T')[0] || today,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    console.log(`✅ Added ${templates?.length || 0} templates to sitemap`);

    // Récupérer tous les articles publiés
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (articlesError) throw articlesError;

    // Ajouter chaque article au sitemap
    articles?.forEach(article => {
      urls.push({
        loc: `${SITE_URL}/blog/${article.slug}`,
        lastmod: article.updated_at?.split('T')[0] || today,
        changefreq: 'monthly',
        priority: 0.7
      });
    });

    console.log(`✅ Added ${articles?.length || 0} articles to sitemap`);

    // Catégories de templates
    const categories = ['professional', 'personal', 'academic', 'immigration', 'juridique'];
    categories.forEach(category => {
      urls.push({
        loc: `${SITE_URL}/category/${category}`,
        lastmod: today,
        changefreq: 'daily',
        priority: 0.8
      });
    });

    // Générer le XML
    const xml = generateSitemapXML(urls);

    console.log('\n📄 Sitemap généré avec succès!');
    console.log(`📊 Total URLs: ${urls.length}`);
    console.log(`\n${xml}\n`);

    return xml;
  } catch (error) {
    console.error('❌ Erreur génération sitemap:', error);
    throw error;
  }
}

function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlsXML = urls
    .map(
      url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
}

// Exécuter si appelé directement
if (require.main === module) {
  generateSitemap()
    .then(xml => {
      // Sauvegarder dans public/sitemap.xml
      const fs = require('fs');
      const path = require('path');
      const publicDir = path.join(__dirname, '../public');
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
      console.log('✅ Sitemap sauvegardé dans public/sitemap.xml');
    })
    .catch(error => {
      console.error('❌ Échec génération sitemap:', error);
      process.exit(1);
    });
}

export { generateSitemap };
