# Supabase - Guide de Dépannage Rapide

## 🚨 Erreur Actuelle

Votre site https://id0c.com affiche :
```
net::ERR_NAME_NOT_RESOLVED
```

## ✅ Solution en 5 Minutes

### Étape 1 : Ouvrir Vercel
```
https://vercel.com/dashboard
```

### Étape 2 : Ajouter les Variables

Dans **Settings → Environment Variables**, ajoutez :

**Variable 1 :**
```
Name: VITE_SUPABASE_URL
Value: https://jgadstuimnblhykfaxsv.supabase.co
Environments: ☑ Production ☑ Preview ☑ Development
```

**Variable 2 :**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRzdHVpbW5ibGh5a2ZheHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwOTQ1MzUsImV4cCI6MjA4MzY3MDUzNX0.j0Lh_22v2gVMPa0Amkt7hyIYorFUE3un0iX-LY1S4Fs
Environments: ☑ Production ☑ Preview ☑ Development
```

### Étape 3 : Redéployer
```
Deployments → ... (trois points) → Redeploy
```

### Étape 4 : Vérifier
```
1. Attendez 1-2 minutes
2. Ouvrez https://id0c.com
3. F12 → Console
4. Vous devriez voir : "✅ Supabase configuré"
```

## 🔍 Page de Diagnostic

Pour tester la connexion Supabase :
```
https://id0c.com/debug/supabase
```

Cette page affiche :
- ✅ État de configuration
- ✅ Test de ping automatique
- ✅ Suggestions de correction
- ✅ Rapport exportable

## 🛠️ Commandes de Dépannage

### Vérifier les variables dans Chrome DevTools
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

Si `undefined`, les variables ne sont pas configurées ou pas redéployées.

### Tester l'URL Supabase directement
```
https://jgadstuimnblhykfaxsv.supabase.co/rest/v1/
```

Devrait retourner HTTP 200 ou 401 (c'est normal).

## ⚠️ Erreurs Courantes

### "Access Denied" sur /debug/supabase
**Solution :** Ajoutez `VITE_ENABLE_DEBUG=true` dans Vercel et redéployez.

### Variables ajoutées mais toujours en erreur
**Solution :** Avez-vous redéployé ? Les variables nécessitent un redéploiement.

### L'URL ne fonctionne pas
**Vérifications :**
- ✓ Commence par `https://`
- ✓ Se termine par `.supabase.co`
- ✓ Pas d'espaces
- ✓ Nom de la variable commence par `VITE_`

## 📋 Checklist

- [ ] Variables ajoutées dans Vercel
- [ ] Les 3 environnements cochés
- [ ] Sauvegardé (Save)
- [ ] Redéployé
- [ ] Attendu 1-2 minutes
- [ ] Testé https://id0c.com
- [ ] Vérifié Console Chrome (F12)
- [ ] Test ping sur /debug/supabase

## 📞 Fichiers de Support

- `vercel-config.html` - Interface graphique avec boutons de copie
- `VERCEL_3_ETAPES.md` - Guide détaillé en 3 étapes
- `SUPABASE_DIAGNOSTIC_GUIDE.md` - Guide complet du système
- `LIRE_EN_PREMIER.md` - Documentation principale

## 🎯 Résultat Attendu

Après configuration correcte, dans Chrome Console (F12) :

```javascript
✅ Supabase client initialized {
  url: "https://jgad****axsv.supabase.co",
  origin: "https://id0c.com",
  timestamp: "2026-02-02T12:00:00.000Z"
}
```

Et sur `/debug/supabase` :

```
Connection Test
✅ Connection Successful
HTTP Status: 200
Response Time: 145ms
```

## 🚀 Une Fois Corrigé

Votre site fonctionnera normalement avec :
- ✅ Authentification
- ✅ Génération de documents
- ✅ Templates
- ✅ Base de données
- ✅ Toutes les fonctionnalités iDoc

---

**Temps estimé :** 5 minutes
**Difficulté :** Facile (copier-coller)
**Résultat :** Site 100% fonctionnel
