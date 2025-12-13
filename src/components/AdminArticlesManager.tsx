import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Tag, Save, X, BarChart3 } from 'lucide-react';
import ArticleStatsDashboard from './ArticleStatsDashboard';
import { logger } from '../lib/logger';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  content_markdown: string | null;
  related_template: string | null;
  category: string;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  featured_image_url: string | null;
  view_count: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminArticlesManager() {
  const [activeView, setActiveView] = useState<'list' | 'stats'>('list');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Article>>({
    slug: '',
    title: '',
    excerpt: '',
    content_html: '',
    content_markdown: '',
    related_template: '',
    category: 'general',
    tags: [],
    meta_title: '',
    meta_description: '',
    featured_image_url: '',
    is_published: false
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      logger.error('Erreur chargement articles:', error);
      alert('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(article: Article) {
    setEditingArticle(article);
    setFormData(article);
    setShowForm(true);
  }

  function handleNew() {
    setEditingArticle(null);
    setFormData({
      slug: '',
      title: '',
      excerpt: '',
      content_html: '',
      content_markdown: '',
      related_template: '',
      category: 'general',
      tags: [],
      meta_title: '',
      meta_description: '',
      featured_image_url: '',
      is_published: false
    });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingArticle(null);
  }

  async function handleSave() {
    if (!formData.slug || !formData.title || !formData.excerpt || !formData.content_html) {
      alert('Veuillez remplir tous les champs obligatoires (slug, titre, excerpt, contenu)');
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        published_at: formData.is_published && !formData.published_at ? new Date().toISOString() : formData.published_at
      };

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(dataToSave)
          .eq('id', editingArticle.id);

        if (error) throw error;
        alert('Article mis à jour avec succès!');
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([dataToSave]);

        if (error) throw error;
        alert('Article créé avec succès!');
      }

      setShowForm(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (error: any) {
      logger.error('Erreur sauvegarde:', error);
      alert(`Erreur: ${error.message}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Article supprimé');
      fetchArticles();
    } catch (error: any) {
      logger.error('Erreur suppression:', error);
      alert(`Erreur: ${error.message}`);
    }
  }

  async function togglePublish(article: Article) {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          is_published: !article.is_published,
          published_at: !article.is_published ? new Date().toISOString() : article.published_at
        })
        .eq('id', article.id);

      if (error) throw error;
      fetchArticles();
    } catch (error: any) {
      logger.error('Erreur toggle publish:', error);
      alert(`Erreur: ${error.message}`);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 bg-white border rounded-lg p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="mon-article-exemple"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Résumé (excerpt) *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenu HTML *
            </label>
            <textarea
              value={formData.content_html}
              onChange={(e) => setFormData({ ...formData, content_html: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              rows={8}
              placeholder="<h2>Titre</h2><p>Paragraphe...</p>"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="general">Général</option>
                <option value="emploi">Emploi</option>
                <option value="immigration">Immigration</option>
                <option value="freelance">Freelance</option>
                <option value="academic">Académique</option>
                <option value="personal">Personnel</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template lié (slug)
              </label>
              <input
                type="text"
                value={formData.related_template || ''}
                onChange={(e) => setFormData({ ...formData, related_template: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="cv-professionnel"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (séparés par virgule)
            </label>
            <input
              type="text"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => setFormData({
                ...formData,
                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="CV, Emploi, Carrière"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL image principale
            </label>
            <input
              type="text"
              value={formData.featured_image_url || ''}
              onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta titre (SEO)
            </label>
            <input
              type="text"
              value={formData.meta_title || ''}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta description (SEO)
            </label>
            <textarea
              value={formData.meta_description || ''}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={2}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="mr-2"
              id="published"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              Publier immédiatement
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Articles</h2>
          <p className="text-gray-600 mt-1">{articles.length} article(s) au total</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvel article
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveView('list')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeView === 'list'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Liste des articles
        </button>
        <button
          onClick={() => setActiveView('stats')}
          className={`px-4 py-2 font-medium transition-colors flex items-center ${
            activeView === 'stats'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Statistiques
        </button>
      </div>

      {activeView === 'stats' ? (
        <ArticleStatsDashboard />
      ) : (
        <div>

      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {article.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    article.is_published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {article.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {article.category}
                  </span>
                  {article.published_at && (
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(article.published_at).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {article.view_count} vues
                  </span>
                  {article.tags && article.tags.length > 0 && (
                    <span>Tags: {article.tags.join(', ')}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => togglePublish(article)}
                  className={`p-2 rounded hover:bg-gray-100 ${
                    article.is_published ? 'text-green-600' : 'text-gray-400'
                  }`}
                  title={article.is_published ? 'Dépublier' : 'Publier'}
                >
                  {article.is_published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleEdit(article)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Modifier"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Aucun article pour le moment</p>
            <button
              onClick={handleNew}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Créer votre premier article
            </button>
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
}
