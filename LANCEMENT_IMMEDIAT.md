# Lancement Immédiat iDoc

**Date**: 11 janvier 2026
**Temps**: 45 minutes
**Statut**: Prêt à lancer

---

## DÉMARRAGE RAPIDE

### 1. Installer Vercel CLI (2 min)

```bash
npm install -g vercel
vercel login
```

### 2. Déployer (3 min)

```bash
cd /tmp/cc-agent/59895567/project
vercel --prod
```

**Questions**:
- Set up and deploy? → **Yes**
- Project name? → **idoc**
- Directory? → **./
**
- Modify settings? → **No**

### 3. Variables Environnement (5 min)

**Via Dashboard Vercel**:

```
https://vercel.com/dashboard
→ Projet "idoc"
→ Settings
→ Environment Variables
```

**Ajouter 3 variables**:

| Nom | Valeur | Environnements |
|-----|--------|----------------|
| `VITE_SUPABASE_URL` | `https://ffujpjaaramwhtmzqhlx.supabase.co` | Prod + Preview + Dev |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTc3MzAsImV4cCI6MjA3ODE3MzczMH0.oiBJ_R4x_ZSRrHLEtSQ9d-gvAaseZJM0XMRS8evDXoo` | Prod + Preview + Dev |
| `VITE_APP_URL` | `https://id0c.com` | Prod only |

**Redéployer**:
```bash
vercel --prod
```

### 4. Configurer Domaine (35 min)

**Dans Vercel**:
```
Dashboard → Domains → Add Domain
Entrer: id0c.com
```

**Chez votre registrar DNS**:

Option A - Nameservers (recommandé):
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Option B - A Record:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Attendre propagation**: 15-30 minutes

**Vérifier**:
```bash
curl -I https://id0c.com
# Résultat: HTTP/2 200
```

### 5. Configurer Supabase (5 min)

```
https://app.supabase.com
→ Projet: ffujpjaaramwhtmzqhlx
→ Authentication
→ URL Configuration
```

**Site URL**:
```
https://id0c.com
```

**Redirect URLs**:
```
https://id0c.com
https://id0c.com/auth/callback
https://id0c.com/dashboard
```

**Save**

---

## VÉRIFICATION RAPIDE

### Test 1: Site accessible

```bash
curl -I https://id0c.com
# Attendu: 200 OK
```

### Test 2: Connexion

```
1. Aller sur: https://id0c.com
2. Cliquer "Connexion"
3. S'inscrire
4. Se connecter
5. ✓ Redirection dashboard
```

### Test 3: Génération

```
1. Templates → Choisir template
2. Remplir formulaire
3. Générer document
4. ✓ PDF téléchargé
```

### Test 4: Admin

```
1. Supabase → user_profiles
2. Trouver votre user
3. role = "admin"
4. Aller sur /admin
5. ✓ Dashboard affiché
```

---

## CONFIGURATION OPTIONNELLE

### Emails (30 min)

```
1. Créer compte Resend.com
2. Ajouter domaine id0c.com
3. Configurer DNS (SPF, DKIM)
4. Copier API Key
5. Supabase → Secrets:
   - send-email: RESEND_API_KEY
   - idoc-alert-notify: RESEND_API_KEY
```

### Stripe (15 min)

```
1. Stripe Dashboard → Webhooks
2. URL: https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/stripe-webhook
3. Events: checkout.session.completed, payment_intent.*
4. Copier Webhook Secret
5. Supabase → stripe-webhook → Secrets:
   STRIPE_WEBHOOK_SECRET
```

### SEO (15 min)

```
1. Google Search Console
2. Ajouter: https://id0c.com
3. Vérifier propriété
4. Soumettre sitemap: /sitemap.xml
5. Demander indexation pages
```

---

## TIMELINE

```
00:00  Installer Vercel CLI               2 min
00:02  Premier déploiement                3 min
00:05  Variables environnement            5 min
00:10  Redéployer                         2 min
00:12  Configurer domaine                 5 min
00:17  ⏳ Attendre DNS                   25 min
00:42  Configurer Supabase Auth           5 min
00:47  Tests critiques                    3 min
00:50  ✅ EN PRODUCTION!

Optionnel:
00:50  Emails Resend                     30 min
01:20  Stripe Webhooks                   15 min
01:35  Google Search Console             15 min
02:00  ✅ TOUT CONFIGURÉ!
```

---

## COMMANDES ESSENTIELLES

```bash
# Déployer
vercel --prod

# Voir logs
vercel logs

# Variables
vercel env ls

# Test DNS
dig id0c.com +short

# Test site
curl -I https://id0c.com

# Vérification complète
./verify-deployment.sh id0c.com
```

---

## SUPPORT

### Documentation

| Fichier | Description |
|---------|-------------|
| `PRET_POUR_PRODUCTION.md` | Statut et vue d'ensemble |
| `DEPLOIEMENT_RAPIDE_GUIDE.md` | Guide complet déploiement |
| `CHECKLIST_DEPLOIEMENT_FINAL.md` | Checklist 11 phases |
| `VARIABLES_ENVIRONNEMENT_VERCEL.md` | Configuration variables |
| `SUPABASE_AUTH_URLS_CONFIG.md` | Configuration Auth |

### Aide

- **Vercel**: https://vercel.com/support
- **Supabase**: https://supabase.com/support
- **Discord Vercel**: https://vercel.com/discord

---

## PROBLÈMES COURANTS

### Site ne charge pas

```bash
# Vérifier DNS
dig id0c.com +short

# Vérifier variables
vercel env ls

# Redéployer
vercel --prod --force
```

### Auth échoue

```
1. Vérifier URLs Supabase
2. Vérifier variables Vercel
3. Voir logs: Supabase → Auth → Logs
```

### Build échoue

```bash
# Test local
npm run build

# Si OK local, vérifier variables Vercel
```

---

## APRÈS LANCEMENT

### Monitoring (J+1)

```
✓ Vercel Analytics
✓ Supabase Logs
✓ Stripe Dashboard (si configuré)
✓ Google Analytics (si configuré)
```

### Marketing (J+1)

```
✓ Poster LinkedIn
✓ Poster Twitter/X
✓ Envoyer à contacts
✓ Soumettre Product Hunt
```

### Optimisation (S+1)

```
✓ Analyser données users
✓ Publier 3 articles blog
✓ Optimiser pages populaires
✓ Corriger bugs remontés
```

---

## STATUT ACTUEL

### Code

- ✅ Build: Succès (15.14s)
- ✅ TypeScript: Warnings uniquement
- ✅ Configuration: Correcte
- ✅ SEO: Optimisé
- ✅ Sécurité: RLS activé

### À Faire

- [ ] Déployer Vercel (10 min)
- [ ] Configurer domaine (35 min)
- [ ] Configurer Auth (5 min)
- [ ] Tester (5 min)

**Total**: 55 minutes

---

## PRÊT?

**Commande pour démarrer maintenant**:

```bash
vercel --prod
```

**Guide à suivre**:
→ `DEPLOIEMENT_RAPIDE_GUIDE.md`

**Tout est prêt!** 🚀

---

**Dernière mise à jour**: 11 janvier 2026
**Version**: 2.0
**Action**: Lancer maintenant
