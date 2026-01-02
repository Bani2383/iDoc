import React, { useState, useEffect } from 'react';
import { FileText, Shield, BookOpen, DollarSign, Edit2, Save, X, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { UnifiedTemplateLabLinter } from './UnifiedTemplateLabLinter';
import AdminArticlesManager from './AdminArticlesManager';

type TabType = 'templates' | 'validation' | 'articles';

interface Template {
  id: string;
  template_code?: string;
  name?: string;
  title?: string;
  category?: string;
  status?: string;
  verification_required?: boolean;
  last_verified_at?: string;
  price_usd: number;
  price_cad: number;
  price_eur: number;
  is_free: boolean;
  source: 'document_templates' | 'idoc_guided_templates';
}

export const CentreValidation: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFree, setFilterFree] = useState<'all' | 'free' | 'paid'>('all');
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceForm, setPriceForm] = useState({ usd: 1.99, cad: 1.99, eur: 1.99, is_free: false });

  useEffect(() => {
    if (activeTab === 'templates') {
      loadTemplates();
    }
  }, [activeTab]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const [idocRes, docRes] = await Promise.all([
        supabase
          .from('idoc_guided_templates')
          .select('id, template_code, category, status, verification_required, last_verified_at, price_usd, price_cad, price_eur, is_free')
          .order('created_at', { ascending: false }),
        supabase
          .from('document_templates')
          .select('id, name, category, price_usd, price_cad, price_eur, is_free')
          .order('created_at', { ascending: false })
      ]);

      const idocTemplates = (idocRes.data || []).map(t => ({
        ...t,
        title: t.template_code,
        source: 'idoc_guided_templates' as const
      }));

      const docTemplates = (docRes.data || []).map(t => ({
        ...t,
        title: t.name,
        source: 'document_templates' as const
      }));

      setTemplates([...idocTemplates, ...docTemplates]);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditPrice = (template: Template) => {
    setEditingPrice(template.id);
    setPriceForm({
      usd: template.price_usd || 1.99,
      cad: template.price_cad || 1.99,
      eur: template.price_eur || 1.99,
      is_free: template.is_free || false
    });
  };

  const savePrice = async (template: Template) => {
    try {
      const { error } = await supabase
        .from(template.source)
        .update({
          price_usd: priceForm.is_free ? 0 : priceForm.usd,
          price_cad: priceForm.is_free ? 0 : priceForm.cad,
          price_eur: priceForm.is_free ? 0 : priceForm.eur,
          is_free: priceForm.is_free,
          updated_at: new Date().toISOString()
        })
        .eq('id', template.id);

      if (error) throw error;

      setEditingPrice(null);
      loadTemplates();
    } catch (error) {
      console.error('Error saving price:', error);
      alert('Erreur lors de la sauvegarde du prix');
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = !searchTerm ||
      (t.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.template_code?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.category?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      filterFree === 'all' ||
      (filterFree === 'free' && t.is_free) ||
      (filterFree === 'paid' && !t.is_free);

    return matchesSearch && matchesFilter;
  });

  const tabs = [
    { id: 'templates' as TabType, label: 'Gestion des Modèles', icon: FileText },
    { id: 'validation' as TabType, label: 'Validation & Linter', icon: Shield },
    { id: 'articles' as TabType, label: 'Articles / Blog', icon: BookOpen }
  ];

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Administrateur Requis</h2>
          <p className="text-gray-600">Cette section est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Centre de Validation
              </h1>
              <p className="text-gray-600 mt-2">
                Gestion complète des modèles, validation de la qualité, et publication d'articles
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                      ${activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'templates' && (
              <div>
                {/* Filters */}
                <div className="mb-6 flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Rechercher par nom, code, catégorie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={filterFree}
                      onChange={(e) => setFilterFree(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tous les modèles</option>
                      <option value="free">Gratuits uniquement</option>
                      <option value="paid">Payants uniquement</option>
                    </select>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-900">{templates.length}</div>
                    <div className="text-sm text-gray-600">Total modèles</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {templates.filter(t => t.is_free).length}
                    </div>
                    <div className="text-sm text-gray-600">Gratuits</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {templates.filter(t => !t.is_free).length}
                    </div>
                    <div className="text-sm text-gray-600">Payants</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {templates.filter(t => t.status === 'verified').length}
                    </div>
                    <div className="text-sm text-gray-600">Vérifiés</div>
                  </div>
                </div>

                {/* Templates List */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
                    <p className="mt-2 text-gray-600">Chargement...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {template.title || template.template_code || template.name}
                              </h3>
                              {template.is_free ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                  GRATUIT
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                                  PAYANT
                                </span>
                              )}
                              {template.source === 'idoc_guided_templates' && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                                  iDoc
                                </span>
                              )}
                              {template.status === 'verified' && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  Vérifié
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                              <span>Catégorie: {template.category || 'Non définie'}</span>
                              <span>Source: {template.source === 'idoc_guided_templates' ? 'iDoc Guidé' : 'Document Standard'}</span>
                              {template.last_verified_at && (
                                <span>Vérifié le: {new Date(template.last_verified_at).toLocaleDateString('fr-FR')}</span>
                              )}
                            </div>
                          </div>

                          {/* Price Editor */}
                          <div className="ml-4">
                            {editingPrice === template.id ? (
                              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 min-w-[300px]">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`free-${template.id}`}
                                      checked={priceForm.is_free}
                                      onChange={(e) => setPriceForm({ ...priceForm, is_free: e.target.checked })}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`free-${template.id}`} className="text-sm font-medium text-gray-700">
                                      Modèle gratuit
                                    </label>
                                  </div>

                                  {!priceForm.is_free && (
                                    <>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          USD
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={priceForm.usd}
                                          onChange={(e) => setPriceForm({ ...priceForm, usd: parseFloat(e.target.value) || 0 })}
                                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          CAD
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={priceForm.cad}
                                          onChange={(e) => setPriceForm({ ...priceForm, cad: parseFloat(e.target.value) || 0 })}
                                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          EUR
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={priceForm.eur}
                                          onChange={(e) => setPriceForm({ ...priceForm, eur: parseFloat(e.target.value) || 0 })}
                                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                    </>
                                  )}

                                  <div className="flex gap-2 pt-2">
                                    <button
                                      onClick={() => savePrice(template)}
                                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center justify-center gap-1"
                                    >
                                      <Save className="w-4 h-4" />
                                      Sauvegarder
                                    </button>
                                    <button
                                      onClick={() => setEditingPrice(null)}
                                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 flex items-center justify-center"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-right">
                                <div className="flex items-center gap-3 mb-2">
                                  {template.is_free ? (
                                    <div className="text-lg font-bold text-green-600">GRATUIT</div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="text-sm text-gray-600 flex items-center gap-2">
                                        <span className="font-medium">USD:</span>
                                        <span className="font-bold text-gray-900">${template.price_usd?.toFixed(2) || '1.99'}</span>
                                      </div>
                                      <div className="text-sm text-gray-600 flex items-center gap-2">
                                        <span className="font-medium">CAD:</span>
                                        <span className="font-bold text-gray-900">${template.price_cad?.toFixed(2) || '1.99'}</span>
                                      </div>
                                      <div className="text-sm text-gray-600 flex items-center gap-2">
                                        <span className="font-medium">EUR:</span>
                                        <span className="font-bold text-gray-900">€{template.price_eur?.toFixed(2) || '1.99'}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => startEditPrice(template)}
                                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-2"
                                >
                                  <DollarSign className="w-4 h-4" />
                                  Modifier Prix
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredTemplates.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        Aucun modèle trouvé
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'validation' && (
              <div>
                <UnifiedTemplateLabLinter />
              </div>
            )}

            {activeTab === 'articles' && (
              <div>
                <AdminArticlesManager />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
