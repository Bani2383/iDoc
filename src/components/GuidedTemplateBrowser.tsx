/**
 * Guided Template Browser
 *
 * @description Browse and select guided templates (NEW FEATURE - doesn't affect existing templates)
 * This component is separate from existing template browsers
 */

import { useState, useEffect } from 'react';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GuidedTemplateCard {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface GuidedTemplateBrowserProps {
  onSelectTemplate: (templateId: string) => void;
  onBack?: () => void;
}

export function GuidedTemplateBrowser({ onSelectTemplate, onBack }: GuidedTemplateBrowserProps) {
  const [templates, setTemplates] = useState<GuidedTemplateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchGuidedTemplates();
  }, []);

  const fetchGuidedTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('guided_template_configs')
        .select('id, name, description, category')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching guided templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'immigration', name: 'Immigration' },
    { id: 'legal', name: 'Legal' },
    { id: 'business', name: 'Business' },
    { id: 'personal', name: 'Personal' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter((t) => t.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Guided Templates
          </h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
            NEW
          </span>
        </div>
        <p className="text-gray-600">
          Step-by-step document creation with intelligent guidance and conditional logic
        </p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No guided templates available in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <FileText className="w-10 h-10 text-blue-600" />
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {template.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {template.category}
                </span>
                <button
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template.id);
                  }}
                >
                  Start
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {onBack && (
        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Back to main menu
          </button>
        </div>
      )}
    </div>
  );
}
