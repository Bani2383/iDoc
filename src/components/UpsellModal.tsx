import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  base_price_cents: number;
}

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedTemplateId: string;
}

export default function UpsellModal({ isOpen, onClose, purchasedTemplateId }: UpsellModalProps) {
  const [recommendations, setRecommendations] = useState<Template[]>([]);
  const [discountPercent, setDiscountPercent] = useState(20);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && purchasedTemplateId) {
      loadRecommendations();
    }
  }, [isOpen, purchasedTemplateId]);

  const loadRecommendations = async () => {
    try {
      const { data: rules } = await supabase
        .from('upsell_rules')
        .select('*')
        .eq('trigger_template_id', purchasedTemplateId)
        .eq('is_active', true)
        .eq('display_timing', 'post_purchase')
        .order('priority', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (rules && rules.recommended_template_ids) {
        const { data: templates } = await supabase
          .from('document_templates')
          .select('*')
          .in('id', rules.recommended_template_ids)
          .limit(3);

        if (templates) {
          setRecommendations(templates);
          setDiscountPercent(rules.discount_percent || 20);
        }
      }

      if (!rules || !rules.recommended_template_ids || recommendations.length === 0) {
        const { data: purchasedTemplate } = await supabase
          .from('document_templates')
          .select('category')
          .eq('id', purchasedTemplateId)
          .maybeSingle();

        if (purchasedTemplate) {
          const { data: similarTemplates } = await supabase
            .from('document_templates')
            .select('*')
            .eq('category', purchasedTemplate.category)
            .neq('id', purchasedTemplateId)
            .eq('is_public', true)
            .limit(3);

          if (similarTemplates) {
            setRecommendations(similarTemplates);
          }
        }
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseUpsell = async (template: Template) => {
    setPurchasing(template.id);
    try {
      alert(`Achat de "${template.name}" avec ${discountPercent}% de réduction !`);

      const discountedPrice = template.base_price_cents * (1 - discountPercent / 100);

      await new Promise(resolve => setTimeout(resolve, 1000));

      setPurchasing(null);
    } catch (error) {
      console.error('Error purchasing upsell:', error);
      setPurchasing(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 mr-3" />
            <div>
              <h2 className="text-3xl font-bold">Achat réussi !</h2>
              <p className="text-blue-100">Votre document a été ajouté à votre compte</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Offre Spéciale Exclusive</h3>
            <p className="text-lg text-gray-600">
              Complétez votre collection maintenant avec <span className="text-red-600 font-bold">{discountPercent}% de réduction</span>
            </p>
            <div className="mt-4 inline-block bg-red-100 text-red-800 px-6 py-2 rounded-full font-bold">
              Cette offre expire dans 10 minutes ⏰
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune recommandation disponible pour le moment</p>
              <button
                onClick={onClose}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((template) => {
                const originalPrice = (template.base_price_cents / 100).toFixed(2);
                const discountedPrice = (template.base_price_cents * (1 - discountPercent / 100) / 100).toFixed(2);
                const savings = (template.base_price_cents * discountPercent / 100 / 100).toFixed(2);

                return (
                  <div
                    key={template.id}
                    className="relative border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-all hover:shadow-lg"
                  >
                    <div className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full px-3 py-1 font-bold text-sm shadow-lg">
                      -{discountPercent}%
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold text-lg mb-2">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Prix normal:</span>
                          <span className="text-sm text-gray-400 line-through">{originalPrice}€</span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold">Prix aujourd'hui:</span>
                          <span className="text-2xl font-bold text-blue-600">{discountedPrice}€</span>
                        </div>
                        <div className="text-xs text-green-600 font-semibold">
                          Économisez {savings}€ !
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => purchaseUpsell(template)}
                      disabled={purchasing === template.id}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {purchasing === template.id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Achat...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Ajouter maintenant
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 underline"
            >
              Non merci, je continue
            </button>
          </div>

          <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <Sparkles className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-1" />
              <div className="text-sm text-gray-700">
                <strong>Pourquoi ces documents ?</strong> Les clients qui ont acheté le même document que vous ont aussi trouvé ces templates très utiles. Profitez de cette réduction exclusive maintenant !
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
