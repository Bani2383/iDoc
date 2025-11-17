import React, { useEffect, useState } from 'react';
import { DollarSign, FileText, TrendingUp, Users, Download, RefreshCw, XCircle, Edit, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Purchase {
  id: string;
  user_id: string;
  template_id: string | null;
  stripe_session_id: string;
  stripe_payment_intent_id: string;
  stripe_invoice_id: string | null;
  invoice_pdf_url: string | null;
  invoice_hosted_url: string | null;
  amount: number;
  currency: string;
  country: string | null;
  province_or_state: string | null;
  tax_amount: number;
  status: string;
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  last_invoice_pdf_url: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
}

interface AccountingEntry {
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

interface Stats {
  totalRevenue: number;
  totalTaxes: number;
  totalPurchases: number;
  activeSubscriptions: number;
  revenueByProvince: Record<string, number>;
}

export const AdminBillingDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'purchases' | 'subscriptions' | 'accounting' | 'stats'>('stats');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [accountingLog, setAccountingLog] = useState<AccountingEntry[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalTaxes: 0,
    totalPurchases: 0,
    activeSubscriptions: 0,
    revenueByProvince: {},
  });
  const [loading, setLoading] = useState(true);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [correctAmount, setCorrectAmount] = useState('');
  const [correctTaxAmount, setCorrectTaxAmount] = useState('');
  const [correctNotes, setCorrectNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAllData();
    }
  }, [profile]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPurchases(),
        fetchSubscriptions(),
        fetchAccountingLog(),
      ]);
      calculateStats();
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching purchases:', error);
    } else {
      setPurchases(data || []);
    }
  };

  const fetchSubscriptions = async () => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false});

    if (error) {
      console.error('Error fetching subscriptions:', error);
    } else {
      setSubscriptions(data || []);
    }
  };

  const fetchAccountingLog = async () => {
    const { data, error } = await supabase
      .from('accounting_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching accounting log:', error);
    } else {
      setAccountingLog(data || []);
    }
  };

  const calculateStats = () => {
    const paidPurchases = purchases.filter(p => p.status === 'paid');
    const totalRevenue = paidPurchases.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
    const totalTaxes = paidPurchases.reduce((sum, p) => sum + parseFloat(p.tax_amount?.toString() || '0'), 0);
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;

    const revenueByProvince: Record<string, number> = {};
    paidPurchases.forEach(p => {
      const province = p.province_or_state || 'Inconnu';
      revenueByProvince[province] = (revenueByProvince[province] || 0) + parseFloat(p.amount.toString());
    });

    setStats({
      totalRevenue,
      totalTaxes,
      totalPurchases: paidPurchases.length,
      activeSubscriptions,
      revenueByProvince,
    });
  };

  const handleRefund = async () => {
    if (!selectedPurchase) return;

    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-billing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({
          action: 'refund',
          purchaseId: selectedPurchase.id,
          amount: refundAmount ? parseFloat(refundAmount) : undefined,
          reason: refundReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du remboursement');
      }

      alert('Remboursement effectué avec succès!');
      setShowRefundModal(false);
      setRefundAmount('');
      setRefundReason('');
      setSelectedPurchase(null);
      fetchAllData();
    } catch (error) {
      console.error('Refund error:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors du remboursement');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCorrectTransaction = async () => {
    if (!selectedPurchase) return;

    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-billing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({
          action: 'correct-transaction',
          purchaseId: selectedPurchase.id,
          newAmount: parseFloat(correctAmount),
          newTaxAmount: correctTaxAmount ? parseFloat(correctTaxAmount) : 0,
          notes: correctNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la correction');
      }

      alert('Transaction corrigée avec succès!');
      setShowCorrectModal(false);
      setCorrectAmount('');
      setCorrectTaxAmount('');
      setCorrectNotes('');
      setSelectedPurchase(null);
      fetchAllData();
    } catch (error) {
      console.error('Correction error:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la correction');
    } finally {
      setActionLoading(false);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Restreint</h2>
        <p className="text-gray-600">Seuls les administrateurs peuvent accéder à cette page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Chargement des données de facturation...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturation & Comptabilité</h1>
        <p className="text-gray-600">Gestion complète des paiements, taxes et comptabilité</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'stats', label: 'Statistiques', icon: TrendingUp },
            { id: 'purchases', label: 'Ventes', icon: DollarSign },
            { id: 'subscriptions', label: 'Abonnements', icon: Users },
            { id: 'accounting', label: 'Journal Comptable', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Revenus Totaux</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)} $</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Taxes Collect\u00e9es</span>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTaxes.toFixed(2)} $</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Ventes</span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPurchases}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Abonnements Actifs</span>
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Revenus par Province/\u00c9tat</h3>
            <div className="space-y-3">
              {Object.entries(stats.revenueByProvince)
                .sort(([, a], [, b]) => b - a)
                .map(([province, revenue]) => (
                  <div key={province} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{province}</span>
                    <span className="text-sm font-bold text-gray-900">{revenue.toFixed(2)} $</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Purchases Tab */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(purchase.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {parseFloat(purchase.amount.toString()).toFixed(2)} {purchase.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {parseFloat(purchase.tax_amount?.toString() || '0').toFixed(2)} {purchase.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {purchase.province_or_state || purchase.country || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        purchase.status === 'paid' ? 'bg-green-100 text-green-800' :
                        purchase.status === 'refunded' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {purchase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {purchase.invoice_pdf_url && (
                        <a
                          href={purchase.invoice_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Download className="w-4 h-4 inline" />
                        </a>
                      )}
                      {purchase.status === 'paid' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedPurchase(purchase);
                              setShowRefundModal(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <RefreshCw className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPurchase(purchase);
                              setCorrectAmount(purchase.amount.toString());
                              setCorrectTaxAmount(purchase.tax_amount?.toString() || '0');
                              setShowCorrectModal(true);
                            }}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            <Edit className="w-4 h-4 inline" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date D\u00e9but</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P\u00e9riode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(sub.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {sub.plan_id.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        sub.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(sub.current_period_end).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sub.last_invoice_pdf_url && (
                        <a
                          href={sub.last_invoice_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Download className="w-4 h-4 inline" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Accounting Log Tab */}
      {activeTab === 'accounting' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accountingLog.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        entry.type === 'sale' ? 'bg-green-100 text-green-800' :
                        entry.type === 'refund' ? 'bg-red-100 text-red-800' :
                        entry.type === 'correction' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {parseFloat(entry.amount.toString()).toFixed(2)} {entry.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {parseFloat(entry.tax_amount?.toString() || '0').toFixed(2)} {entry.currency}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {entry.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rembourser une Transaction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant (laisser vide pour remboursement complet)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder={selectedPurchase.amount.toString()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raison
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundAmount('');
                    setRefundReason('');
                    setSelectedPurchase(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={actionLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleRefund}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Traitement...' : 'Rembourser'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Correction Modal */}
      {showCorrectModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Corriger une Transaction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau Montant
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={correctAmount}
                  onChange={(e) => setCorrectAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau Montant de Taxes
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={correctTaxAmount}
                  onChange={(e) => setCorrectTaxAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes de Correction
                </label>
                <textarea
                  value={correctNotes}
                  onChange={(e) => setCorrectNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCorrectModal(false);
                    setCorrectAmount('');
                    setCorrectTaxAmount('');
                    setCorrectNotes('');
                    setSelectedPurchase(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={actionLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleCorrectTransaction}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Traitement...' : 'Corriger'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
