import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign, Target, Mail, Clock } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  lastGenerated: Date;
  recipients: string[];
  metrics: string[];
  status: 'active' | 'paused';
}

export default function AutomatedReporting() {
  const [reports] = useState<Report[]>([
    {
      id: '1',
      name: 'Rapport Quotidien - KPIs',
      frequency: 'daily',
      lastGenerated: new Date(),
      recipients: ['admin@idoc.com', 'marketing@idoc.com'],
      metrics: ['Visiteurs', 'Conversions', 'Revenus', 'ROI'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Rapport Hebdomadaire - Campagnes',
      frequency: 'weekly',
      lastGenerated: new Date(Date.now() - 86400000),
      recipients: ['admin@idoc.com', 'ads@idoc.com'],
      metrics: ['Google Ads', 'SEO', 'Email', 'Social'],
      status: 'active'
    },
    {
      id: '3',
      name: 'Rapport Mensuel - Financier',
      frequency: 'monthly',
      lastGenerated: new Date(Date.now() - 7 * 86400000),
      recipients: ['admin@idoc.com', 'finance@idoc.com'],
      metrics: ['MRR', 'Churn', 'LTV', 'CAC'],
      status: 'active'
    }
  ]);

  const generateReport = (reportId: string) => {
    alert(`Génération du rapport ${reportId} en cours...`);
  };

  const downloadSampleReport = () => {
    const sampleReport = `
# RAPPORT QUOTIDIEN IDOC - ${new Date().toLocaleDateString()}

## 📊 VUE D'ENSEMBLE

### Trafic
- Visiteurs: 2,847 (+12% vs hier)
- Pages vues: 8,523 (+15% vs hier)
- Taux de rebond: 42% (-3% vs hier)
- Temps moyen: 3m 24s (+8% vs hier)

### Conversions
- Total conversions: 127 (+18% vs hier)
- Taux de conversion: 4.5% (+0.3% vs hier)
- Revenus: 3,810€ (+22% vs hier)
- Panier moyen: 30€

### Sources de Trafic
1. Google Ads: 1,247 visiteurs (987€ revenus) - ROI: 245%
2. SEO Organique: 823 visiteurs (1,234€ revenus) - ROI: ∞
3. Direct: 512 visiteurs (892€ revenus)
4. Social Media: 187 visiteurs (423€ revenus)
5. Email: 78 visiteurs (274€ revenus) - ROI: 412%

## 🎯 GOOGLE ADS

### Campagne "Haute Intention"
- Dépensé: 127€
- Revenus: 892€
- ROI: 602%
- Conversions: 34
- CPA: 3,74€

### Campagne "Volume Maximum"
- Dépensé: 245€
- Revenus: 542€
- ROI: 121%
- Conversions: 18
- CPA: 13,61€

## 📧 EMAIL MARKETING

### Campagnes Automatiques
- Emails envoyés: 423
- Taux d'ouverture: 68%
- Taux de clic: 34%
- Conversions: 23
- Revenus: 690€

### Top Performing
1. Abandon Panier: 12 conversions (360€)
2. Bienvenue: 8 conversions (240€)
3. Upsell: 3 conversions (90€)

## 🌐 SEO

### Articles Publiés
- Nouveaux articles: 0
- Total articles: 120
- Articles en Top 10: 67
- Trafic organique: +15% vs hier

### Top Articles
1. "Comment créer un contrat": 234 vues, 12 conversions
2. "Modèle de facture": 187 vues, 8 conversions
3. "Lettre de démission": 156 vues, 6 conversions

## 🔄 A/B TESTS

### Tests Actifs
1. Titre Homepage: Variante B gagne (+33%)
2. CTA Couleur: Variante C gagne (+21%)

## 🎬 ACTIONS RECOMMANDÉES

1. ✅ URGENT: Augmenter budget campagne "Haute Intention" (+50€/jour)
2. ⚠️ ATTENTION: Optimiser campagne "Volume Maximum" (ROI faible)
3. 💡 OPPORTUNITÉ: Lancer campagne retargeting (ROI estimé 400%)
4. 📝 TÂCHE: Générer 30 nouveaux articles SEO cette semaine
5. 🎯 RECOMMANDATION: Implémenter variante B du titre (gain +33%)

## 💰 PRÉVISIONS

### Aujourd'hui (estimé fin de journée)
- Visiteurs: 3,200
- Conversions: 145
- Revenus: 4,350€

### Cette Semaine
- Visiteurs: 21,000
- Conversions: 945
- Revenus: 28,350€

### Ce Mois
- Visiteurs: 90,000
- Conversions: 4,050
- Revenus: 121,500€

---
Rapport généré automatiquement le ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([sampleReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-idoc-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <FileText className="text-green-400" />
            Reporting Automatique
          </h1>
          <p className="text-xl text-green-200">
            Recevez vos rapports automatiquement par email
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <MetricCard
            icon={<FileText className="text-blue-400" />}
            label="Rapports Actifs"
            value={reports.filter(r => r.status === 'active').length}
            color="text-blue-400"
          />
          <MetricCard
            icon={<Mail className="text-green-400" />}
            label="Destinataires"
            value={new Set(reports.flatMap(r => r.recipients)).size}
            color="text-green-400"
          />
          <MetricCard
            icon={<Clock className="text-purple-400" />}
            label="Temps Gagné"
            value="12h/sem"
            color="text-purple-400"
          />
        </div>

        <div className="space-y-6 mb-8">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-3xl font-black text-white">{report.name}</h2>
                    <StatusBadge status={report.status} />
                    <FrequencyBadge frequency={report.frequency} />
                  </div>
                  <div className="text-gray-300 text-sm">
                    Dernier rapport: {report.lastGenerated.toLocaleDateString()} à {report.lastGenerated.toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => generateReport(report.id)}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2"
                >
                  <Download size={20} />
                  Générer Maintenant
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Mail className="text-blue-400" />
                    Destinataires
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="space-y-2">
                      {report.recipients.map((email, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          {email}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Target className="text-purple-400" />
                    Métriques Incluses
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {report.metrics.map((metric, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30 mb-8">
          <h2 className="text-3xl font-black text-white mb-6 text-center">
            Exemple de Rapport Quotidien
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contenu Inclus</h3>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-start gap-2">
                  <TrendingUp className="text-green-400 mt-1 flex-shrink-0" size={20} />
                  <span><strong>KPIs Principaux:</strong> Visiteurs, conversions, revenus, ROI</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="text-blue-400 mt-1 flex-shrink-0" size={20} />
                  <span><strong>Campagnes:</strong> Performance Google Ads, SEO, Email</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                  <span><strong>Sources:</strong> Analyse détaillée par canal</span>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                  <span><strong>Financier:</strong> Revenus, dépenses, ROI par source</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="text-pink-400 mt-1 flex-shrink-0" size={20} />
                  <span><strong>A/B Tests:</strong> Résultats des tests en cours</span>
                </li>
                <li className="flex items-start gap-2">
                  <Calendar className="text-orange-400 mt-1 flex-shrink-0" size={20} />
                  <span><strong>Prévisions:</strong> Estimations jour/semaine/mois</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Actions Recommandées</h3>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-gray-300 mb-4">
                  Chaque rapport inclut des recommandations automatiques basées sur vos données :
                </p>
                <ul className="space-y-2 text-gray-200">
                  <li>✅ Actions urgentes à prendre</li>
                  <li>⚠️ Alertes sur performances faibles</li>
                  <li>💡 Opportunités d'optimisation</li>
                  <li>📝 Tâches recommandées</li>
                  <li>🎯 Objectifs suggérés</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={downloadSampleReport}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-black text-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-3 mx-auto"
            >
              <Download size={24} />
              Télécharger un Exemple de Rapport
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30">
          <h2 className="text-3xl font-black text-white mb-6 text-center">
            Bénéfices du Reporting Automatique
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-black text-green-400 mb-2">12h</div>
              <div className="text-white">Temps Gagné / Semaine</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-400 mb-2">100%</div>
              <div className="text-white">Visibilité en Temps Réel</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-400 mb-2">+45%</div>
              <div className="text-white">Réactivité Améliorée</div>
            </div>
            <div>
              <div className="text-4xl font-black text-yellow-400 mb-2">0</div>
              <div className="text-white">Erreur Humaine</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="text-gray-300 text-sm mb-2">{label}</div>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold ${
      status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
    }`}>
      {status === 'active' ? 'ACTIF' : 'PAUSÉ'}
    </span>
  );
}

function FrequencyBadge({ frequency }: { frequency: string }) {
  const colors = {
    daily: 'bg-blue-500/20 text-blue-300',
    weekly: 'bg-purple-500/20 text-purple-300',
    monthly: 'bg-yellow-500/20 text-yellow-300'
  };

  const labels = {
    daily: 'QUOTIDIEN',
    weekly: 'HEBDOMADAIRE',
    monthly: 'MENSUEL'
  };

  return (
    <span className={`px-4 py-1 rounded-full text-xs font-bold ${colors[frequency as keyof typeof colors]}`}>
      {labels[frequency as keyof typeof labels]}
    </span>
  );
}
