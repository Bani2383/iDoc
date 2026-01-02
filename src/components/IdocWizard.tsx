/**
 * IdocWizard - Ultra-simple guided template wizard
 *
 * @description New isolated component for guided document generation
 * Does NOT touch existing template system
 */

import { useState } from 'react';
import { FileText, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { RulesEngine, GuidedTemplateInputs, DocumentType, ValidationError } from '../lib/rulesEngine';

interface IdocWizardProps {
  onComplete?: (inputs: GuidedTemplateInputs) => void;
  onCancel?: () => void;
}

type WizardStep = 'intro' | 'document_type' | 'details' | 'preview';

export function IdocWizard({ onComplete, onCancel }: IdocWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('intro');
  const [freeText, setFreeText] = useState('');
  const [inputs, setInputs] = useState<Partial<GuidedTemplateInputs>>({
    variables: {
      nom_demandeur: '',
      ville: '',
      pays: '',
      date: new Date().toISOString().split('T')[0]
    }
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);

  /**
   * Handle free text interpretation
   */
  const handleFreeTextContinue = () => {
    const interpreted = RulesEngine.interpretFreeText(freeText);
    setInputs({ ...inputs, ...interpreted });
    setCurrentStep('document_type');
  };

  /**
   * Handle document type selection
   */
  const handleDocumentTypeSelect = (type: DocumentType) => {
    setInputs({ ...inputs, document_type: type });
    setCurrentStep('details');
  };

  /**
   * Validate and continue to preview
   */
  const handleContinueToPreview = () => {
    if (!inputs.document_type) return;

    const validationErrors = RulesEngine.validate(inputs as GuidedTemplateInputs);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setCurrentStep('preview');
  };

  /**
   * Complete wizard
   */
  const handleComplete = () => {
    if (onComplete && inputs.document_type) {
      onComplete(inputs as GuidedTemplateInputs);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Créer votre document d'immigration
          </h1>
          <p className="text-gray-600">
            Décrivez votre situation en quelques mots. Nous générons le bon document.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2">
            {['intro', 'document_type', 'details', 'preview'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === step
                      ? 'bg-blue-600 text-white'
                      : index < ['intro', 'document_type', 'details', 'preview'].indexOf(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < ['intro', 'document_type', 'details', 'preview'].indexOf(currentStep) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      index < ['intro', 'document_type', 'details', 'preview'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Step 1: Intro - Free Text */}
          {currentStep === 'intro' && (
            <div>
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  Quel est votre problème ou votre situation ?
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Par exemple: refus de visa visiteur, expliquer fonds insuffisants, lettre d'invitation visa, répondre à une lettre d'immigration, expliquer liens d'attache..."
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-4">
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Annuler
                  </button>
                )}
                <button
                  onClick={handleFreeTextContinue}
                  disabled={freeText.trim().length < 3}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Document Type Selection */}
          {currentStep === 'document_type' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Quel type de document souhaitez-vous créer ?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleDocumentTypeSelect('VISA_VISITEUR_UNIVERSEL')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-all"
                >
                  <FileText className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Visa Visiteur</h3>
                  <p className="text-sm text-gray-600">Lettre de motivation pour visa touristique</p>
                </button>

                <button
                  onClick={() => handleDocumentTypeSelect('INVITATION')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-all"
                >
                  <FileText className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Lettre d'Invitation</h3>
                  <p className="text-sm text-gray-600">Inviter quelqu'un à vous rendre visite</p>
                </button>

                <button
                  onClick={() => handleDocumentTypeSelect('REPONSE_LETTRE')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-all"
                >
                  <FileText className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Réponse à une Lettre</h3>
                  <p className="text-sm text-gray-600">Répondre à une demande de document</p>
                </button>

                <button
                  onClick={() => handleDocumentTypeSelect('IMMIGRATION_LETTRE')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-all"
                >
                  <FileText className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Lettre IRCC / CAQ</h3>
                  <p className="text-sm text-gray-600">Immigration Canada ou Québec</p>
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('intro')}
                  className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium flex items-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details Form (Simplified) */}
          {currentStep === 'details' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Informations personnelles
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={inputs.variables?.nom_demandeur || ''}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        variables: { ...inputs.variables!, nom_demandeur: e.target.value }
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={inputs.variables?.ville || ''}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          variables: { ...inputs.variables!, ville: e.target.value }
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pays *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={inputs.variables?.pays || ''}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          variables: { ...inputs.variables!, pays: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={inputs.variables?.date || ''}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        variables: { ...inputs.variables!, date: e.target.value }
                      })
                    }
                  />
                </div>
              </div>

              {/* Errors Display */}
              {errors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Erreurs de validation :</h3>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('document_type')}
                  className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium flex items-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour</span>
                </button>
                <button
                  onClick={handleContinueToPreview}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <span>Aperçu</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 'preview' && inputs.document_type && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Aperçu du document</h2>

              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Document prêt à être généré</h3>
                </div>

                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>Type :</strong> {inputs.document_type.replace(/_/g, ' ')}
                  </p>
                  <p>
                    <strong>Nom :</strong> {inputs.variables?.nom_demandeur}
                  </p>
                  <p>
                    <strong>Localisation :</strong> {inputs.variables?.ville}, {inputs.variables?.pays}
                  </p>
                  <p>
                    <strong>Date :</strong> {inputs.variables?.date}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Version gratuite :</strong> Téléchargement PDF
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Passez en Premium pour débloquer l'édition, les variantes et l'export DOCX
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('details')}
                  className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium flex items-center space-x-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour</span>
                </button>
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Télécharger PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Ce document est généré pour un demandeur non représenté. Consultez un professionnel pour
            des conseils juridiques.
          </p>
        </div>
      </div>
    </div>
  );
}
