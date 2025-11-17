import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { templateCache } from '../lib/templateCache';

interface TemplateField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
}

interface Template {
  id: string;
  name: string;
  category: string;
  description?: string;
  content?: string;
  fields?: TemplateField[];
  is_active: boolean;
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const cached = templateCache.get('active_templates');
      if (cached) {
        setTemplates(cached);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('document_templates')
        .select('id, name, category, description, template_content, template_variables, is_active')
        .eq('is_active', true)
        .order('name');

      if (fetchError) throw fetchError;

      const templatesData = (data || []).map((template: any) => ({
        id: template.id,
        name: template.name,
        category: template.category,
        description: template.description,
        content: template.template_content,
        fields: template.template_variables,
        is_active: template.is_active
      }));
      templateCache.set('active_templates', templatesData);
      setTemplates(templatesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const getTemplateById = async (id: string): Promise<Template | null> => {
    const cacheKey = `template_${id}`;

    return templateCache.getOrFetch(cacheKey, async () => {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    });
  };

  const invalidateCache = () => {
    templateCache.invalidateAll();
    loadTemplates();
  };

  return {
    templates,
    loading,
    error,
    getTemplateById,
    invalidateCache,
    refetch: loadTemplates,
  };
}
