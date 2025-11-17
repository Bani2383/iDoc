import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, User, FileText, Download, MapPin, Edit3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SignaturePad } from './SignaturePad';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'date' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  prefillKey?: string;
}

interface WizardStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  fields: FormField[];
}

interface SmartFillStudioProps {
  templateId: string;
  templateName: string;
  onComplete: (data: Record<string, string>) => void;
  onCancel: () => void;
}

interface GeolocationData {
  city?: string;
  region?: string;
  country?: string;
  postal?: string;
}

const SmartFillStudio: React.FC<SmartFillStudioProps> = ({
  templateId,
  templateName,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [geolocation, setGeolocation] = useState<GeolocationData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [steps, setSteps] = useState<WizardStep[]>([]);
  const [templateContent, setTemplateContent] = useState<string>('');
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureMode, setSignatureMode] = useState<'electronic' | 'manual' | null>(null);
  const pdfPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTemplateData();
    fetchGeolocation();
  }, [templateId]);

  const loadTemplateData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('document_templates')
        .select('template_content, template_variables')
        .eq('id', templateId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Template not found');

      setTemplateContent(data.template_content || '');

      const fields = data.template_variables || [];
      const wizardSteps = createStepsFromFields(fields);
      setSteps(wizardSteps);
    } catch (err) {
      console.error('Error loading template:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createStepsFromFields = (fields: any[]): WizardStep[] => {
    if (!fields || fields.length === 0) {
      return [{
        id: 'default',
        title: 'Remplissez le document',
        subtitle: 'Informations requises',
        icon: FileText,
        fields: []
      }];
    }

    const formFields: FormField[] = fields.map((field: any) => ({
      id: field.key || field.id || `field_${Math.random()}`,
      label: field.label || field.name || 'Champ',
      type: (field.type === 'textarea' ? 'textarea' : field.type === 'date' ? 'date' : field.type === 'number' ? 'text' : field.type === 'select' ? 'select' : 'text') as any,
      placeholder: '',
      required: field.required ?? false,
      options: field.options
    }));

    const chunkSize = 5;
    const wizardSteps: WizardStep[] = [];

    for (let i = 0; i < formFields.length; i += chunkSize) {
      wizardSteps.push({
        id: `step_${i / chunkSize + 1}`,
        title: i === 0 ? 'Commençons' : `Étape ${i / chunkSize + 1}`,
        subtitle: `Informations requises (${i + 1}-${Math.min(i + chunkSize, formFields.length)})`,
        icon: i === 0 ? User : FileText,
        fields: formFields.slice(i, i + chunkSize)
      });
    }

    return wizardSteps;
  };

  useEffect(() => {
    if (Object.keys(geolocation).length > 0) {
      prefillFormData();
    }
  }, [geolocation]);

  useEffect(() => {
    if (focusedField && pdfPreviewRef.current) {
      const fieldElement = pdfPreviewRef.current.querySelector(`[data-field="${focusedField}"]`);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [focusedField]);

  const fetchGeolocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setGeolocation({
        city: data.city || '',
        region: data.region || '',
        country: data.country_name || '',
        postal: data.postal || ''
      });
    } catch (error) {
      console.error('Geolocation fetch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const prefillFormData = () => {
    const prefilled: Record<string, string> = {};
    steps.forEach(step => {
      step.fields.forEach(field => {
        if (field.prefillKey && geolocation[field.prefillKey as keyof GeolocationData]) {
          prefilled[field.id] = geolocation[field.prefillKey as keyof GeolocationData] || '';
        }
      });
    });
    setFormData(prev => ({ ...prev, ...prefilled }));
  };

  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return 'Ce champ est requis';
    }
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email invalide';
    }
    return null;
  };

  const validateStep = (): boolean => {
    const currentStepFields = steps[currentStep].fields;
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentStepFields.forEach(field => {
      const error = validateField(field, formData[field.id] || '');
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        if (!signatureMode) {
          return;
        }

        const finalData = { ...formData };
        if (signatureMode === 'electronic' && signatureData) {
          finalData['signature'] = signatureData;
        }
        onComplete(finalData);
      }
    }
  };

  const handleSignatureSave = (signature: string) => {
    setSignatureData(signature);
    setShowSignaturePad(false);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderPDFPreview = () => {
    const renderContent = () => {
      if (!templateContent) {
        return <p className="text-gray-500 italic">Chargement de l'aperçu...</p>;
      }

      let content = templateContent;
      Object.keys(formData).forEach((key) => {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        const value = formData[key] || '___________';
        content = content.replace(regex, value);
      });

      const lines = content.split('\n');
      return lines.map((line, index) => {
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return (
          <p key={index} className="mb-2 whitespace-pre-wrap">
            {line}
          </p>
        );
      });
    };

    return (
      <div className="bg-white shadow-2xl rounded-lg p-8 h-full overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="border-b-2 border-blue-600 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{templateName}</h1>
            <p className="text-sm text-gray-500 mt-2">Prévisualisation en temps réel</p>
          </div>

          <div className="space-y-2 text-gray-800 leading-relaxed font-serif">
            {renderContent()}
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <p className="text-sm text-gray-500 italic">
              Ce document sera généré en PDF une fois le formulaire complété.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Préparation de votre formulaire...</p>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const StepIcon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Retour
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <h2 className="text-xl font-bold text-gray-900">{templateName}</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-600">
              Étape {currentStep + 1} sur {steps.length}
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 p-8 overflow-auto">
            <div className="max-w-xl mx-auto">
              <div className="mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                  <StepIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{currentStepData.title}</h1>
                <p className="text-lg text-gray-600">{currentStepData.subtitle}</p>
              </div>

              {/* Signature Selection on Last Step */}
              {currentStep === steps.length - 1 && (
                <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl animate-slide-up">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    <span>Signature du document</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                      onClick={() => setSignatureMode('electronic')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        signatureMode === 'electronic'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center">
                        <Edit3 className={`w-8 h-8 mx-auto mb-2 ${
                          signatureMode === 'electronic' ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <p className="font-semibold text-gray-900 mb-1">Signature électronique</p>
                        <p className="text-xs text-gray-600">Signer directement dans le PDF</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setSignatureMode('manual')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        signatureMode === 'manual'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center">
                        <Download className={`w-8 h-8 mx-auto mb-2 ${
                          signatureMode === 'manual' ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <p className="font-semibold text-gray-900 mb-1">Signature manuelle</p>
                        <p className="text-xs text-gray-600">Imprimer et signer à la main</p>
                      </div>
                    </button>
                  </div>

                  {signatureMode === 'electronic' && (
                    <div className="mt-4">
                      {!signatureData ? (
                        <button
                          onClick={() => setShowSignaturePad(true)}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Créer ma signature électronique
                        </button>
                      ) : (
                        <div className="bg-white border-2 border-green-500 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-green-700">
                              ✓ Signature prête
                            </p>
                            <button
                              onClick={() => setShowSignaturePad(true)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Modifier
                            </button>
                          </div>
                          <img src={signatureData} alt="Signature" className="w-full h-auto max-h-24 object-contain" />
                        </div>
                      )}
                    </div>
                  )}

                  {signatureMode === 'manual' && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        ℹ️ Le document sera généré sans signature électronique. Vous pourrez l'imprimer et le signer manuellement.
                      </p>
                    </div>
                  )}

                  {!signatureMode && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700 font-semibold">
                        ⚠️ Veuillez choisir une option de signature
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-6">
                {currentStepData.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                      {field.prefillKey && geolocation[field.prefillKey as keyof GeolocationData] && (
                        <span className="ml-2 text-xs text-green-600 font-normal">
                          ✓ Pré-rempli
                        </span>
                      )}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        onFocus={() => setFocusedField(field.id)}
                        onBlur={() => setFocusedField(null)}
                        placeholder={field.placeholder}
                        rows={4}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                          errors[field.id]
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                        }`}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        onFocus={() => setFocusedField(field.id)}
                        onBlur={() => setFocusedField(null)}
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                          errors[field.id]
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                        } ${
                          formData[field.id] && !errors[field.id] ? 'border-green-500' : ''
                        }`}
                      />
                    )}
                    {errors[field.id] && (
                      <p className="mt-2 text-sm text-red-600 animate-shake">{errors[field.id]}</p>
                    )}
                    {formData[field.id] && !errors[field.id] && (
                      <p className="mt-2 text-sm text-green-600 flex items-center">
                        <Check className="w-4 h-4 mr-1" /> Validé
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                {currentStep > 0 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center space-x-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Précédent</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <span>{currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}</span>
                  {currentStep === steps.length - 1 ? (
                    <Download className="w-5 h-5" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="w-1/2 bg-gray-100 p-8 overflow-auto border-l-4 border-blue-500">
            <div ref={pdfPreviewRef}>
              {renderPDFPreview()}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out backwards;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>

      {/* Signature Pad Modal */}
      {showSignaturePad && (
        <SignaturePad
          onClose={() => setShowSignaturePad(false)}
          onSave={handleSignatureSave}
        />
      )}
    </div>
  );
};

export default SmartFillStudio;
