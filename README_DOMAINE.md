# 🌐 Connexion Domaine id0c.com

## Problème
Impossible de connecter id0c.com au projet.

## Solution Express (10 minutes)

👉 **Suivez ce guide** : [`FIX_DOMAINE_MAINTENANT.md`](./FIX_DOMAINE_MAINTENANT.md)

---

## Guides Disponibles

### 🔥 Pour agir immédiatement
**[`FIX_DOMAINE_MAINTENANT.md`](./FIX_DOMAINE_MAINTENANT.md)**
- Solution en 10 minutes
- Étapes numérotées claires
- La solution la plus probable pour votre cas

### 🎯 Pour identifier votre situation
**[`AIDE_DOMAINE_3_QUESTIONS.md`](./AIDE_DOMAINE_3_QUESTIONS.md)**
- 3 questions simples
- Solutions par scénario
- Guide interactif

### 🚀 Diagnostic automatique
**[`COMMENCER_ICI_DOMAINE.md`](./COMMENCER_ICI_DOMAINE.md)**
- Script de diagnostic inclus
- Identification automatique du problème
- Solution personnalisée

### 📚 Guide complet
**[`CONNEXION_DOMAINE_SOLUTION_RAPIDE.md`](./CONNEXION_DOMAINE_SOLUTION_RAPIDE.md)**
- Tous les scénarios possibles
- Dépannage détaillé
- Explications approfondies

### 📖 Si domaine chez Netlify
**[`SITUATION_DOMAINE_NETLIFY.md`](./SITUATION_DOMAINE_NETLIFY.md)**
- Spécifique à Netlify
- 3 options détaillées
- Migration possible

---

## Diagnostic Automatique

```bash
# Exécutez ce script
./scripts/diagnostic-domaine.sh
```

**Il vous dira** :
- Où est votre domaine
- Où il pointe actuellement
- Quoi faire exactement

---

## TL;DR - Solution Ultra-Rapide

### Cas probable : Domaine Netlify + Projet Vercel

```bash
# 1. Déployer sur Vercel
vercel --prod

# 2. Ajouter domaine dans Vercel
# https://vercel.com/dashboard → Project → Settings → Domains
# Add: id0c.com et www.id0c.com

# 3. Configurer DNS sur Netlify
# https://app.netlify.com → Domains → id0c.com → DNS
# A record: @ → 76.76.21.21
# CNAME: www → cname.vercel-dns.com

# 4. Attendre 10 minutes
# Tester: https://id0c.com
```

**Temps total : 15 minutes**

---

## Besoin d'Aide ?

### Option 1 : Diagnostic automatique
```bash
./scripts/diagnostic-domaine.sh
```

### Option 2 : Répondez à ces 3 questions

1. **Où est id0c.com ?**
   - Netlify ?
   - Name.com ?
   - Je ne sais pas ?

2. **Le projet est déployé ?**
   - Oui, sur Vercel
   - Oui, sur Netlify
   - Non, pas encore

3. **Quelle erreur ?**
   - "Invalid Configuration"
   - "ERR_NAME_NOT_RESOLVED"
   - Autre

**Avec ces infos, je vous donne la solution exacte.**

---

## Alternative Temporaire

**Besoin du site EN LIGNE tout de suite ?**

Utilisez l'URL Vercel temporaire :
```
https://votre-projet.vercel.app
```

Vous pourrez configurer id0c.com plus tard sans interruption.

---

## Après la Connexion

Une fois id0c.com fonctionnel :

1. ✅ Configurer OAuth → `GUIDE_RAPIDE_OAUTH.md`
2. ✅ Mettre à jour Supabase URLs
3. ✅ Tester toutes les fonctionnalités
4. ✅ Activer analytics

---

## Structure des Guides

```
README_DOMAINE.md (vous êtes ici)
│
├─→ FIX_DOMAINE_MAINTENANT.md
│   └─ Solution en 10 min (recommandé)
│
├─→ AIDE_DOMAINE_3_QUESTIONS.md
│   └─ Guide interactif
│
├─→ COMMENCER_ICI_DOMAINE.md
│   └─ Avec diagnostic automatique
│
├─→ CONNEXION_DOMAINE_SOLUTION_RAPIDE.md
│   └─ Guide complet détaillé
│
└─→ SITUATION_DOMAINE_NETLIFY.md
    └─ Spécifique Netlify
```

---

## Commencez Maintenant

👉 **[`FIX_DOMAINE_MAINTENANT.md`](./FIX_DOMAINE_MAINTENANT.md)**

Temps estimé : 10-15 minutes
