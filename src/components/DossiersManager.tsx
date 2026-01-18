import React, { useEffect, useState } from 'react';
import { Folder, Plus, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { callDossiersApi, validateApiInput } from '../lib/apiService';

interface Dossier {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: string;
  clients: {
    full_name: string;
    email: string;
  };
  dossier_documents: any[];
}

interface Client {
  id: string;
  full_name: string;
  email: string;
}

export const DossiersManager: React.FC<{ onSelectDossier?: (id: string) => void }> = ({ onSelectDossier }) => {
  const { profile, user } = useAuth();
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    priority: 'normal',
  });

  useEffect(() => {
    fetchDossiers();
    if (profile?.role === 'admin') {
      fetchClients();
    }
  }, [profile]);

  const fetchClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('id, full_name, email')
      .order('full_name');
    setClients(data || []);
  };

  const fetchDossiers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dossiers')
        .select(`
          *,
          clients(full_name, email),
          dossier_documents(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDossiers(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      const validation = validateApiInput(formData, ['client_id', 'title']);
      if (!validation.valid) {
        alert(validation.error || 'Données invalides');
        return;
      }

      const { data, error } = await callDossiersApi('create', formData);

      if (error || !data) {
        throw new Error(error?.message || 'Creation failed');
      }

      alert('Dossier créé!');
      setShowCreateModal(false);
      setFormData({ client_id: '', title: '', description: '', priority: 'normal' });
      fetchDossiers();
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la création');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      in_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      signed: 'bg-blue-100 text-blue-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-red-100 text-red-600',
    };
    return colors[priority] || 'bg-gray-100 text-gray-600';
  };

  const filteredDossiers = dossiers.filter(d =>
    (searchQuery === '' || d.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === '' || d.status === statusFilter)
  );

  if (loading) {
    return <div className="text-center py-16"><div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dossiers</h1>
            <p className="text-gray-600">Gérer les dossiers clients</p>
          </div>
          {profile?.role === 'admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="in_review">En révision</option>
              <option value="approved">Approuvé</option>
              <option value="signed">Signé</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDossiers.map((dossier) => (
          <div
            key={dossier.id}
            onClick={() => onSelectDossier?.(dossier.id)}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <Folder className="w-8 h-8 text-blue-600" />
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(dossier.priority)}`}>
                  {dossier.priority}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dossier.status)}`}>
                  {dossier.status}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{dossier.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dossier.description || 'Pas de description'}</p>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">Client:</p>
                  <p className="font-medium text-gray-900">{dossier.clients.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Documents:</p>
                  <p className="font-bold text-blue-600">{dossier.dossier_documents?.[0]?.count || 0}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Créer un Dossier</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client *</label>
                <select
                  required
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Titre *</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priorité</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Basse</option>
                  <option value="normal">Normale</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
