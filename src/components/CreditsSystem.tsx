import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CreditCard, Zap, TrendingUp, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CreditPackage {
  id: string;
  name: string;
  credits_amount: number;
  bonus_credits: number;
  price_cents: number;
  is_popular: boolean;
}

interface UserCredits {
  balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
}

export default function CreditsSystem() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const { data: packagesData } = await supabase
        .from('credits_packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (packagesData) setPackages(packagesData);

      if (user) {
        const { data: creditsData } = await supabase
          .from('user_credits')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (creditsData) setUserCredits(creditsData);
      }
    } catch (error) {
      console.error('Error loading credits data:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchasePackage = async (pkg: CreditPackage) => {
    if (!user) {
      alert('Veuillez vous connecter pour acheter des crédits');
      return;
    }

    setPurchasing(pkg.id);
    try {
      const totalCredits = pkg.credits_amount + pkg.bonus_credits;

      const { error: txError } = await supabase
        .from('credits_transactions')
        .insert({
          user_id: user.id,
          amount: totalCredits,
          transaction_type: 'purchase',
          description: `Achat package ${pkg.name}`,
          reference_id: pkg.id
        });

      if (txError) throw txError;

      await loadData();
      alert(`Succès ! ${totalCredits} crédits ajoutés à votre compte`);
    } catch (error) {
      console.error('Error purchasing credits:', error);
      alert('Erreur lors de l\'achat');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {userCredits && (
        <div className="mb-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{userCredits.balance}</div>
              <div className="text-blue-200">Crédits disponibles</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{userCredits.lifetime_earned}</div>
              <div className="text-blue-200">Crédits gagnés</div>
            </div>
            <div className="text-center">
              <Gift className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{userCredits.lifetime_spent}</div>
              <div className="text-blue-200">Crédits utilisés</div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Acheter des Crédits</h2>
        <p className="text-xl text-gray-600">Plus vous achetez, plus vous économisez !</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {packages.map((pkg) => {
          const totalCredits = pkg.credits_amount + pkg.bonus_credits;
          const bonusPercent = Math.round((pkg.bonus_credits / pkg.credits_amount) * 100);
          const priceEur = (pkg.price_cents / 100).toFixed(2);
          const pricePerCredit = (pkg.price_cents / totalCredits / 100).toFixed(2);

          return (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-6 ${
                pkg.is_popular
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 shadow-xl scale-105'
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    LE PLUS POPULAIRE
                  </span>
                </div>
              )}

              {pkg.bonus_credits > 0 && (
                <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold shadow-lg">
                  +{bonusPercent}%
                </div>
              )}

              <div className="text-center mb-4">
                <div className="text-2xl font-bold mb-2">{pkg.name}</div>
                <div className="text-4xl font-bold text-blue-600 mb-1">
                  {totalCredits}
                </div>
                <div className="text-sm text-gray-500">crédits</div>
              </div>

              {pkg.bonus_credits > 0 && (
                <div className="bg-green-100 text-green-800 rounded-lg p-2 mb-4 text-center text-sm font-semibold">
                  🎁 +{pkg.bonus_credits} crédits BONUS
                </div>
              )}

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900">{priceEur}€</div>
                <div className="text-sm text-gray-500">{pricePerCredit}€ / crédit</div>
              </div>

              <button
                onClick={() => purchasePackage(pkg)}
                disabled={purchasing === pkg.id}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  pkg.is_popular
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {purchasing === pkg.id ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Achat...
                  </span>
                ) : (
                  <>
                    <CreditCard className="inline w-5 h-5 mr-2" />
                    Acheter maintenant
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-center">Comment fonctionnent les crédits ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              1
            </div>
            <h4 className="font-semibold mb-2">Achetez des crédits</h4>
            <p className="text-sm text-gray-600">Choisissez le package qui vous convient</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              2
            </div>
            <h4 className="font-semibold mb-2">Générez des documents</h4>
            <p className="text-sm text-gray-600">1 crédit = 1 document généré</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              3
            </div>
            <h4 className="font-semibold mb-2">Gagnez des bonus</h4>
            <p className="text-sm text-gray-600">Parrainages et accomplissements</p>
          </div>
        </div>
      </div>
    </div>
  );
}
