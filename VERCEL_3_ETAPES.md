# 🚀 Configurer Supabase sur Vercel - 3 étapes

## ⚡ Étape 1 : Copier les variables

Copiez ces 2 lignes exactement :

```
VITE_SUPABASE_URL
https://jgadstuimnblhykfaxsv.supabase.co
```

```
VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRzdHVpbW5ibGh5a2ZheHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwOTQ1MzUsImV4cCI6MjA4MzY3MDUzNX0.j0Lh_22v2gVMPa0Amkt7hyIYorFUE3un0iX-LY1S4Fs
```

## 📝 Étape 2 : Ajouter dans Vercel

1. Allez sur : **https://vercel.com/dashboard**
2. Cliquez sur votre projet **id0c**
3. Cliquez sur **Settings** (en haut)
4. Cliquez sur **Environment Variables** (menu de gauche)

### Ajouter la première variable :

- **Key** : `VITE_SUPABASE_URL`
- **Value** : `https://jgadstuimnblhykfaxsv.supabase.co`
- **Environments** : Cochez `Production`, `Preview`, `Development`
- Cliquez **Save**

### Ajouter la deuxième variable :

- **Key** : `VITE_SUPABASE_ANON_KEY`
- **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRzdHVpbW5ibGh5a2ZheHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwOTQ1MzUsImV4cCI6MjA4MzY3MDUzNX0.j0Lh_22v2gVMPa0Amkt7hyIYorFUE3un0iX-LY1S4Fs`
- **Environments** : Cochez `Production`, `Preview`, `Development`
- Cliquez **Save**

## 🔄 Étape 3 : Redéployer

1. Cliquez sur **Deployments** (en haut)
2. Sur le dernier déploiement, cliquez sur `⋯` (trois points)
3. Cliquez **Redeploy**
4. Attendez 1-2 minutes

## ✅ Vérification

Ouvrez https://id0c.com et appuyez sur `F12` :

Dans la **Console**, vous devriez voir :
```
✅ Supabase configuré : https://jgadstuimnblhykfaxsv.supabase.co
```

## ❌ Si ça ne fonctionne toujours pas

Vérifiez que vous avez bien :
- ✅ Utilisé exactement `VITE_SUPABASE_URL` (pas `URL_SUPABASE` ou autre)
- ✅ Coché les 3 environnements (Production, Preview, Development)
- ✅ Redéployé après avoir ajouté les variables
- ✅ Attendu que le déploiement soit terminé

## 📸 Capture d'écran Vercel

Votre page Environment Variables devrait ressembler à ça :

```
Variable Name               | Value                           | Environments
---------------------------|----------------------------------|-------------
VITE_SUPABASE_URL          | https://jgadstuimnblh...        | Prod, Prev, Dev
VITE_SUPABASE_ANON_KEY     | eyJhbGciOiJIUzI1NiIsIn...       | Prod, Prev, Dev
```

**Important** : Si d'autres variables Supabase existent (comme `URL_SUPABASE`, `SUPABASE_URL`, etc.), supprimez-les. Seules ces 2 variables doivent exister.
