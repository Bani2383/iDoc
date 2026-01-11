# Shadow Mode & Notifications - Guide Complet

## 📚 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Shadow Mode](#shadow-mode)
3. [Système de Notifications](#système-de-notifications)
4. [Edge Functions](#edge-functions)
5. [Base de Données](#base-de-données)
6. [Configuration](#configuration)
7. [Guide d'utilisation](#guide-dutilisation)
8. [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

Deux nouvelles fonctionnalités avancées ont été ajoutées au système iDoc:

### 🧪 Shadow Mode
Testez des templates en parallèle de la production sans impact sur les utilisateurs.

### 📧 Notifications
Recevez des alertes automatiques par email et Slack pour les événements critiques.

---

## Shadow Mode

### Qu'est-ce que le Shadow Mode?

Le Shadow Mode permet de tester des templates de manière **silencieuse** en arrière-plan:

- ✅ **Tests non-intrusifs**: Aucun impact sur la production
- ✅ **Profils de test réalistes**: Standard, Edge Cases, Minimal
- ✅ **Validation automatique**: Détection d'erreurs avant déploiement
- ✅ **Historique complet**: Suivi de tous les tests exécutés

### Profils de Test

#### 1. Standard
Simule un utilisateur typique avec des données normales:
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0100",
  "address": "123 Main St, City, Country",
  "date": "2026-01-11",
  "amount": "1000"
}
```

#### 2. Edge Case
Teste les cas limites avec caractères spéciaux:
```json
{
  "full_name": "François O'Brien-Müller",
  "email": "test+special@example.co.uk",
  "phone": "+33-1-23-45-67-89",
  "address": "123 Rue de l'Église, Montréal, Québec",
  "amount": "999999.99"
}
```

#### 3. Minimal
Vérifie avec le minimum de données requises:
```json
{
  "full_name": "A",
  "email": "a@b.c",
  "date": "2024-01-01"
}
```

### Fonctionnalités

- **Test individuel**: Teste un template spécifique
- **Test batch**: Teste tous les templates avec Shadow Mode activé
- **Résultats détaillés**: Erreurs, warnings, temps d'exécution
- **Preview output**: Aperçu du document généré
- **Historique**: 10 derniers tests par template

### Validations Automatiques

Le Shadow Mode vérifie:

1. **Champs requis**: Tous les champs obligatoires sont présents
2. **Format email**: Validation du format d'email
3. **Types de données**: Validation number/text/date
4. **Patterns regex**: Validation des patterns de validation
5. **Placeholders**: Détection de placeholders non remplis
6. **Output qualité**: Détection de valeurs undefined/null
7. **Longueur output**: Warning si output trop court

---

## Système de Notifications

### Vue d'ensemble

Le système de notifications envoie automatiquement des alertes pour:

- 🔴 **Alertes CRITICAL**: Problèmes bloquants
- 🟠 **Alertes HIGH**: Problèmes importants
- 🟡 **Alertes MEDIUM**: Problèmes à surveiller
- 🔵 **Alertes LOW**: Informations générales

### Canaux de Notification

#### 1. Email

**Configuration:**
- Liste de destinataires (séparés par virgules)
- Emails HTML formatés avec détails complets
- Inclut severity, type, message, détails techniques

**Format:**
```
Sujet: [iDoc Alert] CRITICAL - template_syntax_error

Corps:
🔴 CRITICAL Alert
Type: template_syntax_error
Template ID: abc-123

Message: Template has syntax errors that prevent rendering

Détails:
{
  "errors": [...],
  "line": 42
}

Alert ID: alert-xxx
```

#### 2. Slack

**Configuration:**
- Webhook URL Slack
- Messages formatés avec blocks
- Support des emojis de severity
- Détails en code blocks

**Obtenir un Webhook Slack:**
1. Aller sur api.slack.com/apps
2. Créer une app ou sélectionner existante
3. Activer "Incoming Webhooks"
4. Ajouter webhook au workspace
5. Copier l'URL webhook

**Format Message:**
```
🔴 CRITICAL Alert

Type: template_syntax_error
Severity: CRITICAL

Message:
Template has syntax errors that prevent rendering

Template ID: abc-123
```

### Niveaux de Severity

Configuration du niveau minimum pour notifications:

- **LOW**: Toutes les alertes (spam potentiel)
- **MEDIUM**: Alertes importantes et critiques (recommandé)
- **HIGH**: Alertes critiques seulement
- **CRITICAL**: Urgences seulement

### Types d'Alertes

Le système génère automatiquement des alertes pour:

1. **template_syntax_error**: Erreur de syntaxe template
2. **template_failed_preview**: Preview métier échoue
3. **unknown_variables**: Variables non déclarées détectées
4. **security_violation**: Tentative de violation sécurité
5. **publish_blocked**: Publication bloquée par règles

---

## Edge Functions

### idoc-shadow-test

**Endpoint:** `/functions/v1/idoc-shadow-test`

**Méthode:** POST

**Authentification:** JWT required (Bearer token)

**Body:**
```json
{
  "template_id": "uuid",
  "profiles": [
    {
      "name": "custom",
      "description": "Test personnalisé",
      "data": {
        "field1": "value1"
      }
    }
  ]
}
```

**Response:**
```json
{
  "template_id": "uuid",
  "overall_passed": true,
  "total_errors": 0,
  "total_warnings": 2,
  "profiles_tested": 3,
  "results": [
    {
      "profile": "standard",
      "passed": true,
      "errors": [],
      "warnings": ["Unfilled placeholders: {{optional_field}}"],
      "execution_time_ms": 45,
      "output_preview": "Generated document preview..."
    }
  ]
}
```

### idoc-alert-notify

**Endpoint:** `/functions/v1/idoc-alert-notify`

**Méthode:** POST

**Authentification:** JWT required

**Body:**
```json
{
  "alert_id": "alert-uuid",
  "template_id": "template-uuid",
  "severity": "CRITICAL",
  "alert_type": "template_syntax_error",
  "message": "Template has critical errors",
  "details": {
    "errors": ["line 42: syntax error"],
    "template_code": "TEMP_001"
  }
}
```

**Response:**
```json
{
  "alert_id": "alert-uuid",
  "email_sent": true,
  "slack_sent": true,
  "errors": [],
  "success": true
}
```

---

## Base de Données

### Tables

#### shadow_test_results

Stocke les résultats des tests Shadow Mode.

```sql
CREATE TABLE shadow_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES idoc_guided_templates(id),
  test_profile text NOT NULL,
  passed boolean NOT NULL DEFAULT false,
  errors_count int NOT NULL DEFAULT 0,
  warnings_count int NOT NULL DEFAULT 0,
  execution_time_ms int NOT NULL DEFAULT 0,
  test_data jsonb,
  result_data jsonb,
  tested_at timestamptz DEFAULT now()
);
```

#### alert_settings

Configuration des notifications.

```sql
CREATE TABLE alert_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_enabled boolean DEFAULT false,
  email_recipients text[] DEFAULT '{}',
  slack_enabled boolean DEFAULT false,
  slack_webhook_url text,
  min_severity_level text DEFAULT 'MEDIUM',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Colonnes Ajoutées

#### idoc_guided_templates

```sql
ALTER TABLE idoc_guided_templates ADD COLUMN IF NOT EXISTS
  shadow_mode_enabled boolean DEFAULT false;

ALTER TABLE idoc_guided_templates ADD COLUMN IF NOT EXISTS
  shadow_tested_at timestamptz;
```

#### template_alerts

```sql
ALTER TABLE template_alerts ADD COLUMN IF NOT EXISTS
  sent_email boolean DEFAULT false;

ALTER TABLE template_alerts ADD COLUMN IF NOT EXISTS
  sent_slack boolean DEFAULT false;
```

### Trigger Automatique

Un trigger envoie automatiquement les notifications:

```sql
CREATE TRIGGER trigger_new_alert_notification
  AFTER INSERT ON template_alerts
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_alert_notification();
```

---

## Configuration

### 1. Activer Shadow Mode pour un Template

**Via UI:**
1. Admin Dashboard → Shadow Mode
2. Sélectionner template
3. Cocher "Shadow Mode Enabled"
4. Cliquer "Run Test" pour test manuel

**Via SQL:**
```sql
UPDATE idoc_guided_templates
SET shadow_mode_enabled = true
WHERE template_code = 'TEMP_001';
```

### 2. Configurer les Notifications

**Via UI:**
1. Admin Dashboard → Notifications
2. Configurer niveau minimum de severity
3. Activer/Configurer Email:
   - Cocher "Email Enabled"
   - Entrer emails séparés par virgules
4. Activer/Configurer Slack:
   - Cocher "Slack Enabled"
   - Entrer webhook URL
5. Cliquer "Save Settings"
6. Cliquer "Test Notifications" pour vérifier

**Via SQL:**
```sql
INSERT INTO alert_settings (
  email_enabled,
  email_recipients,
  slack_enabled,
  slack_webhook_url,
  min_severity_level
) VALUES (
  true,
  ARRAY['admin@example.com', 'team@example.com'],
  true,
  'https://hooks.slack.com/services/YOUR/WEBHOOK/URL',
  'MEDIUM'
);
```

---

## Guide d'utilisation

### Workflow Shadow Mode

#### 1. Créer un nouveau template

```
1. Centre Validation → Créer template
2. Remplir champs, contenu
3. Activer Shadow Mode
4. Lancer test initial
```

#### 2. Analyser résultats

```
✅ Passed: Template fonctionne correctement
  → Passer en trust level MEDIUM
  → Lancer preview métier
  → Publier si OK

❌ Failed: Erreurs détectées
  → Consulter erreurs détaillées
  → Corriger template
  → Relancer test
```

#### 3. Tests réguliers

```
- Run Batch Tests: Teste tous templates Shadow Mode
- Historique: Consulter évolution qualité
- Monitoring: Détecter régressions
```

### Workflow Notifications

#### 1. Configuration initiale

```
1. Notifications → Configurer
2. Choisir severity minimum (MEDIUM recommandé)
3. Ajouter emails destinataires
4. Optionnel: Configurer Slack
5. Test Notifications
```

#### 2. Recevoir une alerte

**Email:**
```
1. Vérifier inbox
2. Lire severity + type
3. Consulter message + détails
4. Aller sur Admin Dashboard → Alertes
5. Consulter alert complète
6. Corriger problème
7. Acquitter alerte
```

**Slack:**
```
1. Notification dans canal
2. Cliquer pour détails
3. Suivre même processus
```

#### 3. Gérer les alertes

```
Admin Dashboard → Alertes:

- Voir toutes alertes non acquittées
- Filtrer par severity/type/date
- Voir détails alert
- Acquitter individuellement
- Acquitter en batch
```

---

## Troubleshooting

### Shadow Mode

#### Les tests ne s'exécutent pas

**Symptômes:**
- Bouton "Run Test" ne fait rien
- Erreur "Not authenticated"

**Solutions:**
1. Vérifier que vous êtes admin connecté
2. Vérifier edge function déployée: `/functions/v1/idoc-shadow-test`
3. Vérifier logs Supabase pour erreurs
4. Vérifier permissions RLS sur `shadow_test_results`

#### Tests échouent systématiquement

**Symptômes:**
- Tous profils failed
- Erreurs "Missing required field"

**Solutions:**
1. Vérifier champs `required` dans template
2. Vérifier correspondance field IDs dans profils test
3. Vérifier validation patterns dans champs
4. Tester avec profil "minimal" d'abord

#### Historique vide

**Symptômes:**
- "No test results yet"
- Tests exécutés mais pas sauvegardés

**Solutions:**
1. Vérifier table `shadow_test_results` existe
2. Vérifier RLS policies permettent INSERT/SELECT
3. Vérifier logs edge function pour erreurs INSERT
4. Vérifier `template_id` correspond à template existant

### Notifications

#### Emails non reçus

**Symptômes:**
- Test notification réussit mais pas d'email
- `email_sent: true` mais inbox vide

**Solutions:**
1. **IMPORTANT**: Emails loggés en console (dev mode)
2. En production: Configurer SMTP service (SendGrid, Mailgun)
3. Vérifier emails valides et pas typos
4. Vérifier spam folder
5. Implémenter vrai service email en production

#### Slack notifications échouent

**Symptômes:**
- `slack_sent: false`
- Erreur "Slack API error"

**Solutions:**
1. Vérifier webhook URL valide et complète
2. Tester webhook URL avec curl:
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"Test from iDoc"}'
```
3. Vérifier webhook pas révoqué
4. Re-créer webhook si nécessaire

#### Alertes ne déclenchent pas notifications

**Symptômes:**
- Alertes créées dans DB
- Pas de notifications envoyées
- `sent_email` et `sent_slack` = false

**Solutions:**
1. Vérifier `alert_settings` existe et configuré
2. Vérifier severity alert >= min_severity_level
3. Vérifier email_enabled OU slack_enabled = true
4. Vérifier trigger `trigger_new_alert_notification` actif
5. Vérifier logs fonction `handle_new_alert_notification`

#### Test notifications échoue

**Symptômes:**
- Erreur "Failed to send test notification"
- `errors: [...]` dans response

**Solutions:**
1. Vérifier edge function `/functions/v1/idoc-alert-notify` déployée
2. Vérifier authentification (JWT valid)
3. Consulter erreurs détaillées dans response
4. Vérifier logs Supabase Edge Functions
5. Vérifier pas de problèmes réseau/firewall

---

## Bonnes Pratiques

### Shadow Mode

1. **Activer sur templates en développement**: Pas sur templates production stables
2. **Tester avant publication**: Toujours run test avant publish
3. **Créer profils personnalisés**: Adapter aux cas d'usage spécifiques
4. **Monitorer régulièrement**: Run batch tests hebdomadaire
5. **Archiver résultats**: Exporter historique si nécessaire

### Notifications

1. **Severity MEDIUM minimum**: Éviter spam avec LOW
2. **Multiple destinataires**: Pas un seul point de défaillance
3. **Slack + Email**: Redondance recommandée
4. **Tester régulièrement**: Vérifier config reste valide
5. **Acquitter rapidement**: Maintenir liste alertes clean
6. **Analyser patterns**: Si trop d'alertes, corriger source

---

## Statistiques et Métriques

### Shadow Mode

Métriques trackées:
- **Pass rate**: % tests réussis par template
- **Execution time**: Temps moyen par profil
- **Error frequency**: Erreurs communes détectées
- **Coverage**: % templates testés

### Notifications

Métriques trackées:
- **Alerts par severity**: Distribution CRITICAL/HIGH/MEDIUM/LOW
- **Delivery rate**: % notifications envoyées avec succès
- **Response time**: Temps entre alert et acquittement
- **Alert types**: Distribution par type d'alerte

---

## Résumé

### Shadow Mode ✅
- 🧪 Tests silencieux en arrière-plan
- 3 profils: Standard, Edge Case, Minimal
- Validations: champs, types, placeholders, output
- Historique complet des tests
- Batch testing disponible

### Notifications ✅
- 📧 Email avec HTML formaté
- 💬 Slack avec blocks formatés
- 4 niveaux severity: LOW, MEDIUM, HIGH, CRITICAL
- Configuration niveau minimum
- Trigger automatique sur nouvelles alertes
- Multiple destinataires supportés

### Edge Functions ✅
- `/functions/v1/idoc-shadow-test`: Tests Shadow Mode
- `/functions/v1/idoc-alert-notify`: Envoi notifications
- Authentication JWT required
- CORS configuré
- Error handling robuste

### Database ✅
- `shadow_test_results`: Historique tests
- `alert_settings`: Config notifications
- Colonnes ajoutées templates: `shadow_mode_enabled`, `shadow_tested_at`
- Colonnes ajoutées alerts: `sent_email`, `sent_slack`
- Trigger automatique notifications

### UI ✅
- Admin Dashboard → Shadow Mode (nouveau)
- Admin Dashboard → Notifications (nouveau)
- Intégration seamless dans workflow existant
- UX intuitive et guidée
- Test direct depuis UI

---

## Support

Pour questions ou problèmes:

1. Consulter ce guide en premier
2. Vérifier logs Supabase (Database + Edge Functions)
3. Tester edge functions directement via curl
4. Vérifier RLS policies si erreurs permissions
5. Contacter équipe si problème persiste

**Logs Supabase:**
- Dashboard Supabase → Logs → Edge Functions
- Dashboard Supabase → Logs → Postgres

**Tester Edge Function:**
```bash
# Shadow Test
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/idoc-shadow-test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"template_id":"uuid"}'

# Notification
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/idoc-alert-notify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"alert_id":"test","severity":"MEDIUM","alert_type":"test","message":"Test"}'
```

---

**Document Version:** 1.0
**Date:** 2026-01-11
**Status:** Production Ready ✅
