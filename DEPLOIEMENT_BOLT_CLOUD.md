# Déploiement iDoc sur Bolt Cloud

**Date**: 11 janvier 2026
**Plateforme**: Bolt Cloud
**Domaine**: id0c.com
**Statut**: Domaine configuré - Variables à ajouter

---

## STATUT ACTUEL

### Domaine ✅

```
✓ Domaine: id0c.com
✓ Assigné à: iDoc
✓ Hosting: Bolt Cloud
✓ DNS: Configuré
✓ Renouvellement: 12 octobre 2026
```

### Variables Environnement ❌

**À configurer dans Bolt Cloud → Secrets**

---

## ÉTAPE 1: Ajouter Variables (5 min)

### Navigation

```
1. Dans Bolt.new
2. Project Settings (sidebar gauche)
3. Cliquer sur "Secrets"
```

### Variables à Ajouter

**Variable 1: VITE_SUPABASE_URL**

```
Nom: VITE_SUPABASE_URL
Valeur: https://ffujpjaaramwhtmzqhlx.supabase.co
```

**Variable 2: VITE_SUPABASE_ANON_KEY**

```
Nom: VITE_SUPABASE_ANON_KEY
Valeur: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTc3MzAsImV4cCI6MjA3ODE3MzczMH0.oiBJ_R4x_ZSRrHLEtSQ9d-gvAaseZJM0XMRS8evDXoo
```

**Variable 3: VITE_APP_URL**

```
Nom: VITE_APP_URL
Valeur: https://id0c.com
```

### Procédure

```
Pour chaque variable:
1. Cliquer "Add Secret" ou équivalent
2. Name: [Nom de la variable]
3. Value: [Valeur de la variable]
4. Save ou Add
```

---

## ÉTAPE 2: Redéployer (2 min)

### Option A: Déploiement Automatique

Si le déploiement automatique est activé:
```
✓ Les changements sont automatiquement déployés
✓ Attendre 1-2 minutes
✓ Vérifier sur https://id0c.com
```

### Option B: Déploiement Manuel

Si nécessaire:
```
1. Cliquer sur "Publish" ou "Deploy"
2. Attendre fin du build
3. Vérifier déploiement
```

---

## ÉTAPE 3: Configurer Supabase (5 min)

### URLs Autorisées

```
1. Aller sur: https://app.supabase.com
2. Projet: ffujpjaaramwhtmzqhlx
3. Authentication → URL Configuration
```

**Site URL**:
```
https://id0c.com
```

**Redirect URLs** (une par ligne):
```
https://id0c.com
https://id0c.com/auth/callback
https://id0c.com/dashboard
```

**Sauvegarder**

---

## ÉTAPE 4: Tests (5 min)

### Test 1: Homepage

```
Aller sur: https://id0c.com
Vérifier: Page charge correctement
```

### Test 2: Connexion Supabase

```
1. Cliquer "Connexion"
2. S'inscrire avec email
3. Se connecter
4. Vérifier: Redirection vers dashboard
```

### Test 3: Génération Document

```
1. Aller sur Templates
2. Choisir un template
3. Remplir formulaire
4. Générer document
5. Vérifier: PDF téléchargé
```

### Test 4: Admin Access

```
1. Supabase → Table Editor → user_profiles
2. Trouver votre utilisateur (par email)
3. Modifier: role = "admin"
4. Save
5. Aller sur: https://id0c.com/admin
6. Vérifier: Dashboard admin accessible
```

---

## CONFIGURATION BOLT CLOUD

### Sections Disponibles

Votre projet a accès à:

- **General** - Configuration générale
- **Domains & Hosting** - Gestion domaines (déjà fait ✅)
- **Analytics** - Statistiques d'utilisation
- **Database** - Base de données (Supabase externe ✅)
- **Authentication** - Auth (Supabase externe ✅)
- **Server Functions** - Edge Functions (Supabase externe ✅)
- **Secrets** - Variables environnement (À FAIRE ❌)
- **User Management** - Gestion utilisateurs
- **File Storage** - Stockage fichiers
- **Knowledge** - Documentation
- **Backups** - Sauvegardes

### Configuration Minimale

Pour que le site fonctionne:

```
✓ Domains: id0c.com (fait)
❌ Secrets: 3 variables (à faire)
```

---

## CHECKLIST DÉPLOIEMENT

### Avant Tests

- [x] Domaine configuré (id0c.com)
- [ ] Variables Secrets ajoutées
- [ ] Redéploiement effectué
- [ ] Supabase URLs configurées

### Tests Critiques

- [ ] Homepage charge
- [ ] Signup/Login fonctionne
- [ ] Génération document OK
- [ ] Admin dashboard accessible

### Optionnel

- [ ] Analytics activées
- [ ] Backups configurés
- [ ] Google Search Console
- [ ] Emails Resend configurés

---

## DIFFÉRENCES BOLT CLOUD vs VERCEL

### Avantages Bolt Cloud

```
✓ Interface intégrée Bolt.new
✓ Déploiement simplifié
✓ Domaine inclus dans l'interface
✓ Pas de CLI nécessaire
✓ Configuration visuelle
```

### Configuration

| Aspect | Bolt Cloud | Vercel |
|--------|------------|--------|
| **Variables** | Secrets (UI) | Environment Variables (Dashboard/CLI) |
| **Domaines** | Domains & Hosting | Domains (Dashboard) |
| **Déploiement** | Publish button | CLI `vercel --prod` |
| **DNS** | Géré automatiquement | Configuration manuelle |

---

## TIMELINE

```
00:00  Ajouter 3 variables Secrets         3 min
00:03  Redéployer application              2 min
00:05  Configurer Supabase Auth URLs       5 min
00:10  Test Homepage                       1 min
00:11  Test Connexion                      2 min
00:13  Test Génération document            2 min
00:15  Créer compte admin                  2 min
00:17  Test Admin dashboard                1 min
00:18  ✅ SITE FONCTIONNEL!

Total: 18 minutes
```

---

## CONFIGURATION COMPLÈTE

### Variables Obligatoires (3)

```
VITE_SUPABASE_URL=https://ffujpjaaramwhtmzqhlx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTc3MzAsImV4cCI6MjA3ODE3MzczMH0.oiBJ_R4x_ZSRrHLEtSQ9d-gvAaseZJM0XMRS8evDXoo
VITE_APP_URL=https://id0c.com
```

### Supabase Auth URLs

```
Site URL:
https://id0c.com

Redirect URLs:
https://id0c.com
https://id0c.com/auth/callback
https://id0c.com/dashboard
```

---

## VÉRIFICATIONS

### Variables Configurées

```bash
# Dans le site déployé, ouvrir Console (F12)
console.log(import.meta.env.VITE_SUPABASE_URL)
# Doit afficher: https://ffujpjaaramwhtmzqhlx.supabase.co

console.log(import.meta.env.VITE_APP_URL)
# Doit afficher: https://id0c.com
```

### Connexion Supabase

```bash
# Test simple
curl https://ffujpjaaramwhtmzqhlx.supabase.co/rest/v1/
# Doit retourner: 200 OK
```

### Site Accessible

```bash
curl -I https://id0c.com
# Doit retourner: HTTP/2 200
```

---

## TROUBLESHOOTING

### Site ne charge pas

```
1. Vérifier que les 3 variables sont dans Secrets
2. Vérifier qu'elles sont bien orthographiées
3. Redéployer: Publish
4. Vider cache navigateur: Ctrl+Shift+R
5. Attendre 2 minutes pour propagation
```

### Erreur Supabase Connection

```
1. Vérifier variables Secrets
2. Vérifier Supabase Auth URLs
3. Console (F12) → Vérifier erreurs
4. Supabase → Logs → API
```

### Auth ne fonctionne pas

```
1. Vérifier Supabase Redirect URLs
2. Vérifier Site URL = https://id0c.com
3. Pas de trailing slash (/)
4. HTTPS obligatoire
```

---

## FONCTIONNALITÉS OPTIONNELLES

### Analytics (Recommandé)

```
1. Project Settings → Analytics
2. Activer analytics
3. Voir statistiques après 24h
```

### Backups (Recommandé)

```
1. Project Settings → Backups
2. Configurer backups automatiques
3. Fréquence recommandée: Quotidien
```

### Emails Resend

**Voir guide**: `GUIDE_CONFIGURATION_EMAILS.md`

Temps: 30 minutes

### Stripe Webhooks

**Voir guide**: `CHECKLIST_DEPLOIEMENT_FINAL.md` Phase 7

Temps: 15 minutes

---

## APRÈS DÉPLOIEMENT

### Jour 1

```
✓ Vérifier site accessible
✓ Tester tous les flows
✓ Monitorer Analytics
✓ Poster sur réseaux sociaux
```

### Semaine 1

```
✓ Publier 3 articles blog
✓ Soumettre Google Search Console
✓ Analyser premiers utilisateurs
✓ Corriger bugs remontés
```

### Mois 1

```
✓ Optimiser templates populaires
✓ Lancer campagne marketing
✓ Partenariats
✓ Améliorer SEO
```

---

## SUPPORT

### Documentation

- `DEPLOIEMENT_BOLT_CLOUD.md` - Ce guide
- `PRET_POUR_PRODUCTION.md` - Statut général
- `GUIDE_CONFIGURATION_EMAILS.md` - Configuration emails
- `CHECKLIST_DEPLOIEMENT_FINAL.md` - Checklist complète

### Aide Bolt

- **Bolt Support**: Dans l'interface Bolt.new
- **Community**: Discord/Forum Bolt
- **Documentation**: https://docs.bolt.new

### Aide Services

- **Supabase**: https://supabase.com/support
- **Resend**: support@resend.com
- **Stripe**: https://support.stripe.com

---

## RÉSUMÉ ACTIONS

### Immédiat (18 min)

```
1. Project Settings → Secrets
2. Ajouter 3 variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_APP_URL
3. Redéployer (Publish)
4. Configurer Supabase Auth URLs
5. Tester site
```

### Recommandé (1h)

```
1. Configurer Resend emails (30 min)
2. Configurer Stripe webhooks (15 min)
3. Soumettre Google Search Console (15 min)
```

---

## STATUT FINAL

### Prêt

```
✅ Code: Production Ready
✅ Build: Succès (17.88s)
✅ Domaine: id0c.com configuré
✅ Hosting: Bolt Cloud actif
```

### À Faire

```
❌ Secrets: Ajouter 3 variables
❌ Supabase: Configurer Auth URLs
❌ Tests: Vérifier fonctionnement
```

**Temps total**: 18 minutes

**Prochaine action**: Project Settings → Secrets

---

## COMMENCER MAINTENANT

### Étape par Étape

**1. Ouvrir Secrets (1 min)**

```
Bolt.new → Project Settings → Secrets
```

**2. Ajouter Variable 1 (1 min)**

```
Name: VITE_SUPABASE_URL
Value: https://ffujpjaaramwhtmzqhlx.supabase.co
Save
```

**3. Ajouter Variable 2 (1 min)**

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTc3MzAsImV4cCI6MjA3ODE3MzczMH0.oiBJ_R4x_ZSRrHLEtSQ9d-gvAaseZJM0XMRS8evDXoo
Save
```

**4. Ajouter Variable 3 (1 min)**

```
Name: VITE_APP_URL
Value: https://id0c.com
Save
```

**5. Redéployer (2 min)**

```
Cliquer: Publish
Attendre: Build terminé
```

**6. Tester (2 min)**

```
Aller sur: https://id0c.com
Vérifier: Site charge
```

**✅ TERMINÉ!**

---

**Prochaine étape**: Ajouter les 3 variables dans Secrets

**Temps**: 18 minutes

**Résultat**: Site fonctionnel sur https://id0c.com

Bon lancement! 🚀

---

**Dernière mise à jour**: 11 janvier 2026
**Plateforme**: Bolt Cloud
**Domaine**: id0c.com ✅
**Variables**: À ajouter ❌
