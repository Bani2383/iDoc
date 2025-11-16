import { useState, useEffect, useCallback } from 'react';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import { supabase, DocumentTemplate } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { pdfGenerator } from '../lib/pdfGenerator';

interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'email' | 'tel' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
  description?: string;
}

interface DocumentGeneratorProps {
  templateId: string;
  onBack: () => void;
}

export function DocumentGenerator({ templateId, onBack }: DocumentGeneratorProps) {
  const { user } = useAuth();
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

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

        const initialValues: Record<string, string> = {};
        validVariables.forEach(v => {
          initialValues[v.name] = '';
        });
        setValues(initialValues);
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

  const handleGenerate = async () => {
    for (const variable of variables) {
      if (variable.required && !values[variable.name]) {
        alert(`Le champ "${variable.label}" est requis`);
        return;
      }
    }

    setGenerating(true);
    try {
      let content = template?.template_content || '';

      Object.entries(values).forEach(([key, value]) => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        content = content.replace(regex, value);
      });

      setGeneratedContent(content);

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
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Erreur lors de la génération du document');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedContent || !template) return;

    try {
      const blob = await pdfGenerator.generatePDF({
        title: template.name,
        content: generatedContent,
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{template.name}</h2>
              {template.instructions && (
                <p className="text-sm text-gray-600 mt-1">{template.instructions}</p>
              )}
            </div>
          </div>
          <FileText className="w-8 h-8 text-blue-600" />
        </div>

        {!generatedContent ? (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {variables.map((variable) => (
                <div key={variable.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {variable.label}
                    {variable.required && <span className="text-red-600 ml-1">*</span>}
                  </label>
                  {variable.description && (
                    <p className="text-xs text-gray-500 mb-2">{variable.description}</p>
                  )}
                  {variable.type === 'textarea' ? (
                    <textarea
                      value={values[variable.name] || ''}
                      onChange={(e) => setValues({ ...values, [variable.name]: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder={variable.placeholder || `Entrez ${variable.label.toLowerCase()}`}
                      required={variable.required}
                    />
                  ) : variable.type === 'select' ? (
                    <select
                      value={values[variable.name] || ''}
                      onChange={(e) => setValues({ ...values, [variable.name]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required={variable.required}
                    >
                      <option value="">-- Sélectionnez une option --</option>
                      {(variable.options || []).map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={variable.type}
                      value={values[variable.name] || ''}
                      onChange={(e) => setValues({ ...values, [variable.name]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder={variable.placeholder || `Entrez ${variable.label.toLowerCase()}`}
                      required={variable.required}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {generating ? 'Génération...' : 'Générer le document'}
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Document généré</h3>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </button>
            </div>

            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {generatedContent}
              </pre>
            </div>

            <button
              onClick={() => setGeneratedContent(null)}
              className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Créer un nouveau document
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
