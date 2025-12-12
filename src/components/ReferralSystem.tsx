import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Gift, Users, Copy, CheckCircle, TrendingUp, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Referral {
  id: string;
  referred_user_id: string;
  status: string;
  created_at: string;
  first_purchase_at: string | null;
}

export default function ReferralSystem() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    if (!user) return;

    try {
      const code = `REF${user.id.slice(0, 8).toUpperCase()}`;
      setReferralCode(code);

      const { data: referralsData } = await supabase
        .from('user_referrals')
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('created_at', { ascending: false });

      if (referralsData) {
        setReferrals(referralsData);
      }

      const { data: rewardsData } = await supabase
        .from('referral_rewards')
        .select('reward_value')
        .eq('user_id', user.id)
        .eq('claimed', true);

      if (rewardsData) {
        const total = rewardsData.reduce((sum, reward) => sum + reward.reward_value, 0);
        setTotalEarned(total);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = 'Rejoins-moi sur iDoc.com !';
    const body = `Salut !\n\nJ'utilise iDoc.com pour générer mes documents juridiques en quelques secondes. C'est vraiment pratique !\n\nUtilise mon code de parrainage ${referralCode} pour obtenir 20% de réduction sur ton premier achat.\n\nLien : ${window.location.origin}?ref=${referralCode}\n\nÀ bientôt !`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaSocial = (platform: string) => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    const text = 'Découvre iDoc.com pour générer tes documents en quelques secondes !';

    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`;
        break;
    }

    window.open(url, '_blank', 'width=600,height=400');
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <Gift className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Programme de Parrainage</h2>
          <p className="text-gray-600 mb-6">Connectez-vous pour accéder à votre programme de parrainage</p>
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

  const completedReferrals = referrals.filter(r => r.status === 'rewarded').length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-center mb-6">
          <Gift className="w-12 h-12 mr-3" />
          <div>
            <h1 className="text-4xl font-bold">Programme de Parrainage</h1>
            <p className="text-purple-100 text-lg">Gagnez des récompenses en partageant iDoc.com</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{completedReferrals}</div>
            <div className="text-purple-100">Parrainages réussis</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{pendingReferrals}</div>
            <div className="text-purple-100">En attente</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center">
            <Gift className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{totalEarned}€</div>
            <div className="text-purple-100">Crédits gagnés</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Votre Code de Parrainage</h2>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg font-mono text-xl font-bold text-center bg-blue-50"
              />
              <button
                onClick={copyReferralLink}
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
                    Copier
                  </>
                )}
              </button>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Lien de parrainage : {window.location.origin}?ref={referralCode}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <Share2 className="w-5 h-5 mr-2" />
              Partager via
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareViaEmail}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                Email
              </button>
              <button
                onClick={() => shareViaSocial('whatsapp')}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
              >
                WhatsApp
              </button>
              <button
                onClick={() => shareViaSocial('facebook')}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all"
              >
                Facebook
              </button>
              <button
                onClick={() => shareViaSocial('twitter')}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-all"
              >
                Twitter
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Comment ça marche ?</h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Partagez votre code</h3>
                <p className="text-sm text-gray-600">Invitez vos amis à utiliser iDoc.com avec votre code de parrainage</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Ils obtiennent 20% de réduction</h3>
                <p className="text-sm text-gray-600">Votre filleul bénéficie d'une réduction sur son premier achat</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Vous gagnez 10€ de crédits</h3>
                <p className="text-sm text-gray-600">Dès que votre filleul effectue son premier achat, vous recevez 10€ de crédits</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Gift className="w-6 h-6 text-orange-600 mr-2" />
              <div className="text-sm">
                <strong className="text-orange-900">Bonus spécial :</strong>{' '}
                <span className="text-gray-700">Parrainez 10 amis et débloquez le statut VIP avec des avantages exclusifs !</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {referrals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Vos Parrainages</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Premier achat</th>
                  <th className="text-left py-3 px-4">Récompense</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(referral.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        referral.status === 'rewarded'
                          ? 'bg-green-100 text-green-800'
                          : referral.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {referral.status === 'rewarded' ? 'Récompensé' : referral.status === 'completed' ? 'Complété' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {referral.first_purchase_at
                        ? new Date(referral.first_purchase_at).toLocaleDateString('fr-FR')
                        : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {referral.status === 'rewarded' ? (
                        <span className="text-green-600 font-bold">+10€</span>
                      ) : (
                        <span className="text-gray-400">En attente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
