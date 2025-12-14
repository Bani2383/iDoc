/**
 * Study Permit Letter of Intent Landing Page (FR-CA)
 * SEO-optimized conversion page for immigration documents
 */

import { FileText, CheckCircle, Shield, Clock } from 'lucide-react';

interface StudyPermitLetterLandingProps {
  onGetStarted: () => void;
}

export function StudyPermitLetterLanding({ onGetStarted }: StudyPermitLetterLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Lettre d'intention pour permis d'études au Canada
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Générez une lettre d'intention professionnelle et conforme aux standards IRCC en moins de 15 minutes
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Créer ma lettre maintenant
          </button>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi une lettre d'intention est cruciale ?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg">
            <FileText className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Document obligatoire</h3>
            <p className="text-gray-600">
              IRCC exige une lettre d'intention (Statement of Purpose) pour évaluer la crédibilité de votre demande de permis d'études
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <Shield className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Critère décisif</h3>
            <p className="text-gray-600">
              Une lettre mal structurée ou incohérente est l'une des principales causes de refus des demandes de permis d'études
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <Clock className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Complexe à rédiger</h3>
            <p className="text-gray-600">
              Équilibrer motivation, cohérence du parcours et preuves de retour demande une structure précise que peu maîtrisent
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          iD0c : La solution pour une lettre d'intention conforme
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Structure pré-validée</strong>
                  <p className="text-gray-600">Modèle conforme aux attentes d'IRCC avec tous les éléments requis</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Questions guidées</strong>
                  <p className="text-gray-600">Formulaire interactif pour collecter toutes les informations nécessaires</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Génération instantanée</strong>
                  <p className="text-gray-600">Votre lettre est prête en PDF en moins de 15 minutes</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Modifications illimitées</strong>
                  <p className="text-gray-600">Ajustez votre lettre avant le téléchargement final</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Inclus dans votre lettre :</h3>
            <ul className="space-y-3 text-gray-700">
              <li>✓ En-tête professionnel</li>
              <li>✓ Présentation du parcours académique</li>
              <li>✓ Motivation pour le programme choisi</li>
              <li>✓ Justification du choix du Canada</li>
              <li>✓ Projet professionnel après les études</li>
              <li>✓ Preuves de liens avec le pays d'origine</li>
              <li>✓ Engagement de retour</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">⚠ Conformité légale</h3>
          <p className="text-gray-700 mb-4">
            <strong>iD0c est une plateforme d'automatisation de documents</strong> et non un cabinet de consultation en immigration.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• Aucune relation consultant-client n'est établie</li>
            <li>• Aucune garantie d'approbation de votre demande par IRCC</li>
            <li>• Les modèles fournis sont basés sur les standards publics d'IRCC</li>
            <li>• Pour des cas complexes, consultez un avocat en immigration agréé</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
        <h2 className="text-3xl font-bold mb-6">
          Prêt à créer votre lettre d'intention ?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Rejoignez des milliers d'étudiants qui ont simplifié leur demande de permis d'études
        </p>
        <button
          onClick={onGetStarted}
          className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          Commencer maintenant - 1,99 CAD
        </button>
        <p className="mt-4 text-sm opacity-75">
          Paiement sécurisé • Génération instantanée • Satisfaction garantie
        </p>
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-gray-500 text-center">
          <p className="mb-2">
            <strong>Clause de non-responsabilité :</strong> iD0c fournit des outils de génération de documents et ne constitue pas un service de conseil juridique ou d'immigration.
          </p>
          <p>
            Droit applicable : Québec, Canada. Pour toute question juridique, consultez un professionnel qualifié.
          </p>
        </div>
      </section>
    </div>
  );
}
