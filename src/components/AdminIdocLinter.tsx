import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Code, Search, FileText, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LintResult {
  ok: boolean;
  templateId: string;
  varsUsed: string[];
  unknownVars: string[];
  sections?: {
    sectionCode: string;
    varsUsed: string[];
    unknownVars: string[];
  }[];
  metadata?: {
    requiredVariables: string[];
    optionalVariables: string[];
  };
  error?: string;
}

interface Template {
  id: string;
  template_code: string;
  title: any;
  category: string;
}

export default function AdminIdocLinter() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [inputs, setInputs] = useState<string>('{}');
  const [lintResult, setLintResult] = useState<LintResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const { data, error } = await supabase
        .from('idoc_guided_templates')
        .select('id, template_code, title, category')
        .eq('is_active', true)
        .order('template_code');

      if (error) throw error;
      setTemplates(data || []);

      if (data && data.length > 0) {
        setSelectedTemplateId(data[0].id);
      }
    } catch (err: any) {
      setError(`Failed to load templates: ${err.message}`);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleLint = async () => {
    if (!selectedTemplateId) {
      setError('Please select a template');
      return;
    }

    let parsedInputs: Record<string, any>;
    try {
      parsedInputs = JSON.parse(inputs);
    } catch (err) {
      setError('Invalid JSON in inputs field');
      return;
    }

    setLoading(true);
    setError('');
    setLintResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/idoc-lint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          template_id: selectedTemplateId,
          inputs: parsedInputs,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to lint template');
      }

      setLintResult(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during linting');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (titleObj: any): string => {
    if (typeof titleObj === 'string') return titleObj;
    if (titleObj && typeof titleObj === 'object') {
      return titleObj.en || titleObj.fr || Object.values(titleObj)[0] || 'Untitled';
    }
    return 'Untitled';
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">iDoc Template Linter</h1>
            <p className="text-sm text-gray-600">Validate template variables and detect typos</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Template
            </label>
            {loadingTemplates ? (
              <div className="text-sm text-gray-500">Loading templates...</div>
            ) : (
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.template_code} - {getTitle(template.title)}
                  </option>
                ))}
              </select>
            )}
            {selectedTemplate && (
              <p className="mt-2 text-sm text-gray-500">
                Category: {selectedTemplate.category}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Inputs (JSON)
            </label>
            <textarea
              value={inputs}
              onChange={(e) => setInputs(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              rows={10}
              placeholder='{"field1": "value1", "field2": "value2"}'
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter the input data to test against the template variables
            </p>
          </div>

          <button
            onClick={handleLint}
            disabled={loading || !selectedTemplateId}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Linting...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Run Lint Check
              </>
            )}
          </button>
        </div>

        {lintResult && (
          <div className="mt-8 space-y-6">
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lint Results</h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Template ID</p>
                    <p className="text-lg font-mono text-gray-900">{lintResult.templateId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {lintResult.unknownVars.length === 0 ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="text-green-600 font-medium">All Variables Valid</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <span className="text-red-600 font-medium">
                          {lintResult.unknownVars.length} Unknown Variable{lintResult.unknownVars.length !== 1 ? 's' : ''}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {lintResult.unknownVars.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-900 mb-2">
                        Unknown Variables (Potential Typos)
                      </h3>
                      <ul className="space-y-1">
                        {lintResult.unknownVars.map((varName, idx) => (
                          <li key={idx} className="text-sm text-red-800 font-mono">
                            {varName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Variables Used ({lintResult.varsUsed.length})
                  </h3>
                  <div className="max-h-48 overflow-y-auto">
                    <ul className="space-y-1">
                      {lintResult.varsUsed.map((varName, idx) => (
                        <li key={idx} className="text-sm text-blue-800 font-mono">
                          {varName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {lintResult.metadata && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-green-900 mb-2">
                      Declared Variables
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-green-700 font-medium">Required:</p>
                        <p className="text-sm text-green-800 font-mono">
                          {lintResult.metadata.requiredVariables.length > 0
                            ? lintResult.metadata.requiredVariables.join(', ')
                            : 'None'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700 font-medium">Optional:</p>
                        <p className="text-sm text-green-800 font-mono">
                          {lintResult.metadata.optionalVariables.length > 0
                            ? lintResult.metadata.optionalVariables.join(', ')
                            : 'None'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {lintResult.sections && lintResult.sections.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Section Analysis</h3>
                  <div className="space-y-3">
                    {lintResult.sections.map((section, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{section.sectionCode}</h4>
                          {section.unknownVars.length > 0 && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              {section.unknownVars.length} unknown
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Variables used: {section.varsUsed.length}</p>
                          {section.unknownVars.length > 0 && (
                            <p className="text-red-600 font-mono mt-1">
                              Unknown: {section.unknownVars.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
