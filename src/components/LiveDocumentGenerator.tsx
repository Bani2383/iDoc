import { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, Download, Save, Sparkles } from 'lucide-react';
import { supabase, DocumentTemplate } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { pdfGenerator } from '../lib/pdfGenerator';

interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea';
  required: boolean;
}

interface LiveDocumentGeneratorProps {
  templateId: string;
  onBack: () => void;
  initialData?: {
    formData: Record<string, string>;
    currentStep?: number;
  };
}

export function LiveDocumentGenerator({ templateId, onBack, initialData }: LiveDocumentGeneratorProps) {
  const { user } = useAuth();
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
  const [values, setValues] = useState<Record<string, string>>(initialData?.formData || {});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [restoredFromGuest, setRestoredFromGuest] = useState(false);

  const fetchTemplate = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;
      if (data) {
        setTemplate(data);
        // Validate and filter variables to ensure they have required fields
        const validVariables = ((data.template_variables as TemplateVariable[]) || []).filter(v =>
          v && v.name && v.label && v.type
        );
        setVariables(validVariables);

        if (initialData?.formData) {
          setValues(initialData.formData);
          setRestoredFromGuest(true);
          localStorage.removeItem(`guest_doc_${templateId}`);
        } else {
          const initialValues: Record<string, string> = {};
          validVariables.forEach(v => {
            initialValues[v.name] = '';
          });
          setValues(initialValues);
        }
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  const livePreview = useMemo(() => {
    let content = template?.template_content || '';

    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      const displayValue = value || `[${key}]`;
      content = content.replace(regex, displayValue);
    });

    return content;
  }, [template, values]);

  const validateField = async (fieldName: string, value: string) => {
    if (!value.trim()) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: '' }));
      return;
    }

    if (value.length < 2) return;

    const variable = variables.find(v => v.name === fieldName);
    if (!variable) return;

    if (variable.type === 'textarea' && value.length > 20) {
      setTimeout(() => {
        const hasBasicIssues =
          /\s{2,}/.test(value) ||
          /[.,;:!?]{2,}/.test(value) ||
          !/^[A-Z]/.test(value.trim());

        if (hasBasicIssues) {
          setValidationErrors(prev => ({
            ...prev,
            [fieldName]: 'Suggestion: vérifiez la ponctuation et les espaces'
          }));
        } else {
          setValidationErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
      }, 500);
    }
  };

  const handleValueChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSave = async () => {
    for (const variable of variables) {
      if (variable.required && !values[variable.name]) {
        alert(`Le champ "${variable.label}" est requis`);
        return;
      }
    }

    setSaving(true);
    try {
      let content = template?.template_content || '';

      Object.entries(values).forEach(([key, value]) => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        content = content.replace(regex, value);
      });

      const { error } = await supabase
        .from('generated_documents')
        .insert([{
          user_id: user?.id,
          template_id: templateId,
          document_type: template?.name,
          content: content,
          variables: values,
          status: 'generated',
          price: 0,
        }]);

      if (error) throw error;

      alert('Document sauvegardé avec succès!');
      onBack();
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Erreur lors de la sauvegarde du document');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!template) return;

    try {
      const blob = await pdfGenerator.generatePDF({
        title: template.name,
        content: template.template_content || '',
        fields: values,
        metadata: {
          author: user?.email,
          subject: template.name
        }
      });

      await pdfGenerator.downloadPDF(blob, template.name || 'document');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Modèle introuvable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {restoredFromGuest && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 text-green-600 mr-3" />
                <p className="text-sm text-green-700">
                  <strong>Formulaire restauré !</strong> Vos données ont été récupérées. Vous pouvez maintenant compléter le formulaire.
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
                {template.instructions && (
                  <p className="text-sm text-gray-600 mt-1">{template.instructions}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informations</h2>
              <div className="space-y-4">
                {variables.map((variable) => (
                  <div key={variable.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {variable.label}
                      {variable.required && <span className="text-red-600 ml-1">*</span>}
                    </label>
                    {variable.type === 'textarea' ? (
                      <textarea
                        value={values[variable.name] || ''}
                        onChange={(e) => handleValueChange(variable.name, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        placeholder={`Entrez ${variable.label.toLowerCase()}`}
                      />
                    ) : (
                      <input
                        type={variable.type}
                        value={values[variable.name] || ''}
                        onChange={(e) => handleValueChange(variable.name, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        placeholder={`Entrez ${variable.label.toLowerCase()}`}
                      />
                    )}
                    {validationErrors[variable.name] && (
                      <div className="mt-2 flex items-start space-x-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{validationErrors[variable.name]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Aperçu en direct</h2>
              <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 max-h-[calc(100vh-16rem)] overflow-y-auto">
                <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-serif">
                  {livePreview.split('\n').map((line, index) => {
                    const hasPlaceholder = /\[[\w_]+\]/.test(line);
                    return (
                      <p
                        key={index}
                        className={`mb-2 ${hasPlaceholder ? 'text-blue-600 font-semibold' : ''}`}
                      >
                        {line || '\u00A0'}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
