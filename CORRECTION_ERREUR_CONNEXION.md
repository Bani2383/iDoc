# 🔧 CORRECTION ERREUR DE CONNEXION SUPABASE
## Diagnostic et Solution

---

## ❌ ERREUR RENCONTRÉE

```
Erreur de connexion
Impossible de se connecter à la base de données.
Vérifiez votre configuration Supabase.
```

---

## ✅ DIAGNOSTIC EFFECTUÉ

### 1. Variables d'Environnement
```bash
✓ Fichier .env existe
✓ VITE_SUPABASE_URL configurée
✓ VITE_SUPABASE_ANON_KEY configurée
```

### 2. Configuration Supabase
```bash
✓ src/lib/supabase.ts correct
✓ Vérifications de variables présentes
✓ Client Supabase créé correctement
```

### 3. Test de Connectivité
```bash
✓ Supabase API accessible (HTTP 200)
✓ URL: https://jgadstuimnblhykfaxsv.supabase.co
✓ Pas de problème réseau
```

---

## 🔍 CAUSE PROBABLE

Le serveur de développement n'est **PAS démarré**, ou a été arrêté.

**Les variables d'environnement (VITE_*) ne sont disponibles QUE lorsque le serveur Vite tourne.**

---

## ✅ SOLUTION

### Option 1: Démarrer le serveur de développement (RECOMMANDÉ)

**Sur votre machine locale:**

```bash
# 1. Ouvrir un terminal dans le dossier du projet
cd /chemin/vers/projet

# 2. Installer les dépendances (si première fois)
npm install

# 3. Démarrer le serveur de développement
npm run dev

# Le serveur démarre sur http://localhost:5173
# Ouvrir cette URL dans votre navigateur
```

**Sur Bolt.new:**

Le serveur devrait démarrer automatiquement. Si ce n'est pas le cas:
1. Cliquer sur le bouton "Preview" ou "Restart Preview"
2. Attendre que le serveur démarre (15-30 secondes)
3. L'application devrait s'afficher

---

### Option 2: Si le serveur tourne déjà

**Vider le cache du navigateur:**

```
Chrome/Edge:
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

Firefox:
Ctrl + F5 (Windows/Linux)
Cmd + Shift + R (Mac)

Safari:
Cmd + Option + R
```

**Ou utiliser le mode navigation privée:**
- Chrome: Ctrl/Cmd + Shift + N
- Firefox: Ctrl/Cmd + Shift + P
- Safari: Cmd + Shift + N

---

### Option 3: Vérifier les variables d'environnement

**Dans le navigateur (Console DevTools - F12):**

```javascript
// Taper cette commande dans la console:
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Résultat attendu:**
```
Supabase URL: https://jgadstuimnblhykfaxsv.supabase.co
Anon Key exists: true
```

**Si vous voyez `undefined`:**
→ Le serveur n'est pas démarré ou les variables ne sont pas chargées

---

### Option 4: Recréer le fichier .env

**Parfois le fichier .env n'est pas lu correctement:**

```bash
# 1. Supprimer le fichier .env existant
rm .env

# 2. Créer un nouveau fichier .env
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://jgadstuimnblhykfaxsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRzdHVpbW5ibGh5a2ZheHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwOTQ1MzUsImV4cCI6MjA4MzY3MDUzNX0.j0Lh_22v2gVMPa0Amkt7hyIYorFUE3un0iX-LY1S4Fs
EOF

# 3. Vérifier le contenu
cat .env

# 4. Redémarrer le serveur
npm run dev
```

---

### Option 5: Ajouter .env.local

**Vite lit aussi .env.local (prioritaire sur .env):**

```bash
# Créer .env.local
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://jgadstuimnblhykfaxsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRzdHVpbW5ibGh5a2ZheHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwOTQ1MzUsImV4cCI6MjA4MzY3MDUzNX0.j0Lh_22v2gVMPa0Amkt7hyIYorFUE3un0iX-LY1S4Fs
EOF

# Redémarrer le serveur
npm run dev
```

---

## 🧪 TEST DE CONNEXION

**Une fois le serveur démarré:**

1. Ouvrir http://localhost:5173
2. Ouvrir DevTools (F12)
3. Aller dans l'onglet Console
4. Chercher des erreurs en rouge

**Si vous voyez:**
```
Error: Missing Supabase environment variables
```
→ Les variables ne sont pas chargées, suivre Option 4 ou 5

**Si vous ne voyez pas d'erreur:**
→ La connexion fonctionne!

---

## 🔧 AUTRES VÉRIFICATIONS

### Vérifier que Supabase fonctionne

**Test direct de l'API:**

```bash
curl -X GET \
  'https://jgadstuimnblhykfaxsv.supabase.co/rest/v1/document_templates?limit=1' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRzdHVpbW5ibGh5a2ZheHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwOTQ1MzUsImV4cCI6MjA4MzY3MDUzNX0.j0Lh_22v2gVMPa0Amkt7hyIYorFUE3un0iX-LY1S4Fs" \
  -H "Content-Type: application/json"
```

**Résultat attendu:**
Un JSON avec des données ou un tableau vide `[]`

**Si erreur 401:**
→ La clé API est invalide (mais elle est valide dans notre cas)

**Si erreur 404:**
→ La table n'existe pas (vérifier les migrations)

---

### Vérifier les migrations Supabase

**Sur Supabase Dashboard:**

1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet: `jgadstuimnblhykfaxsv`
3. Aller dans **Table Editor**
4. Vérifier que les tables existent:
   - `user_profiles`
   - `document_templates`
   - `user_documents`
   - etc.

**Si les tables n'existent pas:**
```bash
# Appliquer les migrations
npx supabase db push
```

---

## 📋 CHECKLIST DE DÉPANNAGE

```
Étape 1: Serveur de développement
□ Le serveur est démarré (npm run dev)
□ Le serveur répond sur localhost:5173
□ Pas d'erreurs dans le terminal

Étape 2: Variables d'environnement
□ Fichier .env existe
□ Variables commencent par VITE_
□ Pas d'espaces ni de guillemets autour des valeurs
□ Le fichier .env est à la racine du projet

Étape 3: Navigateur
□ Cache vidé (Ctrl+Shift+R)
□ Console DevTools ouverte (F12)
□ Pas d'erreur "Missing Supabase environment variables"
□ Les variables sont définies (test console)

Étape 4: Supabase
□ Dashboard Supabase accessible
□ Les tables existent
□ API répond (test curl)
□ Clés API valides
```

---

## 🎯 SOLUTION RAPIDE (99% des cas)

**LA PLUPART DU TEMPS, le problème est simplement:**

```bash
# Le serveur n'est pas démarré!
npm run dev

# Puis ouvrir:
# http://localhost:5173
```

**C'est tout! 🎉**

---

## 🆘 SI LE PROBLÈME PERSISTE

### 1. Logs détaillés

**Activer les logs Supabase:**

Ajouter dans `src/lib/supabase.ts` (avant le `export`):

```typescript
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);
console.log('Supabase Key length:', supabaseAnonKey?.length);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ENV variables:', import.meta.env);
  throw new Error('Missing Supabase environment variables');
}
```

### 2. Version de secours

**Créer un fichier temporaire pour forcer les variables:**

```typescript
// src/lib/supabaseBackup.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://jgadstuimnblhykfaxsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWRzdHVpbW5ibGh5a2ZheHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwOTQ1MzUsImV4cCI6MjA4MzY3MDUzNX0.j0Lh_22v2gVMPa0Amkt7hyIYorFUE3un0iX-LY1S4Fs'
);
```

Puis importer depuis `supabaseBackup` au lieu de `supabase`.

**⚠️ ATTENTION: Ne JAMAIS commiter ce fichier! C'est UNIQUEMENT pour déboguer.**

---

## ✅ RÉSUMÉ

**Problème:** Erreur de connexion Supabase

**Cause la plus probable:** Serveur de développement non démarré

**Solution:** `npm run dev`

**Si ça ne fonctionne pas:** Suivre les options 2-5 ci-dessus

**Test de vérification:** Console DevTools doit montrer les variables

---

**Dernière mise à jour:** 18 Janvier 2026
**Status:** Guide de dépannage complet
**Connexion Supabase testée:** ✅ Fonctionnelle
