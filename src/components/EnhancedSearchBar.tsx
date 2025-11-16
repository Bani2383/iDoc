import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Clock, X } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  popularity: number;
}

interface EnhancedSearchBarProps {
  onSelectTemplate: (template: Template) => void;
  templates: Template[];
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({ onSelectTemplate, templates }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<Template[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const popular = [...templates]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
    setPopularTemplates(popular);

    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, [templates]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = templates.filter(
        (template) =>
          template.name.toLowerCase().includes(query.toLowerCase()) ||
          template.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTemplates(filtered.slice(0, 8));
    } else {
      setFilteredTemplates([]);
    }
  }, [query, templates]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (template: Template) => {
    const newRecent = [template.name, ...recentSearches.filter((s) => s !== template.name)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    setQuery('');
    setIsFocused(false);
    onSelectTemplate(template);
  };

  const handleRecentClick = (searchTerm: string) => {
    setQuery(searchTerm);
    const template = templates.find((t) => t.name === searchTerm);
    if (template) {
      handleSelect(template);
    }
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const showDropdown = isFocused && (filteredTemplates.length > 0 || query.trim().length === 0);

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      <div
        className={`relative transition-all duration-200 ${
          isFocused ? 'ring-4 ring-blue-100' : ''
        }`}
        style={{ borderRadius: '12px' }}
      >
        <Search
          className={`absolute left-6 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? 'text-blue-600' : 'text-gray-400'
          }`}
          size={24}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Recherchez votre document (ex: Contrat de location, Lettre de résiliation...)"
          aria-label="Rechercher un document"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? 'search-results' : undefined}
          aria-autocomplete="list"
          role="combobox"
          className="w-full h-16 pl-16 pr-6 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 shadow-lg"
        />
        {isFocused && (
          <div className="absolute inset-0 -z-10 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-xl"></div>
        )}
      </div>

      {showDropdown && (
        <div
          id="search-results"
          role="listbox"
          aria-label="Résultats de recherche"
          className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border-2 border-blue-500 overflow-hidden z-50 animate-slide-down"
        >
          {query.trim().length === 0 ? (
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Recherches récentes
                    </h3>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                      aria-label="Effacer les recherches récentes"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Effacer
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentClick(search)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-700"
                        role="option"
                        aria-label={`Recherche récente: ${search}`}
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Documents populaires
                </h3>
                <div className="space-y-2">
                  {popularTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelect(template)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-all hover:translate-x-1 group"
                      role="option"
                      aria-label={`Document populaire: ${template.name} - ${template.category}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800 group-hover:text-blue-600">
                          {template.name}
                        </span>
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">
                          🔥 {template.popularity}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">{template.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-3 px-4">
                {filteredTemplates.length} résultat{filteredTemplates.length > 1 ? 's' : ''}
              </div>
              <div className="space-y-2">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelect(template)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-all hover:translate-x-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 group-hover:text-blue-600">
                        {template.name}
                      </span>
                      {template.popularity > 50 && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">
                          🔥 Populaire
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">{template.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <span>Aucune inscription requise</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs font-bold">🍎</span>
          </div>
          <span>Paiement Express</span>
        </div>
        <div className="flex items-center">
          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs font-bold">🔒</span>
          </div>
          <span>100% Sécurisé</span>
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 200ms ease-out;
        }
      `}</style>
    </div>
  );
};

export default EnhancedSearchBar;
