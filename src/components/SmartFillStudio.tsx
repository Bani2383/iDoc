import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, User, FileText, Download, MapPin } from 'lucide-react';

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
  const pdfPreviewRef = useRef<HTMLDivElement>(null);

  const steps: WizardStep[] = [
    {
      id: 'personal',
      title: 'Commençons par vous',
      subtitle: 'Informations personnelles',
      icon: User,
      fields: [
        { id: 'firstName', label: 'Prénom', type: 'text', placeholder: 'Jean', required: true },
        { id: 'lastName', label: 'Nom', type: 'text', placeholder: 'Dupont', required: true },
        { id: 'email', label: 'Email', type: 'email', placeholder: 'jean.dupont@exemple.com', required: true }
      ]
    },
    {
      id: 'location',
      title: 'Où se trouve le bien?',
      subtitle: 'Adresse du logement',
      icon: MapPin,
      fields: [
        { id: 'street', label: 'Rue et numéro', type: 'text', placeholder: '123 rue Principale', required: true },
        { id: 'city', label: 'Ville', type: 'text', placeholder: 'Montréal', required: true, prefillKey: 'city' },
        { id: 'province', label: 'Province/État', type: 'text', placeholder: 'Québec', required: true, prefillKey: 'region' },
        { id: 'postal', label: 'Code postal', type: 'text', placeholder: 'H1A 1A1', required: true, prefillKey: 'postal' },
        { id: 'country', label: 'Pays', type: 'text', placeholder: 'Canada', required: true, prefillKey: 'country' }
      ]
    },
    {
      id: 'details',
      title: 'Détails du document',
      subtitle: 'Informations spécifiques',
      icon: FileText,
      fields: [
        { id: 'startDate', label: 'Date de début', type: 'date', required: true },
        { id: 'monthlyRent', label: 'Loyer mensuel', type: 'text', placeholder: '1500', required: false },
        { id: 'additionalInfo', label: 'Informations supplémentaires', type: 'textarea', placeholder: 'Détails additionnels...', required: false }
      ]
    }
  ];

  useEffect(() => {
    fetchGeolocation();
  }, []);

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
        onComplete(formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderPDFPreview = () => {
    return (
      <div className="bg-white shadow-2xl rounded-lg p-8 h-full overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="border-b-2 border-blue-600 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{templateName}</h1>
            <p className="text-sm text-gray-500 mt-2">Prévisualisation en temps réel</p>
          </div>

          <div className="space-y-6 text-gray-800 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-600">Parties du contrat</h2>
              <p>
                Entre les soussignés :<br />
                <span
                  data-field="firstName"
                  className={`inline-block min-w-[100px] border-b-2 ${
                    focusedField === 'firstName' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } transition-all duration-200 px-1`}
                >
                  {formData.firstName || '___________'}
                </span>
                {' '}
                <span
                  data-field="lastName"
                  className={`inline-block min-w-[100px] border-b-2 ${
                    focusedField === 'lastName' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } transition-all duration-200 px-1`}
                >
                  {formData.lastName || '___________'}
                </span>
                , ci-après dénommé "le Locataire"
              </p>
              <p className="mt-2">
                Adresse email: {' '}
                <span
                  data-field="email"
                  className={`inline-block min-w-[200px] border-b-2 ${
                    focusedField === 'email' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } transition-all duration-200 px-1`}
                >
                  {formData.email || '___________'}
                </span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-600">Adresse du bien loué</h2>
              <p>
                <span
                  data-field="street"
                  className={`inline-block min-w-[200px] border-b-2 ${
                    focusedField === 'street' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } transition-all duration-200 px-1`}
                >
                  {formData.street || '___________'}
                </span>
              </p>
              <p className="mt-2">
                <span
                  data-field="city"
                  className={`inline-block min-w-[120px] border-b-2 ${
                    focusedField === 'city' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } transition-all duration-200 px-1`}
                >
                  {formData.city || '___________'}
                </span>
                {', '}
                <span
                  data-field="province"
                  className={`inline-block min-w-[100px] border-b-2 ${
                    focusedField === 'province' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } transition-all duration-200 px-1`}
                >
                  {formData.province || '___________'}
                </span>
              </p>
              <p className="mt-2">
                <span
                  data-field="postal"
                  className={`inline-block min-w-[100px] border-b-2 ${
                    focusedField === 'postal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } transition-all duration-200 px-1`}
                >
                  {formData.postal || '___________'}
                </span>
                {', '}
                <span
                  data-field="country"
                  className={`inline-block min-w-[100px] border-b-2 ${
                    focusedField === 'country' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } transition-all duration-200 px-1`}
                >
                  {formData.country || '___________'}
                </span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-blue-600">Conditions du bail</h2>
              <p>
                Date de début: {' '}
                <span
                  data-field="startDate"
                  className={`inline-block min-w-[120px] border-b-2 ${
                    focusedField === 'startDate' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  } transition-all duration-200 px-1`}
                >
                  {formData.startDate || '___________'}
                </span>
              </p>
              {formData.monthlyRent && (
                <p className="mt-2">
                  Loyer mensuel: {' '}
                  <span
                    data-field="monthlyRent"
                    className={`inline-block min-w-[100px] border-b-2 ${
                      focusedField === 'monthlyRent' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    } transition-all duration-200 px-1 font-semibold`}
                  >
                    {formData.monthlyRent} $
                  </span>
                </p>
              )}
              {formData.additionalInfo && (
                <p className="mt-4">
                  <strong>Informations supplémentaires:</strong><br />
                  <span
                    data-field="additionalInfo"
                    className={`block mt-2 p-3 border-2 rounded ${
                      focusedField === 'additionalInfo' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    } transition-all duration-200`}
                  >
                    {formData.additionalInfo}
                  </span>
                </p>
              )}
            </section>

            <section className="mt-8 pt-6 border-t-2 border-gray-300">
              <p className="text-sm text-gray-500 italic">
                Ce document sera généré automatiquement une fois le formulaire complété.
              </p>
            </section>
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
    </div>
  );
};

export default SmartFillStudio;
