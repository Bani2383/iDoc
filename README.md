# iDoc - Générateur de Documents Professionnels

Plateforme SaaS de génération de documents PDF en ligne. 20+ modèles disponibles en français et anglais.

## 🚀 Déploiement Rapide

Le site est prêt à être déployé sur **iD0c.com**.

### Option 1: Vercel (Recommandé)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Build manuel

```bash
npm install
npm run build
# Déployer le dossier dist/
```

## 📋 Configuration requise

### Variables d'environnement

Créer un fichier `.env`:

```bash
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon
```

### Google Analytics

Remplacer `G-XXXXXXXXXX` dans `index.html` (lignes 39 et 44) par votre ID Analytics.

## 📁 Documentation

- **DEPLOIEMENT_ID0C_COM.md** - Guide complet de déploiement
- **GUIDE_DEPLOIEMENT_SEO.md** - Configuration SEO
- **GUIDE_MONITORING_TRAFIC.md** - KPIs et monitoring
- **CHECKLIST_DEPLOIEMENT.md** - Checklist complète
- **NOUVELLES_FONCTIONNALITES.md** - Features pour clients

## 🎯 Fonctionnalités

- 20+ templates de documents (FR + EN)
- Génération PDF instantanée
- Paiement sécurisé (1,99$ CAD)
- SEO optimisé (85+ URLs)
- Compatible AI (ChatGPT, Copilot)
- Assistants vocaux (Siri, Google Assistant)
- Multi-langues (30 langues)
- Dashboard admin complet
- Analytics intégré

## 🔧 Développement

```bash
# Installation
npm install

# Dev server
npm run dev

# Build production
npm run build

# Tests
npm run test

# Linting
npm run lint
```

## 📊 Structure

```
src/
├── components/       # Composants React
├── contexts/         # Contexts (Auth, Theme, Language)
├── hooks/           # Custom hooks
├── lib/             # Utilitaires (supabase, analytics, pdf)
├── locales/         # Traductions (30 langues)
└── data/            # Données statiques

public/
├── sitemap.xml      # SEO sitemap
├── robots.txt       # Robots configuration
└── manifest.json    # PWA manifest

supabase/
├── migrations/      # Database migrations
└── functions/       # Edge functions
```

## 🌐 Post-Déploiement

1. Configurer Google Search Console
2. Soumettre sitemap.xml
3. Configurer Bing Webmaster Tools
4. Activer monitoring (UptimeRobot)
5. Vérifier analytics

Voir **DEPLOIEMENT_ID0C_COM.md** pour les détails complets.

## 📈 Objectifs

- Mois 1: 100-500 visiteurs organiques
- Mois 3: 500-1,500 visiteurs
- Mois 12: 3,000-10,000 visiteurs

## 🔒 Sécurité

- HTTPS obligatoire
- Row Level Security (RLS) sur toutes les tables
- Variables d'environnement sécurisées
- Headers de sécurité configurés
- Paiements via Stripe (PCI compliant)

## 📞 Support

Pour questions techniques, consulter la documentation dans le dossier racine.

## 📄 License

Propriétaire - iDoc 2024
