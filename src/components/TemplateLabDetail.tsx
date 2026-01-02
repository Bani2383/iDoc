import React, { useEffect, useState } from 'react';
import { Beaker, CheckCircle, XCircle, Play, FileText, Clock, Award, Code } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TemplateLinter } from './TemplateLinter';

interface TemplateDetail {
  id: string;
  name: string;
  title: string;
  review_status: string;
  version: number;
  content_template: string;
  schema_json: any;
  internal_notes: string;
}

export const TemplateLabDetail: React.FC<{ templateId: string; onBack: () => void }> = ({ templateId, onBack }) => {
  const [template, setTemplate] = useState<TemplateDetail | null>(null);
  const [testRuns, setTestRuns] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState('');
  const [activeTab, setActiveTab] = useState<'test' | 'lint' | 'history'>('test');

  useEffect(() => {
    fetchTemplateDetail();
  }, [templateId]);

  const fetchTemplateDetail = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/template-lab-api/template/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      });

      const data = await response.json();
      setTemplate(data.template);
      setTestRuns(data.testRuns || []);
      setCertificates(data.certificates || []);

      // Initialiser testValues avec les champs du schema
      if (data.template.schema_json?.fields) {
        const initialValues: Record<string, string> = {};
        data.template.schema_json.fields.forEach((field: any) => {
          initialValues[field.name] = '';
        });
        setTestValues(initialValues);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePreview = () => {
    if (!template) return;
    let content = template.content_template || '';

    // Remplacer les placeholders
    Object.keys(testValues).forEach(key => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      content = content.replace(regex, testValues[key] || `[${key}]`);
    });

    setPreview(content);
  };

  const handleRunTest = async (result: 'passed' | 'failed', issues: string = '') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      await fetch(`${supabaseUrl}/functions/v1/template-lab-api/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          template_id: templateId,
          test_values: testValues,
          result,
          issues_found: issues,
        }),
      });

      alert('Test enregistré!');
      fetchTemplateDetail();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleApprove = async () => {
    const summary = prompt('Résumé de l\'approbation:');
    if (!summary) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      await fetch(`${supabaseUrl}/functions/v1/template-lab-api/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          template_id: templateId,
          summary,
          test_runs: testRuns.filter(t => t.result === 'passed').map(t => t.id),
        }),
      });

      alert('Modèle approuvé!');
      onBack();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReject = async () => {
    const issues = prompt('Problèmes trouvés:');
    if (!issues) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      await fetch(`${supabaseUrl}/functions/v1/template-lab-api/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          template_id: templateId,
          internal_notes: issues,
          issues_found: issues,
        }),
      });

      alert('Modèle rejeté');
      onBack();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading || !template) {
    return <div className="text-center py-16"><div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const fields = template.schema_json?.fields || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{template.title}</h1>
            <p className="text-gray-600">Version {template.version}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg font-semibold ${
            template.review_status === 'approved' ? 'bg-green-100 text-green-800' :
            template.review_status === 'published' ? 'bg-blue-100 text-blue-800' :
            template.review_status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {template.review_status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleApprove}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Approuver</span>
          </button>
          <button
            onClick={handleReject}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <XCircle className="w-5 h-5" />
            <span>Rejeter</span>
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'test'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Play className="w-5 h-5" />
            Test & Preview
          </button>
          <button
            onClick={() => setActiveTab('lint')}
            className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'lint'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Code className="w-5 h-5" />
            Lint & Validate
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-5 h-5" />
            History
          </button>
        </div>
      </div>

      {activeTab === 'test' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire de test */}
          <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Beaker className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold">Test du Modèle</h2>
          </div>

          <div className="space-y-3 mb-4">
            {fields.map((field: any) => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  value={testValues[field.name] || ''}
                  onChange={(e) => setTestValues({ ...testValues, [field.name]: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleGeneratePreview}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Play className="w-5 h-5" />
            <span>Générer Prévisualisation</span>
          </button>

          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => handleRunTest('passed')}
              className="flex-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm"
            >
              Test Réussi
            </button>
            <button
              onClick={() => handleRunTest('failed', prompt('Problèmes:') || '')}
              className="flex-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm"
            >
              Test Échoué
            </button>
          </div>
        </div>

        {/* Prévisualisation */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">Prévisualisation</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] whitespace-pre-wrap font-mono text-sm">
            {preview || 'Cliquez sur "Générer Prévisualisation" pour voir le résultat'}
          </div>

          {/* Simulation signature */}
          {preview && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm font-semibold mb-2">Simulation Signatures:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded p-3 text-center">
                  <p className="text-xs text-gray-500 mb-2">Signature Employeur</p>
                  <div className="bg-gray-100 h-16 rounded"></div>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded p-3 text-center">
                  <p className="text-xs text-gray-500 mb-2">Signature Employé</p>
                  <div className="bg-gray-100 h-16 rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {activeTab === 'lint' && (
        <div>
          <TemplateLinter
            templateId={templateId}
            templateContent={template?.content_template || ''}
            schemaFields={fields}
          />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tests */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold">Tests ({testRuns.length})</h2>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testRuns.map(test => (
              <div key={test.id} className="border rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    test.result === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {test.result}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(test.created_at).toLocaleString('fr-FR')}</span>
                </div>
                {test.issues_found && <p className="text-xs text-red-600 mt-1">{test.issues_found}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Certificats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-bold">Certificats ({certificates.length})</h2>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {certificates.map(cert => (
              <div key={cert.id} className="border rounded p-3 bg-yellow-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">v{cert.version_number}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    cert.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {cert.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{cert.summary}</p>
                <p className="text-xs text-gray-500">{new Date(cert.approved_at).toLocaleDateString('fr-FR')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
