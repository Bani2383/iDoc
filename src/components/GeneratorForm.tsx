import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, FileText, Eye, CreditCard, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { pdfGenerator } from '../lib/pdfGenerator';

interface Field {
  id: string;
  field_key: string;
  field_order: number;
  label: string;
  field_type: string;
  is_required: boolean;
  placeholder: string | null;
  options: string[] | null;
}

interface Step {
  id: string;
  step_id: string;
  step_order: number;
  title: string;
  fields: Field[];
}

interface Generator {
  id: string;
  title: string;
  disclaimer: string;
  price: string;
  currency: string;
  pre_payment_notice: string;
  checkout_disclaimer: string;
}

interface GeneratorFormProps {
  generatorId: string;
  onBack: () => void;
}

export function GeneratorForm({ generatorId, onBack }: GeneratorFormProps) {
  const [generator, setGenerator] = useState<Generator | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchGeneratorData();
  }, [generatorId]);

  const fetchGeneratorData = async () => {
    try {
      const { data: genData, error: genError } = await supabase
        .from('document_generators')
        .select('*')
        .eq('id', generatorId)
        .single();

      if (genError) throw genError;
      setGenerator(genData);

      const { data: stepsData, error: stepsError } = await supabase
        .from('generator_steps')
        .select(`
          id,
          step_id,
          step_order,
          title
        `)
        .eq('generator_id', generatorId)
        .order('step_order');

      if (stepsError) throw stepsError;

      const stepsWithFields = await Promise.all(
        (stepsData || []).map(async (step) => {
          const { data: fieldsData, error: fieldsError } = await supabase
            .from('generator_fields')
            .select('*')
            .eq('step_uuid', step.id)
            .order('field_order');

          if (fieldsError) throw fieldsError;

          return {
            ...step,
            fields: fieldsData || [],
          };
        })
      );

      setSteps(stepsWithFields);
    } catch (error) {
      console.error('Error fetching generator data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const currentStep = steps[currentStepIndex];

  const isStepValid = () => {
    if (!currentStep) return false;
    return currentStep.fields.every(
      (field) => !field.is_required || (formData[field.field_key]?.trim() || '')
    );
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setShowPreview(true);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      onBack();
    }
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
  };

  const handlePayment = () => {
    setShowPreview(false);
    setShowPayment(true);
  };

  const handleDownloadPDF = async () => {
    if (!generator) return;

    const content = steps
      .map((step) => {
        const stepContent = step.fields
          .map((field) => {
            const value = formData[field.field_key] || '';
            return `${field.label}:\n${value}`;
          })
          .join('\n\n');
        return `${step.title}\n\n${stepContent}`;
      })
      .join('\n\n\n');

    const blob = await pdfGenerator.generatePDF({
      title: generator.title,
      content: content,
      fields: formData,
      metadata: {
        subject: generator.disclaimer
      }
    });

    await pdfGenerator.downloadPDF(blob, `${generator.id}-${Date.now()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!generator || steps.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-600">Generator not found or has no steps configured.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Required</h2>
            <p className="text-3xl font-bold text-gray-900">
              {generator.currency === 'EUR' ? '€' : generator.currency === 'GBP' ? '£' : generator.currency === 'AED' ? 'AED ' : '$'}
              {parseFloat(generator.price).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">{generator.checkout_disclaimer}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Payment integration would be handled via Stripe. For now, you can download the PDF directly.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownloadPDF}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download PDF (Demo)
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Document Preview</h2>
            <button
              onClick={handlePreviewClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              {generator.pre_payment_notice}
            </p>
          </div>

          <div className="prose max-w-none mb-8 bg-gray-50 p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">{generator.title}</h1>
            {steps.map((step) => (
              <div key={step.id} className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">{step.title}</h2>
                {step.fields.map((field) => {
                  const value = formData[field.field_key] || '';
                  if (!value) return null;
                  return (
                    <div key={field.id} className="mb-3">
                      <p className="font-medium text-gray-700">{field.label}:</p>
                      <p className="text-gray-600 whitespace-pre-wrap">{value}</p>
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>{generator.disclaimer}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePreviewClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {currentStepIndex === 0 ? 'Back to Generators' : 'Previous Step'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{generator.title}</h1>
          <p className="text-sm text-gray-600">{generator.disclaimer}</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">{currentStep.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">{currentStep.title}</h2>
          {currentStep.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.is_required && <span className="text-red-600 ml-1">*</span>}
              </label>
              {field.field_type === 'textarea' ? (
                <textarea
                  value={formData[field.field_key] || ''}
                  onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                  placeholder={field.placeholder || ''}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={field.is_required}
                />
              ) : field.field_type === 'select' && field.options ? (
                <select
                  value={formData[field.field_key] || ''}
                  onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={field.is_required}
                >
                  <option value="">Select an option...</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.field_type === 'email' ? 'email' : field.field_type === 'date' ? 'date' : 'text'}
                  value={formData[field.field_key] || ''}
                  onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
                  placeholder={field.placeholder || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={field.is_required}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentStepIndex < steps.length - 1 ? (
              <>
                Next Step
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Preview Document
                <Eye className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}