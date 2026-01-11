# 🚀 Guide Connexion Vercel - Configuration DNS

## 📍 Étape 1: Se Connecter à Vercel (2 min)

### Option A: Vous avez déjà un compte Vercel

```
1. Aller sur: https://vercel.com

2. Cliquer "Login" (en haut à droite)

3. Se connecter avec:
   - GitHub (recommandé)
   - GitLab
   - Bitbucket
   - Email

4. Vous arrivez sur votre Dashboard Vercel ✅
```

### Option B: Vous n'avez pas encore de compte

```
1. Aller sur: https://vercel.com/signup

2. S'inscrire avec:
   - GitHub (recommandé - connexion facile)
   - GitLab
   - Bitbucket
   - Email

3. Confirmer email si nécessaire

4. Vous arrivez sur votre Dashboard Vercel ✅
```

---

## 📍 Étape 2: Accéder à Votre Projet (1 min)

Une fois connecté sur Vercel Dashboard:

```
1. Vous voyez la liste de vos projets

2. Chercher votre projet (probablement nommé: iDoc, id0c, ou similaire)

3. Cliquer sur le nom du projet

4. Vous êtes maintenant dans la vue du projet ✅
```

**Si vous ne voyez aucun projet:**
- Soit votre projet n'est pas encore déployé sur Vercel
- Soit vous êtes connecté avec un mauvais compte
- Vérifiez l'email/compte utilisé pour déployer

---

## 📍 Étape 3: Accéder Configuration Domaine (1 min)

Dans la page de votre projet:

```
1. Cliquer sur l'onglet "Settings" (en haut)

2. Dans le menu de gauche, cliquer "Domains"

3. Vous voyez la liste de vos domaines:
   - Domaines Vercel (*.vercel.app)
   - Vos domaines personnalisés (id0c.com)

4. Cliquer sur votre domaine: id0c.com

5. Vous êtes maintenant dans la configuration du domaine ✅
```

**Capture conceptuelle de la navigation:**
```
Dashboard → Votre Projet → Settings → Domains → id0c.com
```

---

## 📍 Étape 4: Accéder aux Records DNS (1 min)

Dans la page de configuration du domaine id0c.com:

```
1. Faire défiler vers le bas

2. Trouver la section "DNS Records" ou "DNS Configuration"

3. Vous voyez:
   - Liste des records DNS existants (A, CNAME, TXT, MX...)
   - Bouton "Add" ou "Add Record"

4. Vous êtes prêt à ajouter vos records email! ✅
```

---

## 📍 Étape 5: Ajouter un Record DNS (Exemple)

Pour ajouter un record (ex: TXT pour vérification Zoho):

```
1. Cliquer bouton "Add" ou "Add Record"

2. Remplir le formulaire:

   Type: [Sélectionner dans menu déroulant]
   └─ TXT, MX, CNAME, A, etc.

   Name: [Champ texte]
   └─ @ (pour racine domaine)
   └─ ou sous-domaine (ex: mail, zoho._domainkey)

   Value: [Champ texte]
   └─ Copier la valeur fournie par Zoho/Google/etc.

   TTL: [Optionnel]
   └─ Laisser par défaut ou 3600

3. Cliquer "Save" ou "Add"

4. Record ajouté! ✅
```

**Exemple concret - Vérification Zoho:**
```
Type: TXT
Name: @
Value: zoho-verification=zb1234567890abcdef
TTL: 3600 (ou laisser vide)

→ Cliquer "Save"
```

**Exemple concret - Record MX Zoho:**
```
Type: MX
Name: @
Value: mx.zoho.com
Priority: 10
TTL: 3600 (ou laisser vide)

→ Cliquer "Save"
```

---

## 📍 Étape 6: Vérifier Records DNS (2 min)

Une fois records ajoutés:

```
1. Retourner dans la liste "DNS Records"

2. Vérifier que vos nouveaux records apparaissent:
   ✅ TXT | @ | zoho-verification=...
   ✅ MX  | @ | mx.zoho.com (Priority: 10)
   ✅ MX  | @ | mx2.zoho.com (Priority: 20)
   etc.

3. Records visibles = correctement ajoutés! ✅
```

**Propagation DNS:**
```
⏰ Temps d'attente: 10-30 minutes

Les records DNS prennent du temps à se propager sur Internet.

Ne vous inquiétez pas si:
- Zoho dit "non vérifié" immédiatement après
- Les emails ne fonctionnent pas tout de suite

Attendre 15-30 min puis vérifier à nouveau.
```

---

## 🔍 Vérifier Propagation DNS

Pour vérifier si vos records sont propagés (optionnel):

### Méthode 1: Outil en ligne (facile)

```
1. Aller sur: https://dnschecker.org

2. Entrer votre domaine: id0c.com

3. Sélectionner type de record:
   - TXT (pour vérifications)
   - MX (pour emails)
   - CNAME, A, etc.

4. Cliquer "Search"

5. Voir résultats dans différents pays:
   - Vert ✅ = propagé
   - Rouge ❌ = pas encore propagé

6. Attendre jusqu'à ce que tout soit vert
```

### Méthode 2: Terminal (si vous êtes technique)

**Mac/Linux:**
```bash
# Vérifier records MX
dig MX id0c.com +short

# Vérifier records TXT
dig TXT id0c.com +short

# Vérifier record TXT spécifique (DKIM)
dig TXT zoho._domainkey.id0c.com +short
```

**Windows (PowerShell):**
```powershell
# Vérifier records MX
nslookup -type=MX id0c.com

# Vérifier records TXT
nslookup -type=TXT id0c.com
```

---

## ⚠️ Problèmes Courants

### Problème 1: "Je ne trouve pas mon domaine dans Vercel"

**Solutions:**
```
1. Vérifier que vous êtes connecté au bon compte Vercel
2. Le domaine doit d'abord être ajouté au projet
3. Settings → Domains → "Add Domain" → Entrer id0c.com
4. Suivre instructions Vercel pour configurer le domaine
```

### Problème 2: "Je ne vois pas DNS Records"

**Solutions:**
```
1. Le domaine doit être vérifié d'abord dans Vercel
2. Certains domaines nécessitent configuration nameservers
3. Si domaine acheté ailleurs (GoDaddy, Namecheap):
   - Option A: Changer nameservers vers Vercel
   - Option B: Configurer DNS chez registrar (pas Vercel)
```

### Problème 3: "Mes records n'apparaissent pas"

**Solutions:**
```
1. Attendre 10-30 min (propagation DNS)
2. Vider cache DNS navigateur (Ctrl+Maj+R)
3. Vérifier avec dnschecker.org
4. Essayer en navigation privée
```

### Problème 4: "Record déjà existant"

**Solutions:**
```
1. Supprimer l'ancien record d'abord
2. Puis ajouter le nouveau
3. Exemple: Supprimer anciens MX avant ajouter MX Zoho
```

---

## 📋 Checklist Configuration DNS pour Emails

Pour Zoho Mail (exemple):

```
[ ] Connecté sur Vercel ✅
[ ] Projet trouvé ✅
[ ] Settings → Domains → id0c.com ✅
[ ] DNS Records accessible ✅

Records à ajouter:

[ ] TXT  | @ | zoho-verification=...
[ ] MX   | @ | mx.zoho.com (Priority: 10)
[ ] MX   | @ | mx2.zoho.com (Priority: 20)
[ ] TXT  | @ | v=spf1 include:zoho.com ~all
[ ] TXT  | zoho._domainkey | [valeur DKIM]

[ ] Attendre 15-30 min (propagation)
[ ] Vérifier avec dnschecker.org
[ ] Vérifier dans Zoho Admin Console
[ ] Status "Verified" ✅
```

---

## 🎯 Chemins Directs Vercel

**Dashboard:**
```
https://vercel.com/dashboard
```

**Projets:**
```
https://vercel.com/dashboard
→ Liste de tous vos projets
```

**Settings d'un projet:**
```
https://vercel.com/[votre-username]/[nom-projet]/settings
```

**Domaines d'un projet:**
```
https://vercel.com/[votre-username]/[nom-projet]/settings/domains
```

---

## 📞 Support Vercel

**Documentation:**
```
https://vercel.com/docs

Section DNS:
https://vercel.com/docs/projects/domains/working-with-domains
```

**Support:**
```
Email: support@vercel.com
Chat: Dans dashboard Vercel (icône en bas à droite)
```

---

## 🎉 Vous êtes Prêt!

Maintenant vous savez:

```
✅ Se connecter à Vercel
✅ Trouver votre projet
✅ Accéder à la configuration DNS
✅ Ajouter des records DNS
✅ Vérifier la propagation
✅ Résoudre problèmes courants
```

**Prochaine étape:**

Retourner dans `GUIDE_BOITES_EMAIL_PROFESSIONNELLES.md` et suivre les instructions pour ajouter les records DNS fournis par Zoho (ou autre service choisi).

**Flux complet:**
```
1. Créer compte Zoho Mail
2. Ajouter domaine id0c.com dans Zoho
3. Zoho fournit records DNS
4. SE CONNECTER VERCEL (ce guide) ✅
5. Ajouter records DNS dans Vercel
6. Attendre propagation
7. Vérifier dans Zoho → Status "Verified"
8. Créer boîtes email
9. Tester envoi/réception
10. ✅ Emails opérationnels!
```

---

## 📸 Guide Visuel (Navigation Vercel)

```
┌─────────────────────────────────────┐
│  VERCEL.COM                    Login│  ← 1. Cliquer Login
└─────────────────────────────────────┘

         ↓ Se connecter

┌─────────────────────────────────────┐
│  Dashboard                          │
│                                     │
│  Your Projects:                     │
│  ┌───────────────┐                 │
│  │ iDoc Project  │  ← 2. Cliquer   │
│  └───────────────┘                 │
│  ┌───────────────┐                 │
│  │ Other Project │                 │
│  └───────────────┘                 │
└─────────────────────────────────────┘

         ↓ Dans le projet

┌─────────────────────────────────────┐
│  iDoc Project                       │
│  [Overview] [Deployments] [Settings]│
│                            ↑        │
│                    3. Cliquer       │
└─────────────────────────────────────┘

         ↓ Dans Settings

┌─────────────────────────────────────┐
│  Settings                           │
│  ┌──────────┐                      │
│  │ General  │                      │
│  │ Domains  │  ← 4. Cliquer        │
│  │ Env Vars │                      │
│  │ Functions│                      │
│  └──────────┘                      │
└─────────────────────────────────────┘

         ↓ Dans Domains

┌─────────────────────────────────────┐
│  Domains                            │
│                                     │
│  id0c.com  [Configure]  ← 5. Cliquer│
│  project.vercel.app                 │
└─────────────────────────────────────┘

         ↓ Configuration Domaine

┌─────────────────────────────────────┐
│  Domain: id0c.com                   │
│                                     │
│  DNS Records:        [Add Record]   │
│  ┌─────────────────────────────┐   │
│  │ Type │ Name │ Value │ TTL   │   │
│  │ A    │ @    │ 1.2.3 │ 3600  │   │
│  │ TXT  │ @    │ ...   │ 3600  │   │
│  └─────────────────────────────┘   │
│            ↑                        │
│    6. Ajouter vos records ici       │
└─────────────────────────────────────┘
```

---

**Temps total: 5 minutes**

**Vous êtes maintenant prêt à configurer vos emails! 🚀**
