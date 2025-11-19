import { supabase } from './supabase';

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SEOGenerator {
  private baseUrl = 'https://id0c.com';

  async generateSitemap(): Promise<string> {
    const entries: SitemapEntry[] = [];

    entries.push({
      url: this.baseUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    });

    entries.push({
      url: `${this.baseUrl}/ai`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.9
    });

    const { data: templates } = await supabase
      .from('document_templates')
      .select('code, updated_at')
      .eq('is_public', true);

    if (templates) {
      for (const template of templates) {
        entries.push({
          url: `${this.baseUrl}/modele/${template.code}`,
          lastmod: template.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: 0.8
        });

        entries.push({
          url: `${this.baseUrl}/quick/${template.code}`,
          lastmod: template.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: 0.7
        });

        entries.push({
          url: `${this.baseUrl}/model/${template.code}`,
          lastmod: template.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: 0.8
        });
      }
    }

    const categories = [
      'cv-resume',
      'letters',
      'contracts',
      'attestations',
      'immigration',
      'business',
      'education',
      'personal'
    ];

    for (const category of categories) {
      entries.push({
        url: `${this.baseUrl}/categorie/${category}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 0.9
      });
    }

    return this.buildSitemapXML(entries);
  }

  private buildSitemapXML(entries: SitemapEntry[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const entry of entries) {
      xml += '  <url>\n';
      xml += `    <loc>${entry.url}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    xml += '</urlset>';
    return xml;
  }

  generateRobotsTxt(): string {
    return `# https://id0c.com/robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /api/private

# AI Crawlers
User-agent: GPTBot
Allow: /
Allow: /ai
Allow: /modele/
Allow: /model/
Allow: /quick/

User-agent: ChatGPT-User
Allow: /
Allow: /ai
Allow: /modele/
Allow: /model/
Allow: /quick/

User-agent: Google-Extended
Allow: /
Allow: /ai
Allow: /modele/
Allow: /model/
Allow: /quick/

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Googlebot
Allow: /
Crawl-delay: 1

# Sitemap
Sitemap: https://id0c.com/sitemap.xml
Sitemap: https://id0c.com/sitemap-fr.xml
Sitemap: https://id0c.com/sitemap-en.xml
`;
  }

  generateMetaTags(params: {
    title: string;
    description: string;
    url: string;
    image?: string;
    type?: string;
    locale?: string;
  }): string {
    const { title, description, url, image, type = 'website', locale = 'fr_CA' } = params;
    const imageUrl = image || `${this.baseUrl}/images/og-default.jpg`;

    return `
<!-- Primary Meta Tags -->
<title>${title} | iDoc</title>
<meta name="title" content="${title} | iDoc" />
<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${type}" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:locale" content="${locale}" />
<meta property="og:site_name" content="iDoc" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${url}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />

<!-- Additional Meta Tags -->
<meta name="robots" content="index, follow" />
<meta name="language" content="${locale.split('_')[0]}" />
<meta name="author" content="iDoc" />
`;
  }

  generateStructuredData(type: 'Organization' | 'Product' | 'WebSite', data: any): string {
    const schemas: Record<string, any> = {
      Organization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "iDoc",
        "url": "https://id0c.com",
        "logo": "https://id0c.com/logo.png",
        "description": "Plateforme mondiale de génération de documents personnalisés",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "support@id0c.com"
        },
        "sameAs": [
          "https://facebook.com/idoc",
          "https://twitter.com/idoc",
          "https://linkedin.com/company/idoc"
        ]
      },
      Product: {
        "@context": "https://schema.org",
        "@type": "Product",
        ...data
      },
      WebSite: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "iDoc",
        "url": "https://id0c.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://id0c.com/recherche?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    };

    return JSON.stringify(schemas[type] || schemas.Organization, null, 2);
  }

  async generateHreflangTags(templateCode: string, availableLanguages: string[]): Promise<string> {
    let tags = '';

    for (const lang of availableLanguages) {
      const locale = this.getLocale(lang);
      tags += `<link rel="alternate" hreflang="${lang}" href="https://id0c.com/${lang === 'en' ? 'model' : 'modele'}/${templateCode}?lang=${lang}" />\n`;
    }

    tags += `<link rel="alternate" hreflang="x-default" href="https://id0c.com/modele/${templateCode}" />\n`;

    return tags;
  }

  private getLocale(lang: string): string {
    const locales: Record<string, string> = {
      'fr': 'fr_CA',
      'en': 'en_US',
      'es': 'es_ES',
      'de': 'de_DE',
      'it': 'it_IT',
      'pt': 'pt_BR',
      'ar': 'ar_SA',
      'zh': 'zh_CN',
      'ja': 'ja_JP'
    };

    return locales[lang] || 'en_US';
  }
}

export const seoGenerator = new SEOGenerator();
