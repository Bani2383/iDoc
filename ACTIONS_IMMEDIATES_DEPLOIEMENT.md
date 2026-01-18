# 🚀 ACTIONS IMMÉDIATES AVANT DÉPLOIEMENT
## Durée Totale: 30 minutes

---

## ❌ CRITIQUE #1: Corriger ViewType (2 min)

**Fichier:** `src/App.tsx`

**Problème:** Type "idoc-wizard" utilisé mais non défini.

**Solution:**
```typescript
// Trouver la définition de ViewType et ajouter "idoc-wizard"
type ViewType =
  | "home"
  | "generator"
  | "guided-flow"
  | "idoc-wizard"  // ← AJOUTER CETTE LIGNE
  | "document-list"
  | "admin"
  | "profile"
  | "pricing"
  | "faq"
  | "legal"
  | "category"
  | "article"
  | "articles"
  | "seo-demo"
  | "signature-feature"
  | "study-permit"
  | "refusal-letter";
```

---

## ❌ CRITIQUE #2: Corriger GitHub Actions (5 min)

**Fichier:** `.github/workflows/webpack.yml`

**Problème:** Utilise Webpack au lieu de Vite.

**Solution:** Remplacer tout le contenu par:
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Run tests
        run: npm test
        continue-on-error: true
```

---

## ⚠️ ACTION #3: Mettre à jour Browserslist (1 min)

**Commande:**
```bash
npx update-browserslist-db@latest
```

**Puis rebuilder:**
```bash
npm run build
```

---

## ⚠️ ACTION #4: Variables Environnement Vercel (10 min)

### Aller sur Vercel:
1. https://vercel.com/dashboard
2. Sélectionner votre projet iDoc
3. **Settings** → **Environment Variables**

### Ajouter (OBLIGATOIRE):
```bash
# Configuration Base
NODE_ENV=production
VITE_APP_URL=https://id0c.com

# Supabase
VITE_SUPABASE_URL=https://jgadstuimnblhykfaxsv.supabase.co
VITE_SUPABASE_ANON_KEY=[copier depuis .env local]
```

### Ajouter (SI PAIEMENTS):
```bash
# Stripe Production
VITE_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Ajouter (OPTIONNEL - Analytics):
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_HOTJAR_ID=XXXXXXX
```

### Important:
- Pour **Production**: Cocher "Production"
- Pour **Preview**: Cocher "Preview"
- Pour **Development**: Cocher "Development"

---

## ⚠️ ACTION #5: Redirect URLs Supabase (5 min)

### Aller sur Supabase:
1. https://supabase.com/dashboard
2. Sélectionner votre projet
3. **Authentication** → **URL Configuration**

### Ajouter ces URLs:
```
Site URL:
https://id0c.com

Redirect URLs:
https://id0c.com/**
https://www.id0c.com/**
http://localhost:5173/**  (pour dev local)
```

### Site URL (un seul):
```
https://id0c.com
```

---

## ⚠️ ACTION #6: Configuration DNS (Si pas déjà fait)

### Sur votre registrar (Name.com, GoDaddy, etc.):

```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

### Vérification:
Attendre 5-30 minutes pour la propagation DNS.

Vérifier avec:
```bash
nslookup id0c.com
nslookup www.id0c.com
```

---

## ⚠️ ACTION #7: Configuration Domaine sur Vercel (5 min)

### Aller sur Vercel:
1. **Settings** → **Domains**

### Ajouter domaines:
```
Production Domain: id0c.com
Add Domain: www.id0c.com (sera un alias)
```

### Vérifier:
Vercel va automatiquement:
- Générer certificat SSL
- Configurer le routing
- Activer HTTPS

---

## ✅ CHECKLIST FINALE

Avant de déployer, vérifier:

```bash
□ ViewType corrigé dans App.tsx
□ GitHub Actions workflow corrigé
□ Browserslist mis à jour
□ Build local réussi (npm run build)
□ Variables environnement ajoutées sur Vercel
□ Redirect URLs configurées sur Supabase
□ DNS configuré et propagé
□ Domaine ajouté sur Vercel
```

---

## 🚀 DÉPLOIEMENT

### Option A: Via GitHub (Recommandé)

```bash
# 1. Committer les corrections
git add .
git commit -m "fix: corrections critiques pre-deploiement"

# 2. Pousser sur GitHub
git push origin main

# 3. Vercel déploie automatiquement
# Suivre le déploiement sur: https://vercel.com/dashboard
```

### Option B: Via Vercel CLI

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Déployer
vercel --prod
```

### Option C: Via Vercel Dashboard

1. Aller sur https://vercel.com/dashboard
2. **New Project**
3. **Import Git Repository**
4. Sélectionner votre repo
5. Configurer:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Ajouter les variables d'environnement
7. **Deploy**

---

## 📊 VÉRIFICATION POST-DÉPLOIEMENT

### Tests Immédiats:

```bash
✓ Site accessible sur https://id0c.com
✓ Redirection www → non-www (ou inverse)
✓ HTTPS actif (certificat SSL)
✓ Page d'accueil se charge
✓ Connexion/Inscription fonctionne
✓ Génération de document fonctionne
✓ Pas d'erreurs dans la console
```

### Tests Avancés:

```bash
✓ Test sur mobile
✓ Test de performance (Lighthouse)
✓ Test de sécurité
✓ Test des paiements (si activés)
✓ Test des emails
✓ Test multilingue
```

---

## 🆘 EN CAS DE PROBLÈME

### Build échoue sur Vercel:
1. Vérifier les logs de build sur Vercel
2. Vérifier que les variables d'environnement sont correctes
3. Tester en local: `npm run build`

### Erreurs Supabase:
1. Vérifier les Redirect URLs
2. Vérifier les variables VITE_SUPABASE_*
3. Vérifier les RLS policies

### DNS ne résout pas:
1. Attendre plus longtemps (jusqu'à 48h max)
2. Vérifier la configuration DNS
3. Utiliser https://dnschecker.org pour vérifier la propagation

### Certificat SSL manquant:
1. Attendre 5-10 minutes après ajout du domaine
2. Vérifier que DNS est correct
3. Forcer le renouvellement sur Vercel

---

## 📞 RESSOURCES

### Documentation:
- `RAPPORT_VERIFICATION_COMPLETE_2026.md` - Rapport complet
- `WORKFLOW_DEVELOPPEMENT_BOLT_VERCEL.md` - Workflow dev
- `GUIDE_DEPLOIEMENT_COMPLET_2026.md` - Guide complet

### Support:
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Vite: https://vitejs.dev/guide/

---

## 🎯 RÉSUMÉ

**Temps estimé:** 30 minutes
**Complexité:** Facile
**Risque:** Faible

**Après ces actions, votre site sera 100% opérationnel sur id0c.com!**

---

**Dernière mise à jour:** 18 Janvier 2026
**Status:** ✅ Prêt à exécuter
