# Guide de Deploiement en Production iDoc.com - 2025

## Table des Matieres

1. [Pre-requis](#pre-requis)
2. [Preparation du Projet](#preparation-du-projet)
3. [Configuration Base de Donnees](#configuration-base-de-donnees)
4. [Deploiement Frontend](#deploiement-frontend)
5. [Configuration DNS et Domaine](#configuration-dns-et-domaine)
6. [Configuration Edge Functions](#configuration-edge-functions)
7. [Configuration Stripe](#configuration-stripe)
8. [SEO et Performance](#seo-et-performance)
9. [Monitoring et Maintenance](#monitoring-et-maintenance)
10. [Checklist Finale](#checklist-finale)

---

## Pre-requis

### Comptes Necessaires

- [ ] Compte GitHub (pour le code source)
- [ ] Compte Vercel (pour l'hebergement frontend)
- [ ] Compte Supabase (deja configure)
- [ ] Compte Stripe (pour les paiements)
- [ ] Compte Google Search Console
- [ ] Compte Google Analytics (optionnel)

### Outils Locaux

```bash
# Verifier Node.js (version 18+)
node --version

# Verifier npm
npm --version

# Installer Vercel CLI
npm install -g vercel
```

---

## Preparation du Projet

### 1. Verification du Build Local

```bash
# Depuis le repertoire du projet
cd /tmp/cc-agent/59895567/project

# Installer les dependances
npm install

# Lancer le build
npm run build

# Verifier qu'il n'y a pas d'erreurs
```

Si le build reussit, vous etes pret pour le deploiement.

### 2. Variables d'Environnement

Creez un fichier `.env.production` avec :

```env
# Supabase (Production)
VITE_SUPABASE_URL=votre_url_supabase_production
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase_production

# Stripe (Production - CLE PUBLIQUE UNIQUEMENT)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique

# Environnement
VITE_ENVIRONMENT=production
VITE_SITE_URL=https://idoc.com
```

**IMPORTANT** :
- N'incluez JAMAIS les cles secretes Stripe dans le frontend
- Les cles secretes vont dans les Edge Functions Supabase
- Verifiez que `.env.production` est dans `.gitignore`

---

## Configuration Base de Donnees

### 1. Verifier les Migrations

```bash
# Se connecter a Supabase
# Via l'interface Supabase Dashboard

# Verifier que toutes les migrations sont appliquees :
# 1. Aller dans SQL Editor
# 2. Executer :
SELECT * FROM supabase_migrations.schema_migrations ORDER BY version DESC LIMIT 10;
```

### 2. Verifier les Donnees

```sql
-- Templates
SELECT COUNT(*) as total_templates FROM document_templates;

-- Articles
SELECT COUNT(*) as total_articles FROM articles WHERE is_published = true;

-- Users
SELECT COUNT(*) as total_users FROM auth.users;
```

**Attendu** :
- Templates : ~107+
- Articles : ~53+ (23 initiaux + 30 nouveaux)
- Users : au moins 1 admin

### 3. Verifier les Policies RLS

```sql
-- Lister toutes les policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

Assurez-vous que TOUTES les tables ont des policies RLS actives.

### 4. Creer un Utilisateur Admin

```sql
-- Si pas encore d'admin, creer un compte via l'interface Supabase Auth
-- Puis executer :
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'uuid_de_votre_utilisateur';
```

---

## Deploiement Frontend

### Option 1 : Deploiement avec Vercel (Recommande)

#### A. Via Vercel Dashboard (Plus Simple)

1. **Connexion Vercel**
   - Allez sur https://vercel.com
   - Connectez-vous avec GitHub

2. **Import du Projet**
   - Cliquez "Add New..." > "Project"
   - Selectionnez votre repository GitHub
   - Cliquez "Import"

3. **Configuration Build**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Variables d'Environnement**
   - Ajoutez toutes les variables de `.env.production`
   - Cliquez "Deploy"

5. **Domaine Custom**
   - Une fois deploye, allez dans "Settings" > "Domains"
   - Ajoutez votre domaine : `idoc.com`
   - Ajoutez aussi `www.idoc.com`

#### B. Via CLI Vercel

```bash
# Se connecter a Vercel
vercel login

# Premier deploiement
vercel

# Repondre aux questions :
# - Set up and deploy? Y
# - Which scope? Votre compte
# - Link to existing project? N
# - Project name? idoc-com
# - Directory? ./
# - Override settings? N

# Ajouter les variables d'environnement
vercel env add VITE_SUPABASE_URL
# Collez votre URL Supabase

vercel env add VITE_SUPABASE_ANON_KEY
# Collez votre cle anon

vercel env add VITE_STRIPE_PUBLISHABLE_KEY
# Collez votre cle publique Stripe

# Deploiement en production
vercel --prod
```

### Option 2 : Netlify

1. **Connexion Netlify**
   - Allez sur https://netlify.com
   - Connectez-vous avec GitHub

2. **Import du Projet**
   - "Add new site" > "Import an existing project"
   - Selectionnez votre repository

3. **Configuration Build**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Variables d'Environnement**
   - Allez dans "Site settings" > "Environment variables"
   - Ajoutez toutes vos variables

5. **Deploiement**
   - Cliquez "Deploy site"

### Verification du Deploiement

Une fois deploye, verifiez :

```bash
# Tester l'URL de production
curl -I https://votre-url-vercel.vercel.app

# Devrait retourner HTTP 200
```

Ouvrez dans le navigateur et verifiez :
- [ ] La page d'accueil se charge
- [ ] Les templates s'affichent
- [ ] La recherche fonctionne
- [ ] L'inscription/connexion fonctionne

---

## Configuration DNS et Domaine

### 1. Configuration chez votre Registrar

Connectez-vous a votre registrar de domaine (OVH, Gandi, Namecheap, etc.)

#### Si vous utilisez Vercel :

Ajoutez ces enregistrements DNS :

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

#### Si vous utilisez Netlify :

```
Type    Name    Value
A       @       75.2.60.5
CNAME   www     votre-site.netlify.app
```

### 2. Configuration SSL

Les deux plateformes gerent automatiquement SSL :
- Vercel : SSL automatique via Let's Encrypt
- Netlify : SSL automatique via Let's Encrypt

Attendez 24-48h pour la propagation DNS complete.

### 3. Verification DNS

```bash
# Verifier les enregistrements DNS
nslookup idoc.com
nslookup www.idoc.com

# Verifier SSL
curl -I https://idoc.com
```

---

## Configuration Edge Functions

### 1. Verifier les Edge Functions Deployees

Allez dans Supabase Dashboard > Edge Functions

Fonctions necessaires :
- `checkout-subscription`
- `checkout-credits`
- `stripe-webhook`
- `idoc-api`
- `template-lab-api`
- `dossiers-api`
- `admin-billing`

### 2. Configurer les Secrets Stripe

Dans Supabase Dashboard > Project Settings > Edge Functions :

```bash
# Ajouter la cle secrete Stripe (PRODUCTION)
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
```

**IMPORTANT** : Utilisez les cles LIVE de Stripe, pas les cles TEST.

### 3. URLs des Edge Functions

Notez vos URLs Edge Functions :
```
https://votre-projet.supabase.co/functions/v1/checkout-subscription
https://votre-projet.supabase.co/functions/v1/stripe-webhook
```

---

## Configuration Stripe

### 1. Passer en Mode Live

1. Connectez-vous a https://dashboard.stripe.com
2. Basculez sur "View live data" (coin superieur gauche)

### 2. Creer les Produits

#### Produit 1 : Pack 50 Credits

```
Nom: Pack 50 Credits
Prix: 9.99 EUR
Type: One-time payment
ID produit: noter pour config
```

#### Produit 2 : Pack 200 Credits

```
Nom: Pack 200 Credits
Prix: 29.99 EUR
Type: One-time payment
```

#### Produit 3 : Abonnement Pro

```
Nom: Abonnement Pro
Prix: 19.99 EUR/mois
Type: Recurring
Intervalle: Mensuel
```

### 3. Configurer les Webhooks

1. Allez dans Developers > Webhooks
2. Cliquez "Add endpoint"
3. URL endpoint : `https://votre-projet.supabase.co/functions/v1/stripe-webhook`
4. Selectionnez ces evenements :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

5. Copiez le "Signing secret" (whsec_...)
6. Ajoutez-le dans Supabase Edge Functions secrets

### 4. Tester les Paiements

```bash
# Utiliser les cartes de test Stripe
# Carte qui reussit : 4242 4242 4242 4242
# Carte qui echoue : 4000 0000 0000 0002
```

Testez un paiement sur votre site en production avec mode test active.

---

## SEO et Performance

### 1. Google Search Console

1. Allez sur https://search.google.com/search-console
2. Cliquez "Ajouter une propriete"
3. Entrez `https://idoc.com`
4. Verifiez via DNS ou fichier HTML

#### Verification DNS (Recommande)

Ajoutez un enregistrement TXT chez votre registrar :
```
Type: TXT
Name: @
Value: google-site-verification=votre-code
```

5. Soumettez le sitemap :
   ```
   https://idoc.com/sitemap.xml
   ```

### 2. Google Analytics (Optionnel)

1. Creez une propriete GA4
2. Ajoutez le tracking ID dans votre code
3. Deployez

### 3. robots.txt

Verifiez que `/public/robots.txt` contient :

```txt
User-agent: *
Allow: /
Sitemap: https://idoc.com/sitemap.xml
```

### 4. Sitemap

Verifiez que `/public/sitemap.xml` existe et contient toutes vos URLs.

### 5. Performance

Testez la performance :
- PageSpeed Insights : https://pagespeed.web.dev/
- GTmetrix : https://gtmetrix.com/

Score cible :
- Performance : 90+
- Accessibilite : 95+
- Best Practices : 95+
- SEO : 95+

---

## Monitoring et Maintenance

### 1. Monitoring Supabase

Dashboard Supabase > Reports :
- [ ] Verifier l'utilisation de la base de donnees
- [ ] Verifier les requetes lentes
- [ ] Configurer les alertes

### 2. Monitoring Vercel

Dashboard Vercel > Analytics :
- [ ] Activer Analytics
- [ ] Verifier les metriques Web Vitals
- [ ] Configurer les alertes

### 3. Monitoring Stripe

Dashboard Stripe :
- [ ] Activer les notifications email
- [ ] Verifier les paiements quotidiens
- [ ] Surveiller les echecs de paiement

### 4. Logs et Erreurs

```bash
# Vercel : voir les logs
vercel logs

# Supabase : Dashboard > Logs
# Stripe : Dashboard > Developers > Logs
```

### 5. Backups

Supabase fait des backups automatiques mais :
- [ ] Configurez des backups supplementaires
- [ ] Testez la restauration une fois par mois

---

## Checklist Finale

### Pre-Lancement

- [ ] Build reussit sans erreurs
- [ ] Toutes les migrations DB sont appliquees
- [ ] RLS policies sont actives sur toutes les tables
- [ ] Au moins 1 utilisateur admin existe
- [ ] Templates sont presents (107+)
- [ ] Articles SEO sont presents (53+)
- [ ] Edge Functions sont deployees
- [ ] Variables d'environnement sont configurees

### Lancement

- [ ] Site deploye sur Vercel/Netlify
- [ ] DNS configure correctement
- [ ] SSL actif (HTTPS)
- [ ] Domaine custom fonctionne
- [ ] www.domaine redirige vers domaine
- [ ] Stripe mode LIVE active
- [ ] Webhooks Stripe configures
- [ ] Paiements test reussis

### Post-Lancement

- [ ] Google Search Console verifie
- [ ] Sitemap soumis
- [ ] Google Analytics configure (optionnel)
- [ ] Monitoring active (Vercel, Supabase, Stripe)
- [ ] Alertes configurees
- [ ] Backup teste
- [ ] Performance testee (90+ PageSpeed)

### SEO et Marketing

- [ ] Tous les meta tags sont presents
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Images ont des attributs alt
- [ ] Liens internes fonctionnent
- [ ] Schema markup present
- [ ] Open Graph tags presents
- [ ] Twitter Card tags presents

### Securite

- [ ] Cles API secretes ne sont PAS dans le code
- [ ] .env est dans .gitignore
- [ ] RLS active sur toutes les tables
- [ ] Policies testees
- [ ] CORS configure correctement
- [ ] HTTPS force
- [ ] Headers de securite configures

---

## Commandes Utiles

### Build et Test Local

```bash
# Build production
npm run build

# Preview du build
npm run preview

# Tests
npm run test

# Typecheck
npm run typecheck
```

### Vercel CLI

```bash
# Status du deploiement
vercel ls

# Logs en temps reel
vercel logs --follow

# Variables d'environnement
vercel env ls

# Rollback a une version precedente
vercel rollback
```

### Supabase CLI (Optionnel)

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref votre-ref-projet

# Voir les migrations
supabase db diff

# Appliquer les migrations
supabase db push
```

---

## Troubleshooting

### Le site ne se charge pas

1. Verifier le build : `npm run build`
2. Verifier les logs Vercel : `vercel logs`
3. Verifier les variables d'environnement
4. Verifier le DNS : `nslookup idoc.com`

### Les templates ne s'affichent pas

1. Verifier la connexion Supabase
2. Verifier les policies RLS
3. Verifier dans SQL :
   ```sql
   SELECT COUNT(*) FROM document_templates;
   ```

### Les paiements ne fonctionnent pas

1. Verifier les cles Stripe (mode LIVE)
2. Verifier les webhooks Stripe
3. Verifier les logs Edge Functions
4. Verifier les secrets Supabase

### Erreurs 403 ou 401

1. Verifier les policies RLS
2. Verifier l'authentification
3. Verifier les tokens JWT

---

## Support

### Documentation

- Vercel : https://vercel.com/docs
- Supabase : https://supabase.com/docs
- Stripe : https://stripe.com/docs

### Communautes

- Vercel Discord : https://vercel.com/discord
- Supabase Discord : https://discord.supabase.com
- Stripe Support : https://support.stripe.com

---

## Prochaines Etapes

Une fois en production :

1. **Semaine 1** : Monitoring intensif
   - Verifier les logs quotidiennement
   - Surveiller les performances
   - Corriger les bugs critiques

2. **Mois 1** : Optimisation
   - Analyser les metriques
   - Optimiser les requetes lentes
   - Ameliorer le SEO

3. **Mois 2+** : Croissance
   - Ajouter plus de templates
   - Creer plus d'articles SEO
   - Lancer des campagnes marketing
   - Optimiser les conversions

---

**Felicitations !** Vous etes pret a deployer iDoc.com en production.

En cas de probleme, verifiez d'abord les logs, puis la documentation officielle.

Bonne chance pour votre lancement !
