# 🆘 Impossible de connecter id0c.com ? 3 Questions

## Question 1️⃣ : Où voulez-vous que le site soit hébergé ?

### A) Sur **Vercel** (recommandé pour ce projet)

**Pourquoi Vercel ?**
- Configuration automatique
- SSL gratuit
- Performance optimale
- Déploiement continu depuis GitHub

**→ Passez à l'étape "Configuration Vercel" ci-dessous**

---

### B) Sur **Netlify**

**Pourquoi Netlify ?**
- Vous avez déjà le domaine chez Netlify
- Simple à configurer
- Bon pour les sites statiques

**→ Passez à l'étape "Configuration Netlify" ci-dessous**

---

### C) **Je ne sais pas** / Pas encore décidé

**→ Recommandation : Vercel**

Ce projet est optimisé pour Vercel. Suivez "Configuration Vercel".

---

## Question 2️⃣ : Le projet est-il déjà déployé quelque part ?

### A) **Oui**, sur Vercel

```bash
# Vérifier l'URL actuelle
# Devrait être quelque chose comme : https://idoc-xyz.vercel.app
```

**→ Il suffit de connecter le domaine, voir "Connecter domaine sur Vercel"**

---

### B) **Oui**, sur Netlify

```bash
# Vérifier l'URL actuelle
# Devrait être quelque chose comme : https://idoc-xyz.netlify.app
```

**→ Il suffit de connecter le domaine, voir "Connecter domaine sur Netlify"**

---

### C) **Non**, nulle part

**→ D'abord déployer, voir "Déploiement Express"**

---

## Question 3️⃣ : Avez-vous vraiment acheté id0c.com ?

### A) **Oui**, chez Netlify

Quand vous avez créé un site sur Netlify, ils vous ont proposé d'acheter le domaine.

**Vérification** :
1. https://app.netlify.com
2. Menu "Domains" (pas Sites)
3. Cherchez "id0c.com"

**Trouvé ?** → Voir "Configuration avec domaine Netlify"
**Pas trouvé ?** → Vérifier le bon compte ou voir option B/C

---

### B) **Oui**, chez Name.com

Vous êtes allé directement sur Name.com et acheté id0c.com.

**Vérification** :
1. https://www.name.com/account/domain
2. Cherchez "id0c.com" dans la liste

**Trouvé ?** → Voir "Configuration avec domaine Name.com"
**Pas trouvé ?** → Mauvais compte ou voir option C

---

### C) **Je ne sais pas** / Pas sûr

**Tests rapides** :

#### Test 1 : Cherchez dans vos emails
```
Mots-clés à chercher :
- "id0c.com"
- "domain purchase"
- "domain registration"
- "receipt"
```

#### Test 2 : Vérifiez si le domaine existe
```
https://www.whois.com/whois/id0c.com
```

**Résultat "Available"** → Le domaine n'est pas acheté, il faut l'acheter
**Résultat avec infos** → Regardez "Registrar" pour savoir où il est

---

## 🚀 SOLUTIONS PAR SCÉNARIO

### Scénario 1 : Projet sur Vercel + Domaine chez Netlify

**Le plus courant selon vos docs**

#### Étape 1 : Connecter domaine dans Vercel (2 min)

```
1. https://vercel.com/dashboard
2. Votre projet → Settings → Domains
3. Add Domain : id0c.com
4. Add Domain : www.id0c.com
5. Noter les DNS que Vercel vous montre
```

#### Étape 2 : Configurer DNS sur Netlify (3 min)

```
1. https://app.netlify.com
2. Domains → id0c.com
3. DNS settings → DNS records

4. SUPPRIMER tout A record existant

5. AJOUTER :
   Type: A
   Name: @
   Value: 76.76.21.21

6. AJOUTER :
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

7. Save Changes
```

#### Étape 3 : Vérifier (5 min d'attente)

```
Attendre 5-10 minutes puis :

1. Vercel → Domains → Doit afficher "Valid Configuration"
2. Ouvrir : https://id0c.com
3. Ouvrir : https://www.id0c.com
```

✅ **Ça marche !**

---

### Scénario 2 : Projet sur Vercel + Domaine chez Name.com

#### Étape 1 : Connecter domaine dans Vercel (2 min)

```
1. https://vercel.com/dashboard
2. Votre projet → Settings → Domains
3. Add Domain : id0c.com
4. Add Domain : www.id0c.com
```

#### Étape 2 : Configurer DNS sur Name.com (3 min)

```
1. https://www.name.com/account/domain/details/id0c.com#dns
2. Manage DNS Records

3. AJOUTER ou MODIFIER :
   Type: A
   Host: @
   Answer: 76.76.21.21
   TTL: 300

4. AJOUTER ou MODIFIER :
   Type: CNAME
   Host: www
   Answer: cname.vercel-dns.com
   TTL: 300

5. Save
```

#### Étape 3 : Vérifier (5 min)

```
Même que Scénario 1
```

✅ **Ça marche !**

---

### Scénario 3 : Tout sur Netlify

**Le plus simple !**

```
1. https://app.netlify.com
2. Votre site iDoc
3. Domain settings
4. Add custom domain
5. Entrer : id0c.com
6. Netlify configure tout automatiquement
```

✅ **Terminé en 2 minutes !**

---

### Scénario 4 : Domaine pas encore acheté

#### Acheter sur Name.com (recommandé)

```
1. https://www.name.com
2. Search : id0c.com
3. Add to cart
4. Checkout (~10-15€/an)
5. Une fois acheté, suivre Scénario 2
```

#### OU acheter sur Netlify

```
1. https://app.netlify.com
2. Domains → Add a domain
3. id0c.com → Purchase
4. Payer (~15$/an)
5. Connecter au site (automatique)
```

---

### Scénario 5 : Projet pas encore déployé

#### Déployer sur Vercel (3 min)

```bash
# Installation CLI
npm i -g vercel

# Connexion
vercel login

# Déploiement
cd /chemin/vers/votre/projet
vercel --prod

# Suivez les prompts :
# - Link to existing project? No
# - What's your project's name? idoc
# - In which directory is your code located? ./
# - Want to override the settings? No

# Une fois déployé, suivre Scénario 1 ou 2
```

#### OU déployer sur Netlify (3 min)

```bash
# Installation CLI
npm i -g netlify-cli

# Connexion
netlify login

# Déploiement
cd /chemin/vers/votre/projet
netlify deploy --prod

# Suivez les prompts
# Puis connecter le domaine (automatique si domaine chez Netlify)
```

---

## 🔍 Diagnostic Automatique

**Vous avez accès au terminal ?**

```bash
# Exécutez ce script
./scripts/diagnostic-domaine.sh

# Il identifie automatiquement :
# - Où pointe le domaine
# - Qui gère le DNS
# - Si HTTPS fonctionne
# - La solution exacte à appliquer
```

---

## ⚡ Dépannage Ultra-Rapide

### "Domain not found" dans Vercel

**Cause** : Le domaine n'est pas dans votre compte

**Solution** : Vérifiez où vous l'avez acheté (Netlify, Name.com, autre)

---

### "Invalid Configuration" dans Vercel

**Cause** : DNS pas correctement configuré

**Solution** :
```bash
# Vérifier les DNS
dig id0c.com A +short
# Doit retourner : 76.76.21.21

dig www.id0c.com CNAME +short
# Doit retourner : cname.vercel-dns.com

# Si différent, reconfigurer les DNS
```

---

### Site inaccessible / ERR_NAME_NOT_RESOLVED

**Cause** : DNS pas propagé ou pas configuré

**Solutions** :
1. Attendre 5-30 minutes
2. Vider cache DNS local :
   ```bash
   # macOS
   sudo dscacheutil -flushcache

   # Windows
   ipconfig /flushdns

   # Linux
   sudo systemd-resolve --flush-caches
   ```
3. Vérifier que DNS est bien configuré (voir au-dessus)

---

### Page 404 / Site vide

**Cause** : Domaine connecté mais projet pas déployé

**Solution** :
```bash
# Redéployer
git add .
git commit -m "Deploy"
git push

# Si lié à Vercel/Netlify, déploiement automatique
# Sinon :
vercel --prod
# ou
netlify deploy --prod
```

---

## 📞 Support Direct

### Toujours bloqué ?

**Dites-moi** :

1. **Réponses aux 3 questions** :
   - Question 1 : Vercel, Netlify ou je ne sais pas ?
   - Question 2 : Projet déployé ? Où ?
   - Question 3 : Domaine acheté ? Où ?

2. **Résultats du diagnostic** :
   ```bash
   ./scripts/diagnostic-domaine.sh
   # Copiez tout le résultat
   ```

3. **Message d'erreur exact** :
   - Screenshot ou copie du message

**Avec ces infos**, je vous donne la solution exacte en 2 minutes.

---

## ✅ Ça marche ! Et après ?

### Checklist finale

- [ ] https://id0c.com fonctionne
- [ ] https://www.id0c.com fonctionne
- [ ] HTTPS activé (cadenas vert)
- [ ] Vercel/Netlify affiche "Valid"

### Prochaines étapes

1. **Configuration OAuth** → `GUIDE_RAPIDE_OAUTH.md`
2. **Tests** → Tester toutes les fonctionnalités
3. **Suivi** → Activer analytics, monitoring
4. **Marketing** → SEO, partage, promotion

---

## 🎯 TL;DR (Résumé Ultra-Court)

**Cas le plus probable pour vous** :

```
1. Projet sur Vercel
2. Domaine chez Netlify
3. Solution :
   - Vercel : Add domain id0c.com
   - Netlify DNS : A @ → 76.76.21.21
   - Netlify DNS : CNAME www → cname.vercel-dns.com
   - Attendre 10 minutes
   - Ça marche
```

**Temps total** : 15 minutes

---

**Vous avez juste besoin que ça marche ?** Répondez aux 3 questions et je vous donne la marche à suivre exacte.
