# 🔥 CONNECTER id0c.com MAINTENANT

> **Temps estimé : 10 minutes**

---

## 🎯 LA SOLUTION LA PLUS PROBABLE

Basé sur vos documents, voici ce qui est le plus probable :

```
✓ Domaine acheté chez Netlify
✓ Projet à déployer sur Vercel
✓ Besoin de connecter les deux
```

---

## ⚡ FAIRE EN 10 MINUTES

### ÉTAPE 1 : Déployer sur Vercel (3 min)

**Si pas encore fait :**

```bash
# Terminal
npm i -g vercel
vercel login
cd /tmp/cc-agent/59895567/project
vercel --prod
```

**Notez l'URL** : https://votre-projet.vercel.app

**Si déjà fait** : Passez à l'étape 2

---

### ÉTAPE 2 : Ajouter domaine dans Vercel (1 min)

```
1. https://vercel.com/dashboard
2. Cliquer sur votre projet
3. Settings → Domains
4. Taper : id0c.com
5. Cliquer Add
6. Taper : www.id0c.com
7. Cliquer Add
```

**Vercel affiche un avertissement** → Normal ! Continuez.

---

### ÉTAPE 3 : Configurer DNS sur Netlify (5 min)

#### A) Trouver id0c.com sur Netlify

```
1. https://app.netlify.com
2. Se connecter
3. Menu "Domains" (dans la sidebar)
4. Chercher "id0c.com" dans la liste
```

**Trouvé ?** Continuez ci-dessous
**Pas trouvé ?** Voir "Plan B" plus bas

---

#### B) Configurer les DNS

```
5. Cliquer sur "id0c.com"
6. Onglet "DNS settings"
7. Section "DNS records"

8. Chercher les A records existants
   → Cliquer les 3 points → Delete (pour chacun)

9. Cliquer "Add new record"
   Type: A
   Name: @ (ou id0c.com)
   Value: 76.76.21.21
   TTL: Auto
   → Save

10. Cliquer "Add new record"
    Type: CNAME
    Name: www
    Value: cname.vercel-dns.com
    TTL: Auto
    → Save
```

---

### ÉTAPE 4 : Vérifier (5-10 min d'attente)

**Attendre 5 minutes**, puis :

```
1. Retourner sur Vercel → Settings → Domains
2. Status doit être "Valid Configuration" (peut prendre jusqu'à 10 min)
3. Ouvrir : https://id0c.com
4. Ouvrir : https://www.id0c.com
```

**✅ Ça marche ? BRAVO ! Vous avez terminé.**

**❌ Ça ne marche pas ? Voir "Dépannage" ci-dessous**

---

## 🆘 PLAN B : id0c.com pas trouvé sur Netlify

### Possibilité 1 : Mauvais compte Netlify

```
1. Cherchez dans vos emails "netlify.com"
2. Identifiez quel email a été utilisé
3. Déconnectez-vous de Netlify
4. Reconnectez-vous avec le bon email
5. Retournez à Étape 3
```

---

### Possibilité 2 : Domaine chez Name.com (pas Netlify)

```
1. https://www.name.com/account/domain
2. Vérifier si id0c.com est là

Si OUI :
  3. Cliquer sur id0c.com
  4. Manage → DNS Records
  5. Ajouter :
     Type: A
     Host: @
     Answer: 76.76.21.21

  6. Ajouter :
     Type: CNAME
     Host: www
     Answer: cname.vercel-dns.com

  7. Save
  8. Retourner à Étape 4

Si NON : Possibilité 3
```

---

### Possibilité 3 : Domaine jamais acheté

```
Vérifier sur : https://www.whois.com/whois/id0c.com
```

**Si "Available"** → Le domaine est libre !

**Achetez-le maintenant** :
```
1. https://www.name.com
2. Rechercher : id0c.com
3. Add to cart → Checkout (~12€/an)
4. Une fois acheté, suivre Possibilité 2 ci-dessus
```

---

## 🔧 DÉPANNAGE EXPRESS

### Erreur : "Invalid Configuration" dans Vercel

**Vérifiez les DNS** :

```bash
dig id0c.com A +short
# DOIT retourner : 76.76.21.21

dig www.id0c.com CNAME +short
# DOIT retourner : cname.vercel-dns.com
```

**Si différent** :
- Retournez à Étape 3
- Vérifiez que vous avez bien saisi les valeurs
- Supprimez les anciens records qui pointent ailleurs

---

### Le site ne charge pas

**Causes possibles** :

1. **DNS pas propagé** → Attendre 30 min max
2. **Cache DNS** → Vider cache :
   ```bash
   # macOS
   sudo dscacheutil -flushcache

   # Windows
   ipconfig /flushdns
   ```
3. **Projet pas déployé** :
   ```bash
   vercel --prod
   ```

---

### "ERR_NAME_NOT_RESOLVED"

**Cause** : DNS pas configuré ou propagation en cours

**Solutions** :
1. Attendre 10-30 minutes
2. Vérifier DNS (commandes ci-dessus)
3. Essayer en navigation privée

---

### Page 404

**Cause** : Domaine connecté mais route incorrecte

**Solution** :
```bash
# Redéployer
git add .
git commit -m "Fix routing"
git push
vercel --prod
```

---

## 📊 DIAGNOSTIC AUTOMATIQUE

**Vous préférez un diagnostic auto ?**

```bash
./scripts/diagnostic-domaine.sh
```

Ce script vous dit **exactement** :
- Où est votre domaine
- Où il pointe
- Ce qu'il faut corriger

---

## 🎯 SOLUTION TEMPORAIRE

**Besoin du site EN LIGNE IMMÉDIATEMENT ?**

Utilisez votre URL Vercel :

```
https://votre-projet.vercel.app
```

**Avantages** :
- Fonctionne tout de suite
- HTTPS automatique
- Vous pouvez configurer id0c.com plus tard
- Cette URL reste active même après

**Vous pouvez** :
- Partager aux clients
- Configurer OAuth avec cette URL
- Tester toutes les fonctionnalités
- Prendre votre temps pour configurer le domaine

---

## ✅ CHECKLIST DE SUCCÈS

Quand tout fonctionne :

- [ ] https://id0c.com → Affiche votre site
- [ ] https://www.id0c.com → Redirige vers id0c.com
- [ ] Cadenas vert (HTTPS)
- [ ] Vercel Domains : "Valid Configuration"
- [ ] Pas d'erreur SSL

**Tous cochés ? PARFAIT ! 🎉**

---

## 📞 BESOIN D'AIDE ?

### Donnez-moi ces 3 infos :

1. **Où est id0c.com ?**
   - [ ] Sur Netlify
   - [ ] Sur Name.com
   - [ ] Je ne le trouve nulle part
   - [ ] Je ne sais pas

2. **Le projet est déployé ?**
   - [ ] Oui sur Vercel : https://_____.vercel.app
   - [ ] Oui sur Netlify : https://_____.netlify.app
   - [ ] Non, pas encore déployé

3. **Quelle erreur exacte ?**
   - [ ] "Invalid Configuration"
   - [ ] "ERR_NAME_NOT_RESOLVED"
   - [ ] Page 404
   - [ ] Autre : ________________

**Avec ces 3 réponses, je vous débloque en 2 minutes.**

---

## 🚀 APRÈS LA CONNEXION

Une fois que id0c.com fonctionne :

### 1. Configurer OAuth (30 min)
`GUIDE_RAPIDE_OAUTH.md`

### 2. Configurer Supabase Auth URLs
```
Supabase Dashboard → Authentication → URL Configuration
Site URL: https://id0c.com
Redirect URLs:
- https://id0c.com
- https://id0c.com/auth/callback
```

### 3. Tester tout
- Inscription
- Connexion
- Mot de passe oublié
- Génération de documents
- Paiements (si configuré)

---

## 📚 GUIDES COMPLETS

Si vous voulez tout comprendre en détail :

- **`COMMENCER_ICI_DOMAINE.md`** - Guide avec diagnostic auto
- **`AIDE_DOMAINE_3_QUESTIONS.md`** - Guide interactif
- **`CONNEXION_DOMAINE_SOLUTION_RAPIDE.md`** - Tous les scénarios
- **`SITUATION_DOMAINE_NETLIFY.md`** - Spécifique Netlify

---

## ⏱️ RÉCAP TIMING

| Étape | Temps | Statut |
|-------|-------|--------|
| Déployer sur Vercel | 3 min | ___ |
| Ajouter domaine Vercel | 1 min | ___ |
| Configurer DNS | 5 min | ___ |
| Attente propagation | 5-10 min | ___ |
| **TOTAL** | **15-20 min** | ___ |

---

**C'est parti ! Commencez par l'Étape 1 ci-dessus. 🚀**
