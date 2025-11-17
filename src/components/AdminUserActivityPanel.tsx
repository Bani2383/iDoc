import React, { useEffect, useState } from 'react';
import { Users, Activity, TrendingUp, Eye, Search, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface UserWithActivity {
  id: string;
  email: string;
  full_name: string | null;
  login_count: number;
  last_login_at: string | null;
  last_ip: string | null;
  created_at: string;
  role: string;
  recentActivities?: UserActivity[];
  purchaseCount?: number;
  subscriptionActive?: boolean;
}

interface UserActivity {
  id: string;
  timestamp: string;
  activity_type: string;
  page_url: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: any;
}

export const AdminUserActivityPanel: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserWithActivity[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithActivity | null>(null);
  const [userHistory, setUserHistory] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers();
    }
  }, [profile]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Récupérer tous les utilisateurs
      const { data: usersData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('login_count', { ascending: false });

      if (error) throw error;

      // Pour chaque utilisateur, récupérer activités récentes et achats
      const enrichedUsers = await Promise.all(
        (usersData || []).map(async (user) => {
          // Activités récentes
          const { data: activities } = await supabase
            .from('user_activity')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false })
            .limit(5);

          // Nombre d'achats
          const { count: purchaseCount } = await supabase
            .from('purchases')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'paid');

          // Abonnement actif
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .maybeSingle();

          return {
            ...user,
            recentActivities: activities || [],
            purchaseCount: purchaseCount || 0,
            subscriptionActive: !!subscription,
          };
        })
      );

      setUsers(enrichedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setUserHistory(data || []);
    } catch (error) {
      console.error('Error fetching user history:', error);
    }
  };

  const handleViewHistory = async (user: UserWithActivity) => {
    setSelectedUser(user);
    await fetchUserHistory(user.id);
    setShowHistoryModal(true);
  };

  const filteredUsers = users.filter(user =>
    searchQuery === '' ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      login: '🔐',
      visit: '👁️',
      payment: '💳',
      'view-document': '📄',
      'generate-document': '✨',
    };
    return icons[type] || '📌';
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Accès Restreint</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivi des Utilisateurs</h1>
        <p className="text-gray-600">Historique complet des activités et statistiques</p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Utilisateurs</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Connexions Totales</span>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {users.reduce((sum, u) => sum + (u.login_count || 0), 0)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Abonnés Actifs</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {users.filter(u => u.subscriptionActive).length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Achats Totaux</span>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {users.reduce((sum, u) => sum + (u.purchaseCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par email ou nom..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connexions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière Visite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Achats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Abonnement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.full_name || 'Sans nom'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {user.login_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.last_login_at
                      ? new Date(user.last_login_at).toLocaleDateString('fr-FR')
                      : 'Jamais'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.purchaseCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.subscriptionActive ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Actif
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {user.last_ip || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewHistory(user)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Historique</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Historique */}
      {showHistoryModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Historique Complet</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedUser.email} - {userHistory.length} activités
                  </p>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[70vh] p-6">
              <div className="space-y-4">
                {userHistory.map((activity) => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getActivityIcon(activity.activity_type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{activity.activity_type}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          {activity.page_url && (
                            <p className="text-sm text-gray-600 mt-1">
                              Page: {activity.page_url}
                            </p>
                          )}
                          {activity.ip_address && (
                            <p className="text-xs text-gray-500 mt-1">
                              IP: {activity.ip_address}
                            </p>
                          )}
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <pre className="text-xs text-gray-600 mt-2 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
