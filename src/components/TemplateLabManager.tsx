import React, { useEffect, useState } from 'react';
import { Beaker, CheckCircle, XCircle, Clock, FileCheck, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Template {
  id: string;
  name: string;
  title: string;
  category: string;
  review_status: string;
  version: number;
  last_reviewed_at: string | null;
  last_reviewed_by: string | null;
  created_at: string;
}

export const TemplateLabManager: React.FC<{ onSelectTemplate?: (id: string) => void }> = ({ onSelectTemplate }) => {
  const { profile } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchTemplates();
    }
  }, [profile]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; icon: any }> = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock },
      in_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      published: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FileCheck },
    };
    const { bg, text, icon: Icon } = config[status] || config.draft;
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bg} ${text} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </span>
    );
  };

  const filteredTemplates = templates.filter(t =>
    (searchQuery === '' || t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || t.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === '' || t.review_status === statusFilter)
  );

  const stats = {
    total: templates.length,
    draft: templates.filter(t => t.review_status === 'draft').length,
    in_review: templates.filter(t => t.review_status === 'in_review').length,
    approved: templates.filter(t => t.review_status === 'approved').length,
    published: templates.filter(t => t.review_status === 'published').length,
    rejected: templates.filter(t => t.review_status === 'rejected').length,
  };

  if (profile?.role !== 'admin') {
    return <div className="text-center py-16"><h2 className="text-2xl font-bold">Accès Restreint</h2></div>;
  }

  if (loading) {
    return <div className="text-center py-16"><div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Beaker className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Lab des Modèles</h1>
        </div>
        <p className="text-gray-600">Tester et certifier les modèles avant publication</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Brouillon</p>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <p className="text-sm text-yellow-600">En révision</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.in_review}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-sm text-green-600">Approuvé</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <p className="text-sm text-blue-600">Publié</p>
          <p className="text-2xl font-bold text-blue-600">{stats.published}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <p className="text-sm text-red-600">Rejeté</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un modèle..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="in_review">En révision</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
              <option value="published">Publié</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modèle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière révision</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTemplates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{template.title || template.name}</p>
                    <p className="text-sm text-gray-500">{template.id.substring(0, 8)}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{template.category || '-'}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-mono bg-gray-100 rounded">v{template.version || 1}</span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(template.review_status)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {template.last_reviewed_at ? new Date(template.last_reviewed_at).toLocaleDateString('fr-FR') : 'Jamais'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onSelectTemplate?.(template.id)}
                    className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                  >
                    Tester →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
