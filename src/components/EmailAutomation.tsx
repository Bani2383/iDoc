import React, { useState } from 'react';
import { Mail, Send, Clock, Users, CheckCircle, TrendingUp, Zap } from 'lucide-react';

interface EmailCampaign {
  id: string;
  name: string;
  trigger: string;
  subject: string;
  content: string;
  delay: number;
  status: 'active' | 'paused' | 'draft';
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
}

export default function EmailAutomation() {
  const [campaigns] = useState<EmailCampaign[]>([
    {
      id: '1',
      name: 'Bienvenue Nouveau Visiteur',
      trigger: 'Première visite',
      subject: 'Bienvenue sur iDoc - Créez votre premier document gratuitement',
      content: `Bonjour,

Bienvenue sur iDoc ! 👋

Nous sommes ravis de vous accueillir. Pour commencer, voici ce que vous pouvez faire :

✅ Créer votre premier document en 2 minutes
✅ Accéder à +100 modèles professionnels
✅ Signer et partager vos documents

🎁 OFFRE SPÉCIALE : -30% sur votre premier achat avec le code BIENVENUE30

Créez votre document maintenant : [LIEN]

À bientôt,
L'équipe iDoc`,
      delay: 5,
      status: 'active',
      sent: 1247,
      opened: 823,
      clicked: 312,
      converted: 87
    },
    {
      id: '2',
      name: 'Abandon Panier',
      trigger: 'Document créé mais non téléchargé',
      subject: '⏰ Votre document vous attend - Finalisez maintenant',
      content: `Bonjour,

Nous avons remarqué que vous avez commencé à créer un document mais ne l'avez pas finalisé.

Votre document est toujours disponible et vous attend ! 📄

🎁 OFFRE LIMITÉE : Finalisez maintenant et obtenez 40% de réduction
Code promo : FINALISE40
Valable uniquement 24h

Reprendre où vous étiez : [LIEN]

Cette offre expire dans 24h !

L'équipe iDoc`,
      delay: 60,
      status: 'active',
      sent: 423,
      opened: 298,
      clicked: 156,
      converted: 67
    },
    {
      id: '3',
      name: 'Réactivation 30 jours',
      trigger: 'Pas de connexion depuis 30 jours',
      subject: 'On vous a manqué ! 🎁 Revenez avec 50% de réduction',
      content: `Bonjour,

Cela fait un moment ! Nous espérons que tout va bien. 😊

Nous avons ajouté de nouvelles fonctionnalités :
✨ 50 nouveaux modèles de documents
✨ Signature électronique intégrée
✨ Génération IA encore plus rapide

🎁 OFFRE RETOUR : 50% de réduction sur tous nos plans
Code : RETOUR50
Valable 7 jours

Redécouvrez iDoc : [LIEN]

À très bientôt,
L'équipe iDoc`,
      delay: 43200,
      status: 'active',
      sent: 187,
      opened: 94,
      clicked: 31,
      converted: 12
    },
    {
      id: '4',
      name: 'Upsell Après Achat',
      trigger: 'Achat document simple',
      subject: '🚀 Passez au niveau supérieur avec 40% de réduction',
      content: `Bonjour,

Merci pour votre achat ! Nous espérons que vous êtes satisfait de votre document. 💼

Saviez-vous que vous pourriez faire encore plus avec iDoc Pro ?

🌟 Avec iDoc Pro, vous obtenez :
• Documents illimités
• Signature électronique
• Stockage sécurisé
• Support prioritaire

💰 OFFRE SPÉCIALE CLIENT : -40% sur votre première année
Code : PRO40

Passer à Pro maintenant : [LIEN]

Offre valable 48h uniquement !

L'équipe iDoc`,
      delay: 1440,
      status: 'active',
      sent: 312,
      opened: 234,
      clicked: 98,
      converted: 45
    },
    {
      id: '5',
      name: 'Demande Avis',
      trigger: '7 jours après achat satisfait',
      subject: 'Votre avis nous intéresse 💬',
      content: `Bonjour,

Vous utilisez iDoc depuis maintenant 7 jours. Nous aimerions avoir votre retour ! 😊

Votre avis est précieux et nous aide à améliorer notre service.

⭐ Donnez votre avis (2 minutes) : [LIEN]

🎁 En remerciement, recevez 20€ de crédits gratuits !

Merci de votre confiance,
L'équipe iDoc

P.S. : Partagez votre expérience et aidez d'autres utilisateurs !`,
      delay: 10080,
      status: 'active',
      sent: 543,
      opened: 412,
      clicked: 187,
      converted: 134
    }
  ]);

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
  const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0);
  const totalConverted = campaigns.reduce((sum, c) => sum + c.converted, 0);

  const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
  const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
  const conversionRate = totalSent > 0 ? (totalConverted / totalSent) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <Mail className="text-blue-400" />
            Automatisation Email
          </h1>
          <p className="text-xl text-blue-200">
            Convertissez automatiquement avec des emails ciblés
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <MetricCard
            icon={<Send className="text-blue-400" />}
            label="Emails Envoyés"
            value={totalSent.toLocaleString()}
            color="text-blue-400"
          />
          <MetricCard
            icon={<Mail className="text-green-400" />}
            label="Taux d'Ouverture"
            value={`${openRate.toFixed(1)}%`}
            color="text-green-400"
          />
          <MetricCard
            icon={<TrendingUp className="text-purple-400" />}
            label="Taux de Clic"
            value={`${clickRate.toFixed(1)}%`}
            color="text-purple-400"
          />
          <MetricCard
            icon={<CheckCircle className="text-yellow-400" />}
            label="Conversions"
            value={totalConverted}
            subtitle={`${conversionRate.toFixed(1)}%`}
            color="text-yellow-400"
          />
        </div>

        <div className="space-y-6">
          {campaigns.map((campaign) => {
            const campaignOpenRate = campaign.sent > 0 ? (campaign.opened / campaign.sent) * 100 : 0;
            const campaignClickRate = campaign.opened > 0 ? (campaign.clicked / campaign.opened) * 100 : 0;
            const campaignConversionRate = campaign.sent > 0 ? (campaign.converted / campaign.sent) * 100 : 0;

            return (
              <div
                key={campaign.id}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-3xl font-black text-white">{campaign.name}</h2>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                      <span className="flex items-center gap-2">
                        <Zap size={16} />
                        Trigger: {campaign.trigger}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={16} />
                        Délai: {formatDelay(campaign.delay)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Contenu</h3>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="mb-3">
                        <span className="text-gray-400 text-sm">Sujet:</span>
                        <p className="text-white font-semibold">{campaign.subject}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Message:</span>
                        <pre className="text-gray-300 text-sm mt-2 whitespace-pre-wrap font-sans">
                          {campaign.content.slice(0, 200)}...
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Performances</h3>
                    <div className="space-y-3">
                      <PerformanceBar
                        label="Envoyés"
                        value={campaign.sent}
                        percentage={100}
                        color="bg-blue-500"
                      />
                      <PerformanceBar
                        label="Ouverts"
                        value={campaign.opened}
                        percentage={campaignOpenRate}
                        color="bg-green-500"
                      />
                      <PerformanceBar
                        label="Cliqués"
                        value={campaign.clicked}
                        percentage={campaignClickRate}
                        color="bg-purple-500"
                      />
                      <PerformanceBar
                        label="Convertis"
                        value={campaign.converted}
                        percentage={campaignConversionRate}
                        color="bg-yellow-500"
                      />
                    </div>

                    <div className="mt-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                      <div className="text-center">
                        <div className="text-3xl font-black text-green-400 mb-1">
                          {campaignConversionRate.toFixed(2)}%
                        </div>
                        <div className="text-green-200 text-sm">Taux de Conversion</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30">
          <h2 className="text-3xl font-black text-white mb-6 text-center">
            Stratégie d'Email Automation
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-white">
            <div>
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Users className="text-blue-400" />
                Segmentation
              </h3>
              <ul className="space-y-2 text-gray-200">
                <li>• Nouveaux visiteurs</li>
                <li>• Paniers abandonnés</li>
                <li>• Clients actifs</li>
                <li>• Clients inactifs</li>
                <li>• VIP / Gros acheteurs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <Clock className="text-purple-400" />
                Timing Optimal
              </h3>
              <ul className="space-y-2 text-gray-200">
                <li>• Bienvenue: 5 minutes</li>
                <li>• Abandon: 1 heure</li>
                <li>• Relance: 24 heures</li>
                <li>• Réactivation: 30 jours</li>
                <li>• Fidélisation: 7 jours</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <TrendingUp className="text-green-400" />
                Optimisation
              </h3>
              <ul className="space-y-2 text-gray-200">
                <li>• A/B test des sujets</li>
                <li>• Personnalisation du contenu</li>
                <li>• Offres exclusives</li>
                <li>• Urgence et rareté</li>
                <li>• Preuve sociale</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border border-yellow-500/30">
          <h2 className="text-2xl font-black text-white mb-4 text-center">
            💡 Résultats Attendus
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-black text-green-400 mb-2">+45%</div>
              <div className="text-white">Conversions</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-400 mb-2">+120%</div>
              <div className="text-white">Revenus</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-400 mb-2">-60%</div>
              <div className="text-white">Abandons</div>
            </div>
            <div>
              <div className="text-4xl font-black text-yellow-400 mb-2">+200%</div>
              <div className="text-white">ROI Email</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, subtitle, color }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-gray-300 text-sm mb-2">{label}</div>
      <div className={`text-3xl font-black ${color}`}>{value}</div>
      {subtitle && <div className="text-gray-400 text-sm mt-1">{subtitle}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: 'bg-green-500/20 text-green-300',
    paused: 'bg-yellow-500/20 text-yellow-300',
    draft: 'bg-gray-500/20 text-gray-300'
  };

  const labels = {
    active: 'ACTIF',
    paused: 'PAUSÉ',
    draft: 'BROUILLON'
  };

  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold ${colors[status as keyof typeof colors]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}

function PerformanceBar({ label, value, percentage, color }: any) {
  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
      <div className="flex justify-between mb-2">
        <span className="text-white font-medium">{label}</span>
        <span className="text-white font-bold">{value} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

function formatDelay(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} heures`;
  return `${Math.floor(minutes / 1440)} jours`;
}
