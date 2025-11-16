import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { supabase, DocumentTemplate } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

interface DocumentListProps {
  category: 'professional' | 'personal';
  title: string;
  onTemplateSelect?: (templateId: string) => void;
}

export function DocumentList({ category, title, onTemplateSelect }: DocumentListProps) {
  const { theme } = useTheme();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const { data, error } = await supabase
          .from('document_templates')
          .select('*')
          .eq('category', category)
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;

        // Filter templates: for guest mode (onTemplateSelect), only show templates with variables
        const filteredTemplates = onTemplateSelect
          ? (data || []).filter(t => {
              const vars = t.template_variables;
              return Array.isArray(vars) && vars.length > 0;
            })
          : (data || []);

        setTemplates(filteredTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, [category, onTemplateSelect]);

  if (loading) {
    return (
      <div className={theme === 'minimal' ? 'bg-white border border-black p-8' : 'bg-white rounded-xl p-8 shadow-sm'}>
        <h3 className={theme === 'minimal' ? 'text-xl font-light text-black mb-6 tracking-tight' : 'text-2xl font-bold text-gray-900 mb-6'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>{title}</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const displayedTemplates = showAll ? templates : templates.slice(0, 5);

  return (
    <div className={theme === 'minimal' ? 'bg-white border border-black p-8' : 'bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow'}>
      <h3 className={theme === 'minimal' ? 'text-xl font-light text-black mb-6 tracking-tight' : 'text-2xl font-bold text-gray-900 mb-6'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>{title}</h3>
      <ul className="space-y-3">
        {displayedTemplates.map((template) => (
          <li key={template.id}>
            {onTemplateSelect ? (
              <button
                onClick={() => onTemplateSelect(template.id)}
                className={theme === 'minimal' ? 'flex items-start w-full text-left hover:bg-gray-50 p-2 transition-colors' : 'flex items-start w-full text-left hover:bg-blue-50 p-2 rounded-lg transition-colors'}
              >
                <CheckCircle className={theme === 'minimal' ? 'w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0' : 'w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0'} />
                <span className={theme === 'minimal' ? 'text-xs text-gray-700 hover:text-black transition-colors tracking-wide leading-loose' : 'text-gray-700 hover:text-blue-600 transition-colors'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>{template.name}</span>
              </button>
            ) : (
              <div className="flex items-start">
                <CheckCircle className={theme === 'minimal' ? 'w-5 h-5 text-black mr-3 mt-0.5 flex-shrink-0' : 'w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0'} />
                <span className={theme === 'minimal' ? 'text-xs text-gray-700 tracking-wide leading-loose' : 'text-gray-700'} style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}>{template.name}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
      {templates.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={theme === 'minimal' ? 'mt-6 text-black font-light text-xs hover:text-gray-700 transition-colors tracking-wide' : 'mt-6 text-blue-600 font-semibold hover:text-blue-700 transition-colors'}
          style={theme === 'minimal' ? { fontFamily: 'serif' } : {}}
        >
          {showAll
            ? `Voir moins ↑`
            : `Voir tous les documents (${templates.length}) →`
          }
        </button>
      )}
    </div>
  );
}
