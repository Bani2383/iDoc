# Configuration OAuth - Guide Rapide

## Étape 0 : Récupérer votre Callback URL

1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Settings → API
4. Copier votre URL de projet : `https://XXXXXX.supabase.co`

**Votre Callback URL** : `https://XXXXXX.supabase.co/auth/v1/callback`

Gardez cette URL, vous en aurez besoin pour chaque provider.

---

## Google OAuth (5 minutes - COMMENCER ICI)

### 1. Console Google Cloud
```
https://console.cloud.google.com/
```

### 2. Créer un projet
- Cliquer "Select a project" (en haut)
- "New Project"
- Nom : `iDoc`
- Create

### 3. Activer Google+ API
- APIs & Services → Library
- Chercher "Google+ API"
- Enable

### 4. Créer les credentials
- APIs & Services → Credentials
- "Create Credentials" → "OAuth client ID"
- Si demandé : "Configure Consent Screen"
  - User Type : External
  - App name : iDoc
  - User support email : votre email
  - Developer contact : votre email
  - Save and Continue × 3
  - Back to Dashboard

### 5. Créer OAuth Client ID
- Create Credentials → OAuth client ID
- Application type : **Web application**
- Name : `iDoc Production`
- Authorized redirect URIs : **Ajouter**
  ```
  https://XXXXXX.supabase.co/auth/v1/callback
  ```
- Create

### 6. Copier les credentials
**Vous obtenez** :
- Client ID : `XXXXX.apps.googleusercontent.com`
- Client Secret : `XXXXX`

### 7. Configurer dans Supabase
- Dashboard Supabase → Authentication → Providers
- Google → Enable
- Coller Client ID
- Coller Client Secret
- Save

**TEST** : Aller sur votre site, cliquer "Se connecter avec Google" → ça marche !

---

## Facebook OAuth (10 minutes)

### 1. Facebook Developers
```
https://developers.facebook.com/
```

### 2. Créer une app
- My Apps → Create App
- Use case : **Other**
- Type : **Consumer**
- App name : `iDoc`
- App contact email : votre email
- Create app

### 3. Ajouter Facebook Login
- Dashboard → Add Product
- Facebook Login → Set Up

### 4. Configurer les URLs
- Facebook Login → Settings (menu gauche)
- Valid OAuth Redirect URIs : **Ajouter**
  ```
  https://XXXXXX.supabase.co/auth/v1/callback
  ```
- Save Changes

### 5. Settings → Basic
- App Domains : `id0c.com`
- Privacy Policy URL : `https://id0c.com/legal`
- Terms of Service URL : `https://id0c.com/legal`
- Copier :
  - **App ID**
  - **App Secret** (cliquer "Show")

### 6. Passer en Live
- En haut : Switch slider de "Development" à "Live"
- Confirm

### 7. Configurer dans Supabase
- Dashboard Supabase → Authentication → Providers
- Facebook → Enable
- App ID → Coller dans "Client ID"
- App Secret → Coller dans "Client Secret"
- Save

**TEST** : Cliquer "Se connecter avec Facebook" → ça marche !

---

## GitHub OAuth (5 minutes)

### 1. GitHub Developer Settings
```
https://github.com/settings/developers
```

### 2. Nouvelle OAuth App
- OAuth Apps → New OAuth App
- Application name : `iDoc`
- Homepage URL : `https://id0c.com`
- Application description : `iDoc - Générateur de documents`
- Authorization callback URL :
  ```
  https://XXXXXX.supabase.co/auth/v1/callback
  ```
- Register application

### 3. Générer un secret
- "Generate a new client secret"
- Copier immédiatement (ne sera plus visible)

### 4. Copier les credentials
- **Client ID** : Visible en haut
- **Client Secret** : Celui que vous venez de générer

### 5. Configurer dans Supabase
- Dashboard Supabase → Authentication → Providers
- GitHub → Enable
- Coller Client ID
- Coller Client Secret
- Save

**TEST** : Cliquer "Se connecter avec GitHub" → ça marche !

---

## Twitter/X OAuth (10 minutes)

### 1. Twitter Developer Portal
```
https://developer.twitter.com/en/portal/dashboard
```

### 2. Créer un projet
- Projects & Apps → Create Project
- Project name : `iDoc`
- Use case : `Enabling people to log in with Twitter`
- Project description : `Document generator platform`

### 3. Créer une app
- App name : `iDoc Production`
- Get your keys (copier quelque part, on les utilise pas)
- Skip to dashboard

### 4. Configurer OAuth 2.0
- App settings → User authentication settings → Set up
- App permissions : **Read**
- Type of App : **Web App**
- App info :
  - Callback URI / Redirect URL :
    ```
    https://XXXXXX.supabase.co/auth/v1/callback
    ```
  - Website URL : `https://id0c.com`
  - Terms of service : `https://id0c.com/legal`
  - Privacy policy : `https://id0c.com/legal`
- Save

### 5. Récupérer OAuth 2.0 credentials
- Retour aux settings
- OAuth 2.0 Client ID and Secret :
  - **Client ID** : Copier
  - **Client Secret** : Copier

### 6. Configurer dans Supabase
- Dashboard Supabase → Authentication → Providers
- Twitter → Enable
- Coller Client ID
- Coller Client Secret
- Save

**TEST** : Cliquer "Se connecter avec Twitter" → ça marche !

---

## Configuration finale dans Supabase

### URL Configuration
Authentication → URL Configuration :

```
Site URL:
https://id0c.com

Redirect URLs (une par ligne):
https://id0c.com
https://id0c.com/auth/callback
https://id0c.com/reset-password
http://localhost:5173
http://localhost:5173/auth/callback
```

Save

---

## Checklist de configuration

### Obligatoire
- [ ] Supabase URL Configuration (Site URL + Redirect URLs)

### Recommandé (par ordre de priorité)
- [ ] Google OAuth (le plus utilisé)
- [ ] GitHub OAuth (simple et rapide)
- [ ] Facebook OAuth (deuxième plus utilisé)

### Optionnel
- [ ] Twitter/X OAuth (moins critique)

---

## Temps estimé

| Provider | Temps | Difficulté |
|----------|-------|------------|
| Google | 5 min | Facile |
| GitHub | 5 min | Facile |
| Facebook | 10 min | Moyen |
| Twitter | 10 min | Moyen |
| **Total** | **30 min** | - |

---

## Test complet

### 1. Page de connexion
Ouvrir : `https://id0c.com`

### 2. Cliquer "Se connecter"

### 3. Voir les boutons
- [x] Google
- [x] Facebook
- [x] Twitter
- [x] GitHub

### 4. Tester chaque provider
Cliquer sur chaque bouton :
1. Redirection vers le provider
2. Autoriser l'application
3. Redirection vers id0c.com
4. Connecté automatiquement

### 5. Vérifier le profil
- Dashboard → Mon compte
- L'email et nom doivent être préremplis

---

## Dépannage

### "redirect_uri_mismatch"
**Cause** : L'URL de callback n'est pas correcte
**Solution** : Vérifier que vous avez bien mis `https://XXXXXX.supabase.co/auth/v1/callback` partout

### "Invalid client_id"
**Cause** : Client ID ou Secret incorrect
**Solution** : Recopier les credentials depuis le dashboard du provider

### Redirection en boucle
**Cause** : Redirect URLs pas configurées dans Supabase
**Solution** : Ajouter `https://id0c.com/auth/callback` dans URL Configuration

### Email déjà utilisé
**Normal** : Si vous avez déjà un compte avec cet email
**Solution** : Utiliser un autre email ou se connecter avec la méthode originale

---

## Après la configuration

### Afficher les statistiques
Dashboard Supabase → Authentication → Users

Vous verrez :
- Nombre d'utilisateurs par provider
- Dernières connexions
- Nouveaux utilisateurs

### Personnaliser l'expérience
- Modifier les permissions demandées
- Ajouter des scopes supplémentaires
- Personnaliser les emails de bienvenue

---

## Ordre recommandé

### Jour 1 : Google (5 min)
Le plus important, le plus utilisé.

### Jour 2 : GitHub (5 min)
Simple et apprécié des développeurs.

### Jour 3 : Facebook (10 min)
Deuxième plus utilisé après Google.

### Plus tard : Twitter (10 min)
Moins critique, à faire quand vous avez du temps.

---

## Support officiel

### Google
https://support.google.com/cloud/answer/6158849

### Facebook
https://developers.facebook.com/docs/facebook-login

### GitHub
https://docs.github.com/en/developers/apps/building-oauth-apps

### Twitter
https://developer.twitter.com/en/docs/authentication/oauth-2-0

### Supabase
https://supabase.com/docs/guides/auth/social-login
