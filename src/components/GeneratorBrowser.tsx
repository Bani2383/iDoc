import { useState, useEffect } from 'react';
import { FileText, Globe, ArrowRight, Check, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Generator {
  id: string;
  country_code: string;
  locale: string;
  slug: string;
  title: string;
  disclaimer: string;
  price: string;
  currency: string;
  pre_payment_notice: string;
  checkout_disclaimer: string;
  step_count?: number;
}

interface GeneratorBrowserProps {
  onSelectGenerator: (generatorId: string) => void;
}

const countryNames: Record<string, string> = {
  ca: 'Canada',
  us: 'United States',
  uk: 'United Kingdom',
  eu: 'European Union',
  au: 'Australia',
  af: 'Africa',
  ae: 'UAE',
  es: 'Spain',
  de: 'Germany',
};

const countryFlags: Record<string, string> = {
  ca: '🇨🇦',
  us: '🇺🇸',
  uk: '🇬🇧',
  eu: '🇪🇺',
  au: '🇦🇺',
  af: '🌍',
  ae: '🇦🇪',
  es: '🇪🇸',
  de: '🇩🇪',
};

export function GeneratorBrowser({ onSelectGenerator }: GeneratorBrowserProps) {
  const [generators, setGenerators] = useState<Generator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    fetchGenerators();
  }, []);

  const fetchGenerators = async () => {
    try {
      const { data: generatorsData, error } = await supabase
        .from('document_generators')
        .select(`
          id,
          country_code,
          locale,
          slug,
          title,
          disclaimer,
          price,
          currency,
          pre_payment_notice,
          checkout_disclaimer
        `)
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;

      setGenerators(generatorsData || []);
    } catch (error) {
      console.error('Error fetching generators:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGenerators = generators.filter((gen) => {
    const matchesSearch = gen.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || gen.country_code === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const groupedGenerators = filteredGenerators.reduce((acc, gen) => {
    if (!acc[gen.country_code]) {
      acc[gen.country_code] = [];
    }
    acc[gen.country_code].push(gen);
    return acc;
  }, {} as Record<string, Generator[]>);

  const uniqueCountries = Array.from(new Set(generators.map(g => g.country_code)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Document Generators
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose from our collection of professional document generators for immigration, visa applications, and more.
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search generators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCountry(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCountry
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Countries
          </button>
          {uniqueCountries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCountry === country
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {countryFlags[country]} {countryNames[country]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedGenerators).map(([countryCode, gens]) => (
          <div key={countryCode}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{countryFlags[countryCode]}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {countryNames[countryCode]}
                </h2>
                <p className="text-gray-600">{gens.length} generator{gens.length !== 1 ? 's' : ''} available</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gens.map((generator) => (
                <div
                  key={generator.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {generator.locale}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {generator.title.replace('Generator – ', '').replace('Générateur – ', '').replace('Generador – ', '')}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {generator.disclaimer}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-2xl font-bold text-gray-900">
                      {generator.currency === 'EUR' ? '€' : generator.currency === 'GBP' ? '£' : generator.currency === 'AED' ? 'AED' : '$'}
                      {parseFloat(generator.price).toFixed(2)}
                    </div>
                    <button
                      onClick={() => onSelectGenerator(generator.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-green-600">
                    <Check className="w-4 h-4" />
                    Preview before payment
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredGenerators.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No generators found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}