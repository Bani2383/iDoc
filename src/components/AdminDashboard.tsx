import { useEffect, useState } from 'react';
import { Users, FileText, DollarSign, TrendingUp, Settings, Activity, Sliders, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { TemplateManager } from './TemplateManager';
import { UserManager } from './UserManager';
import { LoginStatsManager } from './LoginStatsManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import PRDExportButton from './PRDExportButton';

interface Stats {
  totalUsers: number;
  totalDocuments: number;
  totalRevenue: number;
  pendingPayments: number;
}

interface RecentDocument {
  id: string;
  document_type: string;
  status: string;
  price: number;
  created_at: string;
  user_profiles: {
    email: string;
    full_name: string | null;
  };
}

export function AdminDashboard() {
  const { user, profile, signOut } = useAuth();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates' | 'users' | 'stats' | 'settings'>('dashboard');
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDocuments: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = theme === 'minimal' ? {
    primary: 'bg-black hover:bg-gray-800',
    primaryText: 'text-black',
    primaryBorder: 'border-black',
    tabActive: 'border-black text-black',
    tabInactive: 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300',
  } : {
    primary: 'bg-blue-600 hover:bg-blue-700',
    primaryText: 'text-blue-600',
    primaryBorder: 'border-blue-600',
    tabActive: 'border-blue-600 text-blue-600',
    tabInactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
  };

  useEffect(() => {
    fetchStats();
    fetchRecentDocuments();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResult, docsResult, paymentsResult] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('generated_documents').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('amount, status'),
      ]);

      const totalRevenue = paymentsResult.data
        ?.filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      const pendingPayments = paymentsResult.data
        ?.filter(p => p.status === 'pending').length || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalDocuments: docsResult.count || 0,
        totalRevenue,
        pendingPayments,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .select(`
          *,
          user_profiles(email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={theme === 'minimal' ? 'min-h-screen bg-white' : 'min-h-screen bg-gray-50'}>
      <header className={theme === 'minimal' ? 'bg-white border-b border-black' : 'bg-white border-b border-gray-200'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Admin</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm text-gray-600">
                  {profile?.full_name || user?.email}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  Administrateur
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PRDExportButton />
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? colors.tabActive
                  : colors.tabInactive
              }`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'templates'
                  ? colors.tabActive
                  : colors.tabInactive
              }`}
            >
              <Settings className={`w-5 h-5 ${activeTab === 'templates' ? (theme === 'minimal' ? 'text-black' : 'text-blue-600') : 'text-gray-500'}`} />
              <span>Gestion des modèles</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'users'
                  ? colors.tabActive
                  : colors.tabInactive
              }`}
            >
              <Users className={`w-5 h-5 ${activeTab === 'users' ? (theme === 'minimal' ? 'text-black' : 'text-blue-600') : 'text-gray-500'}`} />
              <span>Utilisateurs</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'stats'
                  ? colors.tabActive
                  : colors.tabInactive
              }`}
            >
              <Activity className={`w-5 h-5 ${activeTab === 'stats' ? (theme === 'minimal' ? 'text-black' : 'text-blue-600') : 'text-gray-500'}`} />
              <span>Statistiques</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-colors flex items-center space-x-2 ${
                activeTab === 'settings'
                  ? colors.tabActive
                  : colors.tabInactive
              }`}
            >
              <Sliders className={`w-5 h-5 ${activeTab === 'settings' ? (theme === 'minimal' ? 'text-black' : 'text-blue-600') : 'text-gray-500'}`} />
              <span>Paramètres</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'templates' ? (
          <TemplateManager />
        ) : activeTab === 'users' ? (
          <UserManager />
        ) : activeTab === 'stats' ? (
          <LoginStatsManager />
        ) : activeTab === 'settings' ? (
          <SiteSettingsManager />
        ) : (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <Users className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Documents</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDocuments}</p>
              </div>
              <FileText className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-green-600'}`} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Revenus</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRevenue.toFixed(2)} $</p>
              </div>
              <DollarSign className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-yellow-600'}`} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Paiements en attente</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingPayments}</p>
              </div>
              <TrendingUp className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Documents récents</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : recentDocuments.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              Aucun document pour le moment
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{doc.document_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {doc.user_profiles?.full_name || doc.user_profiles?.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          doc.status === 'generated' ? 'bg-green-100 text-green-700' :
                          doc.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                          doc.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {doc.price.toFixed(2)} $
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </>
        )}
      </main>
    </div>
  );
}
