# Configuration Resend (Optionnel)

## Pourquoi cette configuration est optionnelle

La réinitialisation de mot de passe et toutes les fonctionnalités d'authentification fonctionnent **sans Resend** car Supabase envoie automatiquement les emails via son propre système.

Resend est uniquement nécessaire si vous voulez :
- Envoyer des emails personnalisés depuis `@id0c.com`
- Utiliser vos propres templates d'emails
- Avoir un contrôle total sur l'envoi d'emails

## Comment obtenir RESEND_API_KEY

### 1. Créer un compte Resend

```bash
# Aller sur
https://resend.com/signup
```

**Gratuit** : 3,000 emails/mois, 100 emails/jour

### 2. Vérifier votre domaine

1. **Dashboard Resend** → Domains → Add Domain
2. Entrer : `id0c.com`
3. Ajouter ces DNS records chez votre registrar :

```
Type: TXT
Name: @
Value: resend-verify=xxxxx

Type: MX
Name: @
Priority: 10
Value: feedback-smtp.resend.com

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;
```

### 3. Obtenir la clé API

1. **Dashboard Resend** → API Keys
2. Create API Key
3. Name: `iDoc Production`
4. Permission: `Full Access`
5. Copier la clé (commence par `re_`)

### 4. Configurer dans Supabase

```bash
# Via CLI (si installé)
supabase secrets set RESEND_API_KEY=re_votre_cle_ici

# OU via Dashboard
# Project Settings → Edge Functions → Secrets
# Ajouter: RESEND_API_KEY = re_votre_cle_ici
```

### 5. Tester

```bash
curl -X POST https://votre-projet.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer VOTRE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["test@example.com"],
    "subject": "Test Email",
    "html": "<p>Hello from iDoc!</p>"
  }'
```

## Configuration Email dans Supabase Auth

Pour utiliser vos emails personnalisés pour l'authentification :

1. **Dashboard Supabase** → Settings → Auth → SMTP Settings
2. Activer "Custom SMTP"
3. Configuration :

```
Host: smtp.resend.com
Port: 587
Username: resend
Password: re_votre_cle_ici (votre clé API)
Sender email: noreply@id0c.com
Sender name: iDoc
```

4. **Save**
5. **Tester** : Send Test Email

## Avantages d'utiliser Resend

✅ Emails depuis votre propre domaine (`@id0c.com`)
✅ Meilleure délivrabilité
✅ Templates HTML personnalisés
✅ Tracking des ouvertures et clics
✅ Webhooks pour les bounces
✅ Statistiques détaillées

## Alternative : Continuer avec Supabase

Si vous ne configurez pas Resend, **tout fonctionne quand même** :

- Emails envoyés depuis `noreply@supabase.co`
- Réinitialisation de mot de passe ✅
- Confirmation d'email ✅
- Invitations d'utilisateurs ✅

La seule différence est que les emails viennent de Supabase au lieu de votre domaine.

## Résumé

| Fonctionnalité | Sans Resend | Avec Resend |
|----------------|-------------|-------------|
| Mot de passe oublié | ✅ Fonctionne | ✅ Fonctionne |
| Connexion sociale | ✅ Fonctionne | ✅ Fonctionne |
| Email depuis `@id0c.com` | ❌ Non | ✅ Oui |
| Templates personnalisés | Limité | ✅ Total |
| Statistiques détaillées | ❌ Non | ✅ Oui |
| Coût | Gratuit | Gratuit (3k/mois) |

## Décision recommandée

**Pour le lancement immédiat** : Ignorer Resend
- Tout fonctionne sans configuration supplémentaire
- Vous pouvez l'ajouter plus tard quand vous aurez du trafic
- Concentrez-vous sur le déploiement

**Plus tard (quand vous avez des utilisateurs)** : Configurer Resend
- Meilleure image de marque (emails depuis votre domaine)
- Professionnalisme accru
- Meilleures statistiques
