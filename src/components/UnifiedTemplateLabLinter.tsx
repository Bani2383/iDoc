import React, { useState, useEffect } from 'react';
import { Code, Search, Play, CheckCircle, XCircle, AlertTriangle, FileText, Download, Zap, Square, CheckSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Template {
  id: string;
  name: string;
  title: string;
  category: string;
  content_template: string;
  schema_json: any;
  review_status?: string;
  source: 'document_templates' | 'idoc_guided_templates';
}

interface LintResult {
  templateId: string;
  templateName: string;
  ok: boolean;
  varsUsed: string[];
  unknownVars: string[];
  hasPlaceholders: boolean;
  missingFields: string[];
  score: number;
}

export const UnifiedTemplateLabLinter: React.FC = () => {
  const { profile } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [linting, setLinting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'document_templates' | 'idoc_guided_templates'>('all');
  const [lintResults, setLintResults] = useState<LintResult[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAllTemplates();
    }
  }, [profile]);

  const fetchAllTemplates = async () => {
    setLoading(true);
    try {
      const allTemplates: Template[] = [];

      const { data: docTemplates, error: docError } = await supabase
        .from('document_templates')
        .select('id, name, title, category, content_template, schema_json, review_status')
        .order('created_at', { ascending: false });

      if (!docError && docTemplates) {
        allTemplates.push(...docTemplates.map(t => ({ ...t, source: 'document_templates' as const })));
      }

      const { data: idocTemplates, error: idocError } = await supabase
        .from('idoc_guided_templates')
        .select('id, template_code, title_translations, category, sections, metadata')
        .order('created_at', { ascending: false });

      if (!idocError && idocTemplates) {
        allTemplates.push(...idocTemplates.map(t => ({
          id: t.id,
          name: t.template_code,
          title: typeof t.title_translations === 'object' ? (t.title_translations as any).en || (t.title_translations as any).fr : t.template_code,
          category: t.category || 'other',
          content_template: extractContentFromSections(t.sections),
          schema_json: t.metadata,
          source: 'idoc_guided_templates' as const
        })));
      }

      setTemplates(allTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractContentFromSections = (sections: any): string => {
    if (!sections || !Array.isArray(sections)) return '';
    return sections.map((s: any) => s.content_template || '').join('\n\n');
  };

  const lintTemplate = (template: Template): LintResult => {
    const content = template.content_template || '';
    const varsUsed: string[] = [];
    const unknownVars: string[] = [];
    let hasPlaceholders = false;
    const missingFields: string[] = [];

    const placeholderRegex = /\[TODO\]|\[FIXME\]|\[XXX\]|TODO:|FIXME:/gi;
    if (placeholderRegex.test(content)) {
      hasPlaceholders = true;
    }

    const varRegex = /\{\{([^}]+)\}\}/g;
    let match;

    while ((match = varRegex.exec(content)) !== null) {
      const varName = match[1].trim();

      if (varName.startsWith('#') || varName.startsWith('/')) continue;
      if (varName === 'this') continue;

      const helperMatch = varName.match(/^(\w+)\s+(.+)/);
      if (helperMatch) {
        const helper = helperMatch[1];
        const knownHelpers = ['if', 'unless', 'each', 'with', 'eq', 'ne', 'lt', 'gt', 'and', 'or', 'not', 'boolFR'];
        if (knownHelpers.includes(helper)) continue;
      }

      if (!varsUsed.includes(varName)) {
        varsUsed.push(varName);
      }

      const fields = template.schema_json?.fields || [];
      const fieldNames = fields.map((f: any) => f.name);

      if (!fieldNames.includes(varName)) {
        if (!unknownVars.includes(varName)) {
          unknownVars.push(varName);
        }
      }
    }

    const requiredFields = (template.schema_json?.fields || [])
      .filter((f: any) => f.required)
      .map((f: any) => f.name);

    requiredFields.forEach((fieldName: string) => {
      if (!varsUsed.includes(fieldName)) {
        missingFields.push(fieldName);
      }
    });

    const totalIssues = unknownVars.length + (hasPlaceholders ? 5 : 0) + missingFields.length;
    const score = Math.max(0, 100 - (totalIssues * 10));

    return {
      templateId: template.id,
      templateName: template.title || template.name,
      ok: unknownVars.length === 0 && !hasPlaceholders && missingFields.length === 0,
      varsUsed,
      unknownVars,
      hasPlaceholders,
      missingFields,
      score
    };
  };

  const handleLintSelected = async () => {
    if (selectedIds.size === 0) return;

    setLinting(true);
    setShowResults(true);

    const results: LintResult[] = [];
    const templatesToLint = templates.filter(t => selectedIds.has(t.id));

    for (const template of templatesToLint) {
      const result = lintTemplate(template);
      results.push(result);
    }

    setLintResults(results);
    setLinting(false);
  };

  const handleLintSingle = (template: Template) => {
    const result = lintTemplate(template);
    setLintResults([result]);
    setSelectedTemplate(template);
    setShowResults(true);
  };

  const toggleSelectTemplate = (templateId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(templateId)) {
      newSelected.delete(templateId);
    } else {
      newSelected.add(templateId);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTemplates.length && filteredTemplates.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTemplates.map(t => t.id)));
    }
  };

  const exportResults = () => {
    const csv = [
      ['Template', 'Source', 'Status', 'Score', 'Unknown Vars', 'Placeholders', 'Missing Fields'],
      ...lintResults.map(r => [
        r.templateName,
        templates.find(t => t.id === r.templateId)?.source || '',
        r.ok ? 'PASS' : 'FAIL',
        r.score.toString(),
        r.unknownVars.join('; '),
        r.hasPlaceholders ? 'YES' : 'NO',
        r.missingFields.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lint-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredTemplates = templates.filter(t =>
    (searchQuery === '' ||
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (categoryFilter === '' || t.category === categoryFilter) &&
    (sourceFilter === 'all' || t.source === sourceFilter)
  );

  const categories = Array.from(new Set(templates.map(t => t.category))).filter(Boolean);

  const stats = {
    total: filteredTemplates.length,
    document_templates: filteredTemplates.filter(t => t.source === 'document_templates').length,
    idoc_guided_templates: filteredTemplates.filter(t => t.source === 'idoc_guided_templates').length,
    selected: selectedIds.size,
  };

  const lintStats = {
    total: lintResults.length,
    passed: lintResults.filter(r => r.ok).length,
    failed: lintResults.filter(r => !r.ok).length,
    avgScore: lintResults.length > 0
      ? Math.round(lintResults.reduce((sum, r) => sum + r.score, 0) / lintResults.length)
      : 0
  };

  const allSelected = filteredTemplates.length > 0 && selectedIds.size === filteredTemplates.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < filteredTemplates.length;

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Restreint</h2>
          <p className="text-gray-600">Vous devez être administrateur pour accéder à cet outil.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Chargement des templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Template Lab & Linter Unifié</h1>
              <p className="text-blue-100 mt-1">Sélectionnez et analysez vos templates</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Total Templates</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Sélectionnés</p>
              <p className="text-3xl font-bold text-yellow-300">{stats.selected}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Document</p>
              <p className="text-3xl font-bold">{stats.document_templates}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">iDoc</p>
              <p className="text-3xl font-bold">{stats.idoc_guided_templates}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un template..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes sources</option>
              <option value="document_templates">Document Templates</option>
              <option value="idoc_guided_templates">iDoc Templates</option>
            </select>

            <button
              onClick={handleLintSelected}
              disabled={linting || selectedIds.size === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {linting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Analyser ({selectedIds.size})
                </>
              )}
            </button>
          </div>

          {lintResults.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-600">Analysés</p>
                  <p className="text-2xl font-bold text-gray-900">{lintStats.total}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Réussis</p>
                  <p className="text-2xl font-bold text-green-600">{lintStats.passed}</p>
                </div>
                <div>
                  <p className="text-sm text-red-600">Échecs</p>
                  <p className="text-2xl font-bold text-red-600">{lintStats.failed}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Score Moyen</p>
                  <p className="text-2xl font-bold text-blue-600">{lintStats.avgScore}%</p>
                </div>
              </div>
              <button
                onClick={exportResults}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Download className="w-4 h-4" />
                Exporter CSV
              </button>
            </div>
          )}
        </div>

        {showResults && lintResults.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={toggleSelectAll}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {allSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variables</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Problèmes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lintResults.map((result) => {
                    const template = templates.find(t => t.id === result.templateId);
                    if (!template) return null;
                    return (
                      <tr key={result.templateId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleSelectTemplate(template.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {selectedIds.has(template.id) ?
                              <CheckSquare className="w-5 h-5 text-blue-600" /> :
                              <Square className="w-5 h-5" />
                            }
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{result.templateName}</p>
                            <p className="text-sm text-gray-500">{result.templateId.substring(0, 8)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            template?.source === 'document_templates'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {template?.source === 'document_templates' ? 'Doc' : 'iDoc'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {result.ok ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">PASS</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600">
                              <XCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">FAIL</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  result.score >= 80 ? 'bg-green-500' :
                                  result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${result.score}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-12">{result.score}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-900">{result.varsUsed.length} utilisées</p>
                            {result.unknownVars.length > 0 && (
                              <p className="text-red-600">{result.unknownVars.length} inconnues</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {result.unknownVars.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                <AlertTriangle className="w-3 h-3" />
                                {result.unknownVars.length} var inconnues
                              </span>
                            )}
                            {result.hasPlaceholders && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                                <AlertTriangle className="w-3 h-3" />
                                Placeholders
                              </span>
                            )}
                            {result.missingFields.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                <AlertTriangle className="w-3 h-3" />
                                {result.missingFields.length} champs manquants
                              </span>
                            )}
                            {result.ok && (
                              <span className="text-green-600 text-sm">Aucun</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedTemplate(template || null);
                              setLintResults([result]);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Détails →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={toggleSelectAll}
                        className="text-gray-500 hover:text-gray-700"
                        title={allSelected ? "Tout désélectionner" : "Tout sélectionner"}
                      >
                        {allSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : someSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTemplates.map((template) => (
                    <tr
                      key={template.id}
                      className={`hover:bg-gray-50 ${selectedIds.has(template.id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleSelectTemplate(template.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {selectedIds.has(template.id) ?
                            <CheckSquare className="w-5 h-5 text-blue-600" /> :
                            <Square className="w-5 h-5" />
                          }
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{template.title || template.name}</p>
                          <p className="text-sm text-gray-500">{template.id.substring(0, 8)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          template.source === 'document_templates'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {template.source === 'document_templates' ? 'Document' : 'iDoc'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{template.category || '-'}</td>
                      <td className="px-6 py-4">
                        {template.review_status && (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            template.review_status === 'published' ? 'bg-blue-100 text-blue-800' :
                            template.review_status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {template.review_status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleLintSingle(template)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        >
                          <Code className="w-4 h-4" />
                          Analyser
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTemplate && lintResults.length === 1 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setShowResults(false);
                setLintResults([]);
              }}
              className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
            >
              ← Retour à la liste
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedTemplate.title || selectedTemplate.name}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  Résultats du Lint
                </h3>

                {lintResults[0].unknownVars.length > 0 && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-semibold text-red-900 mb-2">Variables inconnues ({lintResults[0].unknownVars.length})</p>
                    <div className="space-y-1">
                      {lintResults[0].unknownVars.map(v => (
                        <p key={v} className="text-sm text-red-700 font-mono bg-red-100 px-2 py-1 rounded">{v}</p>
                      ))}
                    </div>
                  </div>
                )}

                {lintResults[0].missingFields.length > 0 && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-semibold text-yellow-900 mb-2">Champs requis non utilisés ({lintResults[0].missingFields.length})</p>
                    <div className="space-y-1">
                      {lintResults[0].missingFields.map(f => (
                        <p key={f} className="text-sm text-yellow-700 font-mono bg-yellow-100 px-2 py-1 rounded">{f}</p>
                      ))}
                    </div>
                  </div>
                )}

                {lintResults[0].hasPlaceholders && (
                  <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-semibold text-orange-900">Placeholders détectés</p>
                    <p className="text-sm text-orange-700 mt-1">Des marqueurs TODO/FIXME ont été trouvés dans le template.</p>
                  </div>
                )}

                {lintResults[0].ok && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-semibold text-green-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Template valide
                    </p>
                    <p className="text-sm text-green-700 mt-1">Toutes les variables sont correctement définies.</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Informations
                </h3>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Variables utilisées</p>
                    <p className="text-2xl font-bold text-gray-900">{lintResults[0].varsUsed.length}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Score de qualité</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            lintResults[0].score >= 80 ? 'bg-green-500' :
                            lintResults[0].score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${lintResults[0].score}%` }}
                        />
                      </div>
                      <span className="text-xl font-bold text-gray-900">{lintResults[0].score}%</span>
                    </div>
                  </div>

                  {lintResults[0].varsUsed.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Liste des variables</p>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {lintResults[0].varsUsed.map(v => (
                          <p key={v} className="text-xs text-gray-700 font-mono bg-white px-2 py-1 rounded">{v}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
