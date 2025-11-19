import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, CreditCard, FileText, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface GuestCheckoutFlowProps {
  templateId: string;
  templateTitle: string;
  templatePrice: number;
  fieldsSchema: any[];
  onComplete: (data: any) => void;
  onBack: () => void;
}

export function GuestCheckoutFlow({
  templateId,
  templateTitle,
  templatePrice,
  fieldsSchema,
  onComplete,
  onBack
}: GuestCheckoutFlowProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any, field: any): string | null => {
    if (field.required && !value) {
      return 'Ce champ est requis';
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Email invalide';
      }
    }

    if (field.type === 'phone' && value) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(value)) {
        return 'Téléphone invalide';
      }
    }

    return null;
  };

  const handleFieldChange = (name: string, value: any, field: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    const error = validateField(name, value, field);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmitForm = () => {
    const newErrors: Record<string, string> = {};

    fieldsSchema.forEach(field => {
      const value = formData[field.name];
      const error = validateField(field.name, value, field);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!email) {
      setErrors({ email: 'Email requis pour recevoir votre document' });
      return;
    }

    setStep('payment');
  };

  const handlePayment = () => {
    onComplete({
      email,
      formData,
      templateId
    });
    setStep('success');
  };

  const renderField = (field: any) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];

    const baseInputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
      error ? 'border-red-500' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value, field)}
            placeholder={field.placeholder}
            rows={4}
            className={baseInputClass}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value, field)}
            className={baseInputClass}
          >
            <option value="">Sélectionner...</option>
            {field.options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value, field)}
            className={baseInputClass}
          />
        );

      case 'checkbox':
        return (
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.name, e.target.checked, field)}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700">{field.label}</span>
          </label>
        );

      default:
        return (
          <input
            type={field.type || 'text'}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value, field)}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        );
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Document créé avec succès!
          </h2>

          <p className="text-gray-600 mb-6">
            Votre document a été envoyé à <strong>{email}</strong>
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Créez un compte pour:</strong>
            </p>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>✓ Sauvegarder tous vos documents</li>
              <li>✓ Accéder à l'historique</li>
              <li>✓ Modifier vos documents</li>
            </ul>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
          >
            Créer un compte
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full text-gray-600 hover:text-gray-800 font-medium"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => setStep('form')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h3>

              <div className="border-b pb-4 mb-4">
                <div className="flex items-start space-x-3 mb-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{templateTitle}</p>
                    <p className="text-sm text-gray-600">Document numérique (PDF)</p>
                  </div>
                  <p className="font-bold text-gray-900">{templatePrice.toFixed(2)} $</p>
                </div>
              </div>

              <div className="space-y-2 border-b pb-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-900">{templatePrice.toFixed(2)} $</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes (calculées)</span>
                  <span className="text-gray-900">0.00 $</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">{templatePrice.toFixed(2)} $</span>
              </div>

              <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
                <Zap className="w-4 h-4" />
                <span>Téléchargement instantané après paiement</span>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Paiement sécurisé</h3>

              <div className="space-y-4">
                {/* Apple Pay / Google Pay */}
                <div className="space-y-2">
                  <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                    <span> Pay</span>
                  </button>
                  <button className="w-full border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Google Pay
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">ou carte bancaire</span>
                  </div>
                </div>

                {/* Card Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Numéro de carte
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Expiration
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Payer {templatePrice.toFixed(2)} $</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Paiement sécurisé par Stripe. Vos données sont protégées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-600">Étape 1 sur 2</span>
            <span className="text-sm text-gray-600">Formulaire</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{templateTitle}</h2>
            <p className="text-gray-600">
              Remplissez les informations ci-dessous pour créer votre document
            </p>
          </div>

          <form className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Votre email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Votre document sera envoyé à cette adresse
              </p>
            </div>

            {/* Dynamic Fields */}
            {fieldsSchema.map((field) => (
              <div key={field.name}>
                {field.type !== 'checkbox' && (
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}

                {renderField(field)}

                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                )}

                {field.helpText && (
                  <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleSubmitForm}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continuer vers le paiement</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Zap className="w-4 h-4" />
            <span>Temps estimé: 2 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
