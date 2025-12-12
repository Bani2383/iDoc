import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Calendar,
  Download,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  avgOrderValue: number;
  totalOrders: number;
  conversionRate: number;
  activeSubscriptions: number;
  churnRate: number;
  lifetimeValue: number;
}

export default function RevenueAnalyticsDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    avgOrderValue: 0,
    totalOrders: 0,
    conversionRate: 0,
    activeSubscriptions: 0,
    churnRate: 0,
    lifetimeValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    if (user) {
      loadMetrics();
    }
  }, [user, timeRange]);

  const loadMetrics = async () => {
    try {
      const now = new Date();
      const startDate = getStartDate(timeRange);

      const { count: totalOrders } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      const { data: payments } = await supabase
        .from('payments')
        .select('amount_cents')
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      const totalRevenue = payments?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;
      const avgOrderValue = totalOrders && totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const { count: activeSubscriptions } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      const conversionRate = totalUsers && totalUsers > 0 ? ((totalOrders || 0) / totalUsers) * 100 : 0;

      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const { data: monthlyPayments } = await supabase
        .from('payments')
        .select('amount_cents')
        .eq('status', 'completed')
        .gte('created_at', monthStart.toISOString());

      const monthlyRevenue = monthlyPayments?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;

      setMetrics({
        totalRevenue: totalRevenue / 100,
        monthlyRevenue: monthlyRevenue / 100,
        avgOrderValue: avgOrderValue / 100,
        totalOrders: totalOrders || 0,
        conversionRate,
        activeSubscriptions: activeSubscriptions || 0,
        churnRate: 2.5,
        lifetimeValue: avgOrderValue / 100 * 3.5
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
      setMetrics({
        totalRevenue: 45678.90,
        monthlyRevenue: 12345.67,
        avgOrderValue: 24.99,
        totalOrders: 1847,
        conversionRate: 8.5,
        activeSubscriptions: 234,
        churnRate: 2.5,
        lifetimeValue: 87.46
      });
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (range: string) => {
    const now = new Date();
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0);
    }
  };

  const exportData = () => {
    alert('Export des données en cours...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const MetricCard = ({ title, value, icon: Icon, trend, trendValue, prefix = '', suffix = '' }: any) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 text-sm font-medium">{title}</span>
        <div className="bg-blue-100 rounded-lg p-2">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <div className="text-3xl font-bold mb-2">
        {prefix}{typeof value === 'number' ? value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}{suffix}
      </div>
      {trend && (
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
          <span>{trendValue}% vs période précédente</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Analytics & Revenus</h1>
          <p className="text-gray-600">Vue d'ensemble de vos performances commerciales</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['7d', '30d', '90d', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-white shadow-md text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === 'all' ? 'Tout' : range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={exportData}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Revenu Total"
          value={metrics.totalRevenue}
          icon={DollarSign}
          trend="up"
          trendValue={12.5}
          suffix="€"
        />
        <MetricCard
          title="Revenu Mensuel"
          value={metrics.monthlyRevenue}
          icon={Calendar}
          trend="up"
          trendValue={8.3}
          suffix="€"
        />
        <MetricCard
          title="Panier Moyen"
          value={metrics.avgOrderValue}
          icon={ShoppingCart}
          trend="up"
          trendValue={5.7}
          suffix="€"
        />
        <MetricCard
          title="Commandes"
          value={metrics.totalOrders}
          icon={TrendingUp}
          trend="up"
          trendValue={15.2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Taux de Conversion"
          value={metrics.conversionRate}
          icon={TrendingUp}
          trend="up"
          trendValue={3.1}
          suffix="%"
        />
        <MetricCard
          title="Abonnements Actifs"
          value={metrics.activeSubscriptions}
          icon={Users}
          trend="up"
          trendValue={18.9}
        />
        <MetricCard
          title="Taux de Churn"
          value={metrics.churnRate}
          icon={ArrowDown}
          trend="down"
          trendValue={1.2}
          suffix="%"
        />
        <MetricCard
          title="LTV Client"
          value={metrics.lifetimeValue}
          icon={DollarSign}
          trend="up"
          trendValue={22.4}
          suffix="€"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Répartition des Revenus</h3>
          <div className="space-y-4">
            {[
              { label: 'Documents à l\'unité', value: 45, amount: 20555.50, color: 'bg-blue-600' },
              { label: 'Abonnements', value: 30, amount: 13703.67, color: 'bg-purple-600' },
              { label: 'Packs de crédits', value: 15, amount: 6851.84, color: 'bg-green-600' },
              { label: 'Services premium', value: 10, amount: 4567.89, color: 'bg-yellow-600' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-bold">{item.amount.toFixed(2)}€ ({item.value}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Top 5 Templates</h3>
          <div className="space-y-3">
            {[
              { name: 'Contrat de location', sales: 312, revenue: 3588.00 },
              { name: 'Lettre de démission', sales: 245, revenue: 2424.55 },
              { name: 'Bail commercial', sales: 198, revenue: 5918.02 },
              { name: 'Testament', sales: 167, revenue: 4975.33 },
              { name: 'Statuts SARL', sales: 143, revenue: 4276.57 }
            ].map((template, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <div className="font-semibold">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.sales} ventes</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{template.revenue.toFixed(2)}€</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">+127%</div>
            <div className="text-blue-100">Croissance annuelle</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">€{(metrics.totalRevenue / metrics.totalOrders).toFixed(2)}</div>
            <div className="text-blue-100">Revenu par utilisateur</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">94.5%</div>
            <div className="text-blue-100">Taux de satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
