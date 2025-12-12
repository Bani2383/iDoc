import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Flame, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FlashDeal {
  id: string;
  template_id: string;
  template_name?: string;
  original_price_cents: number;
  deal_price_cents: number;
  discount_percent: number;
  ends_at: string;
  max_purchases: number;
  current_purchases: number;
}

export default function FlashDealsWidget() {
  const { user } = useAuth();
  const [deals, setDeals] = useState<FlashDeal[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDeals = async () => {
    try {
      const { data: dealsData } = await supabase
        .from('flash_deals')
        .select(`
          *,
          document_templates (name)
        `)
        .eq('is_active', true)
        .lte('starts_at', new Date().toISOString())
        .gte('ends_at', new Date().toISOString())
        .order('ends_at', { ascending: true });

      if (dealsData) {
        const formattedDeals = dealsData.map(deal => ({
          ...deal,
          template_name: (deal as any).document_templates?.name || 'Template'
        }));
        setDeals(formattedDeals);
      }
    } catch (error) {
      console.error('Error loading flash deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCountdowns = () => {
    const newTimeLeft: { [key: string]: string } = {};
    deals.forEach(deal => {
      const now = new Date().getTime();
      const end = new Date(deal.ends_at).getTime();
      const distance = end - now;

      if (distance > 0) {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        newTimeLeft[deal.id] = `${hours}h ${minutes}m ${seconds}s`;
      } else {
        newTimeLeft[deal.id] = 'Expiré';
      }
    });
    setTimeLeft(newTimeLeft);
  };

  const purchaseDeal = async (deal: FlashDeal) => {
    if (!user) {
      alert('Connectez-vous pour profiter de cette offre');
      return;
    }

    try {
      const { error } = await supabase
        .from('flash_deal_purchases')
        .insert({
          deal_id: deal.id,
          user_id: user.id
        });

      if (error) {
        if (error.code === '23505') {
          alert('Vous avez déjà acheté cette offre flash !');
        } else {
          throw error;
        }
        return;
      }

      await supabase.rpc('increment', {
        table_name: 'flash_deals',
        row_id: deal.id,
        column_name: 'current_purchases'
      });

      alert('Offre flash achetée avec succès !');
      loadDeals();
    } catch (error) {
      console.error('Error purchasing deal:', error);
      alert('Erreur lors de l\'achat');
    }
  };

  if (loading || deals.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl shadow-2xl p-1">
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-center mb-6">
          <Flame className="w-8 h-8 text-orange-500 animate-pulse mr-2" />
          <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            OFFRES FLASH DU JOUR
          </h3>
          <Flame className="w-8 h-8 text-orange-500 animate-pulse ml-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const originalPrice = (deal.original_price_cents / 100).toFixed(2);
            const dealPrice = (deal.deal_price_cents / 100).toFixed(2);
            const remaining = deal.max_purchases ? deal.max_purchases - deal.current_purchases : 999;
            const percentSold = deal.max_purchases ? (deal.current_purchases / deal.max_purchases) * 100 : 0;

            return (
              <div
                key={deal.id}
                className="relative bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full px-4 py-2 font-bold text-lg shadow-lg">
                  -{deal.discount_percent}%
                </div>

                <div className="mb-4">
                  <h4 className="text-xl font-bold mb-2">{deal.template_name}</h4>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-red-600">{dealPrice}€</span>
                    <span className="text-lg text-gray-400 line-through">{originalPrice}€</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-semibold text-red-600">{timeLeft[deal.id] || 'Calcul...'}</span>
                  </div>
                </div>

                {deal.max_purchases && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Places restantes</span>
                      <span className="font-bold text-orange-600">{remaining}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                        style={{ width: `${percentSold}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => purchaseDeal(deal)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Profiter de l'offre
                </button>

                <div className="mt-3 text-center text-xs text-gray-500">
                  {deal.current_purchases} personnes ont déjà profité de cette offre
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ⚡ Nouvelles offres flash chaque jour à minuit ⚡
          </p>
        </div>
      </div>
    </div>
  );
}
