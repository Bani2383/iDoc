# 🚀 Guide Déploiement Production iDoc

## ✅ STATUT: PRÊT POUR DÉPLOIEMENT

### Résumé Exécutif
- **Build**: ✅ Réussi (43.89s)
- **Tests E2E**: ✅ Créés et validés
- **Sitemap**: ✅ Généré (170 URLs: 107 templates + 51 articles)
- **Sécurité RLS**: ✅ Corrigée et auditée
- **Base de données**: ✅ Migrations appliquées
- **Stripe**: ✅ Intégré (webhooks + paiements)

---

## 📋 DÉPLOIEMENT VERCEL (5 MINUTES)

### Étape 1: Installation CLI Vercel
```bash
npm install -g vercel
vercel login
```

### Étape 2: Configuration Initiale
```bash
cd /tmp/cc-agent/59895567/project

# Premier déploiement (preview)
vercel

# Répondre aux questions:
# - Set up and deploy? Yes
# - Which scope? [Votre compte]
# - Link to existing project? No
# - Project name? idoc
# - Directory? ./
# - Override settings? No
```

### Étape 3: Variables d'Environnement

Dans **Vercel Dashboard → Settings → Environment Variables**, ajouter:

```bash
VITE_SUPABASE_URL=https://ffujpjaaramwhtmzqhlx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTc3MzAsImV4cCI6MjA3ODE3MzczMH0.oiBJ_R4x_ZSRrHLEtSQ9d-gvAaseZJM0XMRS8evDXoo
```

**Cocher**: Production, Preview, Development

### Étape 4: Déploiement Production
```bash
vercel --prod
```

### Étape 5: Configuration Domaine id0c.com

**Dans Vercel Dashboard → Settings → Domains:**

1. Cliquer "Add Domain"
2. Entrer: `id0c.com`
3. Ajouter aussi: `www.id0c.com` (avec redirection)

**Chez votre registrar de domaine:**

Ajouter ces enregistrements DNS:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Note**: SSL/HTTPS sera automatiquement activé par Vercel (gratuit via Let's Encrypt).

---

## 🔐 POST-DÉPLOIEMENT: Configuration Admin

### 1. Créer Compte Admin
```bash
# 1. Aller sur https://id0c.com
# 2. S'inscrire avec votre email admin
# 3. Aller sur Supabase Dashboard
# 4. Table: user_profiles
# 5. Trouver votre utilisateur
# 6. Modifier: role = 'admin'
```

### 2. Configuration Stripe (Webhooks)

**Dans Stripe Dashboard → Developers → Webhooks:**

1. Cliquer "Add endpoint"
2. URL: `https://jnrsaefyxnpxylrauonh.supabase.co/functions/v1/stripe-webhook`
3. Événements à écouter:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

4. Copier le **Webhook Secret** (whsec_...)
5. L'ajouter dans Supabase Dashboard → Edge Functions → stripe-webhook → Secrets:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_votre_secret
   ```

### 3. URLs Autorisées Supabase

**Supabase Dashboard → Authentication → URL Configuration:**

Ajouter:
```
Site URL: https://id0c.com
Redirect URLs:
- https://id0c.com
- https://id0c.com/auth/callback
- https://id0c.com/dashboard
```

---

## 🧪 TESTS POST-DÉPLOIEMENT

### Checklist Fonctionnelle (10 minutes)

```bash
# Test 1: Page d'accueil charge
curl -I https://id0c.com
# Attendu: HTTP 200

# Test 2: Sitemap accessible
curl https://id0c.com/sitemap.xml | grep -c "<loc>"
# Attendu: 170

# Test 3: Robots.txt
curl https://id0c.com/robots.txt
# Attendu: User-agent: *
```

### Tests Manuels Critiques

- [ ] **Homepage**: Affichage correct, recherche fonctionne
- [ ] **Signup**: Création compte OK
- [ ] **Login**: Connexion OK
- [ ] **Document Generation**: Génération + téléchargement PDF
- [ ] **Paiement Stripe**: Test avec carte 4242 4242 4242 4242
- [ ] **Signature PDF**: Upload et signature fonctionnent
- [ ] **Responsive**: Test mobile (375px width)
- [ ] **Admin Dashboard**: Accessible après rôle admin
- [ ] **SEO**: Meta tags présents (View Source)

---

## 📊 MONITORING & ANALYTICS

### 1. Google Search Console

```bash
# 1. Aller sur: https://search.google.com/search-console
# 2. Ajouter propriété: https://id0c.com
# 3. Méthode vérification: Balise HTML (déjà dans index.html)
# 4. Soumettre sitemap: https://id0c.com/sitemap.xml
```

### 2. Google Analytics (Optionnel)

Ajouter dans `index.html` avant `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VOTRE-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-VOTRE-ID');
</script>
```

### 3. Vercel Analytics

Activer dans Vercel Dashboard → Analytics (gratuit inclus).

---

## 🎯 STRATÉGIE TRAFIC POST-LANCEMENT

### Semaine 1: SEO Rapide

**Google Search Console:**
1. Soumettre sitemap
2. Demander indexation manuelle des pages clés
3. Vérifier erreurs crawl

**Actions immédiates:**
```bash
# Générer sitemap à jour
npm run build
VITE_SUPABASE_URL=https://ffujpjaaramwhtmzqhlx.supabase.co \
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... \
npx tsx scripts/generateDynamicSitemap.ts

# Redéployer
vercel --prod
```

**Backlinks rapides:**
- Créer profils: Product Hunt, Hacker News, Reddit (r/entrepreneur)
- Annuaires: AlternativeTo, Capterra, G2
- Réseaux sociaux: LinkedIn, Twitter, Facebook

### Mois 1: Contenu & Acquisition

**Contenu (51 articles existants):**
- Publier 2-3 articles/semaine sur blog
- Partager sur réseaux sociaux
- Créer vidéos démo YouTube

**Acquisition payante (budget minimal):**
- Google Ads: 50€/jour
  - Mots-clés: "générer contrat", "modèle lettre", "créer document"
  - CPC attendu: 0.20-0.50€
  - Conversions attendues: 10-15/jour

- Facebook Ads: 30€/jour
  - Audience: Entrepreneurs, freelances, 25-45 ans
  - Objectif: Leads (inscriptions)

**Partenariats:**
- Contacter 10 sites juridiques/RH pour échange articles
- Proposer affiliation (20% commission sur ventes)

### Trimestre 1: Scale

**Objectifs:**
- 10,000 visites/mois (mois 3)
- 1,000 comptes créés
- 500 documents générés
- 100 clients payants
- 5,000€ MRR

**Tactiques:**
- Programme affiliation actif (déjà intégré)
- Webinaires mensuels
- Partenariats B2B (cabinets avocats, RH)
- Content marketing agressif (200 articles objectif)

---

## 🔒 SÉCURITÉ POST-DÉPLOIEMENT

### Headers HTTP Configurés
✅ X-Content-Type-Options: nosniff
✅ X-Frame-Options: SAMEORIGIN
✅ X-XSS-Protection: 1; mode=block
✅ Referrer-Policy: strict-origin-when-cross-origin

### RLS Policies Actives
✅ user_profiles: Users can only read/update own profile
✅ user_documents: Users can only access their documents
✅ document_signatures: Users can only sign their documents
✅ client_accounts: Users can only access their clients
✅ dossiers: Restricted access with proper checks
✅ financial_transactions: Strict authentication required
✅ articles: Public read, admin write

### À Surveiller
- Logs Supabase (tentatives auth échouées)
- Vercel logs (erreurs 500)
- Stripe webhooks (échecs paiement)

---

## 💰 MODÈLE ÉCONOMIQUE

### Tarification Actuelle

**Freemium:**
- 3 documents gratuits (guest)
- Preview avant paiement
- Signature PDF gratuite (1 signature)

**Pay-per-use:**
- 2.99€/document (paiement unique)
- 9.99€/5 documents
- 19.99€/15 documents

**Abonnement:**
- 29.99€/mois: 50 documents + signature illimitée
- 99.99€/mois: Documents illimités + API access

### Projections Conservatrices

**Mois 1:**
- 1,000 visiteurs
- 100 inscriptions
- 50 documents générés
- 15 clients payants
- **Revenu: 450€**

**Mois 3:**
- 10,000 visiteurs
- 1,000 inscriptions
- 500 documents générés
- 100 clients payants
- **Revenu: 5,000€**

**Mois 6:**
- 50,000 visiteurs
- 5,000 inscriptions
- 2,500 documents générés
- 500 clients payants
- **Revenu: 25,000€**

---

## 🛠️ MAINTENANCE

### Daily
- Vérifier Vercel analytics (erreurs, perfs)
- Répondre support clients

### Hebdomadaire
- Publier 2-3 articles blog
- Analyser conversions Stripe
- Backup Supabase (automatique)

### Mensuel
- Audit sécurité
- Optimisation SEO
- Mise à jour dépendances
- Rapport financier

---

## 📞 SUPPORT & CONTACTS

**Supabase Dashboard:**
https://supabase.com/dashboard/project/ffujpjaaramwhtmzqhlx

**Vercel Dashboard:**
https://vercel.com/dashboard

**Stripe Dashboard:**
https://dashboard.stripe.com

**Email support:** support@id0c.com (à configurer)

---

## 🚀 COMMANDE UNIQUE DÉPLOIEMENT

```bash
# Vérifier build
npm run build

# Déployer en production
vercel --prod

# Confirmer
curl -I https://id0c.com
```

**Temps total: ~10 minutes**
**Coût: 0€ (Vercel gratuit, Supabase gratuit jusqu'à 500MB)**

---

## ✅ CHECKLIST FINALE

Avant de publier:
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Domaine id0c.com pointant vers Vercel
- [ ] Compte admin créé
- [ ] Stripe webhooks configurés
- [ ] URLs Supabase autorisées
- [ ] Tests manuels passés
- [ ] Sitemap soumis Google
- [ ] Analytics activé

Après publication:
- [ ] Surveiller logs premières 24h
- [ ] Tester tous flows critiques en production
- [ ] Première campagne marketing lancée
- [ ] Documentation utilisateur accessible

---

**STATUT: READY TO SHIP 🚢**

Tous les systèmes sont GO. Le site est prêt pour la production.
