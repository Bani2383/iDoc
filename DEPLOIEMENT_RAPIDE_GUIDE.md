# Guide de Déploiement Rapide iDoc

**Date**: 11 janvier 2026
**Temps total**: 45 minutes (hors propagation DNS)
**Statut**: Prêt pour production

---

## Avant de Commencer

### Prérequis Vérifiés

✅ Build réussi (15.14s)
✅ `vercel.json` corrigé
✅ `sitemap.xml` présent
✅ `robots.txt` configuré
✅ `.env.example` à jour
✅ Script de vérification disponible

### Comptes Nécessaires

Créez ces comptes AVANT de déployer:

1. **Vercel** (gratuit) - https://vercel.com/signup
2. **Domaine** (payant) - Transférer ou configurer `id0c.com`
3. **Resend** (gratuit 3000/mois) - https://resend.com/signup
4. **Stripe** (gratuit) - https://dashboard.stripe.com/register

---

## DÉPLOIEMENT EXPRESS (45 MIN)

### ÉTAPE 1: Déployer sur Vercel (10 min)

#### 1.1 Premier Déploiement

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd /tmp/cc-agent/59895567/project
vercel
```

**Questions interactives**:
```
? Set up and deploy? → Yes
? Which scope? → Votre compte
? Link to existing project? → No
? What's your project's name? → idoc
? In which directory is your code located? → ./
? Want to modify settings? → No
```

**Résultat**: URL preview `https://idoc-xxx.vercel.app`

#### 1.2 Variables d'Environnement

**Via Dashboard** (recommandé):

```
1. Aller sur: https://vercel.com/dashboard
2. Projet "idoc" → Settings → Environment Variables
3. Ajouter 3 variables:
```

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `VITE_SUPABASE_URL` | `https://ffujpjaaramwhtmzqhlx.supabase.co` | ✓ Prod ✓ Preview ✓ Dev |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTc3MzAsImV4cCI6MjA3ODE3MzczMH0.oiBJ_R4x_ZSRrHLEtSQ9d-gvAaseZJM0XMRS8evDXoo` | ✓ Prod ✓ Preview ✓ Dev |
| `VITE_APP_URL` | `https://id0c.com` | ✓ Prod only |

**Via CLI** (alternatif):

```bash
vercel env add VITE_SUPABASE_URL production
# Coller: https://ffujpjaaramwhtmzqhlx.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Coller la clé anon

vercel env add VITE_APP_URL production
# Entrer: https://id0c.com
```

#### 1.3 Redéployer

```bash
vercel --prod
```

**Attendre**: Build complet (~2 min)
**Résultat**: URL de production affichée

---

### ÉTAPE 2: Configurer Domaine (30 min)

#### 2.1 Ajouter Domaine dans Vercel

```
1. Dashboard → Projet "idoc"
2. Settings → Domains
3. Cliquer "Add Domain"
4. Entrer: id0c.com
5. Cocher "Redirect www.id0c.com to id0c.com"
6. Save
```

**Vercel affiche**: Instructions DNS à configurer

#### 2.2 Méthode Recommandée: Nameservers Vercel

**Avantages**:
- Configuration automatique
- Gestion DNS simplifiée
- HTTPS automatique
- Certificat SSL gratuit

**Étapes**:

```
1. Identifier votre registrar (GoDaddy, Namecheap, OVH, etc.)
2. Aller dans Gestion DNS du domaine
3. Changer Nameservers vers:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
4. Sauvegarder
```

**Délai**: 15-60 minutes (propagation DNS)

#### 2.3 Méthode Alternative: Records DNS

Si vous voulez garder votre DNS actuel:

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

#### 2.4 Vérifier Propagation

```bash
# Tester le domaine
dig id0c.com +short
# Résultat attendu: 76.76.21.21 (ou IP Vercel)

# Tester HTTPS
curl -I https://id0c.com
# Résultat attendu: HTTP/2 200
```

**Ou via web**: https://dnschecker.org/#A/id0c.com

---

### ÉTAPE 3: Configurer Supabase (5 min)

#### 3.1 URLs Autorisées

```
1. Dashboard Supabase: https://app.supabase.com
2. Projet: ffujpjaaramwhtmzqhlx
3. Authentication → URL Configuration
```

**Ajouter ces URLs**:

```
Site URL:
https://id0c.com

Redirect URLs (une par ligne):
https://id0c.com
https://id0c.com/auth/callback
https://id0c.com/dashboard
https://idoc-xxx.vercel.app
```

**Sauvegarder** → Configuration Auth mise à jour

---

## VÉRIFICATIONS RAPIDES

### Test Automatique

```bash
./verify-deployment.sh id0c.com
```

### Tests Manuels Critiques

#### 1. Homepage
```bash
curl -I https://id0c.com
# Doit retourner: 200 OK
```

#### 2. Connexion Supabase
```
1. Aller sur: https://id0c.com
2. Cliquer "Connexion"
3. S'inscrire avec votre email
4. Vérifier confirmation (si activée)
5. Se connecter
```

#### 3. Génération Document
```
1. Connecté, aller sur Templates
2. Choisir un template
3. Remplir formulaire
4. Cliquer "Générer"
5. Vérifier preview PDF
```

#### 4. Admin Access
```
1. Supabase Dashboard → Table Editor
2. Table: user_profiles
3. Trouver votre user (email)
4. Modifier: role = "admin"
5. Save
6. Aller sur: https://id0c.com/admin
7. Vérifier accès dashboard
```

---

## DÉPLOIEMENT COMPLET (Optionnel)

Ces étapes peuvent être faites après le lancement:

### Emails (Resend) - 30 min

**Guide complet**: Voir `CHECKLIST_DEPLOIEMENT_FINAL.md` Phase 5

Résumé rapide:
```
1. Créer compte Resend
2. Ajouter domaine id0c.com
3. Configurer 3 DNS records (SPF, DKIM, Verification)
4. Copier API Key
5. Ajouter dans Supabase Secrets:
   - send-email: RESEND_API_KEY
   - idoc-alert-notify: RESEND_API_KEY
```

### Stripe Webhooks - 15 min

**Guide complet**: Voir `CHECKLIST_DEPLOIEMENT_FINAL.md` Phase 7

Résumé rapide:
```
1. Stripe Dashboard → Webhooks
2. Add endpoint: https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/stripe-webhook
3. Événements: checkout.session.completed, payment_intent.*
4. Copier Webhook Secret
5. Ajouter dans Supabase Secrets: STRIPE_WEBHOOK_SECRET
```

### Google Search Console - 15 min

**Guide complet**: Voir `CHECKLIST_DEPLOIEMENT_FINAL.md` Phase 4

Résumé rapide:
```
1. https://search.google.com/search-console
2. Ajouter propriété: https://id0c.com
3. Vérifier propriété (balise HTML)
4. Soumettre sitemap: https://id0c.com/sitemap.xml
5. Demander indexation pages principales
```

---

## TROUBLESHOOTING EXPRESS

### Site ne charge pas

```bash
# 1. Vérifier DNS
dig id0c.com +short

# 2. Vérifier HTTPS
curl -I https://id0c.com

# 3. Vérifier Vercel logs
vercel logs https://id0c.com

# 4. Redéployer
vercel --prod --force
```

### Erreur Supabase Connection

```
1. Vérifier variables Vercel:
   Dashboard → Settings → Environment Variables

2. Vérifier URLs Supabase:
   Authentication → URL Configuration

3. Vérifier RLS policies:
   Table Editor → Vérifier accès public où nécessaire
```

### Build Errors

```bash
# Nettoyer cache
rm -rf node_modules/.vite
rm -rf dist

# Rebuild
npm run build

# Si succès local mais erreur Vercel:
# Vérifier variables environnement
```

---

## COMMANDES UTILES

### Déploiement

```bash
# Déploiement preview
vercel

# Déploiement production
vercel --prod

# Forcer rebuild
vercel --prod --force

# Voir logs
vercel logs
```

### Variables Environnement

```bash
# Lister toutes
vercel env ls

# Ajouter variable
vercel env add VITE_NEW_VAR production

# Supprimer variable
vercel env rm VITE_OLD_VAR production

# Pull variables localement
vercel env pull .env.local
```

### Tests

```bash
# Build local
npm run build

# Lancer dev local
npm run dev

# Tests automatiques
npm run test:run

# Vérifier TypeScript
npm run typecheck
```

### DNS

```bash
# Vérifier A record
dig id0c.com +short

# Vérifier CNAME
dig www.id0c.com +short

# Vérifier propagation mondiale
# https://dnschecker.org/#A/id0c.com

# Test HTTPS
curl -I https://id0c.com
```

---

## CHECKLIST MINIMALE

Cochez ces éléments pour un déploiement fonctionnel:

### Critique (Site ne marche pas sans)

- [ ] Vercel déployé
- [ ] Variables environnement configurées
- [ ] Domaine pointé vers Vercel
- [ ] DNS propagé (15-60 min)
- [ ] HTTPS actif
- [ ] Supabase URLs configurées
- [ ] Compte admin créé

### Important (Fonctionnalités clés)

- [ ] Test signup/login réussi
- [ ] Test génération document réussi
- [ ] Admin dashboard accessible
- [ ] Sitemap soumis Google

### Optionnel (Peut être fait après)

- [ ] Emails configurés (Resend)
- [ ] Stripe webhooks configurés
- [ ] Analytics activées
- [ ] Marketing lancé

---

## TIMELINE RÉALISTE

```
00:00 - Déployer Vercel (CLI)               10 min
00:10 - Configurer variables env             5 min
00:15 - Redéployer avec variables            2 min
00:17 - Ajouter domaine Vercel               3 min
00:20 - Changer DNS registrar                5 min
00:25 - ⏳ ATTENTE propagation DNS          30 min
00:55 - Vérifier domaine actif               2 min
00:57 - Configurer Supabase URLs             3 min
01:00 - Créer compte et promouvoir admin     5 min
01:05 - Tests manuels critiques             10 min
01:15 - ✅ SITE EN PRODUCTION!

Optionnel:
01:15 - Configurer emails (Resend)          30 min
01:45 - Configurer Stripe webhooks          15 min
02:00 - Google Search Console               15 min
02:15 - ✅ CONFIGURATION COMPLÈTE!
```

---

## APRÈS LE LANCEMENT

### Jour 1

- [ ] Vérifier Analytics (après 2-3h)
- [ ] Tester tous les flows critiques
- [ ] Poster annonce réseaux sociaux
- [ ] Monitorer logs erreurs

### Semaine 1

- [ ] Publier 3 articles blog
- [ ] Soumettre annuaires (Product Hunt, etc.)
- [ ] Analyser première data utilisateurs
- [ ] Optimiser pages à fort rebond

### Mois 1

- [ ] Lancer campagne Google Ads
- [ ] Partenariats influenceurs
- [ ] Améliorer templates populaires
- [ ] Ajouter nouveaux templates demandés

---

## SUPPORT ET DOCUMENTATION

### Documentation Complète

- **Checklist détaillée**: `CHECKLIST_DEPLOIEMENT_FINAL.md`
- **Configuration DNS**: `CONFIGURATION_DNS_VERCEL.md`
- **Variables environnement**: `VARIABLES_ENVIRONNEMENT_VERCEL.md`
- **Configuration emails**: `GUIDE_CONFIGURATION_EMAILS.md`

### Support Services

- **Vercel**: https://vercel.com/support
- **Supabase**: https://supabase.com/support
- **Resend**: support@resend.com
- **Stripe**: https://support.stripe.com

### Communauté

- **Discord Vercel**: https://vercel.com/discord
- **Discord Supabase**: https://discord.supabase.com
- **Reddit**: r/webdev, r/SideProject

---

## RAPPELS IMPORTANTS

### Sécurité

- ✅ **HTTPS automatique** via Vercel (Let's Encrypt)
- ✅ **RLS activé** sur toutes les tables Supabase
- ✅ **Variables sensibles** dans Vercel (pas dans code)
- ✅ **Webhooks secrets** dans Supabase Secrets
- ❌ **Jamais commiter** `.env` dans Git

### Performance

- ✅ Build optimisé: 15s
- ✅ Sitemap généré: 50+ URLs
- ✅ Images lazy-loaded
- ✅ Code splitting actif
- ✅ CDN Vercel global

### SEO

- ✅ Meta tags dynamiques
- ✅ Sitemap XML
- ✅ Robots.txt optimisé
- ✅ Schema.org markup
- ✅ URLs lisibles

---

## PRÊT À DÉPLOYER!

Votre projet iDoc est prêt pour la production.

**Commande de déploiement**:
```bash
vercel --prod
```

**Temps total**: 45 minutes (critique) + 1h (optionnel)

**Résultat**: Site professionnel en production sur `https://id0c.com`

Bon lancement! 🚀

---

**Dernière mise à jour**: 11 janvier 2026
**Version**: 1.0
**Statut**: Production Ready
