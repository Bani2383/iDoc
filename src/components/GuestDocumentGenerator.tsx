import { useState, useEffect } from 'react';
import { X, ChevronRight, LogIn, Eye } from 'lucide-react';
import { supabase, DocumentTemplate } from '../lib/supabase';

interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'email' | 'tel' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
  description?: string;
}

interface GuestDocumentGeneratorProps {
  templateId: string;
  onClose: () => void;
  onLogin: () => void;
}

export function GuestDocumentGenerator({ templateId, onClose, onLogin }: GuestDocumentGeneratorProps) {
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const STORAGE_KEY = `guest_doc_${templateId}`;

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const { data, error } = await supabase
          .from('document_templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (error) throw error;
        setTemplate(data);

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const { formData: savedFormData, currentStep: savedStep } = JSON.parse(saved);
            setFormData(savedFormData || {});
            setCurrentStep(savedStep || 0);
          } catch (e) {
            console.error('Error restoring saved data:', e);
          }
        }
      } catch (error) {
        console.error('Error fetching template:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [templateId]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        formData,
        currentStep,
        timestamp: new Date().toISOString()
      }));
    }
  }, [formData, currentStep, STORAGE_KEY]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Chargement du modèle...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!template || !template.template_variables) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <p className="text-gray-600">Ce modèle n'est pas encore configuré pour le mode invité.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Validate and filter variables to ensure they have required fields
  const variables = ((template.template_variables as TemplateVariable[]) || []).filter(v =>
    v && v.name && v.label && v.type
  );

  // Safety check: if no valid variables, show error with debug info
  if (variables.length === 0) {
    console.error('Template variables issue:', {
      templateId,
      templateName: template.name,
      rawVariables: template.template_variables,
      variablesType: typeof template.template_variables,
      isArray: Array.isArray(template.template_variables),
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Ce modèle ne contient aucune variable valide pour le mode invité.</p>
            <p className="text-sm text-gray-500 mb-4">
              Template: {template.name}
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fermer et choisir un autre modèle
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalSteps = variables.length;
  const allowedSteps = Math.ceil(totalSteps * 0.5);
  const currentVariable = variables[currentStep];
  const isLastAllowedStep = currentStep >= allowedSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Safety check: if currentVariable is undefined (index out of bounds), reset to valid step
  if (!currentVariable) {
    if (currentStep > 0) {
      setCurrentStep(0);
    }
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < variables.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (value: string) => {
    if (currentVariable) {
      setFormData({
        ...formData,
        [currentVariable.name]: value
      });
    }
  };

  const generatePreview = () => {
    if (!template?.template_content) return 'Aucun aperçu disponible';

    let preview = template.template_content;
    Object.entries(formData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      preview = preview.replace(regex, value || `[${key}]`);
    });

    return preview;
  };

  const handleLoginWithSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      formData,
      currentStep,
      templateId,
      timestamp: new Date().toISOString()
    }));
    onLogin();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Étape {currentStep + 1} sur {totalSteps} • Aperçu gratuit ({allowedSteps} questions)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50"
              title="Afficher l'aperçu"
            >
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">Aperçu</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="w-full bg-gray-200 h-2">
          <div
            className="bg-blue-600 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          {showPreview && (
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Aperçu du document
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white p-4 rounded border border-gray-300 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {generatePreview()}
                </pre>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ Aperçu partiel - Connectez-vous pour voir le document complet
              </p>
            </div>
          )}
          {isLastAllowedStep && currentStep > 0 && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <LogIn className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Aperçu limité à 50%</h4>
                  <p className="text-sm text-blue-700">
                    Connectez-vous pour compléter toutes les questions et générer votre document final.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              {currentVariable.label}
              {currentVariable.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            {currentVariable.description && (
              <p className="text-sm text-gray-600 mb-4">{currentVariable.description}</p>
            )}
            {currentVariable.type === 'textarea' ? (
              <textarea
                value={formData[currentVariable.name] || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentVariable.placeholder || `Entrez ${currentVariable.label.toLowerCase()}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                disabled={isLastAllowedStep && currentStep > 0}
              />
            ) : currentVariable.type === 'select' ? (
              <select
                value={formData[currentVariable.name] || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLastAllowedStep && currentStep > 0}
              >
                <option value="">-- Sélectionnez une option --</option>
                {(currentVariable.options || []).map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={currentVariable.type}
                value={formData[currentVariable.name] || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentVariable.placeholder || `Entrez ${currentVariable.label.toLowerCase()}`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLastAllowedStep && currentStep > 0}
              />
            )}
          </div>

          {isLastAllowedStep && currentStep > 0 ? (
            <div className="space-y-3">
              <button
                onClick={handleLoginWithSave}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Se connecter pour continuer</span>
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Fermer l'aperçu
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Retour
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!formData[currentVariable.name] || isLastAllowedStep}
                className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>{currentStep === variables.length - 1 ? 'Terminer' : 'Suivant'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Vous avez complété {Math.min(currentStep + 1, allowedSteps)} sur {allowedSteps} questions gratuites
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
