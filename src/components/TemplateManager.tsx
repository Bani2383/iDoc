import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase, DocumentTemplate } from '../lib/supabase';
import { TemplateEditor } from './TemplateEditor';

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export function TemplateManager() {
  const { theme } = useTheme();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!showEditor) {
      fetchTemplates();
    }
  }, [showEditor]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const { data, error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', deleteConfirm.id)
        .select();

      if (error) {
        console.error('Delete error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Aucune ligne supprimée - permissions insuffisantes ou template introuvable');
      }

      showToast('success', 'Modèle supprimé avec succès');
      fetchTemplates();
    } catch (error) {
      const err = error as Error & { details?: string };
      console.error('Full error object:', error);
      const errorMessage = err?.message || err?.details || 'Erreur inconnue';
      showToast('error', `Erreur lors de la suppression: ${errorMessage}`);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (id: string) => {
    setSelectedTemplateId(id);
    setShowEditor(true);
  };

  const handleNew = () => {
    setSelectedTemplateId(null);
    setShowEditor(true);
  };

  const handleBack = () => {
    setShowEditor(false);
    setSelectedTemplateId(null);
  };

  if (showEditor) {
    return (
      <TemplateEditor
        templateId={selectedTemplateId || undefined}
        onBack={handleBack}
        onSave={handleBack}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const categoryCounts = {
    professional: templates.filter(t => t.category === 'professional').length,
    personal: templates.filter(t => t.category === 'personal').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des modèles</h2>
          <p className="text-gray-600 mt-1">
            {templates.length} modèles au total
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau modèle</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Professionnels</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{categoryCounts.professional}</p>
            </div>
            <FileText className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Personnels</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{categoryCounts.personal}</p>
            </div>
            <FileText className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-green-600'}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{templates.length}</p>
            </div>
            <FileText className="w-12 h-12 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Variables
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {template.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    template.category === 'professional' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {template.category === 'professional' ? 'Professionnel' :
                     'Personnel'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    template.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {template.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {Array.isArray(template.template_variables) ? template.template_variables.length : 0} variable(s)
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(template.id)}
                      className={`p-2 rounded-lg transition-colors ${theme === 'minimal' ? 'text-black hover:bg-gray-100' : 'text-blue-600 hover:bg-blue-50'}`}
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(template.id, template.name)}
                      className={`p-2 rounded-lg transition-colors ${theme === 'minimal' ? 'text-black hover:bg-gray-100' : 'text-red-600 hover:bg-red-50'}`}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className={`w-8 h-8 ${theme === 'minimal' ? 'text-gray-900' : 'text-red-600'}`} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Supprimer le modèle
            </h3>

            <p className="text-gray-600 text-center mb-2">
              Êtes-vous sûr de vouloir supprimer ce modèle?
            </p>

            <p className="text-gray-900 font-semibold text-center mb-6 px-4 py-2 bg-gray-100 rounded-lg">
              {deleteConfirm.name}
            </p>

            <p className="text-sm text-gray-500 text-center mb-6">
              Cette action est irréversible.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-xl ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 flex-shrink-0" />
            )}
            <p className="font-semibold text-lg">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-4 p-1 hover:bg-white/20 rounded transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
