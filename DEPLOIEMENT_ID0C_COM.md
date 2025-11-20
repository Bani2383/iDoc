# 🚀 Guide de Déploiement - iD0c.com

## ✅ Domaine acheté: iD0c.com

---

## 🎯 Méthode recommandée: Vercel (Gratuit + Simple)

### **Pourquoi Vercel?**
- ✅ Gratuit pour projets personnels
- ✅ HTTPS automatique
- ✅ Déploiement en 2 minutes
- ✅ CDN mondial
- ✅ Intégration Git automatique
- ✅ Domaine personnalisé facile

---

## 📋 ÉTAPE 1: Préparer le projet

### **1.1 Variables d'environnement**

Vérifiez votre fichier `.env`:
```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

### **1.2 Google Analytics**

**IMPORTANT:** Remplacez l'ID dans `index.html`:

```bash
# Ligne 39 et 44
G-XXXXXXXXXX  →  Votre vrai ID Google Analytics
```

Si vous n'avez pas encore de compte:
1. Allez sur https://analytics.google.com
2. Créez une propriété "iDoc"
3. Copiez l'ID (G-XXXXXXXXXX)

### **1.3 Build local (test)**

```bash
npm run build
```

Devrait afficher: `✓ built in ~15s`

---

## 🚀 ÉTAPE 2: Déployer sur Vercel

### **Option A: Via Interface Web (Plus Simple)**

#### **1. Créer compte Vercel**
- Allez sur: https://vercel.com/signup
- Connectez-vous avec GitHub (recommandé)

#### **2. Pousser votre code sur GitHub**

```bash
# Si pas encore fait:
git init
git add .
git commit -m "Ready for deployment"

# Créer un repo sur GitHub puis:
git remote add origin https://github.com/votre-username/idoc.git
git branch -M main
git push -u origin main
```

#### **3. Importer le projet sur Vercel**

1. Sur Vercel, cliquer "Add New Project"
2. Sélectionner votre repo GitHub "idoc"
3. Vercel détecte automatiquement Vite

#### **4. Configurer les variables d'environnement**

Dans Vercel, section "Environment Variables", ajouter:

```
VITE_SUPABASE_URL = https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY = votre-clé-anon
```

#### **5. Déployer**

- Cliquer "Deploy"
- Attendre 2-3 minutes
- Vercel vous donne une URL temporaire: `idoc-xxx.vercel.app`

---

### **Option B: Via CLI (Plus Rapide si à l'aise)**

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel

# Suivre les prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? idoc
# - Directory? ./
# - Override settings? No

# 4. Déployer en production
vercel --prod
```

---

## 🌐 ÉTAPE 3: Configurer le domaine iD0c.com

### **3.1 Dans Vercel**

1. Aller dans votre projet
2. Settings → Domains
3. Ajouter: `id0c.com` (noter: minuscules)
4. Ajouter aussi: `www.id0c.com`

Vercel va vous donner des instructions DNS.

### **3.2 Configuration DNS chez votre registrar**

Vous devez ajouter ces enregistrements DNS:

#### **Pour id0c.com (racine):**

**Type:** A Record
**Name:** @ (ou vide)
**Value:** 76.76.21.21

**OU**

**Type:** CNAME
**Name:** @ (ou vide)
**Value:** cname.vercel-dns.com

#### **Pour www.id0c.com:**

**Type:** CNAME
**Name:** www
**Value:** cname.vercel-dns.com

### **3.3 Vérifier la configuration**

Vercel vérifie automatiquement. Ça prend 5 minutes à 48h selon le registrar.

Pour tester:
```bash
# Vérifier DNS
nslookup id0c.com

# Devrait pointer vers Vercel
```

---

## 🔒 ÉTAPE 4: HTTPS (Automatique)

Vercel active automatiquement HTTPS avec Let's Encrypt.

**Vérifier:**
- https://id0c.com devrait fonctionner
- http://id0c.com devrait rediriger vers https://

---

## 📊 ÉTAPE 5: Configuration post-déploiement

### **5.1 Google Search Console**

1. Allez sur: https://search.google.com/search-console
2. Cliquer "Ajouter une propriété"
3. Sélectionner "Préfixe d'URL"
4. Entrer: `https://id0c.com`
5. Méthode de vérification: "Balise HTML"
6. Copier la balise meta

**Ajouter dans index.html:**
```html
<head>
  <meta name="google-site-verification" content="VOTRE-CODE" />
  ...
</head>
```

7. Redéployer (git push)
8. Cliquer "Vérifier" dans Search Console

### **5.2 Soumettre le sitemap**

Dans Search Console:
1. Menu "Sitemaps"
2. Entrer: `https://id0c.com/sitemap.xml`
3. Cliquer "Envoyer"
4. Attendre 24-48h pour indexation

### **5.3 Bing Webmaster Tools**

1. Allez sur: https://www.bing.com/webmasters
2. Cliquer "Importer depuis Google Search Console" (plus rapide)
3. Ou ajouter manuellement: `https://id0c.com`
4. Soumettre sitemap: `https://id0c.com/sitemap.xml`

### **5.4 Google Analytics**

1. Aller sur: https://analytics.google.com
2. Vérifier que les données arrivent
3. Tester: visiter votre site et attendre 30 secondes
4. Rafraîchir Analytics → devrait voir 1 utilisateur actif

---

## 🧪 ÉTAPE 6: Tests post-déploiement

### **Checklist manuelle:**

Visiter et tester:
- [ ] https://id0c.com (homepage s'affiche)
- [ ] https://id0c.com/sitemap.xml (XML valide)
- [ ] https://id0c.com/robots.txt (texte visible)
- [ ] https://id0c.com/ai (page AI)
- [ ] Recherche fonctionne
- [ ] Cliquer sur un template → génération s'ouvre
- [ ] Test paiement (mode test Stripe)
- [ ] Mobile responsive (tester sur téléphone)

### **Tests automatiques:**

```bash
# Google PageSpeed
# Allez sur: https://pagespeed.web.dev
# Entrer: https://id0c.com
# Objectif: Score >80
```

```bash
# Mobile-Friendly Test
# Allez sur: https://search.google.com/test/mobile-friendly
# Entrer: https://id0c.com
# Devrait dire "Mobile-friendly"
```

---

## 📈 ÉTAPE 7: Monitoring

### **7.1 UptimeRobot (Gratuit)**

1. Allez sur: https://uptimerobot.com
2. Créer un compte gratuit
3. Ajouter un monitor:
   - Type: HTTPS
   - URL: https://id0c.com
   - Interval: 5 minutes
4. Ajouter votre email pour alertes

### **7.2 Dashboard Analytics**

Créer un dashboard personnalisé dans GA4:
- Sessions par source
- Conversions
- Top templates vus
- Taux de conversion

---

## 🎯 ÉTAPE 8: Calendrier post-lancement

### **Jour 1 (Aujourd'hui):**
- [x] Déployer sur Vercel
- [x] Configurer DNS
- [ ] Vérifier HTTPS fonctionne
- [ ] Tester manuellement 5 templates
- [ ] Configurer Search Console
- [ ] Configurer Bing Webmaster

### **Jour 2:**
- [ ] Vérifier que DNS propage (24-48h)
- [ ] Vérifier https://id0c.com accessible
- [ ] Faire 1 test d'achat complet (1,99$)

### **Jour 3-7:**
- [ ] Vérifier indexation Search Console (au moins 5 pages)
- [ ] Pas d'erreurs dans Search Console
- [ ] Analytics enregistre les visites

### **Semaine 2:**
- [ ] Vérifier positions moyennes (<100)
- [ ] Au moins 10 pages indexées
- [ ] Partager sur réseaux sociaux

### **Mois 1:**
- [ ] 50+ pages indexées
- [ ] Premières visites organiques (10-50)
- [ ] Première conversion possible
- [ ] Rapport mensuel

---

## 🔧 Dépannage

### **Problème: DNS ne propage pas**

```bash
# Vérifier DNS
nslookup id0c.com
dig id0c.com

# Si toujours ancien:
# - Attendre 24-48h
# - Vérifier configuration chez registrar
# - Vider cache DNS: ipconfig /flushdns (Windows)
```

### **Problème: Site ne s'affiche pas**

1. Vérifier build: `npm run build`
2. Vérifier variables d'environnement dans Vercel
3. Check logs Vercel (onglet Deployments)

### **Problème: 404 sur les routes**

Vercel devrait détecter SPA automatiquement.

Si problème, créer `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### **Problème: Templates ne s'affichent pas**

1. Vérifier variables Supabase dans Vercel
2. Check console navigateur (F12)
3. Vérifier RLS policies Supabase

---

## 📞 Support

**Vercel:**
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs

**Google Search Console:**
- Help: https://support.google.com/webmasters

---

## ✅ Checklist finale avant de déclarer succès

- [ ] Site accessible sur https://id0c.com
- [ ] HTTPS actif (cadenas vert)
- [ ] 20 templates visibles
- [ ] Recherche fonctionne
- [ ] Paiement test réussi (mode test)
- [ ] Google Analytics enregistre visites
- [ ] Search Console configuré
- [ ] Sitemap soumis
- [ ] Bing Webmaster configuré
- [ ] UptimeRobot actif
- [ ] Mobile responsive testé

---

## 🎉 Une fois tout fait:

**Votre site iD0c.com sera:**
- ✅ En ligne 24/7
- ✅ HTTPS sécurisé
- ✅ Indexable par Google
- ✅ Recommandable par ChatGPT
- ✅ Rapide (CDN mondial)
- ✅ Monitoré
- ✅ Prêt à générer du revenu

**Premier objectif réaliste:**
- Semaine 1: 0-10 visiteurs (vous + tests)
- Semaine 2-4: 10-50 visiteurs
- Mois 2: 50-200 visiteurs
- Mois 3: 100-500 visiteurs

**Première conversion attendue:** Mois 2-3

---

*Guide créé le: 2024-11-19*
*Domaine: iD0c.com*
*Plateforme: Vercel (recommandée)*
