# ✅ Checklist Variables Vercel - id0c.com

## Problème actuel
Le site https://id0c.com affiche `ERR_NAME_NOT_RESOLVED` car les variables d'environnement Supabase ne sont pas correctement configurées dans Vercel.

## Solution en 3 étapes

### 1️⃣ Connexion à Vercel
1. Allez sur https://vercel.com
2. Connectez-vous avec votre compte
3. Sélectionnez le projet **id0c**

### 2️⃣ Configuration des variables
1. Cliquez sur **Settings** (dans le menu du projet)
2. Cliquez sur **Environment Variables** (menu de gauche)
3. Ajoutez ou modifiez ces 2 variables :

```
VITE_SUPABASE_URL
https://ffujpjaaramwhtmzqhlx.supabase.co
```

```
VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExMTMzMDcsImV4cCI6MjA0NjY4OTMwN30.Lp-xJGVWG6yI0-Dq66eOxfqW6qyqTOJoqzw5lE_ggaE
```

**Important :**
- Les noms doivent être EXACTEMENT `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- Le préfixe `VITE_` est obligatoire pour que Vite expose ces variables au client
- Configurez pour tous les environnements (Production, Preview, Development)

### 3️⃣ Redéploiement
1. Allez dans l'onglet **Deployments**
2. Trouvez le dernier déploiement
3. Cliquez sur les 3 points `...` → **Redeploy**
4. Cochez **Use existing build cache** (optionnel)
5. Cliquez sur **Redeploy**

## Vérification

Une fois le déploiement terminé :

1. Ouvrez https://id0c.com
2. Ouvrez Chrome DevTools (F12)
3. Allez dans l'onglet Console
4. Vous devriez voir : `✅ Supabase configuré : https://ffujpjaaramwhtmzqhlx.supabase.co`
5. Si vous voyez toujours des erreurs, actualisez avec Ctrl+Shift+R (vider le cache)

## Variables à NE PAS utiliser

Ces variables sont INCORRECTES et doivent être ignorées ou supprimées :

- ❌ `URL_SUPABASE`
- ❌ `SUPABASE_URL` (sans VITE_)
- ❌ `URL_SUPABASE_VITE`
- ❌ `SUPABASE_SECRET_KEY`
- ❌ `SERVICE_ROLE_KEY` (ne doit jamais être exposée côté client)

## Où trouver ces valeurs

Si vous avez perdu les valeurs :

1. Connectez-vous sur https://supabase.com
2. Sélectionnez votre projet **ffujpjaaramwhtmzqhlx**
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → VITE_SUPABASE_URL
   - **anon public** key → VITE_SUPABASE_ANON_KEY

## Résultat attendu

Après cette configuration :
- ✅ Plus d'erreur DNS
- ✅ Requêtes Supabase fonctionnent
- ✅ Login/Register/Reset password fonctionnent
- ✅ Templates se chargent correctement

## Support

Si le problème persiste après ces étapes :
1. Vérifiez les logs de déploiement Vercel
2. Vérifiez la console du navigateur (F12)
3. Contactez le support en fournissant les logs exacts
