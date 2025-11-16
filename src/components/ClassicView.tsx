/**
 * ClassicView Component
 *
 * @description Classic document generation view with hero, features, and document list
 * @component
 */

import { FileText, Sparkles } from 'lucide-react';
import { Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { AllDocumentsList } from './AllDocumentsList';

interface ClassicViewProps {
  /** Handler for AI generator button */
  onShowAIGenerator: () => void;
  /** Handler for template selection */
  onTemplateSelect: (templateId: string) => void;
}

/**
 * Renders the classic document generation view
 *
 * @param {ClassicViewProps} props - Component props
 * @returns {JSX.Element} Classic view UI
 */
export function ClassicView({ onShowAIGenerator, onTemplateSelect }: ClassicViewProps) {
  const scrollToDocuments = () => {
    setTimeout(() => {
      document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Créez facilement tous vos documents !
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Des modèles de documents personnalisables pour tous vos besoins, avec l'assistance de l'IA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToDocuments}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-center"
                aria-label="Parcourir les modèles de documents"
              >
                Parcourir les modèles
              </button>
              <button
                onClick={onShowAIGenerator}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border-2 border-blue-600 flex items-center justify-center space-x-2"
                aria-label="Générer un document avec l'intelligence artificielle"
              >
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span>Générer avec l'IA</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto" role="region" aria-label="Statistiques">
            <div className="text-center">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" aria-hidden="true" />
              <div className="text-3xl font-bold text-gray-900">40+</div>
              <div className="text-gray-600">Modèles de documents</div>
            </div>
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-3" aria-hidden="true" />
              <div className="text-3xl font-bold text-gray-900">IA</div>
              <div className="text-gray-600">Génération intelligente</div>
            </div>
            <div className="text-center">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" aria-hidden="true" />
              <div className="text-3xl font-bold text-gray-900">Simple</div>
              <div className="text-gray-600">Et rapide</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Comment ça marche ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choisissez votre document</h3>
              <p className="text-gray-600">
                Parcourez notre bibliothèque de modèles ou demandez à l'IA de créer un nouveau document
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Répondez aux questions</h3>
              <p className="text-gray-600">
                Notre assistant vous guide étape par étape pour personnaliser votre document
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Téléchargez et utilisez</h3>
              <p className="text-gray-600">
                Obtenez votre document finalisé en format PDF ou Word, prêt à être utilisé
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section id="documents" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Nos modèles de documents
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Choisissez parmi notre sélection de documents professionnels
          </p>
          <Suspense fallback={<LoadingSpinner text="Chargement des documents..." />}>
            <AllDocumentsList onTemplateSelect={onTemplateSelect} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
