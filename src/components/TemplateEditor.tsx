import { useState, useEffect, useCallback } from 'react';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { supabase, DocumentTemplate, TemplateVariable } from '../lib/supabase';

interface TemplateEditorProps {
  templateId?: string;
  onBack: () => void;
  onSave: () => void;
}

export function TemplateEditor({ templateId, onBack, onSave }: TemplateEditorProps) {
  const [template, setTemplate] = useState<Partial<DocumentTemplate>>({
    name: '',
    category: 'professional',
    description: '',
    slug: '',
    template_content: '',
    template_variables: [],
    instructions: '',
    is_active: true,
    sort_order: 0,
  });
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
  const [loading, setLoading] = useState(!!templateId);
  const [saving, setSaving] = useState(false);

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
        // Ensure variables array has valid structure for editing
        const vars = (data.template_variables as TemplateVariable[]) || [];
        // Initialize missing fields with defaults for the editor
        const validatedVars = vars.map(v => ({
          name: v?.name || '',
          label: v?.label || '',
          type: v?.type || 'text',
          required: v?.required ?? false,
          placeholder: v?.placeholder,
          options: v?.options,
          description: v?.description
        }));
        setVariables(validatedVars);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId, fetchTemplate]);

  const addVariable = () => {
    setVariables([
      ...variables,
      { name: '', label: '', type: 'text', required: true, placeholder: '', options: [], description: '' },
    ]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: keyof TemplateVariable, value: string | boolean | string[]) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Générer un slug à partir du nom
      const slug = template.name?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || '';

      const dataToSave = {
        ...template,
        slug,
        template_variables: variables,
      };

      if (templateId) {
        const { error } = await supabase
          .from('document_templates')
          .update(dataToSave)
          .eq('id', templateId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('document_templates')
          .insert([dataToSave]);

        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            {templateId ? 'Modifier le modèle' : 'Nouveau modèle'}
          </h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom du document
            </label>
            <input
              type="text"
              value={template.name || ''}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Ex: Contrat de travail"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={template.category || 'professional'}
              onChange={(e) => setTemplate({ ...template, category: e.target.value as 'professional' | 'personal' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="professional">Professionnel</option>
              <option value="personal">Personnel</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instructions
          </label>
          <textarea
            value={template.instructions || ''}
            onChange={(e) => setTemplate({ ...template, instructions: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Instructions pour remplir ce document..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Variables du document
            </label>
            <button
              onClick={addVariable}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une variable</span>
            </button>
          </div>

          <div className="space-y-4">
            {variables.map((variable, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-start space-x-4">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) => updateVariable(index, 'name', e.target.value)}
                      placeholder="Nom (ex: client_name)"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={variable.label}
                      onChange={(e) => updateVariable(index, 'label', e.target.value)}
                      placeholder="Label (ex: Nom du client)"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <select
                      value={variable.type}
                      onChange={(e) => updateVariable(index, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="text">Texte</option>
                      <option value="email">Email</option>
                      <option value="tel">Téléphone</option>
                      <option value="number">Nombre</option>
                      <option value="date">Date</option>
                      <option value="textarea">Zone de texte</option>
                      <option value="select">Liste déroulante</option>
                    </select>
                  </div>
                  <label className="flex items-center space-x-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={variable.required}
                      onChange={(e) => updateVariable(index, 'required', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Requis</span>
                  </label>
                  <button
                    onClick={() => removeVariable(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={variable.placeholder || ''}
                    onChange={(e) => updateVariable(index, 'placeholder', e.target.value)}
                    placeholder="Placeholder (optionnel)"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={variable.description || ''}
                    onChange={(e) => updateVariable(index, 'description', e.target.value)}
                    placeholder="Description (optionnel)"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                {variable.type === 'select' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Options (une par ligne)
                    </label>
                    <textarea
                      value={(variable.options || []).join('\n')}
                      onChange={(e) => updateVariable(index, 'options', e.target.value.split('\n').filter(o => o.trim()))}
                      rows={4}
                      placeholder="Option 1\nOption 2\nOption 3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contenu du modèle
            <span className="text-gray-500 font-normal ml-2">
              (Utilisez {'{variable_name}'} pour les variables)
            </span>
          </label>
          <textarea
            value={template.template_content || ''}
            onChange={(e) => setTemplate({ ...template, template_content: e.target.value })}
            rows={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
            placeholder="Collez le contenu du modèle ici..."
          />
        </div>
      </div>
    </div>
  );
}
