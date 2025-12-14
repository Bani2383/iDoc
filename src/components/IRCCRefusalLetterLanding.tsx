/**
 * IRCC Refusal Explanation Letter Landing Page (FR-CA)
 * SEO-optimized conversion page for post-refusal immigration documents
 */

import { AlertTriangle, FileText, CheckCircle, Shield } from 'lucide-react';

interface IRCCRefusalLetterLandingProps {
  onGetStarted: () => void;
}

export function IRCCRefusalLetterLanding({ onGetStarted }: IRCCRefusalLetterLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Refus IRCC : Rédigez une lettre explicative solide
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Un refus n'est pas une fin en soi. Préparez une nouvelle demande convaincante avec une lettre explicative structurée
          </p>
          <button
            onClick={onGetStarted}
            className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
          >
            Créer ma lettre explicative
          </button>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi votre demande a été refusée ?
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-red-600">Documents manquants</h3>
            <p className="text-gray-600 text-sm">
              Pièces justificatives absentes ou incomplètes dans le dossier
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-red-600">Doute sur intentions</h3>
            <p className="text-gray-600 text-sm">
              L'agent n'est pas convaincu que vous quitterez le Canada
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-red-600">Preuves financières</h3>
            <p className="text-gray-600 text-sm">
              Ressources financières jugées insuffisantes pour le séjour
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-red-600">Incohérences</h3>
            <p className="text-gray-600 text-sm">
              Contradictions entre les documents ou déclarations
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Comment répondre efficacement aux motifs de refus
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Votre lettre explicative doit :</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Répondre point par point</strong>
                  <p className="text-gray-600">Adresser chaque motif de refus mentionné dans la lettre d'IRCC</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Apporter des preuves concrètes</strong>
                  <p className="text-gray-600">Documents officiels appuyant vos explications</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Rester factuelle et professionnelle</strong>
                  <p className="text-gray-600">Ton sobre, sans émotion ni revendication</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Démontrer les changements</strong>
                  <p className="text-gray-600">Nouveaux éléments ou corrections depuis le refus</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-red-600">Ce qu'iD0c génère pour vous :</h3>
            <ul className="space-y-3 text-gray-700">
              <li>✓ En-tête avec référence au refus</li>
              <li>✓ Introduction reconnaissant le refus</li>
              <li>✓ Réponse structurée à chaque motif</li>
              <li>✓ Sections pour joindre nouvelles preuves</li>
              <li>✓ Engagement de conformité</li>
              <li>✓ Conclusion professionnelle</li>
              <li>✓ Format PDF prêt à soumettre</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Comment ça fonctionne ?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Analysez votre refus</h3>
            <p className="text-gray-600">
              Lisez attentivement la lettre de refus d'IRCC pour identifier les motifs précis
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Remplissez le formulaire</h3>
            <p className="text-gray-600">
              Répondez aux questions guidées pour chaque motif de refus
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Téléchargez et soumettez</h3>
            <p className="text-gray-600">
              Recevez votre lettre en PDF, joignez vos preuves et soumettez à IRCC
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border-l-4 border-red-600 p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Conformité et limites
          </h3>
          <p className="text-gray-700 mb-4">
            <strong>iD0c facilite la rédaction de votre lettre explicative</strong>, mais ne garantit pas l'approbation de votre nouvelle demande.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• iD0c n'est pas un consultant en immigration réglementé (CRCIC)</li>
            <li>• Aucune garantie d'approbation par IRCC ne peut être fournie</li>
            <li>• Vous restez responsable de l'exactitude des informations fournies</li>
            <li>• Pour des cas complexes ou judiciaires, consultez un avocat spécialisé</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg">
        <h2 className="text-3xl font-bold mb-6">
          Ne laissez pas un refus vous arrêter
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Des milliers de demandes refusées sont acceptées après une lettre explicative bien structurée
        </p>
        <button
          onClick={onGetStarted}
          className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          Créer ma lettre explicative - 1,99 CAD
        </button>
        <p className="mt-4 text-sm opacity-75">
          Paiement sécurisé • Génération instantanée • Modifications illimitées
        </p>
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-gray-500 text-center">
          <p className="mb-2">
            <strong>Clause de non-responsabilité :</strong> iD0c est une plateforme d'automatisation documentaire. Nous ne sommes pas un cabinet de consultation en immigration.
          </p>
          <p>
            Droit applicable : Québec, Canada. Les décisions finales d'IRCC sont discrétionnaires et indépendantes des documents soumis.
          </p>
        </div>
      </section>
    </div>
  );
}
