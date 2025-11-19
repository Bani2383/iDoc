import { useEffect, useState } from 'react';
import { FileText, Check, Clock, Download, Star, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useAnalytics } from '../hooks/useAnalytics';

interface SEOTemplatePageProps {
  templateCode: string;
  onCreateDocument: () => void;
}

interface TemplateData {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  estimated_time_minutes: number;
  seo_content: {
    introduction: string;
    purpose: string;
    who_can_use: string;
    when_to_use: string;
    examples: string[];
    sample_extract: string;
    faqs: Array<{ question: string; answer: string }>;
  };
}

export function SEOTemplatePage({ templateCode, onCreateDocument }: SEOTemplatePageProps) {
  const { t, language } = useLanguage();
  const { trackTemplateView } = useAnalytics();
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplate();
  }, [templateCode, language]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);

      const { data: templateData, error: templateError } = await supabase
        .from('document_templates')
        .select('*')
        .eq('code', templateCode)
        .single();

      if (templateError) throw templateError;

      const { data: translationData } = await supabase
        .from('template_translations')
        .select('*')
        .eq('template_id', templateData.id)
        .eq('language_code', language)
        .maybeSingle();

      const seoData = translationData?.meta_tags?.seo_content || templateData.metadata?.seo_content || {
        introduction: '',
        purpose: '',
        who_can_use: '',
        when_to_use: '',
        examples: [],
        sample_extract: '',
        faqs: []
      };

      setTemplate({
        id: templateData.id,
        title: translationData?.title || templateData.title,
        description: translationData?.description || templateData.description,
        price: templateData.price,
        category: templateData.category,
        estimated_time_minutes: templateData.estimated_time_minutes || 5,
        seo_content: seoData
      });

      trackTemplateView(templateData.id);
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStructuredData = () => {
    if (!template) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": template.title,
      "description": template.description,
      "image": `https://id0c.com/images/templates/${templateCode}.jpg`,
      "brand": {
        "@type": "Brand",
        "name": "iDoc"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://id0c.com/modele/${templateCode}`,
        "priceCurrency": "CAD",
        "price": template.price.toFixed(2),
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2025-12-31"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127"
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Modèle non trouvé</h1>
          <a href="/" className="text-blue-600 hover:text-blue-700">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Structured Data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="https://id0c.com" className="hover:text-blue-600">Accueil</a>
              <span>/</span>
              <a href={`https://id0c.com/categorie/${template.category}`} className="hover:text-blue-600">
                {template.category}
              </a>
              <span>/</span>
              <span className="text-gray-900">{template.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {template.title}
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {template.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5" />
                <span>{template.estimated_time_minutes} minutes</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
                <Download className="w-5 h-5" />
                <span>PDF instantané</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
                <Star className="w-5 h-5" />
                <span>4.8/5 (127 avis)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={onCreateDocument}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-2"
              >
                <span>Créer maintenant → {template.price.toFixed(2)} $</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Introduction */}
          {template.seo_content.introduction && (
            <section className="mb-12">
              <p className="text-lg text-gray-700 leading-relaxed">
                {template.seo_content.introduction}
              </p>
            </section>
          )}

          {/* Purpose */}
          {template.seo_content.purpose && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                À quoi sert ce document ?
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {template.seo_content.purpose}
              </div>
            </section>
          )}

          {/* Who Can Use */}
          {template.seo_content.who_can_use && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Qui peut l'utiliser ?
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {template.seo_content.who_can_use}
              </div>
            </section>
          )}

          {/* When to Use */}
          {template.seo_content.when_to_use && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quand l'utiliser ?
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {template.seo_content.when_to_use}
              </div>
            </section>
          )}

          {/* Examples */}
          {template.seo_content.examples && template.seo_content.examples.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Exemples concrets
              </h2>
              <div className="space-y-4">
                {template.seo_content.examples.map((example, index) => (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                    <div className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">{example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sample Extract */}
          {template.seo_content.sample_extract && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Modèle prêt à l'emploi
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
                  {template.seo_content.sample_extract}
                </pre>
              </div>
            </section>
          )}

          {/* CTA Middle */}
          <section className="my-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Créez votre document en 1 minute
            </h3>
            <p className="text-lg text-blue-100 mb-6">
              Remplissez quelques informations simples et téléchargez votre PDF instantanément
            </p>
            <button
              onClick={onCreateDocument}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105"
            >
              Générer maintenant → {template.price.toFixed(2)} $
            </button>
          </section>

          {/* FAQ */}
          {template.seo_content.faqs && template.seo_content.faqs.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Questions fréquentes
              </h2>
              <div className="space-y-6">
                {template.seo_content.faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à créer votre {template.title.toLowerCase()} ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Rejoignez des milliers d'utilisateurs satisfaits
            </p>
            <button
              onClick={onCreateDocument}
              className="bg-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Créer maintenant → {template.price.toFixed(2)} $
            </button>
          </section>
        </article>

        {/* Trust Section */}
        <section className="bg-gray-50 py-12 border-t">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                <p className="text-gray-600">Documents créés</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">4.8/5</div>
                <p className="text-gray-600">Note moyenne</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">30+</div>
                <p className="text-gray-600">Langues disponibles</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
