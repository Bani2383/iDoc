# Guide Déploiement Complet iDoc - 2026

**STATUT**: PRÊT POUR PRODUCTION

**Build**: ✅ Réussi (13.20s)
**Sécurité**: ✅ RLS configuré
**SEO**: ✅ Optimisé
**Templates**: ✅ 107 templates
**Articles**: ✅ 51 articles blog

---

# TABLE DES MATIÈRES

1. [Déploiement Vercel](#1-déploiement-vercel)
2. [Configuration DNS/Domaine](#2-configuration-dns-domaine)
3. [Variables d'Environnement](#3-variables-denvironnement)
4. [SEO & Performance](#4-seo--performance)
5. [Emails Transactionnels](#5-emails-transactionnels)
6. [Post-Déploiement](#6-post-déploiement)
7. [Monitoring](#7-monitoring)

---

# 1. DÉPLOIEMENT VERCEL

## Option A: Déploiement via Dashboard (RECOMMANDÉ)

### Étape 1.1: Préparer le Repo
```bash
# 1. Pousser le code sur GitHub/GitLab
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Étape 1.2: Connecter à Vercel
```
1. Aller sur https://vercel.com
2. Cliquer "Add New Project"
3. Importer votre repo GitHub/GitLab
4. Framework Preset: Vite (auto-détecté)
5. Root Directory: ./
6. Build Command: npm run build
7. Output Directory: dist
8. Cliquer "Deploy"
```

**Temps**: 2-3 minutes pour le premier déploiement.

---

## Option B: Déploiement via CLI

### Installation CLI
```bash
npm install -g vercel
vercel login
```

### Premier Déploiement
```bash
cd /tmp/cc-agent/59895567/project

# Preview deployment
vercel

# Production deployment
vercel --prod
```

**Résultat**: Vous recevrez une URL comme `https://idoc-xxxxx.vercel.app`

---

# 2. CONFIGURATION DNS DOMAINE

## Configuration pour id0c.com

### Étape 2.1: Ajouter le Domaine dans Vercel

```
1. Dashboard Vercel → Votre Projet
2. Settings → Domains
3. Cliquer "Add Domain"
4. Entrer: id0c.com
5. Cocher "Redirect www.id0c.com to id0c.com"
6. Cliquer "Add"
```

Vercel va vous donner des instructions DNS à configurer.

---

### Étape 2.2: Configurer DNS chez votre Registrar

**Chez votre registrar de domaine (GoDaddy, Namecheap, OVH, etc.)**:

#### Configuration Minimale (DNS A Record)

```
Type: A
Name: @ (ou laisser vide)
Value: 76.76.21.21
TTL: 3600
```

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### Configuration Avancée (Nameservers Vercel)

Si vous voulez gérer tout le DNS via Vercel:

```
Dans votre registrar:
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
```

**Avantages**:
- Gestion centralisée dans Vercel
- Plus facile pour configurer emails ensuite
- Propagation plus rapide

**Temps de propagation**: 15 minutes à 48 heures (généralement 1-2 heures)

---

### Étape 2.3: Vérifier la Configuration

```bash
# Vérifier DNS A record
dig id0c.com +short
# Attendu: 76.76.21.21

# Vérifier CNAME www
dig www.id0c.com +short
# Attendu: cname.vercel-dns.com

# Tester HTTPS (après propagation)
curl -I https://id0c.com
# Attendu: HTTP/2 200
```

**Ou via outil en ligne**:
https://dnschecker.org → Entrer `id0c.com`

---

# 3. VARIABLES D'ENVIRONNEMENT

## Étape 3.1: Configuration dans Vercel Dashboard

```
1. Vercel Dashboard → Votre Projet
2. Settings → Environment Variables
3. Ajouter chaque variable ci-dessous
```

## Variables OBLIGATOIRES

### Supabase (CRITIQUE)

```bash
VITE_SUPABASE_URL=https://ffujpjaaramwhtmzqhlx.supabase.co
```
**Description**: URL de votre projet Supabase
**Environnements**: Production, Preview, Development

```bash
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTc3MzAsImV4cCI6MjA3ODE3MzczMH0.oiBJ_R4x_ZSRrHLEtSQ9d-gvAaseZJM0XMRS8evDXoo
```
**Description**: Clé anonyme Supabase (safe pour le client)
**Environnements**: Production, Preview, Development

### Application

```bash
VITE_APP_URL=https://id0c.com
```
**Description**: URL de production du site
**Environnements**: Production uniquement

---

## Variables OPTIONNELLES (Recommandées)

### Stripe (Pour Paiements)

```bash
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```
**Description**: Clé publique Stripe (mode live)
**Environnements**: Production

```bash
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```
**Description**: Clé publique Stripe (mode test)
**Environnements**: Preview, Development

**Note**: Les clés secrètes Stripe doivent être dans Supabase Edge Functions, PAS dans Vercel.

### Analytics

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
**Description**: Google Analytics Measurement ID
**Environnements**: Production

```bash
VITE_HOTJAR_ID=XXXXXXX
```
**Description**: Hotjar Site ID
**Environnements**: Production

---

## Étape 3.2: Redéployer

Après avoir ajouté les variables:

```bash
# Via CLI
vercel --prod

# Ou via Dashboard
Settings → Deployments → Redeploy
```

---

# 4. SEO & PERFORMANCE

## 4.1 Sitemap & Robots.txt

✅ **Déjà configuré** dans votre projet:

- `public/sitemap.xml` - 170+ URLs
- `public/robots.txt` - Optimisé pour Google, AI crawlers
- `vercel.json` - Headers SEO optimisés

**Vérification post-déploiement**:
```bash
curl https://id0c.com/sitemap.xml
curl https://id0c.com/robots.txt
```

---

## 4.2 Google Search Console

### Configuration (10 minutes)

```
1. Aller sur https://search.google.com/search-console
2. Cliquer "Ajouter une propriété"
3. Type: "Préfixe d'URL" → https://id0c.com
4. Méthode de vérification: "Balise HTML"
5. Copier le code de vérification
```

### Ajouter la Balise de Vérification

```bash
# Éditer index.html
# Ajouter dans <head>:
<meta name="google-site-verification" content="VOTRE_CODE_ICI" />
```

### Soumettre Sitemap

```
Dans Google Search Console:
1. Onglet "Sitemaps"
2. Ajouter: https://id0c.com/sitemap.xml
3. Cliquer "Envoyer"
```

**Indexation**: 24-72 heures pour les premières pages

---

## 4.3 Schema Markup (Structured Data)

✅ **Déjà intégré** dans votre code:

- Organization schema (homepage)
- Product schema (templates)
- FAQ schema (pages FAQ)
- Article schema (blog posts)

**Vérification**:
```
https://search.google.com/test/rich-results
→ Entrer: https://id0c.com
```

---

## 4.4 Performance Optimizations

✅ **Déjà configuré** via `vercel.json`:

### Headers de Cache
```json
/assets/* → Cache 1 an (immutable)
/sitemap.xml → Cache 24h
/robots.txt → Cache 24h
```

### Headers de Sécurité
```json
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Optimisations Build
- Code splitting automatique
- CSS minifié (89 KB)
- Lazy loading des composants
- Images optimisées

**Score attendu (PageSpeed)**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

---

## 4.5 Analytics Vercel

### Activation

```
1. Dashboard Vercel → Votre Projet
2. Onglet "Analytics"
3. Cliquer "Enable"
```

**Gratuit inclus**:
- Core Web Vitals
- Temps de chargement
- Taux de rebond
- Sources de trafic

---

# 5. EMAILS TRANSACTIONNELS

## Architecture Email

Votre système utilise:
- **Resend.com** (envoi emails)
- **Supabase Edge Functions** (backend)
- **Domaine personnalisé** (id0c.com)

---

## 5.1 Créer Compte Resend

```
1. Aller sur https://resend.com
2. Sign Up (Email + Password)
3. Confirmer email
4. Plan gratuit: 3,000 emails/mois
```

---

## 5.2 Ajouter Domaine dans Resend

```
1. Dashboard Resend → "Domains"
2. Cliquer "Add Domain"
3. Entrer: id0c.com
4. Cliquer "Add"
```

Resend va afficher **3 records DNS**:

### Record SPF (TXT)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

### Record DKIM (CNAME)
```
Type: CNAME
Name: resend._domainkey
Value: [fourni par Resend - copier exactement]
TTL: 3600
```

### Record Vérification (TXT)
```
Type: TXT
Name: _resend
Value: [fourni par Resend - copier exactement]
TTL: 3600
```

---

## 5.3 Configurer DNS pour Emails

### Si DNS géré par Vercel

```
1. Dashboard Vercel → Settings → Domains
2. Cliquer sur "id0c.com"
3. Section "DNS Records"
4. Ajouter les 3 records ci-dessus
```

### Si DNS géré par Registrar externe

Ajouter les 3 records dans votre registrar (GoDaddy, Namecheap, etc.)

**Vérification propagation**:
```bash
dig TXT id0c.com +short | grep spf
dig CNAME resend._domainkey.id0c.com +short
dig TXT _resend.id0c.com +short
```

**Temps**: 15-30 minutes

---

## 5.4 Obtenir API Key Resend

```
1. Dashboard Resend → "API Keys"
2. Cliquer "Create API Key"
3. Name: "iDoc Production"
4. Permission: "Full Access"
5. Cliquer "Create"
6. COPIER LA CLÉ (commence par re_...)
```

**Format**: `re_xxxxxxxxxxxxxxxxxxxxx`

⚠️ **IMPORTANT**: Cette clé ne s'affiche qu'une fois!

---

## 5.5 Configurer Supabase Edge Functions

```bash
# Option A: Via Dashboard Supabase
1. https://supabase.com/dashboard
2. Votre projet → Edge Functions
3. Fonction "send-email" → Secrets
4. Ajouter: RESEND_API_KEY = re_votre_cle
5. Répéter pour "idoc-alert-notify"

# Option B: Via CLI
supabase secrets set RESEND_API_KEY=re_votre_cle
```

---

## 5.6 Vérifier Configuration Supabase Auth

Pour que les emails de confirmation/reset password fonctionnent:

```
1. Dashboard Supabase → Authentication → URL Configuration
2. Site URL: https://id0c.com
3. Redirect URLs:
   - https://id0c.com
   - https://id0c.com/auth/callback
   - https://id0c.com/dashboard
4. Cliquer "Save"
```

---

## 5.7 Tester les Emails

### Test via Admin Dashboard

```
1. Aller sur https://id0c.com/admin
2. Se connecter (créer compte admin d'abord)
3. Onglet "Notifications"
4. Activer "Enable Email Notifications"
5. Ajouter votre email dans "Email Recipients"
6. Cliquer "Test Notifications"
```

**Résultat attendu**:
- Email reçu en 30-60 secondes
- From: "iDoc Alerts <alerts@id0c.com>"
- Pas dans spam
- HTML bien formaté

### Test via curl

```bash
curl -X POST \
  https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_SERVICE_KEY" \
  -d '{
    "to": ["test@example.com"],
    "subject": "Test iDoc",
    "html": "<h1>Test OK</h1>",
    "from": "iDoc <no-reply@id0c.com>"
  }'
```

---

## 5.8 Adresses Email Disponibles

Une fois domaine vérifié, toutes ces adresses fonctionnent:

```
no-reply@id0c.com      ← Notifications auto
alerts@id0c.com        ← Alertes système
support@id0c.com       ← Support client
hello@id0c.com         ← Contact général
billing@id0c.com       ← Facturation
contact@id0c.com       ← Formulaire contact
team@id0c.com          ← Équipe
```

Pas de configuration supplémentaire nécessaire!

---

# 6. POST-DÉPLOIEMENT

## 6.1 Créer Compte Admin

```bash
# 1. Aller sur https://id0c.com
# 2. S'inscrire avec votre email
# 3. Aller sur Supabase Dashboard
# 4. Table: user_profiles
# 5. Trouver votre user_id
# 6. Modifier: role = 'admin'
```

**Ou via SQL**:
```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'votre.email@domain.com';
```

---

## 6.2 Configuration Stripe Webhooks

### Créer Webhook Stripe

```
1. Dashboard Stripe → Developers → Webhooks
2. Cliquer "Add endpoint"
3. URL: https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/stripe-webhook
4. Description: "iDoc Production Webhooks"
5. Événements à sélectionner:
```

**Événements requis**:
```
✓ checkout.session.completed
✓ payment_intent.succeeded
✓ payment_intent.payment_failed
✓ customer.subscription.created
✓ customer.subscription.updated
✓ customer.subscription.deleted
✓ invoice.paid
✓ invoice.payment_failed
```

### Configurer Secret Webhook

```bash
# Copier le Webhook Secret (whsec_...)
# Puis dans Supabase:

1. Dashboard Supabase → Edge Functions
2. Fonction "stripe-webhook" → Secrets
3. Ajouter: STRIPE_WEBHOOK_SECRET = whsec_votre_secret

# Ou via CLI:
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_votre_secret
```

---

## 6.3 Tests Post-Déploiement

### Checklist Fonctionnelle

```bash
# 1. Site accessible
curl -I https://id0c.com
# Attendu: HTTP/2 200

# 2. Sitemap
curl https://id0c.com/sitemap.xml | grep -c "<loc>"
# Attendu: 170+

# 3. Robots.txt
curl https://id0c.com/robots.txt
# Attendu: User-agent: *

# 4. Assets cachés
curl -I https://id0c.com/assets/index-*.js
# Attendu: Cache-Control: public, max-age=31536000
```

### Tests Manuels Critiques

**Homepage**:
- [ ] Chargement < 3 secondes
- [ ] Recherche de templates fonctionne
- [ ] Boutons CTA réactifs
- [ ] Design responsive (mobile)

**Authentication**:
- [ ] Signup: création compte OK
- [ ] Login: connexion OK
- [ ] Email confirmation reçu (si activé)
- [ ] Reset password fonctionne

**Document Generation**:
- [ ] Sélection template
- [ ] Remplissage formulaire
- [ ] Preview document
- [ ] Téléchargement PDF OK
- [ ] Signature PDF fonctionne

**Paiement Stripe**:
- [ ] Modal checkout s'ouvre
- [ ] Carte test: 4242 4242 4242 4242
- [ ] Paiement accepté
- [ ] Webhook reçu (vérifier logs Stripe)
- [ ] Document débloqué après paiement

**Admin Dashboard**:
- [ ] Accessible avec compte admin
- [ ] Stats affichées correctement
- [ ] Gestion utilisateurs
- [ ] Gestion templates
- [ ] Notifications email testées

**SEO**:
- [ ] Meta tags présents (View Source)
- [ ] Open Graph tags (Facebook)
- [ ] Twitter Cards
- [ ] Schema.org markup
- [ ] Canonical URLs

---

# 7. MONITORING

## 7.1 Vercel Analytics

**Activation**:
```
Dashboard Vercel → Analytics → Enable
```

**Métriques disponibles**:
- Visites uniques
- Temps de chargement
- Core Web Vitals (LCP, FID, CLS)
- Top pages
- Géolocalisation visiteurs

---

## 7.2 Google Analytics 4

### Installation

Éditer `index.html`, ajouter avant `</head>`:

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

**Ou via Variable d'Environnement** (déjà configuré dans le code):

```bash
# Dans Vercel:
VITE_GA_MEASUREMENT_ID=G-VOTRE-ID
```

Le code dans `src/hooks/useAnalytics.ts` s'en charge automatiquement.

---

## 7.3 Supabase Logs

### Via Dashboard

```
1. Dashboard Supabase → Logs
2. Voir:
   - API Logs (requêtes)
   - Auth Logs (connexions)
   - Function Logs (edge functions)
   - Database Logs (queries)
```

### Via CLI

```bash
# Logs Edge Functions en temps réel
supabase functions logs send-email --tail
supabase functions logs stripe-webhook --tail

# Logs Database
supabase db logs --tail
```

---

## 7.4 Stripe Dashboard

**Monitoring quotidien**:

```
Dashboard Stripe → Overview

Vérifier:
- ✅ Paiements réussis
- ⚠️ Paiements échoués
- 📊 Volume transactions
- 💰 Revenus du jour
```

**Webhooks Status**:
```
Dashboard Stripe → Developers → Webhooks
Vérifier:
- ✅ Endpoint actif (vert)
- 📨 Derniers événements
- ⚠️ Échecs de livraison
```

---

## 7.5 Alertes Automatiques

### Configurer dans Admin Dashboard

```
1. https://id0c.com/admin
2. Onglet "Alertes"
3. Configurer seuils:
   - Erreurs > 10/heure → Email
   - CPU > 80% → Email
   - Paiements échoués → Email immédiat
```

✅ Système d'alertes déjà implémenté dans votre code.

---

# CHECKLIST FINALE DÉPLOIEMENT

## Avant de mettre en ligne

- [ ] Build réussi (`npm run build`)
- [ ] Variables d'environnement configurées (Vercel)
- [ ] Domaine id0c.com pointé vers Vercel
- [ ] DNS propagé (vérifier avec dig/dnschecker)
- [ ] SSL/HTTPS actif (automatique Vercel)
- [ ] Compte admin créé
- [ ] Stripe webhooks configurés
- [ ] Emails testés (Resend + DNS)
- [ ] Supabase URLs autorisées

## Après mise en ligne (Jour 1)

- [ ] Google Search Console configuré
- [ ] Sitemap soumis
- [ ] Google Analytics actif
- [ ] Vercel Analytics actif
- [ ] Tests manuels passés (checklist ci-dessus)
- [ ] Monitoring actif
- [ ] Premier backup DB (automatique Supabase)

## Semaine 1

- [ ] Analyser logs erreurs (Vercel + Supabase)
- [ ] Vérifier indexation Google (site:id0c.com)
- [ ] Optimiser pages lentes (PageSpeed)
- [ ] Configurer alertes automatiques
- [ ] Créer 3 premiers articles blog

## Mois 1

- [ ] Objectif: 1,000 visiteurs
- [ ] Objectif: 100 inscriptions
- [ ] Objectif: 50 documents générés
- [ ] Objectif: 15 clients payants
- [ ] Premier rapport analytics
- [ ] Première campagne marketing (Google Ads / Facebook)

---

# COÛTS ESTIMÉS

## Gratuit (Tier Gratuit)

```
✅ Vercel: Gratuit jusqu'à 100 GB/mois
✅ Supabase: Gratuit jusqu'à 500 MB DB + 2 GB transfert
✅ Resend: Gratuit 3,000 emails/mois
✅ SSL/HTTPS: Gratuit (Let's Encrypt)
```

**Total Mois 1**: 0€ si < 1,000 visiteurs/jour

---

## Payant (Scale)

Si vous dépassez les tiers gratuits:

```
Vercel Pro: 20$/mois
- 1 TB bandwidth
- Analytics avancé
- Support prioritaire

Supabase Pro: 25$/mois
- 8 GB DB
- 50 GB transfert
- Daily backups

Resend Starter: 20$/mois
- 50,000 emails/mois
- Support email

Domaine: ~12€/an (id0c.com)
```

**Total Scale**: ~65$/mois + domaine

---

# COMMANDES RAPIDES

## Déploiement complet (CLI)

```bash
# Build + Test
npm run build
npm run test:run

# Déployer
vercel --prod

# Vérifier
curl -I https://id0c.com
```

## Mise à jour après modifications

```bash
# 1. Commit changes
git add .
git commit -m "Update: description"
git push

# 2. Auto-deploy sur Vercel (si GitHub connecté)
# Ou manuellement:
vercel --prod
```

## Rollback si problème

```bash
# Via Dashboard Vercel:
Deployments → Précédent déploiement → Promote to Production

# Via CLI:
vercel rollback
```

---

# SUPPORT

## Documentation

- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs
- **Resend**: https://resend.com/docs
- **Stripe**: https://stripe.com/docs

## Dashboards

- **Vercel**: https://vercel.com/dashboard
- **Supabase**: https://supabase.com/dashboard/project/ffujpjaaramwhtmzqhlx
- **Resend**: https://resend.com/dashboard
- **Stripe**: https://dashboard.stripe.com
- **Google Search Console**: https://search.google.com/search-console

## Community

- **Discord Supabase**: https://discord.supabase.com
- **Discord Vercel**: https://vercel.com/discord
- **GitHub Issues**: Votre repo

---

# PROCHAINES ÉTAPES

## Après déploiement réussi

1. **Marketing**:
   - Lancer campagne Google Ads (50€/jour)
   - Publier sur Product Hunt
   - Partager sur réseaux sociaux
   - Contacter influenceurs/blogueurs

2. **Contenu**:
   - Publier 2-3 articles/semaine (51 déjà prêts)
   - Créer vidéos démo YouTube
   - Tutoriels utilisateurs

3. **Optimisation**:
   - A/B testing pages clés
   - Améliorer taux conversion
   - Optimiser tunnel paiement
   - Réduire taux rebond

4. **Scale**:
   - Ajouter nouveaux templates
   - Nouveaux marchés (pays/langues)
   - Programme affiliation
   - API publique

---

**TEMPS TOTAL DÉPLOIEMENT**: 1-2 heures

**DIFFICULTÉ**: Facile avec ce guide

**RÉSULTAT**: Site production-ready sur id0c.com

---

**PRÊT À DÉPLOYER?** Suivez les étapes dans l'ordre et cochez au fur et à mesure.

Bonne chance! 🚀
