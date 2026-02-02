# Guide du Système de Diagnostic Supabase

## Vue d'Ensemble

Le système de diagnostic Supabase a été créé pour résoudre les problèmes de connectivité en production sur https://id0c.com. Il fournit :

- ✅ Validation robuste de la configuration
- ✅ Page de diagnostic accessible à `/debug/supabase`
- ✅ Tests de connectivité automatiques
- ✅ Messages d'erreur clairs et actionnables
- ✅ Fallback élégant en cas de configuration invalide
- ✅ Logs console détaillés
- ✅ Masquage des clés sensibles

## Architecture

### Fichiers Créés

```
src/lib/supabaseClient.ts          # Client Supabase centralisé avec validation
src/components/DebugSupabasePage.tsx    # Page de diagnostic /debug/supabase
src/components/SupabaseConfigError.tsx  # Page d'erreur de configuration
```

### Fichiers Modifiés

```
src/lib/supabase.ts                # Re-exporte depuis supabaseClient.ts
src/App.tsx                        # Ajoute route debug + fallback error
```

## Fonctionnalités

### 1. Validation de Configuration

Le système valide automatiquement :

```typescript
// Vérifications effectuées :
✓ VITE_SUPABASE_URL est définie
✓ VITE_SUPABASE_URL commence par https://
✓ VITE_SUPABASE_URL se termine par .supabase.co
✓ VITE_SUPABASE_URL ne contient pas d'espaces
✓ VITE_SUPABASE_ANON_KEY est définie
✓ VITE_SUPABASE_ANON_KEY a une longueur valide
```

### 2. Page de Diagnostic

Accessible à : `https://id0c.com/debug/supabase`

**Protection d'accès :**
- Activée si `VITE_ENABLE_DEBUG=true`
- Activée en mode développement
- Activée sur localhost

**Informations affichées :**
- URL Supabase (complète)
- Clé Anon (masquée : premiers 6 + derniers 4 caractères)
- État de configuration (valide/invalide)
- Origine actuelle (window.location.origin)
- Variables d'environnement présentes
- Timestamp de chargement

**Tests automatiques :**
- Ping vers `/rest/v1/` (HEAD request)
- Affiche le statut HTTP
- Mesure le temps de réponse
- Détecte le type d'erreur
- Suggère des solutions

**Actions disponibles :**
- Bouton "Retry Ping" pour retester
- Bouton "Copy JSON" pour copier un rapport complet

### 3. Fallback en Cas d'Erreur

Si Supabase n'est pas configuré, l'application affiche automatiquement une page d'erreur claire avec :

- Liste des erreurs de configuration
- Format attendu des variables
- Instructions étape par étape pour Vercel
- Bouton pour recharger la page
- Bouton pour ouvrir le panneau de debug

### 4. Logs Console

**Au démarrage (configuration valide) :**
```javascript
✅ Supabase client initialized {
  url: "https://jgad****axsv.supabase.co",
  origin: "https://id0c.com",
  timestamp: "2026-02-02T12:00:00.000Z"
}
```

**En cas d'erreur :**
```javascript
❌ Invalid Supabase configuration: [
  "VITE_SUPABASE_URL is missing"
]

🔧 Supabase Configuration Help
Expected format:
  VITE_SUPABASE_URL=https://<project-ref>.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGci...

Steps to fix:
  1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
  2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
  3. Check Production, Preview, and Development
  4. Go to Deployments → Redeploy
  5. Wait 1-2 minutes and refresh
```

### 5. Détection Intelligente d'Erreurs

Le système détecte et suggère des solutions pour :

**DNS/Network :**
```
❌ net::ERR_NAME_NOT_RESOLVED
💡 DNS error: VITE_SUPABASE_URL may be incorrect or missing from Vercel env vars
```

**CORS :**
```
❌ CORS error
💡 Check Supabase project settings → API → CORS allowed origins
```

**Bloqué par extensions :**
```
❌ Request blocked
💡 Disable browser extensions (AdBlock, Privacy Badger, etc.)
```

**Timeout :**
```
❌ Request timeout
💡 Check Supabase project is not paused
```

**401/403 :**
```
❌ HTTP 401
💡 Check VITE_SUPABASE_ANON_KEY is correct
```

## Utilisation

### En Développement

```bash
# Lancer localement
npm run dev

# Accéder au diagnostic
http://localhost:5173/debug/supabase
```

### En Production

**Accès au diagnostic :**

1. Ajouter `VITE_ENABLE_DEBUG=true` dans Vercel
2. Redéployer
3. Visiter `https://id0c.com/debug/supabase`

**OU** (sans activer DEBUG) :

Modifier temporairement l'URL dans le navigateur :
```
https://id0c.com → https://id0c.com/debug/supabase
```

Le debug est accessible même si Supabase n'est pas configuré.

### Tester la Connectivité

1. Ouvrir `https://id0c.com/debug/supabase`
2. Le test s'exécute automatiquement au chargement
3. Cliquer sur "Retry Ping" pour retester
4. Cliquer sur "Copy JSON" pour partager le rapport

### Copier un Rapport

Le bouton "Copy JSON" copie un rapport complet :

```json
{
  "timestamp": "2026-02-02T12:00:00.000Z",
  "origin": "https://id0c.com",
  "supabaseUrl": "https://jgad****axsv.supabase.co",
  "anonKeyPresent": true,
  "anonKeyMasked": "eyJhbG...S4Fs",
  "configValid": true,
  "configErrors": [],
  "pingResult": {
    "success": true,
    "status": 200,
    "responseTime": 145.5,
    "timestamp": "2026-02-02T12:00:01.000Z"
  },
  "userAgent": "Mozilla/5.0...",
  "envVarsFound": {
    "VITE_SUPABASE_URL": true,
    "VITE_SUPABASE_ANON_KEY": true
  }
}
```

## Sécurité

### Masquage des Clés

Les clés sensibles sont toujours masquées dans l'UI :

```
Anon Key (Masked): eyJhbG...S4Fs
```

Format : `premiers 6 caractères...derniers 4 caractères`

### Protection de la Page Debug

La page `/debug/supabase` nécessite :
- `VITE_ENABLE_DEBUG=true` en production
- OU mode développement
- OU localhost

Sans cela, affiche "Access Denied"

### Rapport JSON

Le rapport JSON copié ne contient jamais la clé complète, seulement :
- La version masquée
- Un booléen `anonKeyPresent`

## Dépannage

### Problème : "Access Denied" sur /debug/supabase

**Solution :**
```bash
# Dans Vercel
VITE_ENABLE_DEBUG=true
```

Puis redéployer.

### Problème : Configuration invalide malgré les variables

**Vérifications :**

1. Les noms commencent bien par `VITE_` ?
2. Pas d'espaces dans l'URL ?
3. L'URL se termine par `.supabase.co` ?
4. Avez-vous redéployé après l'ajout ?

**Debug :**
```javascript
// Dans Chrome DevTools Console
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
```

Si `undefined`, les variables ne sont pas définies ou pas redéployées.

### Problème : Test de connexion échoue avec DNS error

**Causes possibles :**
1. L'URL est incorrecte
2. Les variables ne sont pas définies dans Vercel
3. VPN/Firewall bloque la requête
4. Extension de navigateur bloque

**Solutions :**
1. Vérifier l'URL dans la page debug
2. Tester l'URL directement : `https://[votre-url]/rest/v1/`
3. Désactiver VPN temporairement
4. Tester en navigation privée

### Problème : CORS error

**Solution :**
1. Aller dans Supabase Dashboard
2. Project Settings → API
3. CORS Allowed Origins
4. Ajouter : `https://id0c.com`

## Variables d'Environnement

### Requises

```bash
VITE_SUPABASE_URL=https://jgadstuimnblhykfaxsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optionnelles

```bash
# Active la page debug en production
VITE_ENABLE_DEBUG=true
```

### Configuration Vercel

1. Dashboard → Settings → Environment Variables
2. Ajouter les 2 variables requises
3. Cocher : **Production, Preview, Development**
4. Deployments → Redeploy
5. Attendre 1-2 minutes

## API du Client

### Fonctions Exportées

```typescript
import {
  supabase,                    // Client Supabase (peut être null)
  getSupabaseDiagnostics,      // Diagnostics complets
  getMaskedConfig,             // Config avec clés masquées
  testSupabaseConnection,      // Test de ping
  isSupabaseConfigured,        // Booléen de validation
  getSupabaseConfigErrors,     // Liste des erreurs
} from './lib/supabaseClient';
```

### Utilisation

```typescript
// Vérifier si configuré
if (isSupabaseConfigured()) {
  // Utiliser supabase
  const { data } = await supabase.from('table').select();
} else {
  // Afficher erreur
  const errors = getSupabaseConfigErrors();
  console.error('Config errors:', errors);
}

// Tester la connexion
const result = await testSupabaseConnection();
if (result.success) {
  console.log(`Connected in ${result.responseTime}ms`);
} else {
  console.error(`Failed: ${result.error}`);
  console.log(`Suggestion: ${result.suggestion}`);
}

// Obtenir config masquée
const config = getMaskedConfig();
console.log(`URL: ${config.url}`);
console.log(`Key: ${config.anonKey}`); // eyJhbG...S4Fs
```

## Tests

### Test Local

```bash
# Sans variables (doit afficher l'erreur)
npm run dev
# → Affiche SupabaseConfigError

# Avec variables
cp .env.example .env
# Éditer .env avec vos vraies valeurs
npm run dev
# → Fonctionne normalement
```

### Test Debug Page

```bash
npm run dev
# Visiter : http://localhost:5173/debug/supabase
# → Doit afficher la page de diagnostic
```

### Test Build

```bash
npm run build
# → Doit compiler sans erreur
```

## Checklist de Déploiement

- [ ] Variables Vercel ajoutées (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Les 3 environnements cochés (Production, Preview, Development)
- [ ] Redéployé après ajout des variables
- [ ] Testé `https://id0c.com` (doit charger sans erreur)
- [ ] Testé `https://id0c.com/debug/supabase` (doit afficher success)
- [ ] Vérifié Console Chrome (pas d'erreur DNS)
- [ ] Test de ping réussi (< 500ms)

## Résumé

Le système de diagnostic Supabase transforme les erreurs cryptiques en messages clairs et actionnables :

**Avant :**
```
❌ net::ERR_NAME_NOT_RESOLVED
```

**Après :**
```
❌ Configuration Supabase manquante

Problèmes détectés :
• VITE_SUPABASE_URL is missing

Comment corriger :
1. Aller dans Vercel Dashboard → Settings → Environment Variables
2. Ajouter VITE_SUPABASE_URL = https://votre-projet.supabase.co
3. Ajouter VITE_SUPABASE_ANON_KEY = eyJhbGci...
4. Cocher Production, Preview, Development
5. Redéployer

[Reload Page] [Open Debug Panel]
```

**Support :**
- Page de diagnostic : `/debug/supabase`
- Logs console détaillés
- Rapport JSON exportable
- Messages d'erreur actionnables
