import React, { useEffect, useState } from 'react';
import { Compass, ChevronRight } from 'lucide-react';
import { supabase, DocumentTemplate } from '../lib/supabase';

interface DocPilotRecommendationsProps {
  currentTemplateId?: string;
  sessionId: string;
  onTemplateClick?: (template: DocumentTemplate) => void;
  maxRecommendations?: number;
}

export default function DocPilotRecommendations({
  currentTemplateId,
  sessionId,
  onTemplateClick,
  maxRecommendations = 3,
}: DocPilotRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTemplateId) {
      loadRecommendations();
    }
  }, [currentTemplateId]);

  const loadRecommendations = async () => {
    if (!currentTemplateId) return;

    try {
      const { data: rules, error: rulesError } = await supabase
        .from('recommendation_rules')
        .select('recommended_template_id, rule_type, weight')
        .eq('source_template_id', currentTemplateId)
        .eq('is_active', true)
        .order('weight', { ascending: false })
        .limit(maxRecommendations);

      if (rulesError) throw rulesError;

      if (!rules || rules.length === 0) {
        await loadPopularRecommendations();
        return;
      }

      const templateIds = rules.map(r => r.recommended_template_id);
      const { data: templates, error: templatesError } = await supabase
        .from('document_templates')
        .select('*')
        .in('id', templateIds)
        .eq('is_active', true);

      if (templatesError) throw templatesError;

      const sortedTemplates = templateIds
        .map(id => templates?.find(t => t.id === id))
        .filter(Boolean) as DocumentTemplate[];

      setRecommendations(sortedTemplates);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularRecommendations = async () => {
    try {
      const { data: popularViews } = await supabase
        .from('document_views')
        .select('template_id')
        .neq('template_id', currentTemplateId || '')
        .order('viewed_at', { ascending: false })
        .limit(100);

      if (!popularViews) return;

      const templateCounts = popularViews.reduce((acc, view) => {
        acc[view.template_id] = (acc[view.template_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topTemplateIds = Object.entries(templateCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, maxRecommendations)
        .map(([id]) => id);

      if (topTemplateIds.length === 0) return;

      const { data: templates } = await supabase
        .from('document_templates')
        .select('*')
        .in('id', topTemplateIds)
        .eq('is_active', true);

      if (templates) {
        setRecommendations(templates);
      }
    } catch (error) {
      console.error('Error loading popular recommendations:', error);
    }
  };

  const trackClick = async (templateId: string) => {
    try {
      await supabase.from('document_views').insert({
        session_id: sessionId,
        template_id: templateId,
        source: 'recommendation',
        viewed_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error tracking recommendation click:', error);
    }
  };

  const handleTemplateClick = (template: DocumentTemplate) => {
    trackClick(template.id);
    if (onTemplateClick) {
      onTemplateClick(template);
    }
  };

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 shadow-lg border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Documents recommandés pour vous
        </h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateClick(template)}
            className="w-full bg-white rounded-lg p-4 hover:shadow-md transition-all duration-200 text-left group border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {template.name}
                </h4>
                {template.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {template.description}
                  </p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-600 text-center">
          Ces documents sont souvent consultés ensemble
        </p>
      </div>
    </div>
  );
}
