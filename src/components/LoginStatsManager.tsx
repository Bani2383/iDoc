import { useState, useEffect, useCallback } from 'react';
import { Activity, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface LoginLog {
  id: string;
  user_id: string;
  login_at: string;
  ip_address: string | null;
  user_agent: string | null;
  user_profiles: {
    email: string;
    full_name: string | null;
  };
}

interface LoginStats {
  totalLogins: number;
  uniqueUsers: number;
  loginsToday: number;
  loginsThisWeek: number;
  loginsThisMonth: number;
}

export function LoginStatsManager() {
  const { theme } = useTheme();
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [stats, setStats] = useState<LoginStats>({
    totalLogins: 0,
    uniqueUsers: 0,
    loginsToday: 0,
    loginsThisWeek: 0,
    loginsThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const fetchLoginStats = useCallback(async () => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [totalResult, todayResult, weekResult, monthResult] = await Promise.all([
        supabase.from('login_logs').select('id, user_id', { count: 'exact' }),
        supabase.from('login_logs').select('id', { count: 'exact' }).gte('login_at', today.toISOString()),
        supabase.from('login_logs').select('id', { count: 'exact' }).gte('login_at', weekAgo.toISOString()),
        supabase.from('login_logs').select('id', { count: 'exact' }).gte('login_at', monthAgo.toISOString()),
      ]);

      const uniqueUsers = new Set(totalResult.data?.map(l => l.user_id) || []).size;

      setStats({
        totalLogins: totalResult.count || 0,
        uniqueUsers,
        loginsToday: todayResult.count || 0,
        loginsThisWeek: weekResult.count || 0,
        loginsThisMonth: monthResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching login stats:', error);
    }
  }, []);

  const fetchLoginLogs = useCallback(async () => {
    try {
      let query = supabase
        .from('login_logs')
        .select(`
          id,
          user_id,
          login_at,
          ip_address,
          user_agent,
          user_profiles!inner(email, full_name)
        `)
        .order('login_at', { ascending: false })
        .limit(50);

      if (filter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('login_at', today.toISOString());
      } else if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('login_at', weekAgo.toISOString());
      } else if (filter === 'month') {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        query = query.gte('login_at', monthAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching login logs:', error);
        throw error;
      }

      console.log('Login logs fetched:', data);
      setLogs(data || []);
    } catch (error) {
      console.error('Error in fetchLoginLogs:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchLoginLogs();
    fetchLoginStats();
  }, [filter, fetchLoginLogs, fetchLoginStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Statistiques de connexion</h2>
          <p className="text-gray-600 mt-1">Suivez l'activité des utilisateurs</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tout
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7 jours
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30 jours
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLogins}</p>
            </div>
            <Activity className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Utilisateurs uniques</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uniqueUsers}</p>
            </div>
            <TrendingUp className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-green-600'}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">Aujourd'hui</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.loginsToday}</p>
            </div>
            <Clock className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-yellow-600'}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">7 jours</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.loginsThisWeek}</p>
            </div>
            <Calendar className="w-12 h-12 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600">30 jours</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.loginsThisMonth}</p>
            </div>
            <Calendar className={`w-12 h-12 ${theme === 'minimal' ? 'text-gray-900' : 'text-red-600'}`} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Historique des connexions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date/Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {log.user_profiles?.full_name || 'Nom non renseigné'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.user_profiles?.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(log.login_at).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {log.ip_address || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            Aucune connexion enregistrée
          </div>
        )}
      </div>
    </div>
  );
}
