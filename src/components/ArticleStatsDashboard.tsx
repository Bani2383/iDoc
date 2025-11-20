import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, Eye, BookOpen, Users, Calendar, BarChart3, Target, Award } from 'lucide-react';

interface ArticleStats {
  total_articles: number;
  published_articles: number;
  draft_articles: number;
  total_views: number;
  avg_views_per_article: number;
  most_viewed_article: {
    title: string;
    view_count: number;
    slug: string;
  } | null;
  category_stats: {
    category: string;
    count: number;
    total_views: number;
  }[];
  recent_activity: {
    id: string;
    title: string;
    view_count: number;
    published_at: string;
    category: string;
  }[];
}

export default function ArticleStatsDashboard() {
  const [stats, setStats] = useState<ArticleStats>({
    total_articles: 0,
    published_articles: 0,
    draft_articles: 0,
    total_views: 0,
    avg_views_per_article: 0,
    most_viewed_article: null,
    category_stats: [],
    recent_activity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .order('view_count', { ascending: false });

      if (error) throw error;

      if (!articles || articles.length === 0) {
        setLoading(false);
        return;
      }

      const totalArticles = articles.length;
      const publishedArticles = articles.filter(a => a.is_published).length;
      const draftArticles = totalArticles - publishedArticles;
      const totalViews = articles.reduce((sum, a) => sum + (a.view_count || 0), 0);
      const avgViews = publishedArticles > 0 ? Math.round(totalViews / publishedArticles) : 0;

      const mostViewed = articles[0];

      const categoryMap = new Map<string, { count: number; views: number }>();
      articles.forEach(article => {
        const cat = article.category || 'general';
        const existing = categoryMap.get(cat) || { count: 0, views: 0 };
        categoryMap.set(cat, {
          count: existing.count + 1,
          views: existing.views + (article.view_count || 0)
        });
      });

      const categoryStats = Array.from(categoryMap.entries())
        .map(([category, data]) => ({
          category,
          count: data.count,
          total_views: data.views
        }))
        .sort((a, b) => b.total_views - a.total_views);

      const recentActivity = articles
        .filter(a => a.is_published && a.published_at)
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
        .slice(0, 5)
        .map(a => ({
          id: a.id,
          title: a.title,
          view_count: a.view_count || 0,
          published_at: a.published_at,
          category: a.category
        }));

      setStats({
        total_articles: totalArticles,
        published_articles: publishedArticles,
        draft_articles: draftArticles,
        total_views: totalViews,
        avg_views_per_article: avgViews,
        most_viewed_article: mostViewed ? {
          title: mostViewed.title,
          view_count: mostViewed.view_count || 0,
          slug: mostViewed.slug
        } : null,
        category_stats: categoryStats,
        recent_activity: recentActivity
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-7 h-7 mr-3 text-blue-600" />
          Statistiques des Articles
        </h2>
        <p className="text-gray-600 mt-1">Vue d'ensemble des performances de votre blog</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_articles}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.published_articles} publiés • {stats.draft_articles} brouillons
              </p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lectures</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_views.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Toutes catégories
              </p>
            </div>
            <Eye className="w-12 h-12 text-green-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Moyenne/Article</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avg_views_per_article}</p>
              <p className="text-xs text-gray-500 mt-1">vues par article</p>
            </div>
            <Target className="w-12 h-12 text-indigo-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux Publication</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total_articles > 0
                  ? Math.round((stats.published_articles / stats.total_articles) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">articles publiés</p>
            </div>
            <Award className="w-12 h-12 text-yellow-600 opacity-80" />
          </div>
        </div>
      </div>

      {stats.most_viewed_article && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Award className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-bold">Article le plus consulté</h3>
              </div>
              <p className="text-2xl font-bold mb-2">{stats.most_viewed_article.title}</p>
              <div className="flex items-center text-blue-100">
                <Eye className="w-4 h-4 mr-2" />
                <span className="text-xl font-semibold">{stats.most_viewed_article.view_count.toLocaleString()}</span>
                <span className="ml-2">lectures</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-sm font-medium">Top Performer</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Performance par Catégorie
          </h3>
          <div className="space-y-3">
            {stats.category_stats.length > 0 ? (
              stats.category_stats.map((cat, index) => {
                const maxViews = Math.max(...stats.category_stats.map(c => c.total_views));
                const percentage = maxViews > 0 ? (cat.total_views / maxViews) * 100 : 0;

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 capitalize">{cat.category}</span>
                      <span className="text-gray-600">
                        {cat.count} article{cat.count > 1 ? 's' : ''} • {cat.total_views} vues
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune catégorie disponible</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Articles Récents
          </h3>
          <div className="space-y-3">
            {stats.recent_activity.length > 0 ? (
              stats.recent_activity.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{article.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="capitalize">{article.category}</span>
                      <span>•</span>
                      <span>{new Date(article.published_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-gray-700 ml-3">
                    <Eye className="w-4 h-4 mr-1 text-green-600" />
                    {article.view_count}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Aucun article publié</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <TrendingUp className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Conseils pour améliorer vos statistiques</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Publiez régulièrement du contenu de qualité (2-3 articles/semaine)</li>
              <li>• Optimisez vos meta descriptions et titres pour le SEO</li>
              <li>• Ajoutez des images featured attractives</li>
              <li>• Liez vos articles aux templates correspondants pour augmenter la conversion</li>
              <li>• Partagez vos articles sur les réseaux sociaux</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
