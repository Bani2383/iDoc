# Checklist Déploiement iDoc - Version Simplifiée

**Date**: Janvier 2026
**Temps estimé**: 2-3 heures

---

## PHASE 1: PRÉPARATION (15 min)

### Build & Tests Locaux
- [ ] `npm run build` réussi
- [ ] Pas d'erreurs TypeScript
- [ ] Site fonctionne en local (`npm run dev`)

### Fichiers de Configuration
- [ ] `.env.example` à jour
- [ ] `vercel.json` configuré
- [ ] `sitemap.xml` généré
- [ ] `robots.txt` présent

---

## PHASE 2: VERCEL (30 min)

### Déploiement Initial
- [ ] Compte Vercel créé
- [ ] Projet connecté (GitHub/GitLab)
- [ ] Premier déploiement réussi
- [ ] URL preview reçue (`xxx.vercel.app`)

### Variables d'Environnement
Dans **Vercel → Settings → Environment Variables**:

- [ ] `VITE_SUPABASE_URL`
  ```
  https://ffujpjaaramwhtmzqhlx.supabase.co
  ```

- [ ] `VITE_SUPABASE_ANON_KEY`
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

- [ ] `VITE_APP_URL`
  ```
  https://id0c.com
  ```

- [ ] Cocher: Production, Preview, Development

- [ ] Redéployer après ajout variables

---

## PHASE 3: DOMAINE (45 min)

### Configuration Vercel
- [ ] **Vercel → Settings → Domains**
- [ ] Cliquer "Add Domain"
- [ ] Entrer: `id0c.com`
- [ ] Cocher "Redirect www to apex"

### Configuration DNS chez Registrar

**Option A: DNS A Record** (simple)
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Option B: Nameservers** (recommandé)
```
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
```

### Vérification
- [ ] Attendre propagation DNS (15-30 min)
- [ ] Tester: `curl -I https://id0c.com`
- [ ] Résultat: HTTP/2 200
- [ ] HTTPS automatique actif

---

## PHASE 4: SEO (20 min)

### Google Search Console
- [ ] Créer compte: https://search.google.com/search-console
- [ ] Ajouter propriété: `https://id0c.com`
- [ ] Vérification: Balise HTML
- [ ] Soumettre sitemap: `https://id0c.com/sitemap.xml`

### Indexation Rapide
Demander indexation manuelle de:
- [ ] https://id0c.com/
- [ ] https://id0c.com/templates
- [ ] https://id0c.com/pricing
- [ ] https://id0c.com/blog
- [ ] https://id0c.com/modele/lettre-explicative-refus-visa

### Google Analytics (Optionnel)
- [ ] Créer propriété GA4
- [ ] Copier Measurement ID (G-XXXXXXXXX)
- [ ] Ajouter dans Vercel: `VITE_GA_MEASUREMENT_ID`

---

## PHASE 5: EMAILS (45 min)

### Compte Resend
- [ ] Créer compte: https://resend.com
- [ ] Plan gratuit: 3,000 emails/mois

### Configurer Domaine
- [ ] **Resend → Domains → Add Domain**
- [ ] Entrer: `id0c.com`
- [ ] Copier les 3 records DNS:

**SPF (TXT)**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM (CNAME)**
```
Type: CNAME
Name: resend._domainkey
Value: [fourni par Resend]
```

**Vérification (TXT)**
```
Type: TXT
Name: _resend
Value: [fourni par Resend]
```

### Ajouter DNS Records

**Si Vercel gère DNS**:
- [ ] Vercel → Settings → Domains → id0c.com → DNS Records
- [ ] Ajouter les 3 records ci-dessus

**Si Registrar externe**:
- [ ] Ajouter dans votre registrar (GoDaddy, Namecheap, etc.)

### Vérification DNS
- [ ] Attendre 15-30 min
- [ ] Tester: `dig TXT id0c.com +short`
- [ ] Resend → Verify DNS Records
- [ ] Statut: "Verified" ✓

### API Key Resend
- [ ] **Resend → API Keys → Create**
- [ ] Name: "iDoc Production"
- [ ] Permission: Full Access
- [ ] **COPIER LA CLÉ** (re_...)

### Configurer Supabase
- [ ] **Supabase Dashboard → Edge Functions**
- [ ] Fonction `send-email` → Secrets
- [ ] Ajouter: `RESEND_API_KEY = re_votre_cle`
- [ ] Fonction `idoc-alert-notify` → Secrets
- [ ] Ajouter: `RESEND_API_KEY = re_votre_cle`

### Test Email
- [ ] Aller sur https://id0c.com/admin
- [ ] Se connecter
- [ ] Notifications → Enable Email
- [ ] Test Notifications
- [ ] Vérifier inbox (30-60s)

---

## PHASE 6: SUPABASE (15 min)

### URLs Autorisées
- [ ] **Supabase → Authentication → URL Configuration**
- [ ] Site URL: `https://id0c.com`
- [ ] Redirect URLs:
  - `https://id0c.com`
  - `https://id0c.com/auth/callback`
  - `https://id0c.com/dashboard`
- [ ] Save

---

## PHASE 7: STRIPE (20 min)

### Webhooks
- [ ] **Stripe Dashboard → Developers → Webhooks**
- [ ] Add endpoint
- [ ] URL: `https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/stripe-webhook`
- [ ] Événements:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### Secret Webhook
- [ ] Copier Webhook Secret (whsec_...)
- [ ] **Supabase → Edge Functions → stripe-webhook → Secrets**
- [ ] Ajouter: `STRIPE_WEBHOOK_SECRET = whsec_...`

---

## PHASE 8: COMPTE ADMIN (10 min)

### Créer Compte
- [ ] Aller sur https://id0c.com
- [ ] S'inscrire avec votre email
- [ ] Vérifier email (si confirmation activée)

### Promouvoir Admin
- [ ] **Supabase Dashboard → Table Editor → user_profiles**
- [ ] Trouver votre utilisateur (par email)
- [ ] Modifier colonne `role` → `admin`
- [ ] Save

### Vérifier Accès
- [ ] Aller sur https://id0c.com/admin
- [ ] Vérifier accès dashboard admin
- [ ] Toutes les stats s'affichent

---

## PHASE 9: TESTS FINAUX (30 min)

### Tests Automatiques
```bash
# Lancer script de vérification
./verify-deployment.sh id0c.com
```

### Tests Manuels

**Homepage**:
- [ ] Chargement rapide (< 3s)
- [ ] Recherche fonctionne
- [ ] Boutons CTA cliquables
- [ ] Design responsive mobile

**Authentication**:
- [ ] Signup nouveau compte
- [ ] Login avec compte existant
- [ ] Reset password

**Document Generation**:
- [ ] Sélectionner template
- [ ] Remplir formulaire
- [ ] Preview document
- [ ] Télécharger PDF

**Paiement**:
- [ ] Modal checkout
- [ ] Carte test: 4242 4242 4242 4242
- [ ] Date: Future (ex: 12/28)
- [ ] CVC: 123
- [ ] Paiement accepté
- [ ] Document débloqué

**Signature PDF**:
- [ ] Upload PDF
- [ ] Dessiner signature
- [ ] Télécharger PDF signé

**Admin Dashboard**:
- [ ] Stats affichées
- [ ] Gestion users
- [ ] Gestion templates
- [ ] Test notifications email

**SEO**:
- [ ] View Source → Meta tags présents
- [ ] Sitemap accessible: /sitemap.xml
- [ ] Robots.txt accessible: /robots.txt

---

## PHASE 10: MONITORING (10 min)

### Activer Analytics
- [ ] **Vercel → Analytics → Enable**
- [ ] Vérifier données après 24h

### Vérifier Logs
- [ ] **Vercel → Logs** (pas d'erreurs)
- [ ] **Supabase → Logs → API** (requêtes OK)
- [ ] **Stripe → Webhooks** (événements reçus)

---

## PHASE 11: MARKETING (Premier Jour)

### Réseaux Sociaux
- [ ] Poster sur LinkedIn
- [ ] Poster sur Twitter/X
- [ ] Partager sur Facebook

### Annuaires
- [ ] Soumettre Product Hunt
- [ ] Soumettre AlternativeTo
- [ ] Soumettre Capterra

### Communautés
- [ ] Reddit: r/immigration
- [ ] Reddit: r/entrepreneur
- [ ] Reddit: r/SideProject

---

## RÉSUMÉ PAR PRIORITÉ

### CRITIQUE (SANS ÇA LE SITE NE MARCHE PAS)
```
✓ Déploiement Vercel
✓ Variables environnement (Supabase)
✓ Domaine configuré
✓ DNS propagé
```

### IMPORTANT (FONCTIONNALITÉS CLÉS)
```
✓ Compte admin créé
✓ Emails configurés (Resend)
✓ Stripe webhooks
✓ Tests passés
```

### RECOMMANDÉ (CROISSANCE)
```
✓ Google Search Console
✓ Google Analytics
✓ Vercel Analytics
✓ Marketing initial
```

---

## TEMPS TOTAL PAR PHASE

```
Phase 1: Préparation          15 min
Phase 2: Vercel               30 min
Phase 3: Domaine              45 min  (dont 30 min attente DNS)
Phase 4: SEO                  20 min
Phase 5: Emails               45 min  (dont 15 min attente DNS)
Phase 6: Supabase             15 min
Phase 7: Stripe               20 min
Phase 8: Compte Admin         10 min
Phase 9: Tests                30 min
Phase 10: Monitoring          10 min
Phase 11: Marketing           20 min (facultatif)

TOTAL ACTIF:                  2h30
TOTAL AVEC ATTENTES:          3h15
```

---

## COMMANDES UTILES

### Déploiement
```bash
# Build local
npm run build

# Déployer
vercel --prod

# Vérifier déploiement
./verify-deployment.sh id0c.com
```

### Vérification DNS
```bash
# Domaine principal
dig id0c.com +short

# DNS Email (SPF)
dig TXT id0c.com +short

# DNS Email (DKIM)
dig CNAME resend._domainkey.id0c.com +short
```

### Tests Manuels
```bash
# Homepage
curl -I https://id0c.com

# Sitemap
curl https://id0c.com/sitemap.xml | grep -c "<loc>"

# Robots
curl https://id0c.com/robots.txt

# Performance
curl -s -o /dev/null -w "Time: %{time_total}s\n" https://id0c.com
```

---

## TROUBLESHOOTING RAPIDE

### Site ne charge pas
```
1. Vérifier variables d'environnement Vercel
2. Vérifier DNS propagé: dnschecker.org
3. Vérifier logs Vercel: Dashboard → Logs
4. Redéployer: vercel --prod
```

### Emails ne partent pas
```
1. Vérifier DNS: dig TXT id0c.com
2. Vérifier API Key Resend dans Supabase Secrets
3. Vérifier logs: Supabase → Functions → send-email → Logs
4. Tester via Admin Dashboard
```

### Paiements échouent
```
1. Vérifier Webhook Secret Stripe dans Supabase
2. Vérifier événements: Stripe → Webhooks → Endpoint
3. Vérifier logs: Supabase → Functions → stripe-webhook
4. Tester avec carte: 4242 4242 4242 4242
```

### Page 404
```
1. Vérifier rewrites dans vercel.json
2. Vérifier routes dans App.tsx
3. Clear cache Vercel: Dashboard → Deployments → Redeploy
```

---

## PROCHAINES ÉTAPES (Semaine 1)

- [ ] Analyser premiers visiteurs (Analytics)
- [ ] Publier 3 articles blog
- [ ] Contacter 10 partenaires potentiels
- [ ] Lancer campagne Google Ads (50€/jour)
- [ ] Optimiser pages avec taux rebond élevé

---

## CONTACT SUPPORT

**Vercel**: https://vercel.com/support
**Supabase**: https://supabase.com/support
**Resend**: support@resend.com
**Stripe**: https://support.stripe.com

---

## FÉLICITATIONS! 🎉

Une fois toutes les cases cochées, votre plateforme **iDoc** est:

✓ Déployée en production
✓ Accessible sur votre domaine
✓ Sécurisée (HTTPS + RLS)
✓ Optimisée SEO
✓ Prête à générer des revenus

**Prochaine étape**: Acquérir vos premiers utilisateurs!

Bon lancement! 🚀
