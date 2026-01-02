# Actions Critiques Avant Lancement - iDoc Platform
## Guide Étape par Étape

**Durée totale**: 15 minutes
**Priorité**: 🔴 CRITIQUE
**À faire**: MAINTENANT (avant de déployer en production)

---

## 🗂️ Table des Matières

1. [Configuration Supabase Dashboard (7 min)](#1-configuration-supabase-dashboard-7-min)
2. [Activation Stripe Production (5 min)](#2-activation-stripe-production-5-min)
3. [Vérification DNS (3 min)](#3-vérification-dns-3-min)
4. [Checklist Finale](#checklist-finale)

---

## 1. Configuration Supabase Dashboard (7 min)

### A. Auth DB Connection Pooling (3 minutes)

**Pourquoi**: Améliore la scalabilité de l'authentification pour gérer plusieurs connexions simultanées

**Étapes**:

1. **Accéder au Dashboard**
   - Aller sur https://app.supabase.com
   - Sélectionner votre projet iDoc

2. **Naviguer vers Database Settings**
   - Cliquer sur "Project Settings" (icône engrenage en bas à gauche)
   - Cliquer sur "Database" dans le menu latéral

3. **Modifier Connection Pooling**
   - Scroller jusqu'à la section "Connection Pooling"
   - Trouver "Auth Server Connection Pool"
   - Changer de "Fixed: 10 connections" à "Percentage-based"
   - Entrer **50** (50% des connexions réservées pour Auth)
   - Cliquer sur "Save"

4. **Vérification**
   - Attendre 10 secondes pour que les changements s'appliquent
   - Vérifier qu'aucune erreur n'apparaît
   - ✅ Configuration sauvegardée

**Impact**:
- Avant: Maximum 10 connexions Auth simultanées (limite fixe)
- Après: ~50 connexions Auth possibles en production (échelle avec le plan)

---

### B. Password Breach Detection (4 minutes)

**Pourquoi**: Empêche les utilisateurs d'utiliser des mots de passe compromis (base HaveIBeenPwned)

**Étapes**:

1. **Accéder à Authentication Settings**
   - Dans le Dashboard Supabase
   - Cliquer sur "Authentication" dans le menu latéral
   - Cliquer sur "Policies" (ou "Settings")

2. **Activer Password Breach Detection**
   - Scroller jusqu'à "Password Security"
   - Trouver "Enable password breach detection"
   - Cocher la case / Activer le toggle
   - Cliquer sur "Save"

3. **Configuration Optionnelle (recommandée)**
   - Si disponible, activer aussi:
     - "Minimum password length": 8 caractères ✅ (devrait déjà être configuré)
     - "Require lowercase letters": Oui (recommandé)
     - "Require uppercase letters": Oui (recommandé)
     - "Require numbers": Oui (recommandé)
     - "Require special characters": Optionnel

4. **Vérification**
   - Tester avec un mot de passe connu compromis (ex: "password123")
   - L'inscription devrait échouer avec erreur
   - ✅ Protection activée

**Impact**:
- Protège contre ~10 milliards de mots de passe compromis
- Réduit risque d'attaques credential stuffing
- Améliore confiance utilisateurs

---

### ✅ Supabase Configuration - Checklist

- [ ] Connection Pooling changé à Percentage-based (50%)
- [ ] Password breach detection activé
- [ ] Tests effectués (connexion fonctionne toujours)
- [ ] Pas d'erreurs dans les logs Supabase

**Temps écoulé**: ~7 minutes

---

## 2. Activation Stripe Production (5 min)

### Prérequis

**Vous devez avoir**:
- Un compte Stripe créé
- Mode Production activé dans Stripe Dashboard
- Vérification bancaire complétée (pour recevoir paiements)

**Si pas encore fait**:
1. Créer compte: https://dashboard.stripe.com/register
2. Compléter onboarding (10-15 minutes)
3. Activer mode production (toggle en haut à droite)

---

### A. Récupérer les Clés Production (2 minutes)

**Étapes**:

1. **Accéder au Stripe Dashboard**
   - Aller sur https://dashboard.stripe.com
   - S'assurer d'être en mode **PRODUCTION** (toggle en haut à droite)
   - ⚠️ IMPORTANT: Vérifier que "Test Mode" est DÉSACTIVÉ

2. **Récupérer les API Keys**
   - Cliquer sur "Developers" dans le menu
   - Cliquer sur "API keys"
   - Noter les 2 clés:
     - **Publishable key** (commence par `pk_live_...`)
     - **Secret key** (commence par `sk_live_...`, cliquer "Reveal live key")

3. **Configurer Webhook Secret**
   - Dans "Developers", cliquer sur "Webhooks"
   - Cliquer sur "+ Add endpoint"
   - URL endpoint: `https://[votre-projet-supabase].supabase.co/functions/v1/stripe-webhook`
   - Événements à écouter (sélectionner tous):
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`
   - Cliquer "Add endpoint"
   - **Révéler le Signing Secret** (commence par `whsec_...`)

**Clés récupérées**:
```
VITE_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### B. Configurer Vercel (2 minutes)

**Étapes**:

1. **Accéder à Vercel Dashboard**
   - Aller sur https://vercel.com/dashboard
   - Sélectionner le projet iDoc

2. **Ajouter les Variables d'Environnement**
   - Aller dans "Settings" → "Environment Variables"
   - Ajouter les 3 variables pour **Production** uniquement:

   | Key | Value | Environment |
   |-----|-------|-------------|
   | `VITE_STRIPE_PUBLIC_KEY` | `pk_live_...` | Production |
   | `STRIPE_SECRET_KEY` | `sk_live_...` | Production |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production |

   - ⚠️ Ne PAS mettre ces clés dans Preview/Development
   - Cliquer "Save" pour chaque variable

3. **Redéployer l'Application**
   - Aller dans "Deployments"
   - Cliquer sur le dernier déploiement
   - Cliquer "Redeploy"
   - Attendre 1-2 minutes pour le build

---

### C. Tester le Paiement (1 minute)

**Étapes de Test en Production**:

1. **Accéder à votre site en production**
   - `https://id0c.com` (ou votre domaine)

2. **Tester un achat**
   - Aller sur "Pricing" ou "Crédits"
   - Sélectionner un package
   - Cliquer "Acheter"
   - Utiliser une carte de test Stripe:
     - Numéro: `4242 4242 4242 4242`
     - Date: N'importe quelle date future
     - CVC: N'importe quel 3 chiffres
     - Code postal: N'importe quel code valide

3. **Vérifier le Paiement**
   - Le paiement devrait réussir
   - Vérifier dans Stripe Dashboard → Payments
   - Vérifier dans votre base Supabase (table `payments`)
   - Vérifier que les crédits/abonnement sont ajoutés

**⚠️ IMPORTANT**:
- Les paiements de test en production apparaîtront dans votre Dashboard
- Stripe détecte automatiquement les cartes de test
- Vous pouvez utiliser 4242... même en production pour tester

---

### ✅ Stripe Production - Checklist

- [ ] Mode Production activé dans Stripe
- [ ] Compte bancaire vérifié (pour recevoir fonds)
- [ ] 3 clés récupérées (pk_live, sk_live, whsec)
- [ ] Variables ajoutées dans Vercel Production
- [ ] Application redéployée
- [ ] Webhook configuré avec bonne URL
- [ ] Test de paiement réussi
- [ ] Paiement visible dans Stripe Dashboard
- [ ] Transaction enregistrée dans Supabase

**Temps écoulé**: ~5 minutes

---

## 3. Vérification DNS (3 min)

### A. Vérifier que le Domaine Pointe vers Vercel (1 minute)

**Étapes**:

1. **Vérifier la Configuration DNS**
   - Ouvrir un terminal
   - Exécuter: `nslookup id0c.com`
   - OU utiliser: https://mxtoolbox.com/SuperTool.aspx
   - Vérifier que l'IP pointe vers Vercel

2. **Expected Results**:
   ```
   Non-authoritative answer:
   Name: id0c.com
   Address: 76.76.21.21 (ou autre IP Vercel)
   ```

3. **Si le domaine ne pointe PAS vers Vercel**:
   - Aller dans votre registrar (Namecheap, GoDaddy, etc.)
   - Configurer:
     - Type: `A`
     - Host: `@`
     - Value: `76.76.21.21` (IP Vercel fournie dans leur dashboard)
   - OU Type: `CNAME`, Host: `@`, Value: `cname.vercel-dns.com`
   - Attendre 5-10 minutes pour propagation DNS

---

### B. Vérifier SSL/TLS (1 minute)

**Étapes**:

1. **Accéder au Site en HTTPS**
   - Ouvrir: https://id0c.com
   - Vérifier le cadenas dans la barre d'adresse
   - Cliquer sur le cadenas → "Certificate is valid"

2. **Vérifier dans Vercel Dashboard**
   - Aller dans Settings → Domains
   - Vérifier que "SSL Certificate" est "Active"
   - Status devrait être ✅ "Valid"

3. **Si SSL n'est PAS actif**:
   - Dans Vercel: Domains → Cliquer sur "Renew Certificate"
   - Attendre 1-2 minutes
   - Actualiser la page

---

### C. Tester les Redirects (1 minute)

**URLs à Tester**:

1. **HTTP → HTTPS redirect**
   - Ouvrir: `http://id0c.com` (sans S)
   - Devrait rediriger vers: `https://id0c.com`

2. **WWW → Non-WWW (optionnel)**
   - Ouvrir: `https://www.id0c.com`
   - Devrait rediriger vers: `https://id0c.com`
   - OU l'inverse selon votre config

3. **Sitemap accessible**
   - Ouvrir: `https://id0c.com/sitemap.xml`
   - Devrait afficher le XML avec 1000+ URLs

4. **Robots.txt accessible**
   - Ouvrir: `https://id0c.com/robots.txt`
   - Devrait afficher le fichier robots.txt

---

### ✅ DNS & SSL - Checklist

- [ ] nslookup id0c.com pointe vers IP Vercel
- [ ] https://id0c.com accessible avec SSL valide
- [ ] Certificat SSL actif dans Vercel Dashboard
- [ ] HTTP redirige vers HTTPS
- [ ] /sitemap.xml accessible
- [ ] /robots.txt accessible
- [ ] Aucune erreur "Not Secure" dans le navigateur

**Temps écoulé**: ~3 minutes

---

## Checklist Finale

### 🔴 Critique (15 minutes - À FAIRE MAINTENANT)

- [ ] **Supabase Configuration** (7 min)
  - [ ] Connection Pooling: Percentage-based 50%
  - [ ] Password breach detection activé
  - [ ] Tests connexion OK

- [ ] **Stripe Production** (5 min)
  - [ ] Clés production récupérées
  - [ ] Variables Vercel configurées
  - [ ] Webhook configuré
  - [ ] Test paiement réussi

- [ ] **DNS & SSL** (3 min)
  - [ ] Domaine pointe vers Vercel
  - [ ] SSL/TLS activé
  - [ ] Redirects fonctionnels
  - [ ] Sitemap & robots.txt accessibles

### 🟡 Important (Post-lancement - 1ère heure)

- [ ] **Monitoring**
  - [ ] Vercel Analytics activé
  - [ ] Vérifier les logs Vercel (pas d'erreurs)
  - [ ] Vérifier les logs Supabase (pas d'erreurs)
  - [ ] Tester 3-5 parcours utilisateurs

- [ ] **Sentry ou Error Tracking** (optionnel mais recommandé)
  - [ ] Créer compte Sentry
  - [ ] Ajouter DSN dans Vercel env vars
  - [ ] Tester qu'une erreur est bien logguée

### 🟢 Recommandé (Semaine 1)

- [ ] **Google Analytics**
  - [ ] Créer propriété GA4
  - [ ] Ajouter VITE_GA_MEASUREMENT_ID
  - [ ] Vérifier que les events arrivent

- [ ] **Google Search Console**
  - [ ] Ajouter propriété id0c.com
  - [ ] Vérifier propriété (via DNS ou fichier)
  - [ ] Soumettre sitemap.xml

- [ ] **Backups**
  - [ ] Activer Daily Backups dans Supabase
  - [ ] Tester une restauration
  - [ ] Documenter la procédure

---

## 🚨 En Cas de Problème

### Supabase Connection Pool ne s'applique pas

**Solution**:
1. Vérifier que vous êtes sur le bon projet
2. Clear le cache du navigateur
3. Attendre 30 secondes et rafraîchir
4. Contacter support Supabase si persiste

### Stripe Webhook ne fonctionne pas

**Symptômes**: Paiement réussi mais pas enregistré dans DB

**Solution**:
1. Vérifier l'URL du webhook: `https://[PROJET].supabase.co/functions/v1/stripe-webhook`
2. Vérifier que JWT Verification est **DÉSACTIVÉ** pour stripe-webhook Edge Function
3. Tester manuellement avec Stripe CLI:
   ```bash
   stripe listen --forward-to https://[PROJET].supabase.co/functions/v1/stripe-webhook
   stripe trigger payment_intent.succeeded
   ```
4. Vérifier les logs dans Stripe Dashboard → Webhooks → Event logs

### SSL Certificate ne s'active pas

**Solution**:
1. Vérifier que DNS pointe vers Vercel (peut prendre 24h)
2. Dans Vercel: Remove domain puis Re-add
3. Attendre 5 minutes
4. Si persiste après 24h, contacter Vercel support

### Site inaccessible après déploiement

**Solution**:
1. Vérifier les logs de build dans Vercel
2. Vérifier que les env vars sont dans "Production"
3. Tester en mode Preview d'abord
4. Rollback vers déploiement précédent si nécessaire

---

## 📞 Support & Contacts

### Supabase
- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs
- Support: support@supabase.com
- Discord: https://discord.supabase.com

### Stripe
- Dashboard: https://dashboard.stripe.com
- Docs: https://stripe.com/docs
- Support: https://support.stripe.com
- Chat Support: Disponible dans dashboard

### Vercel
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Support: Via dashboard (Help button)
- Twitter: @vercel pour status

---

## ✅ Validation Finale

**Avant de dire "C'est lancé!"**, vérifier:

1. [ ] Site accessible sur https://id0c.com
2. [ ] SSL valide (cadenas vert)
3. [ ] Login/Signup fonctionnel
4. [ ] Génération de document fonctionne
5. [ ] Paiement test réussi
6. [ ] Webhook Stripe reçu
7. [ ] Email de confirmation envoyé (si configuré)
8. [ ] Dashboard admin accessible
9. [ ] Pas d'erreurs dans console browser
10. [ ] Pas d'erreurs dans logs Vercel/Supabase

**Si les 10 points sont ✅**:

🎉 **FÉLICITATIONS - VOUS ÊTES PRÊT POUR LE LANCEMENT !** 🎉

---

## 📈 Métriques à Suivre (Première Semaine)

### Technique
- Uptime (objectif: >99.5%)
- Temps de réponse médian (objectif: <500ms)
- Taux d'erreur (objectif: <1%)
- Successful payment rate (objectif: >95%)

### Business
- Visiteurs uniques (objectif: >100)
- Inscriptions (objectif: >10)
- Documents générés (objectif: >20)
- Paiements réussis (objectif: >1)
- Taux de conversion signup (objectif: >5%)

### Où Suivre
- **Vercel Analytics**: Trafic, performance
- **Supabase Dashboard**: Auth, DB queries
- **Stripe Dashboard**: Paiements, MRR
- **Google Analytics**: Parcours utilisateurs (si configuré)

---

**Document créé**: 2 janvier 2026
**Dernière mise à jour**: 2 janvier 2026
**Validité**: Permanent (à suivre avant chaque lancement)

**🚀 BON LANCEMENT ! 🚀**
