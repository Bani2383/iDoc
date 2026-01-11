# Configuration Variables d'Environnement Vercel

## Problème Résolu

L'erreur `La variable d'environnement « VITE_SUPABASE_URL » fait référence au secret « supabase_url », qui n'existe pas` a été corrigée.

La section `"env"` dans `vercel.json` a été supprimée car elle référençait des secrets Vercel qui n'existaient pas.

---

## Méthode Recommandée: Dashboard Vercel (SIMPLE)

C'est la méthode utilisée dans votre projet maintenant.

### Étapes

1. **Aller sur Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   → Votre Projet
   → Settings
   → Environment Variables
   ```

2. **Ajouter chaque variable**
   ```
   Name:  VITE_SUPABASE_URL
   Value: https://ffujpjaaramwhtmzqhlx.supabase.co
   Environments: ✓ Production ✓ Preview ✓ Development
   ```

   ```
   Name:  VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Environments: ✓ Production ✓ Preview ✓ Development
   ```

   ```
   Name:  VITE_APP_URL
   Value: https://id0c.com
   Environments: ✓ Production
   ```

3. **Redéployer**
   ```bash
   vercel --prod
   ```

**Avantages**:
- Simple et visuel
- Pas de configuration complexe
- Facile à modifier
- Recommandé pour la plupart des projets

---

## Méthode Avancée: Secrets Vercel (OPTIONNEL)

Si vous voulez utiliser des secrets réutilisables entre projets.

### Étapes

1. **Créer les secrets via CLI**
   ```bash
   # Installer Vercel CLI
   npm install -g vercel
   vercel login

   # Créer secrets
   vercel secrets add supabase_url "https://ffujpjaaramwhtmzqhlx.supabase.co"
   vercel secrets add supabase_anon_key "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

2. **Référencer dans vercel.json**
   ```json
   {
     "env": {
       "VITE_SUPABASE_URL": "@supabase_url",
       "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
     }
   }
   ```

3. **Déployer**
   ```bash
   vercel --prod
   ```

**Avantages**:
- Secrets partagés entre projets
- Plus sécurisé (valeurs cryptées)
- Versionné avec le code

**Inconvénients**:
- Plus complexe
- Nécessite CLI
- Moins flexible

---

## Quelle Méthode Utiliser?

### Dashboard (Recommandé) ✅
**Utilisez si**:
- Premier déploiement
- Projet simple
- Variables spécifiques à ce projet
- Vous préférez l'interface visuelle

### Secrets CLI
**Utilisez si**:
- Plusieurs projets partageant les mêmes secrets
- Environnement CI/CD automatisé
- Besoin de rotation de secrets fréquente
- Équipe avec workflow avancé

---

## Configuration Actuelle de Votre Projet

**Fichier**: `vercel.json` (corrigé)

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [...],
  "headers": [...],
  "redirects": [...]
}
```

**Variables à configurer via Dashboard**:

```bash
VITE_SUPABASE_URL          # Obligatoire
VITE_SUPABASE_ANON_KEY     # Obligatoire
VITE_APP_URL               # Obligatoire (Production)
VITE_STRIPE_PUBLIC_KEY     # Optionnel
VITE_GA_MEASUREMENT_ID     # Optionnel
```

---

## Vérification Post-Configuration

### Via Dashboard Vercel

```
Settings → Environment Variables
→ Voir les 3 variables configurées
→ Status: "Set" pour chaque environnement
```

### Via CLI

```bash
# Lister variables
vercel env ls

# Résultat attendu:
# VITE_SUPABASE_URL     (Production, Preview, Development)
# VITE_SUPABASE_ANON_KEY (Production, Preview, Development)
# VITE_APP_URL          (Production)
```

### Via Logs de Build

```
Vercel Dashboard → Deployments → Latest → Build Logs

Chercher:
✓ VITE_SUPABASE_URL is set
✓ VITE_SUPABASE_ANON_KEY is set
```

---

## Troubleshooting

### Variables non détectées

**Symptôme**: Site charge mais connexion Supabase échoue

**Solution**:
```bash
1. Vérifier Dashboard → Environment Variables
2. Vérifier que les 3 environnements sont cochés
3. Redéployer: vercel --prod
4. Vider cache navigateur
```

### Erreur "Secret not found"

**Symptôme**: Erreur pendant build Vercel

**Solution**:
```bash
# Si vous avez utilisé @secret dans vercel.json:
1. Soit créer le secret: vercel secrets add secret_name "value"
2. Soit supprimer section "env" de vercel.json (recommandé)
3. Configurer via Dashboard à la place
```

### Variables différentes entre environnements

**Exemple**: Test Stripe en Preview, Live en Production

```
Dashboard → Environment Variables

Variable: VITE_STRIPE_PUBLIC_KEY
Production: pk_live_xxx
Preview: pk_test_xxx
Development: pk_test_xxx
```

---

## Best Practices

### Nommage
- **Client-side**: Préfixe `VITE_` obligatoire
- **Server-side**: Pas de préfixe (Edge Functions Supabase)

### Sécurité
- **Jamais commiter** dans `.env`
- **Clés publiques**: OK dans `VITE_*` (exposées au client)
- **Clés secrètes**: Dans Supabase Secrets, PAS dans Vercel

### Organisation
```bash
# Frontend (Vercel)
VITE_SUPABASE_URL          ← URL publique
VITE_SUPABASE_ANON_KEY     ← Clé publique (safe)
VITE_STRIPE_PUBLIC_KEY     ← Clé publique Stripe

# Backend (Supabase Edge Functions)
SUPABASE_SERVICE_ROLE_KEY  ← Clé secrète (auto)
STRIPE_SECRET_KEY          ← Clé secrète Stripe
STRIPE_WEBHOOK_SECRET      ← Secret webhook
RESEND_API_KEY             ← Clé API emails
```

---

## Commandes Utiles

### Ajouter variable via CLI

```bash
# Pour environnement spécifique
vercel env add VITE_NEW_VAR production

# Pour tous les environnements
vercel env add VITE_NEW_VAR
# Puis sélectionner: Production, Preview, Development
```

### Supprimer variable

```bash
vercel env rm VITE_OLD_VAR production
```

### Pull variables localement

```bash
# Télécharger variables pour développement local
vercel env pull .env.local
```

### Lister toutes les variables

```bash
vercel env ls
```

---

## Documentation Officielle

- **Vercel Env Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Vercel Secrets**: https://vercel.com/docs/cli/secrets
- **Vite Env Variables**: https://vitejs.dev/guide/env-and-mode.html

---

## Résumé

**Votre configuration actuelle** (après correction):

✅ `vercel.json` simplifié (pas de section "env")
✅ Variables configurées via Dashboard Vercel
✅ Build fonctionne (13.20s)
✅ Prêt pour déploiement

**Prochaine étape**:

1. Aller sur Vercel Dashboard
2. Ajouter les 3 variables obligatoires
3. Déployer: `vercel --prod`
4. Vérifier site: https://id0c.com

Tout est en ordre! 🚀
