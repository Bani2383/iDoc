import React, { useEffect, useState } from 'react';
import { Download, Filter, Calendar, DollarSign, TrendingUp, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AccountingTransaction {
  id: string;
  type: string;
  reference_type: string | null;
  reference_id: string | null;
  amount: number;
  tax_amount: number;
  country: string | null;
  province_or_state: string | null;
  currency: string;
  notes: string | null;
  created_at: string;
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  type: string;
  country: string;
  province: string;
}

export const AdminAccountingPanel: React.FC = () => {
  const { profile } = useAuth();
  const [transactions, setTransactions] = useState<AccountingTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<AccountingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    type: '',
    country: '',
    province: '',
  });
  const [stats, setStats] = useState({
    totalHT: 0,
    totalTaxes: 0,
    totalTTC: 0,
    byProvince: {} as Record<string, { ht: number; taxes: number; ttc: number }>,
    byType: {} as Record<string, number>,
  });

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchTransactions();
    }
  }, [profile]);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  useEffect(() => {
    calculateStats();
  }, [filteredTransactions]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('accounting_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filters.dateFrom) {
      filtered = filtered.filter(t => new Date(t.created_at) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => new Date(t.created_at) <= new Date(filters.dateTo));
    }

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.country) {
      filtered = filtered.filter(t => t.country === filters.country);
    }

    if (filters.province) {
      filtered = filtered.filter(t => t.province_or_state === filters.province);
    }

    setFilteredTransactions(filtered);
  };

  const calculateStats = () => {
    let totalHT = 0;
    let totalTaxes = 0;
    let totalTTC = 0;
    const byProvince: Record<string, { ht: number; taxes: number; ttc: number }> = {};
    const byType: Record<string, number> = {};

    filteredTransactions.forEach(t => {
      const amount = parseFloat(t.amount?.toString() || '0');
      const taxes = parseFloat(t.tax_amount?.toString() || '0');
      const ht = amount - taxes;

      totalHT += ht;
      totalTaxes += taxes;
      totalTTC += amount;

      const province = t.province_or_state || t.country || 'Inconnu';
      if (!byProvince[province]) {
        byProvince[province] = { ht: 0, taxes: 0, ttc: 0 };
      }
      byProvince[province].ht += ht;
      byProvince[province].taxes += taxes;
      byProvince[province].ttc += amount;

      byType[t.type] = (byType[t.type] || 0) + amount;
    });

    setStats({ totalHT, totalTaxes, totalTTC, byProvince, byType });
  };

  const handleExportCSV = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('from', filters.dateFrom);
      if (filters.dateTo) params.append('to', filters.dateTo);

      const response = await fetch(
        `${supabaseUrl}/functions/v1/admin-accounting-export?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': anonKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `accounting-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export');
    }
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      type: '',
      country: '',
      province: '',
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      sale: 'bg-green-100 text-green-800',
      refund: 'bg-red-100 text-red-800',
      correction: 'bg-orange-100 text-orange-800',
      cancellation: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-blue-100 text-blue-800';
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Accès Restreint</h2>
        <p className="text-gray-600 mt-2">Cette page est réservée aux administrateurs.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Chargement des données comptables...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Module Comptabilité</h1>
            <p className="text-gray-600">Historique complet des transactions et analyses</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total HT</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalHT.toFixed(2)} $</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Taxes Collectées</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalTaxes.toFixed(2)} $</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total TTC</span>
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalTTC.toFixed(2)} $</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
          </h3>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Réinitialiser
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date début
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date fin
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              <option value="sale">Vente</option>
              <option value="refund">Remboursement</option>
              <option value="correction">Correction</option>
              <option value="cancellation">Annulation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              placeholder="CA, US, FR..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <input
              type="text"
              value={filters.province}
              onChange={(e) => setFilters({ ...filters, province: e.target.value })}
              placeholder="QC, ON, CA..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Répartition par province */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Détails par Province/État</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Province/État</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant HT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total TTC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(stats.byProvince)
                .sort(([, a], [, b]) => b.ttc - a.ttc)
                .map(([province, amounts]) => (
                  <tr key={province}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{province}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{amounts.ht.toFixed(2)} $</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{amounts.taxes.toFixed(2)} $</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{amounts.ttc.toFixed(2)} $</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            Historique des Transactions ({filteredTransactions.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant HT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total TTC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lieu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const amount = parseFloat(transaction.amount?.toString() || '0');
                const taxes = parseFloat(transaction.tax_amount?.toString() || '0');
                const ht = amount - taxes;

                return (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {ht.toFixed(2)} {transaction.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {taxes.toFixed(2)} {transaction.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {amount.toFixed(2)} {transaction.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {transaction.province_or_state || transaction.country || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.notes || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
