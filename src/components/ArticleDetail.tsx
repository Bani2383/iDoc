import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Eye, Tag, ArrowLeft, ExternalLink } from 'lucide-react';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  category: string;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  featured_image_url: string | null;
  view_count: number;
  published_at: string;
  related_template: string | null;
}

interface ArticleDetailProps {
  slug: string;
}

export default function ArticleDetail({ slug }: ArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  async function fetchArticle() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      setArticle(data);

      await supabase.rpc('increment_article_views', { article_slug: slug });

      if (data.category) {
        const { data: related } = await supabase
          .from('articles')
          .select('id, slug, title, excerpt, category, published_at, featured_image_url')
          .eq('category', data.category)
          .eq('is_published', true)
          .neq('slug', slug)
          .limit(3);

        if (related) setRelatedArticles(related);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (article) {
      document.title = article.meta_title || `${article.title} | iDoc`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', article.meta_description || article.excerpt);
      }
    }
  }, [article]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
        <p className="text-gray-600 mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
        <button
          onClick={() => {
            const event = new CustomEvent('navigate', { detail: { view: 'articles' } });
            window.dispatchEvent(event);
          }}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Retour aux articles
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => {
          const event = new CustomEvent('navigate', { detail: { view: 'articles' } });
          window.dispatchEvent(event);
        }}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour aux articles
      </button>

      {article.featured_image_url && (
        <img
          src={article.featured_image_url}
          alt={article.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}

      <div className="mb-6">
        <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
          {article.category}
        </span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {article.title}
      </h1>

      <div className="flex items-center gap-6 text-gray-600 text-sm mb-8 pb-8 border-b">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(article.published_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          {article.view_count} vues
        </div>
      </div>

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article.content_html }}
      />

      {article.related_template && (
        <div className="my-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à créer votre document ?
          </h3>
          <p className="text-gray-700 mb-6">
            Utilisez notre modèle professionnel pour créer ce document en quelques minutes.
          </p>
          <a
            href={`/templates/${article.related_template}`}
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Créer maintenant — 1,99€
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      )}

      {relatedArticles.length > 0 && (
        <div className="mt-16 pt-16 border-t">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Articles similaires
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map(related => (
              <a
                key={related.id}
                href={`/articles/${related.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
              >
                {related.featured_image_url && (
                  <img
                    src={related.featured_image_url}
                    alt={related.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <span className="text-xs text-blue-600 font-medium">
                    {related.category}
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 mt-2 mb-2 line-clamp-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {related.excerpt}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-gray-900 mb-2">Besoin d'aide ?</h4>
        <p className="text-gray-600 mb-4">
          Notre équipe est disponible pour vous accompagner dans la création de vos documents.
        </p>
        <a
          href="/contact"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Nous contacter →
        </a>
      </div>
    </div>
  );
}
