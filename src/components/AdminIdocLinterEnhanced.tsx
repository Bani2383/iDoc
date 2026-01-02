import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Code, Search, FileText, AlertTriangle, Download, PlayCircle, Save, Upload, Eye, Shuffle, Filter, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LintResult {
  ok: boolean;
  templateId: string;
  varsUsed: string[];
  unknownVars: string[];
  hasPlaceholders: boolean;
  sections?: {
    sectionCode: string;
    varsUsed: string[];
    unknownVars: string[];
  }[];
  metadata?: {
    requiredVariables: string[];
    optionalVariables: string[];
  };
  cacheUsed?: boolean;
}

interface BatchLintSummary {
  id: string;
  template_code: string;
  status: 'pass' | 'fail';
  unknownVarsCount: number;
  unknownVars: string[];
  hasPlaceholders: boolean;
  published: boolean;
  cacheUsed: boolean;
}

interface BatchLintResult {
  ok: boolean;
  totalTemplates: number;
  passedTemplates: number;
  failedTemplates: number;
  results: BatchLintSummary[];
  executionTimeMs: number;
}

interface Template {
  id: string;
  template_code: string;
  title: any;
  category: string;
  published: boolean;
  last_verified_at?: string;
  updated_at: string;
}

interface Fixture {
  id: string;
  template_id: string;
  fixture_name: string;
  description: string;
  inputs_json: any;
  is_default: boolean;
}

type AuditMode = 'single' | 'batch' | 'random' | 'category' | 'unverified';

export default function AdminIdocLinterEnhanced() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedFixtureId, setSelectedFixtureId] = useState<string>('');
  const [inputs, setInputs] = useState<string>('{}');
  const [lintResult, setLintResult] = useState<LintResult | null>(null);
  const [batchResults, setBatchResults] = useState<BatchLintResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [sortField, setSortField] = useState<'template_code' | 'status' | 'unknownVarsCount'>('status');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [view, setView] = useState<AuditMode>('single');

  const [randomCount, setRandomCount] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [daysUnverified, setDaysUnverified] = useState<number>(7);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplateId) {
      loadFixtures(selectedTemplateId);
    }
  }, [selectedTemplateId]);

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const { data, error } = await supabase
        .from('idoc_guided_templates')
        .select('id, template_code, title, category, published, last_verified_at, updated_at')
        .eq('is_active', true)
        .order('template_code');

      if (error) throw error;
      setTemplates(data || []);

      const uniqueCategories = Array.from(new Set(data?.map(t => t.category).filter(Boolean))) as string[];
      setCategories(uniqueCategories.sort());

      if (data && data.length > 0) {
        setSelectedTemplateId(data[0].id);
      }
    } catch (err: any) {
      setError(`Failed to load templates: ${err.message}`);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const loadFixtures = async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from('idoc_template_fixtures')
        .select('*')
        .eq('template_id', templateId)
        .eq('is_active', true)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setFixtures(data || []);

      const defaultFixture = data?.find(f => f.is_default);
      if (defaultFixture) {
        setSelectedFixtureId(defaultFixture.id);
        setInputs(JSON.stringify(defaultFixture.inputs_json, null, 2));
      }
    } catch (err: any) {
      console.error('Failed to load fixtures:', err);
    }
  };

  const handleFixtureChange = (fixtureId: string) => {
    setSelectedFixtureId(fixtureId);
    const fixture = fixtures.find(f => f.id === fixtureId);
    if (fixture) {
      setInputs(JSON.stringify(fixture.inputs_json, null, 2));
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

  const handleBatchLint = async () => {
    setBatchLoading(true);
    setError('');
    setBatchResults(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/idoc-batch-lint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to run batch lint');
      }

      setBatchResults(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during batch linting');
    } finally {
      setBatchLoading(false);
    }
  };

  const handleRandomAudit = async () => {
    if (randomCount < 1 || randomCount > templates.length) {
      setError(`Please select between 1 and ${templates.length} templates`);
      return;
    }

    setBatchLoading(true);
    setError('');
    setBatchResults(null);

    try {
      const shuffled = [...templates].sort(() => Math.random() - 0.5);
      const selectedTemplates = shuffled.slice(0, randomCount);
      const templateIds = selectedTemplates.map(t => t.id);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/idoc-batch-lint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ template_ids: templateIds }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to run random audit');
      }

      setBatchResults(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during random audit');
    } finally {
      setBatchLoading(false);
    }
  };

  const handleCategoryAudit = async () => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    setBatchLoading(true);
    setError('');
    setBatchResults(null);

    try {
      const categoryTemplates = templates.filter(t => t.category === selectedCategory);
      const templateIds = categoryTemplates.map(t => t.id);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/idoc-batch-lint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ template_ids: templateIds }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to run category audit');
      }

      setBatchResults(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during category audit');
    } finally {
      setBatchLoading(false);
    }
  };

  const handleUnverifiedAudit = async () => {
    setBatchLoading(true);
    setError('');
    setBatchResults(null);

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysUnverified);

      const unverifiedTemplates = templates.filter(t => {
        if (!t.last_verified_at) return true;
        const verifiedDate = new Date(t.last_verified_at);
        return verifiedDate < cutoffDate;
      });

      if (unverifiedTemplates.length === 0) {
        setError(`All templates have been verified in the last ${daysUnverified} days`);
        setBatchLoading(false);
        return;
      }

      const templateIds = unverifiedTemplates.map(t => t.id);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/idoc-batch-lint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ template_ids: templateIds }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to run unverified audit');
      }

      setBatchResults(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during unverified audit');
    } finally {
      setBatchLoading(false);
    }
  };

  const handlePublish = async (templateId: string) => {
    if (!confirm('Publish this template? It will be available in production.')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/idoc-publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ template_id: templateId }),
      });

      const result = await response.json();

      if (result.blocked) {
        alert(`Cannot publish:\n${result.blockers.join('\n')}`);
      } else if (result.published) {
        alert('Template published successfully!');
        loadTemplates();
      }
    } catch (err: any) {
      alert(`Failed to publish: ${err.message}`);
    }
  };

  const exportCSV = () => {
    if (!batchResults) return;

    const headers = ['Template Code', 'Status', 'Unknown Vars', 'Has Placeholders', 'Published'];
    const rows = batchResults.results.map(r => [
      r.template_code,
      r.status,
      r.unknownVarsCount,
      r.hasPlaceholders ? 'Yes' : 'No',
      r.published ? 'Yes' : 'No',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idoc-lint-results-${Date.now()}.csv`;
    a.click();
  };

  const exportJSON = () => {
    if (!batchResults) return;

    const json = JSON.stringify(batchResults, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idoc-lint-results-${Date.now()}.json`;
    a.click();
  };

  const sortedResults = batchResults ? [...batchResults.results].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const dir = sortDir === 'asc' ? 1 : -1;
    return aVal > bVal ? dir : -dir;
  }) : [];

  const getTitle = (titleObj: any): string => {
    if (typeof titleObj === 'string') return titleObj;
    if (titleObj && typeof titleObj === 'object') {
      return titleObj.en || titleObj.fr || Object.values(titleObj)[0] || 'Untitled';
    }
    return 'Untitled';
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">iDoc Template Linter Pro</h1>
              <p className="text-sm text-gray-600">Industrial-grade validation</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setView('single')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                view === 'single' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              Single
            </button>
            <button
              onClick={() => setView('batch')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                view === 'batch' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              All
            </button>
            <button
              onClick={() => setView('random')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                view === 'random' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              Random
            </button>
            <button
              onClick={() => setView('category')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                view === 'category' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Category
            </button>
            <button
              onClick={() => setView('unverified')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                view === 'unverified' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Unverified
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {view === 'single' && (
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
                      {template.template_code} - {getTitle(template.title)} {template.published ? '✓' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {fixtures.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Load Fixture
                </label>
                <select
                  value={selectedFixtureId}
                  onChange={(e) => handleFixtureChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Custom inputs...</option>
                  {fixtures.map((fixture) => (
                    <option key={fixture.id} value={fixture.id}>
                      {fixture.fixture_name} {fixture.is_default ? '(default)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLint}
                disabled={loading || !selectedTemplateId}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              {selectedTemplate && (
                <button
                  onClick={() => handlePublish(selectedTemplateId)}
                  disabled={loading}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Publish
                </button>
              )}
            </div>

            {lintResult && (
              <div className="mt-8 space-y-6 border-t pt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Template ID</p>
                      <p className="text-lg font-mono text-gray-900">{lintResult.templateId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {lintResult.unknownVars.length === 0 && !lintResult.hasPlaceholders ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <span className="text-green-600 font-medium">All Valid</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                          <span className="text-red-600 font-medium">Issues Found</span>
                        </>
                      )}
                    </div>
                  </div>
                  {lintResult.cacheUsed && (
                    <p className="text-xs text-gray-500 mt-2">⚡ Cache used</p>
                  )}
                </div>

                {(lintResult.unknownVars.length > 0 || lintResult.hasPlaceholders) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-red-900 mb-2">Issues</h3>
                        {lintResult.unknownVars.length > 0 && (
                          <div className="mb-2">
                            <p className="text-sm text-red-800 font-medium">Unknown Variables:</p>
                            <ul className="space-y-1 mt-1">
                              {lintResult.unknownVars.map((varName, idx) => (
                                <li key={idx} className="text-sm text-red-800 font-mono">{varName}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {lintResult.hasPlaceholders && (
                          <p className="text-sm text-red-800">Contains placeholder text (TODO, FIXME, etc.)</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      Variables Used ({lintResult.varsUsed.length})
                    </h3>
                    <div className="max-h-48 overflow-y-auto">
                      <ul className="space-y-1">
                        {lintResult.varsUsed.map((varName, idx) => (
                          <li key={idx} className="text-sm text-blue-800 font-mono">{varName}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {lintResult.metadata && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-green-900 mb-2">Declared Variables</h3>
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
              </div>
            )}
          </div>
        )}

        {view === 'batch' && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <button
                onClick={handleBatchLint}
                disabled={batchLoading}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {batchLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running Batch Lint...
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Run Batch Lint on All Templates
                  </>
                )}
              </button>

              {batchResults && (
                <>
                  <button
                    onClick={exportCSV}
                    className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </button>
                  <button
                    onClick={exportJSON}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export JSON
                  </button>
                </>
              )}
            </div>

            {batchResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium">Total</p>
                    <p className="text-2xl font-bold text-blue-900">{batchResults.totalTemplates}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700 font-medium">Passed</p>
                    <p className="text-2xl font-bold text-green-900">{batchResults.passedTemplates}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-700 font-medium">Failed</p>
                    <p className="text-2xl font-bold text-red-900">{batchResults.failedTemplates}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 font-medium">Time</p>
                    <p className="text-2xl font-bold text-gray-900">{batchResults.executionTimeMs}ms</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          onClick={() => {
                            setSortField('template_code');
                            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                          }}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          Template
                        </th>
                        <th
                          onClick={() => {
                            setSortField('status');
                            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                          }}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          Status
                        </th>
                        <th
                          onClick={() => {
                            setSortField('unknownVarsCount');
                            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                          }}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          Issues
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Placeholders
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Published
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cache
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedResults.map((result) => (
                        <tr key={result.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">{result.template_code}</td>
                          <td className="px-4 py-3 text-sm">
                            {result.status === 'pass' ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                PASS
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                FAIL
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {result.unknownVarsCount > 0 ? (
                              <span className="text-red-600 font-medium">{result.unknownVarsCount}</span>
                            ) : (
                              <span className="text-green-600">0</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {result.hasPlaceholders ? (
                              <span className="text-red-600">Yes</span>
                            ) : (
                              <span className="text-green-600">No</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {result.published ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {result.cacheUsed && <span className="text-blue-600">⚡</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'random' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Shuffle className="w-5 h-5" />
                Random Audit
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Test a random sample of templates for quality assurance
              </p>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-blue-900">
                  Number of templates:
                </label>
                <input
                  type="number"
                  min="1"
                  max={templates.length}
                  value={randomCount}
                  onChange={(e) => setRandomCount(Math.max(1, Math.min(templates.length, parseInt(e.target.value) || 1)))}
                  className="w-24 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-blue-600">of {templates.length} total</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRandomAudit}
                disabled={batchLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {batchLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running Random Audit...
                  </>
                ) : (
                  <>
                    <Shuffle className="w-5 h-5" />
                    Run Random Audit
                  </>
                )}
              </button>

              {batchResults && (
                <>
                  <button
                    onClick={exportCSV}
                    className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </button>
                  <button
                    onClick={exportJSON}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export JSON
                  </button>
                </>
              )}
            </div>

            {batchResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium">Audited</p>
                    <p className="text-2xl font-bold text-blue-900">{batchResults.totalTemplates}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700 font-medium">Passed</p>
                    <p className="text-2xl font-bold text-green-900">{batchResults.passedTemplates}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-700 font-medium">Failed</p>
                    <p className="text-2xl font-bold text-red-900">{batchResults.failedTemplates}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 font-medium">Time</p>
                    <p className="text-2xl font-bold text-gray-900">{batchResults.executionTimeMs}ms</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placeholders</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedResults.map((result) => (
                        <tr key={result.id} className={result.status === 'fail' ? 'bg-red-50' : ''}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{result.template_code}</td>
                          <td className="px-4 py-3 text-sm">
                            {result.status === 'pass' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3" />
                                Fail
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {result.unknownVarsCount > 0 && (
                              <span className="text-red-600 font-medium">{result.unknownVarsCount}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{result.hasPlaceholders ? '⚠️' : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'category' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Category Audit
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Test all templates in a specific category
              </p>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-green-900">
                  Select Category:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Choose a category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({templates.filter(t => t.category === cat).length} templates)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCategoryAudit}
                disabled={batchLoading || !selectedCategory}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {batchLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running Category Audit...
                  </>
                ) : (
                  <>
                    <Filter className="w-5 h-5" />
                    Run Category Audit
                  </>
                )}
              </button>

              {batchResults && (
                <>
                  <button
                    onClick={exportCSV}
                    className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </button>
                  <button
                    onClick={exportJSON}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export JSON
                  </button>
                </>
              )}
            </div>

            {batchResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium">Total</p>
                    <p className="text-2xl font-bold text-blue-900">{batchResults.totalTemplates}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700 font-medium">Passed</p>
                    <p className="text-2xl font-bold text-green-900">{batchResults.passedTemplates}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-700 font-medium">Failed</p>
                    <p className="text-2xl font-bold text-red-900">{batchResults.failedTemplates}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 font-medium">Time</p>
                    <p className="text-2xl font-bold text-gray-900">{batchResults.executionTimeMs}ms</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedResults.map((result) => (
                        <tr key={result.id} className={result.status === 'fail' ? 'bg-red-50' : ''}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{result.template_code}</td>
                          <td className="px-4 py-3 text-sm">
                            {result.status === 'pass' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3" />
                                Fail
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {result.unknownVarsCount > 0 && (
                              <span className="text-red-600 font-medium">{result.unknownVarsCount}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{result.published ? '✓' : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'unverified' && (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Unverified Templates Audit
              </h3>
              <p className="text-sm text-orange-700 mb-4">
                Test templates that haven't been verified recently
              </p>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-orange-900">
                  Not verified in last:
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={daysUnverified}
                  onChange={(e) => setDaysUnverified(Math.max(1, Math.min(365, parseInt(e.target.value) || 7)))}
                  className="w-24 px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <span className="text-sm text-orange-600">days</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUnverifiedAudit}
                disabled={batchLoading}
                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {batchLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running Unverified Audit...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    Run Unverified Audit
                  </>
                )}
              </button>

              {batchResults && (
                <>
                  <button
                    onClick={exportCSV}
                    className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </button>
                  <button
                    onClick={exportJSON}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export JSON
                  </button>
                </>
              )}
            </div>

            {batchResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium">Unverified</p>
                    <p className="text-2xl font-bold text-blue-900">{batchResults.totalTemplates}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700 font-medium">Passed</p>
                    <p className="text-2xl font-bold text-green-900">{batchResults.passedTemplates}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-700 font-medium">Failed</p>
                    <p className="text-2xl font-bold text-red-900">{batchResults.failedTemplates}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 font-medium">Time</p>
                    <p className="text-2xl font-bold text-gray-900">{batchResults.executionTimeMs}ms</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placeholders</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedResults.map((result) => (
                        <tr key={result.id} className={result.status === 'fail' ? 'bg-red-50' : ''}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{result.template_code}</td>
                          <td className="px-4 py-3 text-sm">
                            {result.status === 'pass' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3" />
                                Fail
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {result.unknownVarsCount > 0 && (
                              <span className="text-red-600 font-medium">{result.unknownVarsCount}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{result.hasPlaceholders ? '⚠️' : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
