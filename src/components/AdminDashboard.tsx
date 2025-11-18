import { useEffect, useState } from 'react';
import { Users, FileText, DollarSign, TrendingUp, Settings, Activity, Sliders, LogOut, Calculator, Receipt, UserCog, Folder, UserCheck, Beaker, Home, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { TemplateManager } from './TemplateManager';
import { LoginStatsManager } from './LoginStatsManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import PRDExportButton from './PRDExportButton';
import { AdminBillingDashboard } from './AdminBillingDashboard';
import { AdminAccountingPanel } from './AdminAccountingPanel';
import { AdminInvoicesPanel } from './AdminInvoicesPanel';
import { DossiersModule } from './DossiersModule';
import { TemplateLabModule } from './TemplateLabModule';
import { UserManagementHub } from './UserManagementHub';

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

  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates' | 'users' | 'stats' | 'settings' | 'billing' | 'accounting' | 'invoices' | 'dossiers' | 'template-lab'>('dashboard');
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDocuments: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const NavButton = ({ tab, icon: Icon, label, active }: any) => (
    <button
      onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin iDoc</h1>
          <div className="mt-2">
            <span className="text-sm text-gray-600 block truncate">{profile?.full_name || user?.email}</span>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 inline-block mt-1">
              Administrateur
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
          <NavButton tab="dashboard" icon={Home} label="Tableau de bord" active={activeTab === 'dashboard'} />

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contenu</p>
          </div>
          <NavButton tab="templates" icon={FileText} label="Modèles" active={activeTab === 'templates'} />
          <NavButton tab="template-lab" icon={Beaker} label="Lab des Modèles" active={activeTab === 'template-lab'} />

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Gestion</p>
          </div>
          <NavButton tab="users" icon={Users} label="Utilisateurs & Clients" active={activeTab === 'users'} />
          <NavButton tab="dossiers" icon={Folder} label="Dossiers" active={activeTab === 'dossiers'} />

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Finance</p>
          </div>
          <NavButton tab="billing" icon={DollarSign} label="Facturation" active={activeTab === 'billing'} />
          <NavButton tab="accounting" icon={Calculator} label="Comptabilité" active={activeTab === 'accounting'} />
          <NavButton tab="invoices" icon={Receipt} label="Factures" active={activeTab === 'invoices'} />

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Système</p>
          </div>
          <NavButton tab="stats" icon={Activity} label="Statistiques" active={activeTab === 'stats'} />
          <NavButton tab="settings" icon={Sliders} label="Paramètres" active={activeTab === 'settings'} />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <PRDExportButton />
          <button
            onClick={() => signOut()}
            className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'templates' ? (
            <TemplateManager />
          ) : activeTab === 'users' ? (
            <UserManagementHub />
          ) : activeTab === 'stats' ? (
            <LoginStatsManager />
          ) : activeTab === 'settings' ? (
            <SiteSettingsManager />
          ) : activeTab === 'billing' ? (
            <AdminBillingDashboard />
          ) : activeTab === 'accounting' ? (
            <AdminAccountingPanel />
          ) : activeTab === 'invoices' ? (
            <AdminInvoicesPanel />
          ) : activeTab === 'dossiers' ? (
            <DossiersModule />
          ) : activeTab === 'template-lab' ? (
            <TemplateLabModule />
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Tableau de bord</h2>
                <p className="text-gray-600 mt-1">Vue d'ensemble de votre plateforme</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Utilisateurs</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                    </div>
                    <Users className="w-12 h-12 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Documents</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDocuments}</p>
                    </div>
                    <FileText className="w-12 h-12 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Revenus</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRevenue.toFixed(2)} €</p>
                    </div>
                    <DollarSign className="w-12 h-12 text-yellow-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">En attente</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingPayments}</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Documents récents</h3>
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
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Prix</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
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
                              {doc.price.toFixed(2)} €
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
        </div>
      </main>
    </div>
  );
}
