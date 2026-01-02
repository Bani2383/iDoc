/**
 * Guided Template Wizard
 *
 * @description Multi-step wizard with conditional logic using the rule engine
 * This is a NEW component that doesn't affect existing document generation flows
 */

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Eye, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  GuidedTemplateEngine,
  GuidedTemplateConfig,
  GuidedStep,
  GuidedField,
} from '../lib/guidedTemplateEngine';

interface GuidedTemplateWizardProps {
  configId: string;
  onBack: () => void;
  onPreview: (formData: Record<string, any>) => void;
}

export function GuidedTemplateWizard({
  configId,
  onBack,
  onPreview,
}: GuidedTemplateWizardProps) {
  const { user } = useAuth();
  const [config, setConfig] = useState<GuidedTemplateConfig | null>(null);
  const [engine, setEngine] = useState<GuidedTemplateEngine | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, [configId]);

  useEffect(() => {
    if (config) {
      const newEngine = new GuidedTemplateEngine(config);
      newEngine.setFormData(formData);
      setEngine(newEngine);
    }
  }, [config]);

  useEffect(() => {
    if (engine) {
      engine.setFormData(formData);
    }
  }, [formData, engine]);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('guided_template_configs')
        .select('*')
        .eq('id', configId)
        .single();

      if (error) throw error;
      if (data) {
        setConfig(data.config as GuidedTemplateConfig);
      }
    } catch (error) {
      console.error('Error fetching guided template config:', error);
    } finally {
      setLoading(false);
    }
  };

  const visibleSteps = useMemo(() => {
    return engine?.getVisibleSteps() || [];
  }, [engine, formData]);

  const currentStep = visibleSteps[currentStepIndex];

  const visibleFields = useMemo(() => {
    if (!engine || !currentStep) return [];
    return engine.getVisibleFields(currentStep);
  }, [engine, currentStep, formData]);

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    if (!engine || !currentStep) return false;

    const validation = engine.validateStep(currentStep);
    if (!validation.valid) {
      setErrors(validation.errors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStepIndex < visibleSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo(0, 0);
    } else {
      handlePreview();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo(0, 0);
    } else {
      onBack();
    }
  };

  const handleSaveDraft = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('guided_template_submissions')
        .upsert({
          user_id: user.id,
          config_id: configId,
          form_data: formData,
          status: 'draft',
        });

      if (error) throw error;
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (!validateCurrentStep()) return;
    onPreview(formData);
  };

  const renderField = (field: GuidedField) => {
    const value = formData[field.key] || '';
    const fieldErrors = errors[field.key] || [];
    const isRequired = engine?.isFieldRequired(field);

    return (
      <div key={field.id} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {isRequired && <span className="text-red-600 ml-1">*</span>}
        </label>

        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}

        {field.type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        ) : field.type === 'select' ? (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === 'radio' ? (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.key}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        ) : field.type === 'checkbox' ? (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value === true || value === 'true'}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              className="text-blue-600"
            />
            <span className="text-sm text-gray-700">{field.placeholder}</span>
          </label>
        ) : (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )}

        {fieldErrors.length > 0 && (
          <div className="flex items-start gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              {fieldErrors.map((error, idx) => (
                <p key={idx}>{error}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config || !engine || visibleSteps.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 mb-4">Template configuration not found or invalid</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const progress = engine.getProgress();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {currentStepIndex === 0 ? 'Back to templates' : 'Previous step'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{config.name}</h1>
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStepIndex + 1} of {visibleSteps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {currentStep && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStep.title}
              </h2>
              {currentStep.description && (
                <p className="text-gray-600">{currentStep.description}</p>
              )}
            </div>

            <div className="space-y-6 mb-8">
              {visibleFields.map((field) => renderField(field))}
            </div>
          </>
        )}

        <div className="flex gap-3">
          {user && (
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save draft'}
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {currentStepIndex < visibleSteps.length - 1 ? (
              <>
                Next step
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Preview document
                <Eye className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
