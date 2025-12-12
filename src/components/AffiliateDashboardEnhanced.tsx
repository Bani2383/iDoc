import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DollarSign, Users, Link2, TrendingUp, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AffiliateData {
  id: string;
  affiliate_code: string;
  commission_rate: number;
  recurring_commission_rate: number;
  total_clicks: number;
  total_conversions: number;
  total_earned_cents: number;
}

export default function AffiliateDashboardEnhanced() {
  const { user } = useAuth();
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      loadAffiliateData();
    }
  }, [user]);

  const loadAffiliateData = async () => {
    if (!user) return;

    try {
      let { data: affiliate } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!affiliate) {
        const code = `AFF${user.id.slice(0, 8).toUpperCase()}`;
        const { data: newAffiliate, error } = await supabase
          .from('affiliates')
          .insert({
            user_id: user.id,
            affiliate_code: code,
            status: 'active'
          })
          .select()
          .single();

        if (error) throw error;
        affiliate = newAffiliate;
      }

      if (affiliate) {
        setAffiliateData(affiliate);

        const { data: commissionsData } = await supabase
          .from('affiliate_commissions')
          .select('*')
          .eq('affiliate_id', affiliate.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (commissionsData) setCommissions(commissionsData);
      }
    } catch (error) {
      console.error('Error loading affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAffiliateLink = () => {
    if (!affiliateData) return;
    const link = `${window.location.origin}?aff=${affiliateData.affiliate_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Programme d'Affiliation</h2>
          <p className="text-gray-600 mb-6">Connectez-vous pour rejoindre notre programme d'affiliation</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!affiliateData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Erreur</h2>
          <p className="text-gray-600">Impossible de charger les données d'affiliation</p>
        </div>
      </div>
    );
  }

  const conversionRate = affiliateData.total_clicks > 0
    ? (affiliateData.total_conversions / affiliateData.total_clicks * 100).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Dashboard Affiliation</h1>
        <p className="text-green-100 text-lg">Gagnez jusqu'à 30% de commission sur chaque vente !</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-sm font-medium">Gains Totaux</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {(affiliateData.total_earned_cents / 100).toFixed(2)}€
          </div>
          <div className="text-sm text-gray-500">Commission: {affiliateData.commission_rate * 100}%</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-sm font-medium">Clics Totaux</span>
            <Link2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold mb-2">{affiliateData.total_clicks}</div>
          <div className="text-sm text-gray-500">Sur votre lien affilié</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-sm font-medium">Conversions</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold mb-2">{affiliateData.total_conversions}</div>
          <div className="text-sm text-gray-500">Ventes générées</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-sm font-medium">Taux Conversion</span>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold mb-2">{conversionRate}%</div>
          <div className="text-sm text-gray-500">Performance</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Votre Lien d'Affiliation</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Code Affilié</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={affiliateData.affiliate_code}
              readOnly
              className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg font-mono text-lg bg-blue-50"
            />
            <button
              onClick={copyAffiliateLink}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copier le lien
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Votre lien:</strong> {window.location.origin}?aff={affiliateData.affiliate_code}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-4">Comment ça marche ?</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Partagez votre lien</h4>
                <p className="text-sm text-gray-600">Diffusez votre lien sur vos réseaux sociaux, blog, ou par email</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Vos visiteurs achètent</h4>
                <p className="text-sm text-gray-600">Chaque achat via votre lien vous rapporte une commission</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Recevez vos gains</h4>
                <p className="text-sm text-gray-600">Vos commissions sont versées tous les mois sur votre compte</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-4">Structure des Commissions</h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Première vente</span>
                <span className="text-2xl font-bold text-green-600">{affiliateData.commission_rate * 100}%</span>
              </div>
              <p className="text-sm text-gray-600">Sur chaque première vente d'un client référé</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Abonnements récurrents</span>
                <span className="text-2xl font-bold text-blue-600">{affiliateData.recurring_commission_rate * 100}%</span>
              </div>
              <p className="text-sm text-gray-600">Sur chaque renouvellement d'abonnement</p>
            </div>
          </div>
        </div>
      </div>

      {commissions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Historique des Commissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Montant</th>
                  <th className="text-left py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(commission.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">
                        {commission.commission_type === 'first_sale' ? 'Première vente' :
                         commission.commission_type === 'recurring' ? 'Récurrent' : 'Bonus'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-green-600">
                        +{(commission.amount_cents / 100).toFixed(2)}€
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        commission.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : commission.status === 'approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {commission.status === 'paid' ? 'Payé' :
                         commission.status === 'approved' ? 'Approuvé' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-3">Conseils pour Maximiser vos Gains</h3>
        <ul className="space-y-2 text-gray-700">
          <li>✅ Partagez votre lien sur vos réseaux sociaux régulièrement</li>
          <li>✅ Créez du contenu autour des documents juridiques (blog, vidéos)</li>
          <li>✅ Ciblez les entrepreneurs et professionnels qui ont besoin de documents</li>
          <li>✅ Utilisez des groupes Facebook et forums spécialisés</li>
          <li>✅ Proposez votre lien dans votre signature email</li>
        </ul>
      </div>
    </div>
  );
}
