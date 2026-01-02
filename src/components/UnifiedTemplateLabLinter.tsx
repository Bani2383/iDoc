import React, { useState, useEffect } from 'react';
import { Code, Search, Play, CheckCircle, XCircle, AlertTriangle, FileText, Download, Zap, Square, CheckSquare, Shuffle, RefreshCw } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'selection' | 'results'>('selection');
  const [randomCount, setRandomCount] = useState(10);

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
        .select('id, name, name_en, category, template_content, template_content_en, template_variables, review_status')
        .order('created_at', { ascending: false });

      if (docError) {
        console.error('Error fetching document_templates:', docError);
      } else if (docTemplates) {
        allTemplates.push(...docTemplates.map(t => ({
          id: t.id,
          name: t.name,
          title: t.name_en || t.name,
          category: t.category || 'other',
          content_template: t.template_content || '',
          schema_json: t.template_variables || {},
          review_status: t.review_status,
          source: 'document_templates' as const
        })));
      }

      const { data: idocTemplates, error: idocError } = await supabase
        .from('idoc_guided_templates')
        .select('id, template_code, title, category, template_content, required_variables, optional_variables')
        .order('created_at', { ascending: false });

      if (idocError) {
        console.error('Error fetching idoc_guided_templates:', idocError);
      } else if (idocTemplates) {
        const mappedIdoc = idocTemplates.map(t => {
          const titleObj = t.title || {};
          const titleText = (typeof titleObj === 'object' ? (titleObj as any).en || (titleObj as any).fr : null) || t.template_code;

          const contentObj = t.template_content || {};
          const contentText = extractContentFromTemplateContent(contentObj);

          const allVars = {
            fields: [
              ...((t.required_variables as any)?.fields || []),
              ...((t.optional_variables as any)?.fields || [])
            ]
          };

          return {
            id: t.id,
            name: t.template_code,
            title: titleText,
            category: t.category || 'other',
            content_template: contentText,
            schema_json: allVars,
            source: 'idoc_guided_templates' as const
          };
        });
        allTemplates.push(...mappedIdoc);
      }

      setTemplates(allTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractContentFromTemplateContent = (templateContent: any): string => {
    if (!templateContent) return '';

    if (typeof templateContent === 'string') {
      return templateContent;
    }

    if (typeof templateContent === 'object') {
      if (templateContent.fr || templateContent.en) {
        return templateContent.fr || templateContent.en || '';
      }

      if (Array.isArray(templateContent)) {
        return templateContent.map((section: any) => {
          if (typeof section === 'string') return section;
          if (section.content) return section.content;
          if (section.template) return section.template;
          return '';
        }).join('\n\n');
      }

      return JSON.stringify(templateContent);
    }

    return '';
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
    setViewMode('results');

    const results: LintResult[] = [];
    const templatesToLint = templates.filter(t => selectedIds.has(t.id));

    for (const template of templatesToLint) {
      const result = lintTemplate(template);
      results.push(result);
    }

    setLintResults(results);
    setLinting(false);
  };

  const autoFixSelected = async () => {
    if (selectedIds.size === 0) {
      alert('Selectionnez au moins un template');
      return;
    }

    if (!confirm(`Auto-corriger ${selectedIds.size} template(s)?\n\nCeci va:\n- Supprimer les placeholders TODO/FIXME\n- Ajouter les variables manquantes\n- Mettre a jour le statut`)) {
      return;
    }

    setLinting(true);
    let fixed = 0;
    let failed = 0;

    for (const templateId of Array.from(selectedIds)) {
      const template = templates.find(t => t.id === templateId);
      if (!template || template.source !== 'idoc_guided_templates') {
        failed++;
        continue;
      }

      try {
        const { data: currentTemplate } = await supabase
          .from('idoc_guided_templates')
          .select('*')
          .eq('id', templateId)
          .maybeSingle();

        if (!currentTemplate) {
          failed++;
          continue;
        }

        let updatedContent = currentTemplate.template_content;
        let updatedRequired = currentTemplate.required_variables || { fields: [] };
        let updatedOptional = currentTemplate.optional_variables || { fields: [] };
        let changesMade = false;

        if (typeof updatedContent === 'string') {
          const cleanedContent = updatedContent
            .replace(/\[TODO\]/gi, '')
            .replace(/\[FIXME\]/gi, '')
            .replace(/\[XXX\]/gi, '')
            .replace(/TODO:/gi, '')
            .replace(/FIXME:/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

          if (cleanedContent !== updatedContent) {
            updatedContent = cleanedContent;
            changesMade = true;
          }
        }

        const result = lintTemplate({ ...template, content_template: getContentString(updatedContent) });

        if (result.unknownVars.length > 0) {
          if (!updatedOptional.fields) {
            updatedOptional.fields = [];
          }

          const existingNames = updatedOptional.fields.map((f: any) => f.name || f);

          for (const varName of result.unknownVars) {
            if (!existingNames.includes(varName)) {
              updatedOptional.fields.push({
                name: varName,
                type: 'text',
                label: { en: varName, fr: varName },
                required: false,
                placeholder: { en: `Enter ${varName}`, fr: `Saisissez ${varName}` }
              });
              changesMade = true;
            }
          }
        }

        if (changesMade) {
          const { error } = await supabase
            .from('idoc_guided_templates')
            .update({
              template_content: updatedContent,
              optional_variables: updatedOptional,
              status: 'verified',
              last_verified_at: new Date().toISOString(),
              verification_required: false
            })
            .eq('id', templateId);

          if (error) {
            console.error('Auto-fix error:', error);
            failed++;
          } else {
            fixed++;
          }
        } else {
          fixed++;
        }
      } catch (error) {
        console.error('Auto-fix exception:', error);
        failed++;
      }
    }

    setLinting(false);
    alert(`Auto-correction terminee!\n\n✅ Corriges: ${fixed}\n❌ Echecs: ${failed}`);

    await fetchAllTemplates();
  };

  const getContentString = (content: any): string => {
    if (typeof content === 'string') return content;
    if (typeof content === 'object') return JSON.stringify(content);
    return '';
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

  const selectRandom = () => {
    const count = Math.min(randomCount, filteredTemplates.length);
    const shuffled = [...filteredTemplates].sort(() => Math.random() - 0.5);
    const randomSelection = shuffled.slice(0, count);
    setSelectedIds(new Set(randomSelection.map(t => t.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
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
    total: templates.length,
    filtered: filteredTemplates.length,
    selected: selectedIds.size,
    document_templates: templates.filter(t => t.source === 'document_templates').length,
    idoc_guided_templates: templates.filter(t => t.source === 'idoc_guided_templates').length,
  };

  const lintStats = {
    total: lintResults.length,
    passed: lintResults.filter(r => r.ok).length,
    failed: lintResults.filter(r => !r.ok).length,
    avgScore: lintResults.length > 0
      ? Math.round(lintResults.reduce((sum, r) => sum + r.score, 0) / lintResults.length)
      : 0
  };

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
          <p className="text-gray-600">Chargement de {stats.total} templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Template Lab & Linter</h1>
                <p className="text-blue-100 mt-1">Sélectionnez et analysez vos documents</p>
              </div>
            </div>
            <button
              onClick={() => {
                setViewMode('selection');
                setSelectedTemplate(null);
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Nouvelle Sélection
            </button>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Total</p>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-xs text-blue-200 mt-1">documents</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Affichés</p>
              <p className="text-3xl font-bold">{stats.filtered}</p>
              <p className="text-xs text-blue-200 mt-1">après filtres</p>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur rounded-lg p-4 border-2 border-yellow-400">
              <p className="text-yellow-100 text-sm mb-1">Sélectionnés</p>
              <p className="text-3xl font-bold text-yellow-300">{stats.selected}</p>
              <p className="text-xs text-yellow-200 mt-1">pour analyse</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">Document</p>
              <p className="text-3xl font-bold">{stats.document_templates}</p>
              <p className="text-xs text-blue-200 mt-1">templates</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-100 text-sm mb-1">iDoc</p>
              <p className="text-3xl font-bold">{stats.idoc_guided_templates}</p>
              <p className="text-xs text-blue-200 mt-1">templates</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'selection' ? (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Filtres et Sélection</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              </div>

              <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <button
                  onClick={toggleSelectAll}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                  {selectedIds.size === filteredTemplates.length && filteredTemplates.length > 0 ? (
                    <>
                      <Square className="w-4 h-4" />
                      Tout Désélectionner
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      Tout Sélectionner ({filteredTemplates.length})
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={filteredTemplates.length}
                    value={randomCount}
                    onChange={(e) => setRandomCount(parseInt(e.target.value) || 10)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={selectRandom}
                    disabled={filteredTemplates.length === 0}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
                  >
                    <Shuffle className="w-4 h-4" />
                    Sélection Aléatoire
                  </button>
                </div>

                <button
                  onClick={clearSelection}
                  disabled={selectedIds.size === 0}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 disabled:bg-gray-300 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Effacer ({selectedIds.size})
                </button>

                <button
                  onClick={handleLintSelected}
                  disabled={linting || selectedIds.size === 0}
                  className="ml-auto bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {linting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      ANALYSER {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
                    </>
                  )}
                </button>

                <button
                  onClick={autoFixSelected}
                  disabled={linting || selectedIds.size === 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {linting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Correction...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      AUTO-CORRIGER {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
                    </>
                  )}
                </button>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                {stats.filtered} document{stats.filtered > 1 ? 's' : ''} disponible{stats.filtered > 1 ? 's' : ''} • {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const isSelected = selectedIds.has(template.id);
                return (
                  <div
                    key={template.id}
                    onClick={() => toggleSelectTemplate(template.id)}
                    className={`
                      cursor-pointer rounded-lg p-4 border-2 transition-all hover:shadow-lg
                      ${isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-md'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        {isSelected ? (
                          <CheckSquare className="w-6 h-6 text-blue-600" />
                        ) : (
                          <Square className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {template.title || template.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                            template.source === 'document_templates'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {template.source === 'document_templates' ? 'Document' : 'iDoc'}
                          </span>
                          {template.category && (
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                              {template.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-mono truncate">
                          ID: {template.id.substring(0, 12)}...
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun document trouvé</h3>
                <p className="text-gray-600">Essayez de modifier vos filtres</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Résultats de l'Analyse</h2>
                <div className="flex gap-3">
                  <button
                    onClick={exportResults}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Download className="w-4 h-4" />
                    Exporter CSV
                  </button>
                  <button
                    onClick={() => setViewMode('selection')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    Retour à la sélection
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Analysés</p>
                  <p className="text-3xl font-bold text-gray-900">{lintStats.total}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Réussis</p>
                  <p className="text-3xl font-bold text-green-600">{lintStats.passed}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600 mb-1">Échecs</p>
                  <p className="text-3xl font-bold text-red-600">{lintStats.failed}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Score Moyen</p>
                  <p className="text-3xl font-bold text-blue-600">{lintStats.avgScore}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {lintResults.map((result) => {
                const template = templates.find(t => t.id === result.templateId);
                return (
                  <div key={result.templateId} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{result.templateName}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            template?.source === 'document_templates'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {template?.source === 'document_templates' ? 'Document' : 'iDoc'}
                          </span>
                          <span className="text-sm text-gray-500">ID: {result.templateId.substring(0, 12)}...</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {result.ok ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-6 h-6" />
                            <span className="text-lg font-bold">PASS</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-600">
                            <XCircle className="w-6 h-6" />
                            <span className="text-lg font-bold">FAIL</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${
                                result.score >= 80 ? 'bg-green-500' :
                                result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${result.score}%` }}
                            />
                          </div>
                          <p className="text-sm font-bold text-gray-900 mt-1">{result.score}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600 mb-1">Variables utilisées</p>
                        <p className="text-2xl font-bold text-gray-900">{result.varsUsed.length}</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded">
                        <p className="text-sm text-red-600 mb-1">Variables inconnues</p>
                        <p className="text-2xl font-bold text-red-600">{result.unknownVars.length}</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded">
                        <p className="text-sm text-yellow-600 mb-1">Champs manquants</p>
                        <p className="text-2xl font-bold text-yellow-600">{result.missingFields.length}</p>
                      </div>
                    </div>

                    {(result.unknownVars.length > 0 || result.missingFields.length > 0 || result.hasPlaceholders) && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        {result.unknownVars.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-red-900 mb-2">Variables inconnues:</p>
                            <div className="flex flex-wrap gap-2">
                              {result.unknownVars.map(v => (
                                <code key={v} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">{v}</code>
                              ))}
                            </div>
                          </div>
                        )}
                        {result.missingFields.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-yellow-900 mb-2">Champs requis non utilisés:</p>
                            <div className="flex flex-wrap gap-2">
                              {result.missingFields.map(f => (
                                <code key={f} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">{f}</code>
                              ))}
                            </div>
                          </div>
                        )}
                        {result.hasPlaceholders && (
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                            <p className="text-sm font-semibold text-orange-900">Placeholders TODO/FIXME détectés</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
