import { useState, useEffect, useMemo } from 'react';
import { DocumentTemplate } from '../lib/supabase';

interface SearchResult extends DocumentTemplate {
  score: number;
  matchedFields: string[];
}

export function useTemplateSearch(templates: DocumentTemplate[], query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const normalizedTemplates = useMemo(() => {
    return templates.map((template) => ({
      ...template,
      searchText: [
        template.name?.toLowerCase() || '',
        template.description?.toLowerCase() || '',
        template.category?.toLowerCase() || '',
        template.tags?.join(' ').toLowerCase() || '',
      ].join(' '),
    }));
  }, [templates]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timeoutId = setTimeout(() => {
      performSearch(query.toLowerCase().trim());
      setIsSearching(false);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [query, normalizedTemplates]);

  const performSearch = (searchQuery: string) => {
    const searchTerms = searchQuery.split(/\s+/).filter((term) => term.length > 0);

    const scored = normalizedTemplates
      .map((template) => {
        let score = 0;
        const matchedFields: string[] = [];

        const nameMatch = template.name?.toLowerCase().includes(searchQuery);
        if (nameMatch) {
          score += 100;
          matchedFields.push('name');
        }

        if (template.name?.toLowerCase().startsWith(searchQuery)) {
          score += 50;
        }

        searchTerms.forEach((term) => {
          if (template.name?.toLowerCase().includes(term)) {
            score += 10;
          }
        });

        const descMatch = template.description?.toLowerCase().includes(searchQuery);
        if (descMatch) {
          score += 30;
          matchedFields.push('description');
        }

        const categoryMatch = template.category?.toLowerCase().includes(searchQuery);
        if (categoryMatch) {
          score += 40;
          matchedFields.push('category');
        }

        if (template.tags) {
          const tagMatch = template.tags.some((tag) => tag.toLowerCase().includes(searchQuery));
          if (tagMatch) {
            score += 20;
            matchedFields.push('tags');
          }
        }

        searchTerms.forEach((term) => {
          if (template.searchText.includes(term)) {
            score += 5;
          }
        });

        return {
          ...template,
          score,
          matchedFields,
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    setResults(scored as SearchResult[]);
  };

  return {
    results,
    isSearching,
    hasResults: results.length > 0,
  };
}
