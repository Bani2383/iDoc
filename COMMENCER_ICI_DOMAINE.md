# 🚀 Impossible de connecter id0c.com ? COMMENCEZ ICI

## Diagnostic en 30 secondes

### Étape 1 : Exécutez ce script

```bash
./scripts/diagnostic-domaine.sh
```

Ce script va **automatiquement** :
- ✅ Vérifier où pointe votre domaine
- ✅ Identifier qui gère le DNS
- ✅ Tester si le site est accessible
- ✅ Vous donner la solution exacte

---

## Pas d'accès au terminal ? 3 questions

### Question 1 : Où avez-vous déployé votre projet ?

**A) Sur Vercel**
→ Allez à la section "Solution Vercel" ci-dessous

**B) Sur Netlify**
→ Allez à la section "Solution Netlify" ci-dessous

**C) Nulle part encore / Je ne sais pas**
→ Allez à la section "Pas encore déployé" ci-dessous

---

### Question 2 : Où avez-vous acheté id0c.com ?

**A) Chez Netlify** (quand vous avez créé un site)
→ Votre DNS est géré par Netlify

**B) Chez Name.com** (directement sur name.com)
→ Votre DNS est géré par Name.com

**C) Je ne sais pas / Je ne me souviens plus**
→ Vérifiez vos emails avec les mots "domain purchase", "id0c.com", "registration"

---

### Question 3 : Quel message d'erreur voyez-vous ?

**A) "This site can't be reached" / ERR_NAME_NOT_RESOLVED**
→ DNS pas configuré ou propagation en cours

**B) "404 Not Found"**
→ DNS OK mais site pas déployé ou mal configuré

**C) "SSL_ERROR" / "Your connection is not secure"**
→ Certificat SSL en cours de génération

**D) Le site affiche autre chose que mon projet**
→ DNS pointe vers un ancien site

**E) Autre / Pas d'erreur mais rien ne se passe**
→ Décrivez le comportement exact

---

## ⚡ SOLUTIONS RAPIDES

### Solution Vercel (projet déployé sur Vercel)

#### 1. Ajouter le domaine dans Vercel (2 min)

```
1. https://vercel.com/dashboard
2. Cliquer sur votre projet
3. Settings → Domains
4. Ajouter: id0c.com
5. Ajouter: www.id0c.com
```

Vercel va vous montrer les DNS à configurer.

#### 2. Configurer DNS (selon où est le domaine)

**Si domaine chez Netlify** :
```
1. https://app.netlify.com → Domains
2. Trouver id0c.com → DNS settings
3. Ajouter A record: @ → 76.76.21.21
4. Ajouter CNAME: www → cname.vercel-dns.com
```

**Si domaine chez Name.com** :
```
1. https://www.name.com → My Domains
2. id0c.com → Manage → DNS Records
3. Ajouter A record: @ → 76.76.21.21
4. Ajouter CNAME: www → cname.vercel-dns.com
```

#### 3. Attendre 5-10 minutes

```
→ Retourner sur Vercel → Domains
→ Status doit passer à "Valid Configuration"
→ Tester: https://id0c.com
```

✅ **Terminé !**

---

### Solution Netlify (projet déployé sur Netlify)

#### Super simple !

```
1. https://app.netlify.com
2. Votre site iDoc
3. Domain settings
4. Add custom domain
5. Taper: id0c.com
6. Netlify configure tout automatiquement
```

✅ **Terminé !**

---

### Pas encore déployé

#### Option 1 : Déployer sur Vercel (recommandé)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel --prod

# 4. Suivre "Solution Vercel" ci-dessus pour connecter le domaine
```

#### Option 2 : Déployer sur Netlify

```bash
# 1. Installer Netlify CLI
npm i -g netlify-cli

# 2. Se connecter
netlify login

# 3. Déployer
netlify deploy --prod

# 4. Connecter le domaine (automatique si domaine déjà chez Netlify)
```

---

## 🔧 Dépannages Express

### "Je ne trouve pas id0c.com dans mon compte"

**Vérifiez partout** :

1. **Netlify** : https://app.netlify.com → Menu "Domains"
2. **Name.com** : https://www.name.com/account → My Domains
3. **Vercel** : https://vercel.com/dashboard → Domains
4. **Vos emails** : Cherchez "id0c.com" dans votre boîte mail

Si toujours pas trouvé :
- Soit vous avez utilisé un autre compte
- Soit quelqu'un d'autre a enregistré le domaine
- Soit le domaine n'a jamais été acheté

**Test rapide** :
```
https://www.whois.com/whois/id0c.com
```

Si "Available" → Le domaine est libre, personne ne l'a acheté
Si "Registered" → Regarder qui est le registrar et l'organisation

---

### "Invalid Configuration" dans Vercel

**Causes possibles** :

1. **DNS pas encore propagé**
   → Attendre 5-30 minutes

2. **Mauvais DNS records**
   → Vérifier que vous avez bien mis :
   - A record: @ → 76.76.21.21
   - CNAME: www → cname.vercel-dns.com

3. **Domaine déjà utilisé ailleurs**
   → Vérifier qu'aucun autre projet ne l'utilise

**Solution** :
```bash
# Vérifier les DNS actuels
dig id0c.com A +short
# Devrait retourner: 76.76.21.21

dig www.id0c.com CNAME +short
# Devrait retourner: cname.vercel-dns.com
```

---

### Le site affiche une page blanche / erreur 404

**Cause** : Domaine connecté mais projet pas déployé ou route incorrecte

**Solution** :
```bash
# Redéployer
git push

# Ou avec Vercel CLI
vercel --prod

# Ou avec Netlify CLI
netlify deploy --prod
```

---

### "ERR_TOO_MANY_REDIRECTS"

**Cause** : Boucle de redirection (HTTP → HTTPS → HTTP...)

**Solution Vercel** :
```
1. Settings → Domains
2. Pour chaque domaine, vérifier "Redirect to HTTPS"
3. Retirer les redirections en double
```

**Solution Netlify** :
```
1. Site settings → Domain management
2. HTTPS → Force HTTPS (activer)
3. Vérifier pas de règles de redirect en conflit
```

---

## 📞 Support Express

### Si toujours bloqué après 15 minutes

**Donnez-moi ces infos** :

```bash
# Exécutez et copiez les résultats :
./scripts/diagnostic-domaine.sh

# OU manuellement :
dig id0c.com A +short
dig id0c.com NS +short
curl -I https://id0c.com
```

**+ répondez à** :
1. Où est déployé votre projet ? (Vercel, Netlify, nulle part)
2. Où avez-vous acheté id0c.com ? (Netlify, Name.com, je ne sais pas)
3. Quelle erreur exacte voyez-vous ?

Avec ces infos, je peux vous débloquer en 2 minutes.

---

## ✅ Checklist Finale

Quand tout fonctionne, vous devez avoir :

- [ ] https://id0c.com → Affiche votre site iDoc
- [ ] https://www.id0c.com → Redirige vers id0c.com
- [ ] Cadenas vert (HTTPS sécurisé)
- [ ] Vercel Domains montre "Valid Configuration"
- [ ] Pas de message d'erreur

**Si tous les points sont cochés : BRAVO ! 🎉**

Passez à la suite : Configuration OAuth, SEO, etc.

---

## 🎯 Raccourci Temporaire

**Besoin du site en ligne TOUT DE SUITE ?**

Utilisez votre URL Vercel temporaire :

```
https://votre-projet.vercel.app
```

Vous pouvez :
- Partager cette URL immédiatement
- Configurer OAuth avec cette URL
- Tester toutes les fonctionnalités
- Connecter id0c.com plus tard sans interruption

**Avantages** :
- Fonctionne en 30 secondes
- HTTPS automatique
- Pas de configuration
- Vous gardez cette URL même après avoir connecté id0c.com

---

## 📚 Guides Détaillés

Si vous avez le temps et voulez tout comprendre :

- **`CONNEXION_DOMAINE_SOLUTION_RAPIDE.md`** - Guide complet avec tous les scénarios
- **`SITUATION_DOMAINE_NETLIFY.md`** - Spécifique si domaine chez Netlify
- **`scripts/diagnostic-domaine.sh`** - Script automatique de diagnostic

Mais pour 90% des cas, ce guide suffit !

---

**Question ?** Dites-moi à quelle étape vous êtes bloqué et je vous aide.
