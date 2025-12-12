# 🚀 Guide de Déploiement id0c.com

## ⚡ DÉPLOIEMENT RAPIDE (10 minutes)

### Étape 1: Préparer Vercel

```bash
# Si pas encore installé
npm install -g vercel

# Se connecter
vercel login
```

### Étape 2: Déployer

```bash
# Déploiement initial (preview)
vercel

# Quand tout est OK, passer en production
vercel --prod
```

### Étape 3: Configurer le domaine id0c.com

**Dans le Dashboard Vercel:**

1. Aller dans **Settings** → **Domains**
2. Ajouter `id0c.com`
3. Ajouter `www.id0c.com` (redirection vers id0c.com)
4. Copier les enregistrements DNS fournis

**Chez votre registrar:**

Configuration DNS à ajouter:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

SSL/HTTPS sera automatiquement activé par Vercel (gratuit).

---

## 📊 VARIABLES D'ENVIRONNEMENT

**Dans Vercel Dashboard → Settings → Environment Variables:**

```bash
VITE_SUPABASE_URL=https://ffujpjaaramwhtmzqhlx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTc3MzAsImV4cCI6MjA3ODE3MzczMH0.oiBJ_R4x_ZSRrHLEtSQ9d-gvAaseZJM0XMRS8evDXoo
```

---

## ✅ APRÈS DÉPLOIEMENT

### 1. Créer un compte Admin
1. S'inscrire sur https://id0c.com
2. Aller sur Supabase → Table `user_profiles`
3. Modifier `role` de `user` → `admin`

### 2. Tests Essentiels
- [ ] Site accessible sur https://id0c.com
- [ ] Inscription/Connexion OK
- [ ] Génération document fonctionne
- [ ] Téléchargement PDF OK
- [ ] Responsive mobile

### 3. SEO
- [ ] Générer sitemap: `npx ts-node scripts/generateDynamicSitemap.ts`
- [ ] Soumettre à Google Search Console

---

**Commande unique: `vercel --prod`**
