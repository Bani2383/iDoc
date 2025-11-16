import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  CheckCircle,
  ExternalLink,
  Share2,
  Target,
  Award,
} from 'lucide-react';
import { supabase, Affiliate, Referral } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export default function AffiliateDashboard() {
  const { user } = useAuth();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      loadAffiliateData();
    }
  }, [user]);

  const loadAffiliateData = async () => {
    if (!user) return;

    try {
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (affiliateError) throw affiliateError;

      if (affiliateData) {
        setAffiliate(affiliateData);

        const { data: referralsData, error: referralsError } = await supabase
          .from('referrals')
          .select('*')
          .eq('affiliate_id', affiliateData.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (referralsError) throw referralsError;
        setReferrals(referralsData || []);
      }
    } catch (error) {
      console.error('Error loading affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAffiliateAccount = async () => {
    if (!user) return;

    setCreating(true);

    try {
      const { data, error } = await supabase.rpc('generate_referral_code');
      if (error) throw error;

      const code = data;

      const { error: insertError } = await supabase.from('affiliates').insert({
        user_id: user.id,
        referral_code: code,
        commission_rate: 0.3,
        is_active: true,
      });

      if (insertError) throw insertError;

      await loadAffiliateData();
    } catch (error) {
      console.error('Error creating affiliate account:', error);
      alert('Erreur lors de la création du compte affilié');
    } finally {
      setCreating(false);
    }
  };

  const copyReferralLink = () => {
    if (!affiliate) return;

    const link = `${window.location.origin}/?ref=${affiliate.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(cents / 100);
  };

  const getPendingEarnings = () => {
    return referrals
      .filter((r) => r.status === 'pending')
      .reduce((sum, r) => sum + (r.commission_cents || 0), 0);
  };

  const getConversionRate = () => {
    const total = referrals.length;
    const converted = referrals.filter((r) => r.transaction_id !== null).length;
    return total > 0 ? ((converted / total) * 100).toFixed(1) : '0';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Programme d'Affiliation iDoc
          </h1>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Gagnez 30% de commission sur chaque vente générée par vos liens de parrainage.
            Parfait pour créateurs de contenu, consultants et professionnels.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Commission 30%</h3>
              <p className="text-sm text-gray-600">
                Sur tous les paiements (documents à 1,99$ et abonnements Pro à 9,99$/mois)
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cookie 90 jours</h3>
              <p className="text-sm text-gray-600">
                Attribution longue durée pour maximiser vos gains
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Paiement mensuel</h3>
              <p className="text-sm text-gray-600">
                Versement automatique dès 50$ de commission
              </p>
            </div>
          </div>

          <button
            onClick={createAffiliateAccount}
            disabled={creating}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold text-lg inline-flex items-center gap-2"
          >
            {creating ? (
              <>
                <LoadingSpinner />
                <span>Création...</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span>Rejoindre le Programme</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Affilié</h1>
        <p className="text-gray-600 mt-2">Suivez vos performances et vos commissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(affiliate.total_earnings_cents)}
          </div>
          <div className="text-sm text-gray-600">Gains totaux</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(getPendingEarnings())}
          </div>
          <div className="text-sm text-gray-600">En attente</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{affiliate.total_referrals}</div>
          <div className="text-sm text-gray-600">Parrainages</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{getConversionRate()}%</div>
          <div className="text-sm text-gray-600">Taux de conversion</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Votre lien de parrainage</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white rounded-lg px-4 py-3 border border-gray-300 font-mono text-sm text-gray-700">
            {window.location.origin}/?ref={affiliate.referral_code}
          </div>
          <button
            onClick={copyReferralLink}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Copié!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=Générez vos documents légaux en quelques clics avec iDoc&url=${encodeURIComponent(
              `${window.location.origin}/?ref=${affiliate.referral_code}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Partager sur X</span>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              `${window.location.origin}/?ref=${affiliate.referral_code}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Partager sur Facebook</span>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              `${window.location.origin}/?ref=${affiliate.referral_code}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Partager sur LinkedIn</span>
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Historique des parrainages</h3>
        </div>

        {referrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(referral.created_at).toLocaleDateString('fr-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {referral.commission_cents ? formatCurrency(referral.commission_cents) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          referral.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : referral.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {referral.status === 'paid' ? 'Payé' : referral.status === 'pending' ? 'En attente' : 'Annulé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {referral.paid_at
                        ? new Date(referral.paid_at).toLocaleDateString('fr-CA')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun parrainage</h3>
            <p className="text-gray-600">Partagez votre lien pour commencer à gagner des commissions</p>
          </div>
        )}
      </div>
    </div>
  );
}
