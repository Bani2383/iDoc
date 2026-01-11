# Configuration URLs Supabase Auth

**Projet**: iDoc
**Supabase Project**: ffujpjaaramwhtmzqhlx
**Date**: 11 janvier 2026

---

## Configuration Requise

### 1. Accéder à Configuration

```
1. Dashboard Supabase: https://app.supabase.com
2. Sélectionner projet: ffujpjaaramwhtmzqhlx
3. Menu: Authentication → URL Configuration
```

### 2. Site URL (URL principale)

```
Site URL:
https://id0c.com
```

**Description**: URL où votre application est hébergée

### 3. Redirect URLs (URLs de redirection autorisées)

Ajouter ces URLs (une par ligne):

```
https://id0c.com
https://id0c.com/auth/callback
https://id0c.com/dashboard
https://idoc.vercel.app
https://idoc-xxx.vercel.app
```

**Remplacer**: `xxx` par votre ID Vercel réel

**Description**: URLs autorisées pour redirection après authentification

### 4. Sauvegarder

Cliquer **Save** en bas de la page

---

## URLs de Développement (Optionnel)

Si vous développez localement, ajouter aussi:

```
http://localhost:5173
http://localhost:5173/auth/callback
http://localhost:5173/dashboard
```

**Note**: Déjà configuré par défaut normalement

---

## Vérification

### Test Connexion

```bash
# 1. Aller sur votre site
curl https://id0c.com

# 2. Cliquer "Connexion"
# 3. S'inscrire avec email test
# 4. Vérifier redirection après login
```

**Résultat attendu**: Redirection vers dashboard après login réussi

### Logs Supabase

```
Dashboard → Authentication → Logs

Vérifier:
✓ Pas d'erreurs "redirect_uri_mismatch"
✓ Événements "signed_in" présents
✓ Sessions créées correctement
```

---

## Erreurs Communes

### Error: redirect_uri_mismatch

**Cause**: URL de redirection non autorisée

**Solution**:
```
1. Vérifier URL exacte dans logs
2. Ajouter URL dans Redirect URLs
3. Sauvegarder configuration
4. Réessayer connexion
```

### Error: Invalid Site URL

**Cause**: Site URL mal configurée

**Solution**:
```
1. Vérifier Site URL = https://id0c.com
2. Pas de trailing slash (/)
3. HTTPS obligatoire (pas HTTP)
4. Sauvegarder
```

### Error: CORS

**Cause**: Domaine non autorisé

**Solution**:
```
1. Ajouter domaine dans Redirect URLs
2. Vérifier variables Vercel:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
3. Redéployer: vercel --prod
```

---

## Configuration Email (Optionnel)

### Email Templates

```
Dashboard → Authentication → Email Templates
```

**Personnaliser**:
- Confirmation email
- Invitation email
- Magic link email
- Change email confirmation
- Reset password

**Variables disponibles**:
- `{{ .ConfirmationURL }}`
- `{{ .Token }}`
- `{{ .Email }}`
- `{{ .SiteURL }}`

### SMTP (Optionnel)

Par défaut, Supabase utilise son propre service email.

Pour utiliser votre SMTP:
```
Dashboard → Project Settings → Auth
→ SMTP Settings

Host: smtp.resend.com
Port: 587
User: resend
Password: [Votre API Key Resend]
```

**Avantage**: Emails depuis votre domaine `@id0c.com`

---

## Configuration Complète

### Production

```
Site URL:
https://id0c.com

Redirect URLs:
https://id0c.com
https://id0c.com/auth/callback
https://id0c.com/dashboard
https://idoc.vercel.app
```

### Preview (Vercel)

Ajouter pour chaque preview:
```
https://idoc-git-[branch]-[user].vercel.app
```

**Ou utiliser wildcard** (si plan pro):
```
https://*.vercel.app
```

---

## Checklist Configuration

Avant déploiement:

- [ ] Site URL configurée
- [ ] Redirect URLs ajoutées
- [ ] Configuration sauvegardée
- [ ] Test connexion réussi
- [ ] Pas d'erreurs dans logs
- [ ] Email confirmation fonctionne (si activé)

Après déploiement:

- [ ] Test signup nouveau compte
- [ ] Test login compte existant
- [ ] Test reset password
- [ ] Test redirection dashboard
- [ ] Vérifier logs Auth Supabase

---

## Documentation Officielle

- **Auth Configuration**: https://supabase.com/docs/guides/auth/auth-helpers/auth-ui
- **Redirect URLs**: https://supabase.com/docs/guides/auth/redirect-urls
- **Email Templates**: https://supabase.com/docs/guides/auth/auth-email-templates

---

## Configuration Actuelle

**Supabase Project ID**: ffujpjaaramwhtmzqhlx
**URL**: https://ffujpjaaramwhtmzqhlx.supabase.co
**Anon Key**: Dans variables Vercel

**À faire**:
1. Configurer Site URL
2. Ajouter Redirect URLs
3. Tester authentification

**Temps estimé**: 5 minutes

---

**Dernière mise à jour**: 11 janvier 2026
**Statut**: À configurer avant déploiement
