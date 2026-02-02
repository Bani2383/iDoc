# 🔧 Correction ERR_NAME_NOT_RESOLVED - Supabase sur Vercel

## 🎯 Résumé du problème

Le site **https://id0c.com** fonctionne mais toutes les requêtes Supabase échouent avec :
```
net::ERR_NAME_NOT_RESOLVED
```

**Cause :** Les variables d'environnement Vercel ne sont pas correctement configurées.

## ✅ Ce qui a été corrigé dans le code

### 1. Validation améliorée (`src/lib/supabase.ts`)

Le client Supabase vérifie maintenant :
- ✅ Présence de `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- ✅ Format valide de l'URL (doit contenir `.supabase.co`)
- ✅ Affiche des messages d'erreur clairs dans la console

Messages console :
```javascript
✅ Supabase configuré : https://ffujpjaaramwhtmzqhlx.supabase.co
```

En cas d'erreur :
```
❌ Configuration Supabase manquante !
Variables attendues :
- VITE_SUPABASE_URL: ✗ MANQUANT
- VITE_SUPABASE_ANON_KEY: ✗ MANQUANT
```

### 2. Diagnostic visuel amélioré (`src/components/SupabaseDiagnostic.tsx`)

Un modal s'affiche automatiquement en cas d'erreur avec :
- ✅ État de chaque variable
- ✅ Format de l'URL
- ✅ Test de résolution DNS
- ✅ Test de connexion
- ✅ Instructions de correction détaillées

### 3. Fichier .env local corrigé

```bash
VITE_SUPABASE_URL=https://ffujpjaaramwhtmzqhlx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Action requise : Configuration Vercel

### Étape 1 : Connexion Vercel

1. Allez sur **https://vercel.com**
2. Connectez-vous
3. Ouvrez le projet **id0c**

### Étape 2 : Accéder aux variables

1. Cliquez sur **Settings**
2. Dans le menu de gauche, cliquez sur **Environment Variables**

### Étape 3 : Ajouter/Modifier les variables

Ajoutez ces 2 variables (ou modifiez-les si elles existent) :

#### Variable 1 : VITE_SUPABASE_URL

```
Nom : VITE_SUPABASE_URL
Valeur : https://ffujpjaaramwhtmzqhlx.supabase.co
Environnements : Production, Preview, Development (cochez les 3)
```

#### Variable 2 : VITE_SUPABASE_ANON_KEY

```
Nom : VITE_SUPABASE_ANON_KEY
Valeur : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExMTMzMDcsImV4cCI6MjA0NjY4OTMwN30.Lp-xJGVWG6yI0-Dq66eOxfqW6qyqTOJoqzw5lE_ggaE
Environnements : Production, Preview, Development (cochez les 3)
```

### Étape 4 : Supprimer les variables incorrectes

Si ces variables existent, **supprimez-les** :
- ❌ `URL_SUPABASE`
- ❌ `SUPABASE_URL` (sans VITE_)
- ❌ `URL_SUPABASE_VITE`
- ❌ `VITE_URL_SUPABASE`

**Important :** Seules `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` doivent exister.

### Étape 5 : Redéployer

1. Allez dans l'onglet **Deployments**
2. Trouvez le dernier déploiement
3. Cliquez sur `⋯` (trois points) → **Redeploy**
4. Confirmez le redéploiement

### Étape 6 : Vérifier

Une fois le déploiement terminé (1-2 minutes) :

1. Ouvrez **https://id0c.com**
2. Ouvrez Chrome DevTools : `F12`
3. Allez dans l'onglet **Console**
4. Vous devriez voir :
   ```
   ✅ Supabase configuré : https://ffujpjaaramwhtmzqhlx.supabase.co
   ```
5. Aucune erreur `ERR_NAME_NOT_RESOLVED`
6. Les templates devraient se charger

## 🔍 Diagnostic en cas de problème

Si l'erreur persiste :

### Dans Chrome DevTools (F12)

1. **Console** : Cherchez les messages Supabase
2. **Network** : Filtrez par "supabase" et vérifiez les requêtes
3. Notez l'URL exacte des requêtes qui échouent

### Vérifications

1. Les variables commencent-elles par `VITE_` ?
2. L'URL est-elle exactement `https://ffujpjaaramwhtmzqhlx.supabase.co` ?
3. Avez-vous coché tous les environnements (Production, Preview, Development) ?
4. Avez-vous redéployé après avoir modifié les variables ?

## 📝 Pourquoi "VITE_" est obligatoire ?

Vite (l'outil de build) expose uniquement les variables qui commencent par `VITE_` au code client (navigateur).

```javascript
// ✅ Fonctionne
import.meta.env.VITE_SUPABASE_URL

// ❌ Ne fonctionne PAS
import.meta.env.SUPABASE_URL
```

## 🎯 Résultat attendu

Après configuration correcte :

- ✅ `https://id0c.com` se charge complètement
- ✅ Aucune erreur DNS dans la console
- ✅ Login/Register fonctionnent
- ✅ Templates se chargent
- ✅ Reset password fonctionne
- ✅ Toutes les requêtes Supabase passent

## 📞 Support

Si le problème persiste après ces étapes :

1. Vérifiez les logs Vercel (onglet Deployments → logs)
2. Envoyez une capture d'écran de :
   - Chrome DevTools → Console (avec les erreurs)
   - Chrome DevTools → Network (filtré sur "supabase")
   - Vercel → Settings → Environment Variables

## 📚 Fichiers modifiés

- ✅ `src/lib/supabase.ts` - Validation améliorée
- ✅ `src/components/SupabaseDiagnostic.tsx` - Diagnostic visuel
- ✅ `.env` - URL corrigée localement
- ✅ `VERCEL_ENV_CHECKLIST.md` - Guide de configuration
