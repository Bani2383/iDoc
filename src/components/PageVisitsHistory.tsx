import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Eye, User, Globe, Calendar, Filter, TrendingUp } from 'lucide-react';

interface PageVisit {
  id: string;
  user_id: string | null;
  activity_type: string;
  page_url: string;
  timestamp: string;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
}

interface PageVisitSummary {
  page_url: string;
  visit_count: number;
  unique_visitors: number;
  last_visit: string;
}

export default function PageVisitsHistory() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<PageVisit[]>([]);
  const [summaries, setSummaries] = useState<PageVisitSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mine'>('mine');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [viewMode, setViewMode] = useState<'list' | 'summary'>('list');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchVisits();
      fetchSummaries();
    }
  }, [user, filter, timeRange, isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    setIsAdmin(data?.role === 'admin');
  };

  const fetchVisits = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('user_activity')
        .select('*')
        .in('activity_type', ['page_view', 'visit'])
        .order('timestamp', { ascending: false })
        .limit(100);

      if (!isAdmin || filter === 'mine') {
        query = query.eq('user_id', user?.id);
      }

      const now = new Date();
      if (timeRange === 'today') {
        const today = new Date(now.setHours(0, 0, 0, 0));
        query = query.gte('timestamp', today.toISOString());
      } else if (timeRange === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        query = query.gte('timestamp', weekAgo.toISOString());
      } else if (timeRange === 'month') {
        const monthAgo = new Date(now.setDate(now.getDate() - 30));
        query = query.gte('timestamp', monthAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaries = async () => {
    try {
      const now = new Date();
      let startDate = new Date();

      if (timeRange === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (timeRange === 'week') {
        startDate = new Date(now.setDate(now.getDate() - 7));
      } else if (timeRange === 'month') {
        startDate = new Date(now.setDate(now.getDate() - 30));
      } else {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }

      let query = supabase
        .from('user_activity')
        .select('page_url, user_id, timestamp')
        .in('activity_type', ['page_view', 'visit'])
        .gte('timestamp', startDate.toISOString());

      if (!isAdmin || filter === 'mine') {
        query = query.eq('user_id', user?.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const summaryMap = new Map<string, { count: number; users: Set<string>; lastVisit: string }>();

      data?.forEach((visit) => {
        const existing = summaryMap.get(visit.page_url) || {
          count: 0,
          users: new Set(),
          lastVisit: visit.timestamp,
        };

        existing.count++;
        if (visit.user_id) existing.users.add(visit.user_id);
        if (new Date(visit.timestamp) > new Date(existing.lastVisit)) {
          existing.lastVisit = visit.timestamp;
        }

        summaryMap.set(visit.page_url, existing);
      });

      const summaryArray: PageVisitSummary[] = Array.from(summaryMap.entries()).map(
        ([page_url, data]) => ({
          page_url,
          visit_count: data.count,
          unique_visitors: data.users.size,
          last_visit: data.lastVisit,
        })
      );

      summaryArray.sort((a, b) => b.visit_count - a.visit_count);
      setSummaries(summaryArray);
    } catch (error) {
      console.error('Error fetching summaries:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Il y a quelques secondes';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPageDisplayName = (url: string) => {
    const pathMap: Record<string, string> = {
      '/': 'Accueil',
      '/dashboard': 'Tableau de bord',
      '/templates': 'Modèles',
      '/documents': 'Documents',
      '/profile': 'Profil',
      '/admin': 'Administration',
      '/pricing': 'Tarifs',
      '/faq': 'FAQ',
    };

    return pathMap[url] || url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Historique des visites</h2>
              <p className="text-sm text-gray-600">
                {filter === 'mine' ? 'Vos visites' : 'Toutes les visites'} sur le site
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'summary'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Résumé
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'mine')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mine">Mes visites</option>
                <option value="all">Toutes les visites</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
              <option value="all">Tout</option>
            </select>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="space-y-2">
            {visits.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Aucune visite enregistrée</p>
              </div>
            ) : (
              visits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-white rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {getPageDisplayName(visit.page_url)}
                      </p>
                      <p className="text-sm text-gray-500">{visit.page_url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {isAdmin && filter === 'all' && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{visit.user_id ? 'Connecté' : 'Anonyme'}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(visit.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {summaries.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Aucune statistique disponible</p>
              </div>
            ) : (
              summaries.map((summary, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-white rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {getPageDisplayName(summary.page_url)}
                      </p>
                      <p className="text-sm text-gray-500">{summary.page_url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{summary.visit_count}</p>
                      <p className="text-xs text-gray-500">Visites</p>
                    </div>
                    {isAdmin && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {summary.unique_visitors}
                        </p>
                        <p className="text-xs text-gray-500">Visiteurs</p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Dernière visite</p>
                      <p className="text-xs text-gray-500">{formatDate(summary.last_visit)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {visits.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Statistiques</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Total des visites</p>
                  <p className="text-2xl font-bold text-blue-900">{visits.length}</p>
                </div>
                <div>
                  <p className="text-blue-700">Pages uniques</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {new Set(visits.map((v) => v.page_url)).size}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Période</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {timeRange === 'today'
                      ? "Aujourd'hui"
                      : timeRange === 'week'
                      ? '7 jours'
                      : timeRange === 'month'
                      ? '30 jours'
                      : 'Total'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
