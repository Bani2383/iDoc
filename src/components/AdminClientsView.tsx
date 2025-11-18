import { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, Calendar, Eye, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ClientData {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  totalPurchases: number;
  totalSpent: number;
  lastPurchaseDate: string | null;
  activeSubs: number;
  lastActivity: string | null;
}

interface PurchaseDetail {
  id: string;
  amount: number;
  tax_amount: number;
  currency: string;
  status: string;
  created_at: string;
  invoice_pdf_url: string | null;
}

export function AdminClientsView() {
  const { profile } = useAuth();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'paying' | 'active'>('all');
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [clientPurchases, setClientPurchases] = useState<PurchaseDetail[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchClients();
    }
  }, [profile, filterType]);

  const fetchClients = async () => {
    try {
      setLoading(true);

      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const clientDataPromises = (profiles || []).map(async (profile) => {
        const { data: purchases } = await supabase
          .from('purchases')
          .select('amount, created_at, status')
          .eq('user_id', profile.id);

        const { data: subscriptions } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', profile.id);

        const { data: activity } = await supabase
          .from('user_activity_log')
          .select('created_at')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const totalPurchases = purchases?.length || 0;
        const totalSpent = purchases?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        const lastPurchaseDate = purchases?.[0]?.created_at || null;
        const activeSubs = subscriptions?.filter(s => s.status === 'active').length || 0;
        const lastActivity = activity?.[0]?.created_at || null;

        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          created_at: profile.created_at,
          totalPurchases,
          totalSpent,
          lastPurchaseDate,
          activeSubs,
          lastActivity
        };
      });

      const clientsData = await Promise.all(clientDataPromises);

      let filteredData = clientsData;
      if (filterType === 'paying') {
        filteredData = clientsData.filter(c => c.totalPurchases > 0 || c.activeSubs > 0);
      } else if (filterType === 'active') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredData = clientsData.filter(c =>
          c.lastActivity && new Date(c.lastActivity) > weekAgo
        );
      }

      setClients(filteredData);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientDetails = async (client: ClientData) => {
    try {
      const { data: purchases, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', client.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClientPurchases(purchases || []);
      setSelectedClient(client);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'CAD') => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredClients = clients.filter(client =>
    searchQuery === '' ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalClients: clients.length,
    payingClients: clients.filter(c => c.totalPurchases > 0 || c.activeSubs > 0).length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0),
    avgSpentPerClient: clients.length > 0
      ? clients.reduce((sum, c) => sum + c.totalSpent, 0) / clients.length
      : 0
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Accès restreint</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Clients</h2>
        <p className="text-gray-600 mt-1">Vue d'ensemble des clients et de leurs achats</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalClients}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clients Payants</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.payingClients}</p>
            </div>
            <ShoppingBag className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenu Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Panier Moyen</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.avgSpentPerClient)}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par email ou nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilterType('paying')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'paying'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Payants
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Actifs (7j)
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Inscription</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Achats</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Dépensé</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Dernier Achat</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Abonnements</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Aucun client trouvé
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {client.full_name || 'Sans nom'}
                        </p>
                        <p className="text-sm text-gray-600">{client.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(client.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        client.totalPurchases > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.totalPurchases}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatCurrency(client.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(client.lastPurchaseDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        client.activeSubs > 0
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.activeSubs}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => fetchClientDetails(client)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Détails</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedClient.full_name || 'Sans nom'}
                </h3>
                <p className="text-gray-600">{selectedClient.email}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Achats</p>
                  <p className="text-xl font-bold text-gray-900">{selectedClient.totalPurchases}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Dépensé</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(selectedClient.totalSpent)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Abonnements</p>
                  <p className="text-xl font-bold text-gray-900">{selectedClient.activeSubs}</p>
                </div>
              </div>

              {/* Purchase History */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Historique des Achats</h4>
                {clientPurchases.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">Aucun achat</p>
                ) : (
                  <div className="space-y-3">
                    {clientPurchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              Achat #{purchase.id.substring(0, 8)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(purchase.created_at)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(purchase.amount + purchase.tax_amount, purchase.currency)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {purchase.status === 'completed' ? 'Payé' : 'En attente'}
                            </p>
                          </div>
                        </div>
                        {purchase.invoice_pdf_url && (
                          <a
                            href={purchase.invoice_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                          >
                            Télécharger la facture →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
