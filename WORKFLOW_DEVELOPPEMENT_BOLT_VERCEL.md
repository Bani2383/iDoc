# 🔄 WORKFLOW: Développer sur Bolt.new + Déployer sur Vercel

## La Situation

- **Bolt.new** = Environnement de développement (éditeur en ligne)
- **Vercel** = Plateforme de déploiement/production
- **id0c.com** = Votre domaine en production

**Vous N'AVEZ PAS besoin d'ajouter le domaine à Bolt.new!**

---

## 🎯 Le Workflow Recommandé

### Option 1: Bolt.new → GitHub → Vercel (Automatique)

C'est le workflow le plus fluide et professionnel.

#### Étape 1: Développer sur Bolt.new

1. Continuez à coder sur Bolt.new normalement
2. Testez avec l'URL Bolt.new temporaire (ex: https://bolt.new/~/sb1-xxxxx)
3. Pas besoin de domaine personnalisé ici

#### Étape 2: Connecter à GitHub

Une fois satisfait de vos changements:

1. Sur Bolt.new, cliquez sur **"Share"** en haut à droite
2. Cliquez sur **"Push to GitHub"** (ou "Export to GitHub")
3. Authentifiez avec GitHub si nécessaire
4. Créez un nouveau repo ou poussez vers un repo existant
5. Tous vos changements sont maintenant sur GitHub

#### Étape 3: Connecter GitHub à Vercel

**Configuration initiale (une seule fois):**

1. Allez sur https://vercel.com
2. Votre projet id0c
3. **Settings** → **Git**
4. Connectez votre repository GitHub
5. Configurez:
   - Branch: `main` (ou `master`)
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

**Résultat:**

À partir de maintenant, **chaque push sur GitHub déploie automatiquement sur Vercel!**

```
Bolt.new → Push to GitHub → Vercel déploie automatiquement → id0c.com mis à jour
```

---

### Option 2: Bolt.new → Download → Git Local → Vercel

Si vous préférez passer par votre machine locale:

#### Étape 1: Exporter depuis Bolt.new

1. Sur Bolt.new, cliquez **"Share"** → **"Download as ZIP"**
2. Extrayez le ZIP sur votre machine

#### Étape 2: Pousser sur GitHub

```bash
# Dans le dossier extrait
cd chemin/vers/projet

# Initialiser Git (si pas déjà fait)
git init

# Ajouter le remote GitHub
git remote add origin https://github.com/votre-username/votre-repo.git

# Ajouter tous les fichiers
git add .

# Committer
git commit -m "Update from Bolt.new"

# Pousser
git push origin main
```

#### Étape 3: Vercel déploie automatiquement

Si Vercel est connecté à GitHub, le déploiement démarre automatiquement!

---

### Option 3: Développement Local + Vercel

Pour le développement quotidien:

```bash
# 1. Cloner votre repo
git clone https://github.com/votre-username/votre-repo.git
cd votre-repo

# 2. Installer les dépendances
npm install

# 3. Développer localement
npm run dev
# Ouvre http://localhost:5173

# 4. Faire vos modifications

# 5. Tester le build
npm run build
npm run preview

# 6. Committer et pousser
git add .
git commit -m "Nouvelle fonctionnalité"
git push

# 7. Vercel déploie automatiquement sur id0c.com
```

---

## 🚀 Configuration Vercel pour Déploiement Automatique

### 1. Connecter GitHub à Vercel

Sur Vercel: **Settings** → **Git**

- Repository: votre-username/votre-repo
- Production Branch: `main`

### 2. Variables d'environnement

Sur Vercel: **Settings** → **Environment Variables**

Ajoutez:
```
VITE_SUPABASE_URL = votre_url
VITE_SUPABASE_ANON_KEY = votre_key
```

### 3. Build Settings

Sur Vercel: **Settings** → **Build & Development Settings**

- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 4. Domaine

Sur Vercel: **Settings** → **Domains**

- Production: **id0c.com**
- Alias: **www.id0c.com**

---

## 📊 Comparaison des Workflows

### Bolt.new → GitHub → Vercel ✅ (Recommandé)

**Avantages:**
- Automatique
- Aucune installation locale nécessaire
- Déploiement en 1 clic depuis Bolt.new
- Historique Git automatique
- Rollback facile

**Inconvénients:**
- Nécessite un compte GitHub
- Setup initial à faire

---

### Bolt.new → Download → Local → GitHub → Vercel

**Avantages:**
- Contrôle total
- Peut modifier localement avant de pousser

**Inconvénients:**
- Plus d'étapes manuelles
- Risque d'oublier de pousser

---

### Développement Local uniquement

**Avantages:**
- Éditeur de votre choix (VS Code, etc.)
- Outils avancés (debugger, extensions)
- Pas de limite de temps

**Inconvénients:**
- Nécessite installation locale (Node.js, npm, git)
- Pas d'accès depuis n'importe où

---

## 🎨 Mon Conseil: Utiliser les 2

### Pour le prototypage rapide:
- Utilisez **Bolt.new**
- Testez des idées rapidement
- Push to GitHub quand satisfait

### Pour le développement sérieux:
- Clonez sur votre machine locale
- Utilisez VS Code ou votre éditeur préféré
- Développez avec tous vos outils
- Push régulièrement sur GitHub
- Vercel déploie automatiquement

---

## 🔄 Cycle de Développement Typique

```
┌─────────────┐
│  Bolt.new   │  ← Prototypage rapide, nouvelles idées
│  (preview)  │
└──────┬──────┘
       │
       │ Push to GitHub
       ▼
┌─────────────┐
│   GitHub    │  ← Source de vérité, historique
└──────┬──────┘
       │
       │ Auto-deploy
       ▼
┌─────────────┐
│   Vercel    │  ← Production
│  id0c.com   │
└─────────────┘
```

OU

```
┌─────────────┐
│   Local     │  ← Développement principal
│  (VS Code)  │
└──────┬──────┘
       │
       │ git push
       ▼
┌─────────────┐
│   GitHub    │
└──────┬──────┘
       │
       │ Auto-deploy
       ▼
┌─────────────┐
│   Vercel    │
│  id0c.com   │
└─────────────┘
```

---

## ❓ Questions Fréquentes

### Q: Pourquoi Bolt.new ne peut pas ajouter mon domaine?

**R:** Parce que votre domaine est déjà géré par Netlify/Vercel. Un domaine ne peut pointer que vers UNE seule destination. C'est normal et ce n'est pas un problème!

### Q: Comment voir mes changements avant qu'ils soient en production?

**R:** 
- Sur Bolt.new: utilisez l'URL preview (bolt.new/~/xxx)
- Sur Vercel: chaque branch GitHub a son URL de preview
- En local: `npm run dev` sur http://localhost:5173

### Q: Je peux développer sans domaine sur Bolt.new?

**R:** Oui! Bolt.new vous donne automatiquement une URL de preview. Le domaine personnalisé n'est nécessaire QUE pour la production sur Vercel.

### Q: Comment synchroniser Bolt.new avec mon code existant?

**R:**
1. Sur Bolt.new: Import from GitHub
2. Sélectionnez votre repository
3. Bolt.new charge votre code
4. Modifiez
5. Push to GitHub
6. Vercel déploie automatiquement

### Q: Combien de temps prend le déploiement?

**R:**
- Push GitHub → Vercel: **30 secondes à 2 minutes**
- Bolt.new → GitHub: **instantané**
- Total: **moins de 3 minutes** du code à la production!

---

## 🎯 Résumé

1. **NE PAS** essayer d'ajouter id0c.com à Bolt.new
2. **Utiliser** Bolt.new pour développer avec son URL preview
3. **Pousser** sur GitHub depuis Bolt.new (ou en local)
4. **Laisser** Vercel déployer automatiquement sur id0c.com

**Vous pouvez continuer à développer sur Bolt.new normalement!**

Le domaine id0c.com sur Vercel est complètement indépendant de Bolt.new.

---

## 🚀 Prochaines Étapes

1. ✅ Finir la migration vers Vercel (suivez les guides de migration)
2. ✅ Connecter votre GitHub à Vercel
3. ✅ Configurer le déploiement automatique
4. ✅ Continuer à développer sur Bolt.new ou en local
5. ✅ Push → déploiement automatique!

Vous aurez le meilleur des deux mondes:
- **Bolt.new**: prototypage rapide
- **Vercel + id0c.com**: production professionnelle
