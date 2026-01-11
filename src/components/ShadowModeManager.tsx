import React, { useState, useEffect } from 'react';
import { Beaker, Play, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Template {
  id: string;
  template_code: string;
  title: any;
  shadow_mode_enabled: boolean;
  shadow_tested_at: string | null;
}

interface ShadowTestResult {
  id: string;
  template_id: string;
  test_profile: string;
  passed: boolean;
  errors_count: number;
  warnings_count: number;
  execution_time_ms: number;
  result_data: any;
  tested_at: string;
}

export default function ShadowModeManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [testResults, setTestResults] = useState<ShadowTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplateId) {
      loadTestResults(selectedTemplateId);
    }
  }, [selectedTemplateId]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('idoc_guided_templates')
        .select('id, template_code, title, shadow_mode_enabled, shadow_tested_at')
        .eq('is_active', true)
        .order('template_code');

      if (error) throw error;
      setTemplates(data || []);

      if (data && data.length > 0) {
        setSelectedTemplateId(data[0].id);
      }
    } catch (err: any) {
      setError(`Failed to load templates: ${err.message}`);
    }
  };

  const loadTestResults = async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from('shadow_test_results')
        .select('*')
        .eq('template_id', templateId)
        .order('tested_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTestResults(data || []);
    } catch (err: any) {
      console.error('Failed to load test results:', err);
    }
  };

  const toggleShadowMode = async (templateId: string, enabled: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('idoc_guided_templates')
        .update({ shadow_mode_enabled: enabled })
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(templates.map(t =>
        t.id === templateId ? { ...t, shadow_mode_enabled: enabled } : t
      ));
    } catch (err: any) {
      setError(`Failed to toggle shadow mode: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const runShadowTest = async (templateId: string) => {
    try {
      setTesting(true);
      setError('');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/idoc-shadow-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ template_id: templateId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Shadow test failed');
      }

      await loadTestResults(templateId);
      await loadTemplates();

      alert(`Shadow test completed!\n\nProfiles tested: ${result.profiles_tested}\nPassed: ${result.overall_passed ? 'Yes' : 'No'}\nErrors: ${result.total_errors}\nWarnings: ${result.total_warnings}`);

    } catch (err: any) {
      setError(err.message || 'Failed to run shadow test');
    } finally {
      setTesting(false);
    }
  };

  const runBatchShadowTests = async () => {
    const enabledTemplates = templates.filter(t => t.shadow_mode_enabled);

    if (enabledTemplates.length === 0) {
      setError('No templates have shadow mode enabled');
      return;
    }

    if (!confirm(`Run shadow tests on ${enabledTemplates.length} templates?`)) {
      return;
    }

    setTesting(true);
    setError('');

    let completed = 0;
    let failed = 0;

    for (const template of enabledTemplates) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const response = await fetch(`${supabaseUrl}/functions/v1/idoc-shadow-test`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ template_id: template.id }),
        });

        if (response.ok) {
          completed++;
        } else {
          failed++;
        }
      } catch (err) {
        failed++;
      }
    }

    setTesting(false);
    await loadTemplates();
    alert(`Batch shadow tests completed!\n\nCompleted: ${completed}\nFailed: ${failed}`);
  };

  const getTitle = (titleObj: any): string => {
    if (typeof titleObj === 'string') return titleObj;
    if (titleObj && typeof titleObj === 'object') {
      return titleObj.en || titleObj.fr || Object.values(titleObj)[0] || 'Untitled';
    }
    return 'Untitled';
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString();
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Beaker className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shadow Mode Testing</h1>
              <p className="text-sm text-gray-600">Test templates silently in parallel with production</p>
            </div>
          </div>

          <button
            onClick={runBatchShadowTests}
            disabled={testing}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {testing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Batch Tests
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">What is Shadow Mode?</h3>
            </div>
            <p className="text-sm text-blue-700">
              Shadow mode runs tests on templates in the background without affecting production.
              This allows you to validate new templates or changes with real-world data profiles
              before deploying them to users.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Test Profiles</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>Standard: Typical user data</li>
              <li>Edge Case: Special characters, long text</li>
              <li>Minimal: Only required fields</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Template
          </label>
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.template_code} - {getTitle(template.title)}
                {template.shadow_mode_enabled ? ' [Shadow Mode ON]' : ''}
              </option>
            ))}
          </select>
        </div>

        {selectedTemplate && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.template_code}</h3>
                  <p className="text-sm text-gray-600">
                    Last tested: {formatDate(selectedTemplate.shadow_tested_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTemplate.shadow_mode_enabled}
                      onChange={(e) => toggleShadowMode(selectedTemplate.id, e.target.checked)}
                      disabled={loading}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Shadow Mode Enabled</span>
                  </label>
                  <button
                    onClick={() => runShadowTest(selectedTemplate.id)}
                    disabled={testing}
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Run Test
                  </button>
                </div>
              </div>
            </div>

            {testResults.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Test History</h3>
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className={`border rounded-lg p-4 ${
                        result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`font-medium ${result.passed ? 'text-green-900' : 'text-red-900'}`}>
                            {result.passed ? 'Passed' : 'Failed'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {result.test_profile}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {result.execution_time_ms}ms
                          </div>
                          <span>{formatDate(result.tested_at)}</span>
                        </div>
                      </div>

                      {(result.errors_count > 0 || result.warnings_count > 0) && (
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          {result.errors_count > 0 && (
                            <div className="bg-white rounded p-2">
                              <p className="text-sm font-medium text-red-700">
                                Errors: {result.errors_count}
                              </p>
                            </div>
                          )}
                          {result.warnings_count > 0 && (
                            <div className="bg-white rounded p-2">
                              <p className="text-sm font-medium text-yellow-700">
                                Warnings: {result.warnings_count}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {result.result_data?.results && (
                        <details className="mt-3">
                          <summary className="text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            View Details
                          </summary>
                          <div className="mt-2 p-3 bg-white rounded border text-xs font-mono overflow-x-auto">
                            <pre>{JSON.stringify(result.result_data.results, null, 2)}</pre>
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Beaker className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No test results yet. Run a shadow test to see results here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
