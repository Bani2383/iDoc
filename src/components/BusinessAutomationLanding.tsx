/**
 * Business Document Automation Landing Page (FR-CA)
 * B2B positioning for Canadian SMEs
 */

import { Building2, Zap, TrendingUp, Users, FileText, CheckCircle } from 'lucide-react';

interface BusinessAutomationLandingProps {
  onGetStarted: () => void;
}

export function BusinessAutomationLanding({ onGetStarted }: BusinessAutomationLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Automatisez la génération de documents juridiques dans votre PME
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gagnez jusqu'à 18h par mois sur les tâches administratives répétitives et concentrez-vous sur la croissance de votre entreprise
          </p>
          <button
            onClick={onGetStarted}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Découvrir la solution
          </button>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Les défis des PME canadiennes
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg">
            <FileText className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Tâches chronophages</h3>
            <p className="text-gray-600">
              1h30 à 2h par document pour rédiger des contrats, lettres de recommandation ou attestations
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <AlertTriangle className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Risques d'erreurs</h3>
            <p className="text-gray-600">
              Copier-coller de modèles Word peut entraîner des incohérences et des non-conformités juridiques
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <TrendingUp className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Coûts élevés</h3>
            <p className="text-gray-600">
              75 à 160 CAD par document en coût horaire RH/juridique pour des tâches répétitives
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          iD0c : L'automatisation intelligente pour les PME
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Documents générés automatiquement :</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Contrats d'emploi</strong>
                  <p className="text-gray-600">Conformes au Code du travail du Québec, adaptés à chaque situation</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Lettres de recommandation</strong>
                  <p className="text-gray-600">Structure professionnelle pour vos anciens employés</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Attestations d'emploi</strong>
                  <p className="text-gray-600">Générées en 2 minutes avec toutes les informations requises</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <strong>Accords de confidentialité (NDA)</strong>
                  <p className="text-gray-600">Protégez vos informations sensibles avec vos partenaires</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-indigo-600">Comparaison des coûts</h3>
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Critère</th>
                  <th className="p-3">Manuel</th>
                  <th className="p-3 text-indigo-600">iD0c</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 font-medium">Temps/document</td>
                  <td className="p-3 text-red-600">1h30-2h</td>
                  <td className="p-3 text-green-600">10-15 min</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Coût/document</td>
                  <td className="p-3 text-red-600">75-160 CAD</td>
                  <td className="p-3 text-green-600">1,99-9,99 CAD</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Risque d'erreurs</td>
                  <td className="p-3 text-red-600">Élevé</td>
                  <td className="p-3 text-green-600">Faible</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">
          Retour sur investissement concret
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg text-center">
            <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-gray-900 mb-2">85%</h3>
            <p className="text-gray-600">Réduction du temps consacré aux documents RH</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg text-center">
            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-gray-900 mb-2">18h</h3>
            <p className="text-gray-600">Économisées par mois pour une PME embauchant 10 personnes</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg text-center">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-gray-900 mb-2">95%</h3>
            <p className="text-gray-600">Réduction des erreurs administratives</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-indigo-50 to-blue-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi les PME choisissent iD0c
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Aucune installation</h3>
            <p className="text-sm text-gray-600">Solution 100% web, accessible partout</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Mises à jour automatiques</h3>
            <p className="text-sm text-gray-600">Modèles conformes aux dernières lois</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Multi-utilisateurs</h3>
            <p className="text-sm text-gray-600">Toute l'équipe peut générer des documents</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">API disponible</h3>
            <p className="text-sm text-gray-600">Intégration avec vos systèmes internes</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg">
        <h2 className="text-3xl font-bold mb-6">
          Prêt à automatiser vos documents ?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Rejoignez les PME canadiennes qui ont simplifié leur gestion documentaire
        </p>
        <button
          onClick={onGetStarted}
          className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
        >
          Demander une démo
        </button>
        <p className="mt-4 text-sm opacity-75">
          Essai gratuit • Sans engagement • Support en français
        </p>
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-gray-500 text-center">
          <p className="mb-2">
            <strong>Note importante :</strong> iD0c est une plateforme d'automatisation documentaire, pas un cabinet d'avocats.
          </p>
          <p>
            Pour les documents à fort enjeu juridique, nous recommandons une validation par un professionnel qualifié. Droit applicable : Québec, Canada.
          </p>
        </div>
      </section>
    </div>
  );
}

// Fix missing import
import { AlertTriangle } from 'lucide-react';
