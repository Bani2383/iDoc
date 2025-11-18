import { useState, useEffect } from 'react';
import { CreditCard, Download, Clock, CheckCircle, FileText, DollarSign, Calendar, TrendingUp, ShoppingBag, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Purchase {
  id: string;
  template_id: string | null;
  amount: number;
  tax_amount: number;
  currency: string;
  status: string;
  created_at: string;
  invoice_pdf_url: string | null;
  invoice_hosted_url: string | null;
  metadata: any;
}

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  last_invoice_pdf_url: string | null;
  last_invoice_hosted_url: string | null;
  created_at: string;
}

interface ActivityLog {
  id: string;
  action: string;
  details: any;
  created_at: string;
}

export function ClientPurchaseHistory() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'purchases' | 'subscriptions' | 'activity'>('purchases');
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalPurchases: 0,
    activeSubs: 0,
    lastActivity: ''
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (purchasesError) throw purchasesError;

      // Fetch subscriptions
      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;

      // Fetch activity logs
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (activityError) throw activityError;

      setPurchases(purchasesData || []);
      setSubscriptions(subsData || []);
      setActivityLogs(activityData || []);

      // Calculate stats
      const totalSpent = (purchasesData || []).reduce((sum, p) => sum + Number(p.amount), 0);
      const activeSubs = (subsData || []).filter(s => s.status === 'active').length;
      const lastActivity = activityData?.[0]?.created_at || '';

      setStats({
        totalSpent,
        totalPurchases: purchasesData?.length || 0,
        activeSubs,
        lastActivity
      });

    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'CAD') => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      'completed': { color: 'bg-green-100 text-green-800', label: 'Payé' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      'active': { color: 'bg-blue-100 text-blue-800', label: 'Actif' },
      'canceled': { color: 'bg-red-100 text-red-800', label: 'Annulé' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mon Historique</h2>
        <p className="text-gray-600 mt-1">Vos achats, abonnements et activités</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total dépensé</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.totalSpent)}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Achats</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPurchases}</p>
            </div>
            <ShoppingBag className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Abonnements actifs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeSubs}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dernière activité</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString('fr-FR') : 'Aucune'}
              </p>
            </div>
            <Clock className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'purchases'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Achats ({purchases.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'subscriptions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Abonnements ({subscriptions.length})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'activity'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Activité ({activityLogs.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'purchases' && (
          <div className="space-y-4">
            {purchases.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun achat</h3>
                <p className="text-gray-600">Vous n'avez pas encore effectué d'achat</p>
              </div>
            ) : (
              purchases.map((purchase) => (
                <div key={purchase.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">
                          Achat #{purchase.id.substring(0, 8)}
                        </h3>
                        {getStatusBadge(purchase.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-gray-600">Montant</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(purchase.amount, purchase.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Taxes</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(purchase.tax_amount, purchase.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(purchase.created_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(purchase.amount + purchase.tax_amount, purchase.currency)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {purchase.invoice_pdf_url && (
                        <a
                          href={purchase.invoice_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          <span>PDF</span>
                        </a>
                      )}
                      {purchase.invoice_hosted_url && (
                        <a
                          href={purchase.invoice_hosted_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Voir</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {subscriptions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun abonnement</h3>
                <p className="text-gray-600">Vous n'avez pas d'abonnement actif</p>
              </div>
            ) : (
              subscriptions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">Plan {sub.plan_id.toUpperCase()}</h3>
                        {getStatusBadge(sub.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Début de période</p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(sub.current_period_start)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fin de période</p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(sub.current_period_end)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {sub.last_invoice_pdf_url && (
                      <a
                        href={sub.last_invoice_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Dernière facture</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {activityLogs.length === 0 ? (
              <div className="p-12 text-center">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité</h3>
                <p className="text-gray-600">Aucune activité enregistrée</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{log.action}</p>
                        {log.details && (
                          <p className="text-sm text-gray-600 mt-1">
                            {JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
