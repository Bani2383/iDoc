import React, { useState, useEffect } from 'react';
import { Code, Search, Play, CheckCircle, XCircle, AlertTriangle, FileText, Download, Zap, Square, CheckSquare, Shuffle, RefreshCw, Eye, Shield, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { runRenderSmokeTest, isEligibleForProduction, type SmokeTestResult } from '../lib/templateSafety';

interface Template {
  id: string;
  name: string;
  title: string;
  category: string;
  content_template: string;
  schema_json: any;
  review_status?: string;
  source: 'document_templates' | 'idoc_guided_templates';
  status?: string;
  verification_required?: boolean;
  last_verified_at?: string;
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

interface PreviewResult {
  template_id: string;
  template_code: string;
  changes_proposed: {
    placeholders_to_remove: string[];
    variables_to_add: Array<{
      name: string;
      type: string;
      label: { en: string; fr: string };
    }>;
    status_change: { from: string; to: string };
  };
  before: {
    hasPlaceholders: boolean;
    unknownVars: string[];
    status: string;
    eligible_for_production: boolean;
  };
  smoke_test: SmokeTestResult;
  will_be_eligible: boolean;
  issues_count: number;
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
  const [viewMode, setViewMode] = useState<'selection' | 'results' | 'preview' | 'edit'>('selection');
  const [randomCount, setRandomCount] = useState(10);
  const [previewResults, setPreviewResults] = useState<PreviewResult[]>([]);
  const [previewing, setPreviewing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [saving, setSaving] = useState(false);

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
      alert('Veuillez sélectionner au moins un template à valider');
      return;
    }

    if (!confirm(`Validation automatique de ${selectedIds.size} template(s)\n\nActions de correction:\n• Suppression des placeholders (TODO, FIXME)\n• Ajout des variables manquantes aux métadonnées\n• Mise à jour du statut de validation\n\nConfirmer l'application de ces corrections?`)) {
      return;
    }

    setLinting(true);
    let fixed = 0;
    let failed = 0;

    for (const templateId of Array.from(selectedIds)) {
      const template = templates.find(t => t.id === templateId);
      if (!template || template.source !== 'idoc_guided_templates') {
        console.log(`Skipping template ${templateId} - not idoc_guided_templates`);
        failed++;
        continue;
      }

      try {
        const { data: currentTemplate, error: fetchError } = await supabase
          .from('idoc_guided_templates')
          .select('*')
          .eq('id', templateId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching template:', fetchError);
          failed++;
          continue;
        }

        if (!currentTemplate) {
          console.log(`Template ${templateId} not found`);
          failed++;
          continue;
        }

        console.log(`Processing template ${currentTemplate.template_code}`);

        let updatedContent = currentTemplate.template_content;
        let updatedOptional = currentTemplate.optional_variables || { fields: [] };
        let changesMade = false;

        // Nettoyer le contenu des placeholders (SAFE ONLY corrections)
        const contentStr = getContentString(updatedContent);
        const cleanedContent = contentStr
          .replace(/\[TODO\]/gi, '')
          .replace(/\[FIXME\]/gi, '')
          .replace(/\[XXX\]/gi, '')
          .replace(/TODO:/gi, '')
          .replace(/FIXME:/gi, '')
          .replace(/\{\{TODO\}\}/gi, '')
          .replace(/\{\{FIXME\}\}/gi, '')
          .replace(/\s+/g, ' ')
          .trim();

        if (cleanedContent !== contentStr) {
          // Si le contenu original était un objet, on doit le reconstruire
          if (typeof currentTemplate.template_content === 'object' && currentTemplate.template_content !== null) {
            if (Array.isArray(currentTemplate.template_content)) {
              updatedContent = currentTemplate.template_content.map((section: any) => {
                if (typeof section === 'string') {
                  return section
                    .replace(/\[TODO\]/gi, '')
                    .replace(/\[FIXME\]/gi, '')
                    .replace(/\[XXX\]/gi, '')
                    .replace(/TODO:/gi, '')
                    .replace(/FIXME:/gi, '');
                }
                if (section.content) {
                  return {
                    ...section,
                    content: section.content
                      .replace(/\[TODO\]/gi, '')
                      .replace(/\[FIXME\]/gi, '')
                      .replace(/\[XXX\]/gi, '')
                      .replace(/TODO:/gi, '')
                      .replace(/FIXME:/gi, '')
                  };
                }
                return section;
              });
            } else if (currentTemplate.template_content.fr || currentTemplate.template_content.en) {
              updatedContent = {
                ...currentTemplate.template_content,
                fr: (currentTemplate.template_content.fr || '')
                  .replace(/\[TODO\]/gi, '')
                  .replace(/\[FIXME\]/gi, '')
                  .replace(/\[XXX\]/gi, '')
                  .replace(/TODO:/gi, '')
                  .replace(/FIXME:/gi, ''),
                en: (currentTemplate.template_content.en || '')
                  .replace(/\[TODO\]/gi, '')
                  .replace(/\[FIXME\]/gi, '')
                  .replace(/\[XXX\]/gi, '')
                  .replace(/TODO:/gi, '')
                  .replace(/FIXME:/gi, '')
              };
            }
          } else {
            updatedContent = cleanedContent;
          }
          changesMade = true;
          console.log(`Removed placeholders from ${currentTemplate.template_code}`);
        }

        // Analyser les variables manquantes
        const templateForLint: Template = {
          id: currentTemplate.id,
          name: currentTemplate.template_code,
          title: currentTemplate.template_code,
          category: currentTemplate.category || 'other',
          content_template: cleanedContent,
          schema_json: {
            fields: [
              ...((currentTemplate.required_variables as any)?.fields || []),
              ...((currentTemplate.optional_variables as any)?.fields || [])
            ]
          },
          source: 'idoc_guided_templates'
        };

        const result = lintTemplate(templateForLint);

        if (result.unknownVars.length > 0) {
          if (!(updatedOptional as any).fields) {
            (updatedOptional as any).fields = [];
          }

          const existingNames = ((updatedOptional as any).fields || []).map((f: any) => f.name || f);

          for (const varName of result.unknownVars) {
            if (!existingNames.includes(varName)) {
              (updatedOptional as any).fields.push({
                name: varName,
                type: 'text',
                label: { en: varName, fr: varName },
                required: false,
                placeholder: { en: `Enter ${varName}`, fr: `Saisissez ${varName}` }
              });
              changesMade = true;
            }
          }
          console.log(`Added ${result.unknownVars.length} missing variables to ${currentTemplate.template_code}`);
        }

        // Run smoke test to verify template can be rendered safely
        const templateForSmokeTest = {
          ...currentTemplate,
          template_content: updatedContent,
          optional_variables: updatedOptional
        };

        const smokeTest = runRenderSmokeTest(templateForSmokeTest);

        console.log(`Smoke test for ${currentTemplate.template_code}:`, smokeTest);

        // Determine new status based on smoke test
        let newStatus = currentTemplate.status || 'draft';
        let verificationRequired = true;

        if (smokeTest.success && !smokeTest.warnings.length && changesMade) {
          // All checks passed, safe to mark as verified
          newStatus = 'verified';
          verificationRequired = false;
        } else if (smokeTest.success && smokeTest.warnings.length > 0) {
          // Passed but has warnings - needs review
          newStatus = 'draft';
          verificationRequired = true;
          console.warn(`Template ${currentTemplate.template_code} has warnings:`, smokeTest.warnings);
        } else if (!smokeTest.success) {
          // Failed smoke test - do not verify
          newStatus = 'draft';
          verificationRequired = true;
          console.error(`Template ${currentTemplate.template_code} failed smoke test:`, smokeTest.error);
        }

        if (changesMade || newStatus !== currentTemplate.status) {
          const updateData: any = {
            template_content: updatedContent,
            optional_variables: updatedOptional,
            status: newStatus,
            verification_required: verificationRequired,
            updated_at: new Date().toISOString()
          };

          // Only set last_verified_at if we're marking as verified
          if (newStatus === 'verified' && !verificationRequired) {
            updateData.last_verified_at = new Date().toISOString();
          }

          const { error } = await supabase
            .from('idoc_guided_templates')
            .update(updateData)
            .eq('id', templateId);

          if (error) {
            console.error('Auto-fix error for', currentTemplate.template_code, error);
            failed++;
          } else {
            const statusMsg = newStatus === 'verified' ? '✓ VERIFIED' : `⚠ ${newStatus.toUpperCase()}`;
            console.log(`Successfully processed ${currentTemplate.template_code}: ${statusMsg}`);
            fixed++;
          }
        } else {
          console.log(`No changes needed for ${currentTemplate.template_code}`);
          fixed++;
        }
      } catch (error) {
        console.error('Auto-fix exception:', error);
        failed++;
      }
    }

    setLinting(false);
    alert(`Validation automatique terminée\n\n✓ Templates validés et corrigés: ${fixed}\n✗ Échecs de validation: ${failed}\n\nLes templates ont été mis à jour dans la base de données.`);

    await fetchAllTemplates();
  };

  const previewValidation = async () => {
    if (selectedIds.size === 0) {
      alert('Veuillez sélectionner au moins un template à prévisualiser');
      return;
    }

    setPreviewing(true);
    setViewMode('preview');
    const previews: PreviewResult[] = [];

    for (const templateId of Array.from(selectedIds)) {
      const template = templates.find(t => t.id === templateId);
      if (!template || template.source !== 'idoc_guided_templates') {
        console.log(`Skipping template ${templateId} - not idoc_guided_templates`);
        continue;
      }

      try {
        const { data: currentTemplate, error: fetchError } = await supabase
          .from('idoc_guided_templates')
          .select('*')
          .eq('id', templateId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching template:', fetchError);
          continue;
        }

        if (!currentTemplate) {
          console.log(`Template ${templateId} not found in database`);
          continue;
        }

        const placeholdersToRemove: string[] = [];
        const variablesToAdd: Array<{ name: string; type: string; label: { en: string; fr: string } }> = [];

        // Extraire le contenu en string
        let contentStr = getContentString(currentTemplate.template_content);

        console.log(`Analyzing template ${currentTemplate.template_code}, content length: ${contentStr.length}`);

        // Détecter les placeholders (SAFE ONLY corrections)
        const placeholderPatterns = [
          { pattern: /\[TODO\]/gi, name: '[TODO]' },
          { pattern: /\[FIXME\]/gi, name: '[FIXME]' },
          { pattern: /\[XXX\]/gi, name: '[XXX]' },
          { pattern: /TODO:/gi, name: 'TODO:' },
          { pattern: /FIXME:/gi, name: 'FIXME:' },
          { pattern: /\{\{TODO\}\}/gi, name: '{{TODO}}' },
          { pattern: /\{\{FIXME\}\}/gi, name: '{{FIXME}}' },
        ];

        for (const { pattern, name } of placeholderPatterns) {
          const matches = contentStr.match(pattern);
          if (matches && matches.length > 0) {
            placeholdersToRemove.push(`${name} (${matches.length}x)`);
          }
        }

        // Créer un objet template compatible avec lintTemplate
        const templateForLint: Template = {
          id: currentTemplate.id,
          name: currentTemplate.template_code,
          title: currentTemplate.template_code,
          category: currentTemplate.category || 'other',
          content_template: contentStr,
          schema_json: {
            fields: [
              ...((currentTemplate.required_variables as any)?.fields || []),
              ...((currentTemplate.optional_variables as any)?.fields || [])
            ]
          },
          source: 'idoc_guided_templates',
          status: currentTemplate.status,
          verification_required: currentTemplate.verification_required
        };

        const result = lintTemplate(templateForLint);

        console.log(`Lint result for ${currentTemplate.template_code}:`, {
          unknownVars: result.unknownVars.length,
          hasPlaceholders: result.hasPlaceholders
        });

        const updatedOptional = currentTemplate.optional_variables || { fields: [] };
        const existingNames = ((updatedOptional as any).fields || []).map((f: any) => f.name || f);

        for (const varName of result.unknownVars) {
          if (!existingNames.includes(varName)) {
            variablesToAdd.push({
              name: varName,
              type: 'text',
              label: { en: varName, fr: varName }
            });
          }
        }

        // Run smoke test on the template as it would be after fixes
        const templateAfterFixes = {
          ...currentTemplate,
          template_content: contentStr,
          optional_variables: {
            ...currentTemplate.optional_variables,
            fields: [
              ...((currentTemplate.optional_variables as any)?.fields || []),
              ...variablesToAdd.map(v => ({
                name: v.name,
                type: v.type,
                label: v.label,
                required: false
              }))
            ]
          }
        };

        const smokeTest = runRenderSmokeTest(templateAfterFixes);

        console.log(`Smoke test for ${currentTemplate.template_code}:`, smokeTest);

        const issuesCount = placeholdersToRemove.length + variablesToAdd.length;

        // Determine if template will be eligible for production after fixes
        const willBeVerified = smokeTest.success && !smokeTest.warnings.length && issuesCount > 0;
        const willBeEligible = willBeVerified;

        const statusChange = willBeVerified
          ? { from: currentTemplate.status || 'draft', to: 'verified' }
          : { from: currentTemplate.status || 'draft', to: currentTemplate.status || 'draft' };

        const isCurrentlyEligible = isEligibleForProduction(currentTemplate);

        previews.push({
          template_id: templateId,
          template_code: currentTemplate.template_code,
          changes_proposed: {
            placeholders_to_remove: placeholdersToRemove,
            variables_to_add: variablesToAdd,
            status_change: statusChange
          },
          before: {
            hasPlaceholders: placeholdersToRemove.length > 0,
            unknownVars: result.unknownVars,
            status: currentTemplate.status || 'draft',
            eligible_for_production: isCurrentlyEligible
          },
          smoke_test: smokeTest,
          will_be_eligible: willBeEligible,
          issues_count: issuesCount
        });

        console.log(`Added preview for ${currentTemplate.template_code}, issues: ${issuesCount}`);
      } catch (error) {
        console.error('Preview error for template', templateId, error);
      }
    }

    console.log(`Preview complete: ${previews.length} templates analyzed`);
    setPreviewResults(previews);
    setPreviewing(false);
  };

  const openTemplateEditor = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    try {
      if (template.source === 'idoc_guided_templates') {
        const { data, error } = await supabase
          .from('idoc_guided_templates')
          .select('*')
          .eq('id', templateId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching template:', error);
          alert('Erreur lors du chargement du template');
          return;
        }

        if (data) {
          setEditingTemplate(data);
          setEditedContent(getContentString(data.template_content));
          setViewMode('edit');
        }
      } else {
        alert('Seuls les templates iDoc peuvent être édités dans cette interface');
      }
    } catch (error) {
      console.error('Error opening editor:', error);
      alert('Erreur lors de l\'ouverture de l\'éditeur');
    }
  };

  const saveTemplateEdit = async () => {
    if (!editingTemplate) return;

    if (!confirm('Êtes-vous sûr de vouloir sauvegarder ces modifications?')) {
      return;
    }

    setSaving(true);

    try {
      let updatedContent = editedContent;

      // Si le contenu original était un objet, essayer de le préserver
      if (typeof editingTemplate.template_content === 'object' && editingTemplate.template_content !== null) {
        if (editingTemplate.template_content.fr || editingTemplate.template_content.en) {
          updatedContent = {
            ...editingTemplate.template_content,
            fr: editedContent,
            en: editedContent
          };
        }
      }

      const { error } = await supabase
        .from('idoc_guided_templates')
        .update({
          template_content: updatedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTemplate.id);

      if (error) {
        console.error('Error saving template:', error);
        alert('Erreur lors de la sauvegarde: ' + error.message);
      } else {
        alert('Template sauvegardé avec succès!');
        setViewMode('selection');
        setEditingTemplate(null);
        setEditedContent('');
        await fetchAllTemplates();
      }
    } catch (error) {
      console.error('Save exception:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const getContentString = (content: any): string => {
    if (typeof content === 'string') return content;
    if (typeof content === 'object') {
      // Pour les objets avec fr/en
      if (content.fr || content.en) {
        return content.fr || content.en || '';
      }
      // Pour les tableaux de sections
      if (Array.isArray(content)) {
        return content.map((section: any) => {
          if (typeof section === 'string') return section;
          if (section.content) return section.content;
          if (section.template) return section.template;
          return '';
        }).join('\n\n');
      }
      return JSON.stringify(content);
    }
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
                <h1 className="text-3xl font-bold">Centre de Validation des Templates</h1>
                <p className="text-blue-100 mt-1">Validation et conformité des documents administratifs</p>
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
                  disabled={linting || previewing || selectedIds.size === 0}
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
                  onClick={previewValidation}
                  disabled={linting || previewing || selectedIds.size === 0}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                  title="Prévisualiser les corrections sans les appliquer"
                >
                  {previewing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Prévisualisation...
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5" />
                      PRÉVISUALISER {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
                    </>
                  )}
                </button>

                <button
                  onClick={autoFixSelected}
                  disabled={linting || previewing || selectedIds.size === 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                  title="Appliquer les corrections automatiquement"
                >
                  {linting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Correction...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      VALIDER ET CORRIGER {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
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
                    className={`
                      rounded-lg p-4 border-2 transition-all
                      ${isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-md'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="pt-1 cursor-pointer"
                        onClick={() => toggleSelectTemplate(template.id)}
                      >
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
                        <p className="text-xs text-gray-500 font-mono truncate mb-3">
                          ID: {template.id.substring(0, 12)}...
                        </p>
                        {template.source === 'idoc_guided_templates' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openTemplateEditor(template.id);
                            }}
                            className="w-full px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Voir / Éditer
                          </button>
                        )}
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
        ) : viewMode === 'preview' ? (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Prévisualisation des Corrections</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setViewMode('selection');
                      setPreviewResults([]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('selection');
                      autoFixSelected();
                    }}
                    disabled={previewResults.filter(p => p.issues_count > 0).length === 0}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold"
                  >
                    <Zap className="w-5 h-5" />
                    Appliquer les Corrections
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Templates Analysés</p>
                  <p className="text-3xl font-bold text-gray-900">{previewResults.length}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-600 mb-1">Corrections Requises</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {previewResults.filter(p => p.issues_count > 0).length}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Templates Conformes</p>
                  <p className="text-3xl font-bold text-green-600">
                    {previewResults.filter(p => p.issues_count === 0).length}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Mode Prévisualisation:</strong> Aucune modification ne sera appliquée.
                  Consultez les corrections proposées ci-dessous, puis cliquez sur "Appliquer les Corrections"
                  pour valider et mettre à jour les templates.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {previewResults.map((preview) => (
                <div key={preview.template_id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{preview.template_code}</h3>
                      <span className="text-sm text-gray-500">ID: {preview.template_id.substring(0, 12)}...</span>
                    </div>
                    <div className="text-right">
                      {preview.issues_count === 0 ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-6 h-6" />
                          <span className="text-lg font-bold">CONFORME</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <AlertTriangle className="w-6 h-6" />
                          <span className="text-lg font-bold">{preview.issues_count} CORRECTIONS</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {preview.issues_count > 0 && (
                    <div className="space-y-4">
                      {preview.changes_proposed.placeholders_to_remove.length > 0 && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <h4 className="text-sm font-bold text-red-900 mb-3">
                            Placeholders à Supprimer ({preview.changes_proposed.placeholders_to_remove.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {preview.changes_proposed.placeholders_to_remove.map((ph, idx) => (
                              <code key={idx} className="px-3 py-1 bg-red-100 text-red-800 text-xs font-mono rounded">
                                {ph}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}

                      {preview.changes_proposed.variables_to_add.length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="text-sm font-bold text-blue-900 mb-3">
                            Variables à Ajouter ({preview.changes_proposed.variables_to_add.length})
                          </h4>
                          <div className="space-y-2">
                            {preview.changes_proposed.variables_to_add.map((v, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <code className="px-2 py-1 bg-blue-100 text-blue-800 font-mono rounded">
                                  {v.name}
                                </code>
                                <span className="text-gray-500">→</span>
                                <span className="text-gray-700">Type: {v.type}</span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-700">Label: {v.label.fr}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {preview.changes_proposed.status_change.from !== preview.changes_proposed.status_change.to && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="text-sm font-bold text-green-900 mb-2">Changement de Statut</h4>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded font-medium">
                              {preview.changes_proposed.status_change.from}
                            </span>
                            <span className="text-gray-500">→</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded font-medium">
                              {preview.changes_proposed.status_change.to}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Smoke Test Results */}
                      <div className={`p-4 rounded-lg border ${
                        preview.smoke_test.success
                          ? preview.smoke_test.warnings.length > 0
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <h4 className={`text-sm font-bold mb-2 ${
                          preview.smoke_test.success
                            ? preview.smoke_test.warnings.length > 0
                              ? 'text-yellow-900'
                              : 'text-green-900'
                            : 'text-red-900'
                        }`}>
                          Test de Rendu (Smoke Test)
                        </h4>
                        {preview.smoke_test.success ? (
                          <>
                            <p className="text-sm text-green-800 mb-2">✓ Le template peut être rendu en toute sécurité</p>
                            {preview.smoke_test.warnings.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-yellow-900 mb-1">Avertissements:</p>
                                <ul className="text-xs text-yellow-800 space-y-1 ml-4 list-disc">
                                  {preview.smoke_test.warnings.map((w, idx) => (
                                    <li key={idx}>{w}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : (
                          <div>
                            <p className="text-sm text-red-800 mb-2">✗ Échec du test de rendu</p>
                            <p className="text-xs text-red-700 bg-red-100 p-2 rounded font-mono">
                              {preview.smoke_test.error}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Production Eligibility */}
                      <div className={`p-4 rounded-lg border ${
                        preview.will_be_eligible
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                          {preview.will_be_eligible ? (
                            <Shield className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ShieldAlert className="w-4 h-4 text-gray-600" />
                          )}
                          Éligibilité Production
                        </h4>
                        <div className="flex items-center gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Actuellement: </span>
                            {preview.before.eligible_for_production ? (
                              <span className="text-green-600 font-semibold">✓ Éligible</span>
                            ) : (
                              <span className="text-red-600 font-semibold">✗ Non éligible</span>
                            )}
                          </div>
                          <span className="text-gray-400">→</span>
                          <div>
                            <span className="text-gray-600">Après correction: </span>
                            {preview.will_be_eligible ? (
                              <span className="text-green-600 font-semibold">✓ Éligible</span>
                            ) : (
                              <span className="text-gray-600 font-semibold">✗ Non éligible</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {preview.issues_count === 0 && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        ✓ Ce template est conforme et {preview.before.eligible_for_production ? 'éligible pour la production' : 'en attente de vérification'}.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : viewMode === 'edit' && editingTemplate ? (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Éditeur de Template</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingTemplate.template_code} - ID: {editingTemplate.id.substring(0, 12)}...
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setViewMode('selection');
                      setEditingTemplate(null);
                      setEditedContent('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={saveTemplateEdit}
                    disabled={saving || !editedContent}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      'Sauvegarder'
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-900">
                  <strong>Attention:</strong> Vous modifiez directement le contenu du template.
                  Les changements seront appliqués immédiatement en base de données.
                  Assurez-vous de ne pas supprimer de variables nécessaires.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Informations du Template
                  </label>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-xs text-gray-600">Code:</span>
                      <p className="font-mono text-sm">{editingTemplate.template_code}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Catégorie:</span>
                      <p className="text-sm">{editingTemplate.category || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Statut:</span>
                      <p className="text-sm">{editingTemplate.status || 'draft'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">Dernière vérification:</span>
                      <p className="text-sm">
                        {editingTemplate.last_verified_at
                          ? new Date(editingTemplate.last_verified_at).toLocaleDateString('fr-FR')
                          : 'Jamais'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Variables Disponibles
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-2">Variables Requises:</p>
                      <div className="flex flex-wrap gap-2">
                        {((editingTemplate.required_variables as any)?.fields || []).map((field: any, idx: number) => (
                          <code key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {'{{'}{field.name || field}{'}}'}
                          </code>
                        ))}
                        {((editingTemplate.required_variables as any)?.fields || []).length === 0 && (
                          <span className="text-xs text-gray-500">Aucune</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Variables Optionnelles:</p>
                      <div className="flex flex-wrap gap-2">
                        {((editingTemplate.optional_variables as any)?.fields || []).map((field: any, idx: number) => (
                          <code key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {'{{'}{field.name || field}{'}}'}
                          </code>
                        ))}
                        {((editingTemplate.optional_variables as any)?.fields || []).length === 0 && (
                          <span className="text-xs text-gray-500">Aucune</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Contenu du Template
                  </label>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-[500px] px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contenu du template..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Caractères: {editedContent.length} | Lignes: {editedContent.split('\n').length}
                  </p>
                </div>
              </div>
            </div>
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
