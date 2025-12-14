import { useState } from 'react';
import { CheckoutPreview } from './CheckoutPreview';
import { useLanguage } from '../contexts/LanguageContext';

export function CheckoutDemo() {
  const { language, setLanguage } = useLanguage();
  const [showCheckout, setShowCheckout] = useState(false);

  const sampleDocumentHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h1 style="color: #1e293b; margin-bottom: 20px;">Lettre d'intention pour permis d'études</h1>

      <div style="margin-bottom: 30px;">
        <p><strong>De:</strong> Jean Dupont</p>
        <p><strong>À:</strong> Immigration, Réfugiés et Citoyenneté Canada</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-CA')}</p>
      </div>

      <div style="line-height: 1.8; color: #475569;">
        <p><strong>Objet: Demande de permis d'études pour le Canada</strong></p>

        <p>Madame, Monsieur,</p>

        <p>Je me permets de vous adresser cette lettre d'intention dans le cadre de ma demande
        de permis d'études pour poursuivre un programme de maîtrise en informatique à
        l'Université de Montréal, qui débutera en septembre 2025.</p>

        <p><strong>1. Parcours académique et professionnel</strong></p>
        <p>Titulaire d'un baccalauréat en génie logiciel obtenu avec distinction à l'Université
        de Paris, j'ai développé une solide expertise en développement d'applications et
        intelligence artificielle au cours des trois dernières années.</p>

        <p><strong>2. Projet d'études au Canada</strong></p>
        <p>Le programme de maîtrise en informatique de l'Université de Montréal est reconnu
        internationalement pour son excellence en recherche sur l'intelligence artificielle,
        domaine dans lequel je souhaite me spécialiser.</p>

        <p><strong>3. Situation financière</strong></p>
        <p>Je dispose des ressources financières nécessaires pour couvrir l'ensemble de mes
        frais de scolarité et de subsistance pendant toute la durée de mes études au Canada,
        comme attesté par les documents bancaires joints à ma demande.</p>

        <p><strong>4. Engagement de retour</strong></p>
        <p>À l'issue de mes études, je compte rentrer dans mon pays d'origine pour contribuer
        au développement du secteur technologique local en y appliquant les connaissances
        et compétences acquises au Canada.</p>

        <p style="margin-top: 30px;">Dans l'attente d'une réponse favorable, je vous prie
        d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.</p>

        <p style="margin-top: 40px;"><strong>Jean Dupont</strong></p>
      </div>
    </div>
  `;

  if (showCheckout) {
    return (
      <CheckoutPreview
        documentPreview={sampleDocumentHTML}
        price={24.99}
        onPayment={() => {
          alert(language === 'fr'
            ? 'Paiement simulé avec succès ! Dans un environnement réel, cette action déclencherait le processus de paiement Stripe.'
            : 'Payment simulated successfully! In a real environment, this would trigger the Stripe payment process.'
          );
        }}
        onEditData={() => {
          alert(language === 'fr'
            ? 'Retour à l\'édition des données...'
            : 'Returning to data editing...'
          );
          setShowCheckout(false);
        }}
        onBack={() => setShowCheckout(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                {language === 'fr'
                  ? 'Démonstration du Microcopy de Checkout'
                  : 'Checkout Microcopy Demo'}
              </h1>
              <p className="text-slate-600 text-lg">
                {language === 'fr'
                  ? 'Interface de paiement optimisée pour la conversion avec éléments de réassurance'
                  : 'Conversion-optimized payment interface with trust elements'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  language === 'fr'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">
                {language === 'fr' ? 'Fonctionnalités' : 'Features'}
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>
                    {language === 'fr'
                      ? 'Prévisualisation complète du document'
                      : 'Full document preview'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>
                    {language === 'fr'
                      ? 'Traductions FR/EN via système i18n'
                      : 'FR/EN translations via i18n system'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>
                    {language === 'fr'
                      ? 'Éléments de réassurance intégrés'
                      : 'Built-in trust elements'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>
                    {language === 'fr'
                      ? 'Mentions légales conformes'
                      : 'Compliant legal disclaimers'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-3">
                {language === 'fr' ? 'Éléments clés' : 'Key Elements'}
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>
                    {language === 'fr'
                      ? 'Badge de paiement sécurisé'
                      : 'Secure payment badge'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>
                    {language === 'fr'
                      ? 'Clause de non-garantie IRCC'
                      : 'IRCC no-guarantee clause'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>
                    {language === 'fr'
                      ? 'Section d\'aide contextuelle'
                      : 'Contextual help section'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>
                    {language === 'fr'
                      ? 'Bouton de modification des données'
                      : 'Edit data button'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-3">
              {language === 'fr' ? 'Textes utilisés (Microcopy)' : 'Used Copy (Microcopy)'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <code className="block bg-white px-3 py-2 rounded border border-slate-200 mb-2">
                  checkout.previewHeader
                </code>
                <code className="block bg-white px-3 py-2 rounded border border-slate-200 mb-2">
                  checkout.priceLabel
                </code>
                <code className="block bg-white px-3 py-2 rounded border border-slate-200 mb-2">
                  checkout.primaryButton
                </code>
                <code className="block bg-white px-3 py-2 rounded border border-slate-200">
                  checkout.secondaryButton
                </code>
              </div>
              <div>
                <code className="block bg-white px-3 py-2 rounded border border-slate-200 mb-2">
                  checkout.trustLine
                </code>
                <code className="block bg-white px-3 py-2 rounded border border-slate-200 mb-2">
                  checkout.legalLine
                </code>
                <code className="block bg-white px-3 py-2 rounded border border-slate-200 mb-2">
                  checkout.noGuaranteeLine
                </code>
                <code className="block bg-white px-3 py-2 rounded border border-slate-200">
                  checkout.helpTitle
                </code>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] font-semibold text-lg shadow-lg shadow-blue-500/30"
          >
            {language === 'fr'
              ? 'Voir la démo du checkout'
              : 'View checkout demo'}
          </button>

          <p className="text-center text-slate-500 text-sm mt-4">
            {language === 'fr'
              ? 'Changez de langue avec les boutons FR/EN ci-dessus pour voir les traductions'
              : 'Switch language with FR/EN buttons above to see translations'}
          </p>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-3">
            {language === 'fr' ? 'Documentation' : 'Documentation'}
          </h3>
          <p className="text-slate-600 text-sm mb-4">
            {language === 'fr'
              ? 'Pour plus d\'informations sur l\'implémentation et l\'utilisation du microcopy :'
              : 'For more information on microcopy implementation and usage:'}
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              → <code className="bg-slate-100 px-2 py-1 rounded text-xs">CHECKOUT_MICROCOPY_GUIDE.md</code>
            </li>
            <li>
              → <code className="bg-slate-100 px-2 py-1 rounded text-xs">src/components/CheckoutPreview.tsx</code>
            </li>
            <li>
              → <code className="bg-slate-100 px-2 py-1 rounded text-xs">src/locales/fr.json</code> /
              <code className="bg-slate-100 px-2 py-1 rounded text-xs ml-1">en.json</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
