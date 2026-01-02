import React from 'react';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getSeoPageBySlug, getSeoPagesBySilo } from '../idoc/seo/slugs';
import SchemaMarkup from './SchemaMarkup';

interface SeoModelPageProps {
  slug: string;
}

export default function SeoModelPage({ slug }: SeoModelPageProps) {
  const page = getSeoPageBySlug(slug);

  if (!page) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold">Modèle introuvable</h1>
          <p className="mt-4 text-gray-600">Le modèle que vous recherchez n'existe pas.</p>
          <a
            href="/idoc"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Créer un document
            <ArrowRight size={18} />
          </a>
        </div>
      </main>
    );
  }

  const relatedPages = getSeoPagesBySilo(page.silo).filter(p => p.slug !== slug).slice(0, 3);
  const seedData = encodeURIComponent(JSON.stringify(page.docTypeSeed));

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.metaTitle,
    "description": page.metaDescription,
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": page.faq.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    }
  };

  return (
    <>
      <SchemaMarkup data={schema} />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-black">Accueil</a>
            <span className="mx-2">/</span>
            <a href="/idoc" className="hover:text-black">Modèles</a>
            <span className="mx-2">/</span>
            <span>{page.h1}</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {page.h1}
          </h1>

          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            {page.metaDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`/idoc?seed=${seedData}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium"
            >
              <FileText size={20} />
              Générer le document
              <ArrowRight size={18} />
            </a>

            <a
              href="/idoc"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-black transition-colors font-medium"
            >
              Autre situation
            </a>
          </div>

          <div className="mt-12 bg-white rounded-2xl border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-semibold mb-6">Pourquoi utiliser ce modèle ?</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Conforme et structuré</h3>
                  <p className="text-sm text-gray-600">Format professionnel adapté aux exigences des autorités d'immigration</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Gain de temps</h3>
                  <p className="text-sm text-gray-600">Générez votre lettre en quelques minutes au lieu de plusieurs heures</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Personnalisable</h3>
                  <p className="text-sm text-gray-600">Adaptez le contenu à votre situation spécifique</p>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Questions fréquentes</h2>

            <div className="space-y-4">
              {page.faq.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-3">{item.q}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {relatedPages.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Modèles similaires</h2>

              <div className="grid md:grid-cols-3 gap-4">
                {relatedPages.map((relatedPage) => (
                  <a
                    key={relatedPage.slug}
                    href={`/modele/${relatedPage.slug}`}
                    className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-black transition-colors group"
                  >
                    <FileText className="text-gray-400 group-hover:text-black transition-colors mb-3" size={32} />
                    <h3 className="font-semibold mb-2">{relatedPage.h1}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{relatedPage.metaDescription}</p>
                  </a>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-3">Avertissement important</h2>
            <p className="text-gray-700 leading-relaxed">
              Ce modèle est fourni à titre informatif uniquement et ne constitue pas un avis juridique.
              Vous soumettez votre demande sans représentation et demeurez seul responsable des informations
              et documents transmis aux autorités. L'utilisation de ce modèle ne garantit aucun résultat.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
