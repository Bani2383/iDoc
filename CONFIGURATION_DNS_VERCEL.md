# 📧 Configuration DNS pour Emails - Vercel/Bolt

## 🎯 Vous avez acheté votre domaine sur Bolt

Parfait! La configuration DNS sera très simple via le dashboard Vercel.

---

## 🔍 Étape 1: Identifier Votre Domaine

### Via Dashboard Vercel

```
1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet
3. Onglet "Settings" → "Domains"
4. Voir vos domaines configurés
```

**Exemple:**
- Domaine production: `id0c.com`
- Domaine staging: `id0c-staging.vercel.app`

**Note:** Si vous utilisez `vercel.app`, vous ne pourrez **pas** envoyer des emails depuis ce domaine (limitation Vercel). Vous devez utiliser un domaine personnalisé comme `id0c.com`.

---

## ⚡ Étape 2: Créer Compte Resend (5 min)

```
1. https://resend.com
2. Sign Up (Email + Password)
3. Confirmer email
4. Se connecter
```

**Plan Gratuit:**
- ✅ 3,000 emails/mois
- ✅ 100 emails/jour
- ✅ Parfait pour démarrer

---

## 📧 Étape 3: Ajouter Domaine dans Resend (3 min)

```
1. Dashboard Resend → Domains
2. "Add Domain"
3. Entrer: id0c.com (votre domaine)
4. "Add"
```

Resend va afficher **3 records DNS** à configurer:

### Record 1: SPF (TXT)
```
Type: TXT
Name: @ (ou votre domaine)
Value: v=spf1 include:_spf.resend.com ~all
```

### Record 2: DKIM (CNAME)
```
Type: CNAME
Name: resend._domainkey
Value: [valeur fournie par Resend]
```

### Record 3: Vérification (TXT)
```
Type: TXT
Name: _resend
Value: [valeur fournie par Resend]
```

**⚠️ IMPORTANT:** Copiez ces valeurs, vous en aurez besoin!

---

## 🛠️ Étape 4: Configurer DNS sur Vercel (10 min)

### Méthode 1: Via Dashboard Vercel (RECOMMANDÉ)

#### 1. Aller dans DNS Settings

```
1. https://vercel.com/dashboard
2. Votre projet → Settings → Domains
3. Cliquer sur votre domaine (ex: id0c.com)
4. Défiler jusqu'à "DNS Records"
```

#### 2. Ajouter Record SPF (TXT)

```
Cliquer "Add" → "TXT Record"

Name: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: Auto (ou 3600)

→ "Add"
```

#### 3. Ajouter Record DKIM (CNAME)

```
Cliquer "Add" → "CNAME Record"

Name: resend._domainkey
Value: [copier depuis Resend dashboard]
TTL: Auto (ou 3600)

→ "Add"
```

**Note:** Vercel peut ajouter automatiquement `.id0c.com` au Name, donc entrez juste `resend._domainkey`

#### 4. Ajouter Record Vérification (TXT)

```
Cliquer "Add" → "TXT Record"

Name: _resend
Value: [copier depuis Resend dashboard]
TTL: Auto (ou 3600)

→ "Add"
```

#### 5. Résultat Final

Vous devriez voir 3 nouveaux records:

```
✅ TXT   @                     v=spf1 include:_spf.resend.com ~all
✅ CNAME resend._domainkey     resend1.domainkey.resend.com
✅ TXT   _resend              [votre code vérification]
```

---

### Méthode 2: Via Vercel CLI

Si vous préférez la ligne de commande:

```bash
# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Se connecter
vercel login

# Voir les domaines
vercel domains ls

# Ajouter records DNS (pas directement supporté par CLI)
# → Utiliser dashboard Vercel (méthode 1)
```

**Note:** Vercel CLI ne supporte pas l'ajout de records DNS directement. Utilisez le dashboard.

---

### Méthode 3: DNS Externe (Si domaine acheté ailleurs)

Si vous avez acheté `id0c.com` chez un registrar externe (GoDaddy, Namecheap, etc.) mais l'utilisez sur Vercel:

**Option A: DNS géré par Vercel** (recommandé)
1. Pointer nameservers vers Vercel
2. Configurer DNS dans Vercel (méthode 1)

**Option B: DNS géré par registrar**
1. Aller chez votre registrar
2. Ajouter les 3 records DNS là-bas
3. Vérifier avec `dig` ou `nslookup`

---

## ⏱️ Étape 5: Attendre Propagation DNS (15-30 min)

Après avoir ajouté les records:

```
⏳ Propagation DNS: 15 min à 48h (généralement 15-30 min)
```

### Vérifier Propagation

**Via outil en ligne:**
```
https://dnschecker.org

Entrer: id0c.com
Type: TXT
→ Voir "v=spf1 include:_spf.resend.com ~all"

Entrer: resend._domainkey.id0c.com
Type: CNAME
→ Voir la valeur Resend
```

**Via terminal:**
```bash
# Vérifier SPF
dig TXT id0c.com +short

# Vérifier DKIM
dig CNAME resend._domainkey.id0c.com +short

# Vérifier _resend
dig TXT _resend.id0c.com +short
```

---

## ✅ Étape 6: Vérifier Domaine dans Resend (2 min)

Une fois propagation DNS terminée:

```
1. Retour sur Resend Dashboard → Domains
2. Votre domaine → "Verify DNS Records"
3. Status doit devenir "Verified" ✅
```

**Si pas vérifié:**
- Attendre 30 min de plus
- Re-vérifier propagation DNS
- Re-cliquer "Verify DNS Records"

**Statuts possibles:**
```
🟡 Pending    → DNS pas encore propagé (attendre)
✅ Verified   → Tout est OK!
🔴 Failed     → Records DNS incorrects (vérifier)
```

---

## 🔑 Étape 7: Obtenir API Key (2 min)

Dans Resend Dashboard:

```
1. API Keys → "Create API Key"
2. Name: "iDoc Production"
3. Permission: Full Access
4. "Create"
5. 📋 COPIER LA CLÉ (commence par re_...)
```

⚠️ **CRITIQUE:** La clé ne s'affichera qu'une fois! Copiez-la maintenant.

**Format attendu:**
```
re_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Étape 8: Déployer Functions (5 min)

### Option A: Script Automatique (RECOMMANDÉ)

```bash
./deploy-email-functions.sh re_votre_api_key_ici
```

Le script va:
1. ✅ Déployer `send-email`
2. ✅ Déployer `idoc-alert-notify`
3. ✅ Configurer secret `RESEND_API_KEY`
4. ✅ Vérifier configuration
5. ✅ Proposer test email

### Option B: Commandes Manuelles

```bash
# 1. Déployer send-email
supabase functions deploy send-email

# 2. Déployer idoc-alert-notify
supabase functions deploy idoc-alert-notify

# 3. Configurer secret
supabase secrets set RESEND_API_KEY=re_votre_cle

# 4. Vérifier
supabase secrets list
```

**Résultat attendu:**
```
✓ RESEND_API_KEY (configured)
✓ SUPABASE_URL (auto)
✓ SUPABASE_SERVICE_ROLE_KEY (auto)
```

---

## 🧪 Étape 9: Tester (5 min)

### Test 1: Via Admin Dashboard

```
1. Aller dans votre Admin Dashboard
2. Onglet "Notifications"
3. Cocher "Enable Email Notifications"
4. Dans "Email Recipients", ajouter: votre.email@gmail.com
5. Cliquer "Save Settings"
6. Cliquer "Test Notifications"
```

**Résultat attendu:**
- ✅ Email reçu dans 30-60 secondes
- ✅ From: "iDoc Alerts <alerts@id0c.com>"
- ✅ Dans inbox (pas spam)
- ✅ HTML formaté proprement

### Test 2: Via Script

```bash
# Le script de déploiement propose un test
./deploy-email-functions.sh re_votre_cle

# Quand demandé, choisir 'y' pour test
# Entrer votre email
# Vérifier inbox
```

### Test 3: Via curl

```bash
# Remplacer PROJET_ID et SERVICE_KEY
curl -X POST \
  https://PROJET_ID.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SERVICE_KEY" \
  -d '{
    "to": ["test@example.com"],
    "subject": "Test iDoc Email",
    "html": "<h1>Test réussi!</h1><p>Emails fonctionnent.</p>",
    "from": "iDoc Test <alerts@id0c.com>"
  }'
```

**Réponse attendue:**
```json
{
  "success": true,
  "id": "abc123-def456-..."
}
```

---

## 🎯 Cas Spécial: Domaine vercel.app

Si vous n'avez **pas** de domaine personnalisé et utilisez seulement `xxx.vercel.app`:

### ❌ Problème

Vercel **ne permet pas** d'ajouter des records DNS sur les domaines `.vercel.app`. Vous ne pouvez donc **pas** envoyer d'emails depuis `xxx@xxx.vercel.app`.

### ✅ Solutions

#### Option 1: Acheter Domaine Personnalisé (RECOMMANDÉ)

```
1. Acheter domaine (Vercel, Namecheap, GoDaddy, etc.)
   → Coût: ~$10-15/an
   → Exemples: id0c.com, mydocs.io, etc.

2. Ajouter à Vercel:
   → Settings → Domains → Add Domain
   → Suivre instructions Vercel

3. Configurer DNS pour emails (ce guide)
```

#### Option 2: Utiliser Domaine Resend Temporaire

Resend offre un domaine test gratuit:

```
1. Dashboard Resend → Domains
2. Utiliser: onboarding.resend.dev
3. Envoyer depuis: votre-app@onboarding.resend.dev
```

**Limitations:**
- ❌ Pas professionnel
- ❌ Logos/branding Resend
- ❌ Limité à 100 emails
- ✅ Bon pour tester uniquement

#### Option 3: Sous-domaine sur Domaine Existant

Si vous avez un autre domaine ailleurs:

```
1. Créer sous-domaine: mail.votre-autre-domaine.com
2. Configurer DNS sur ce sous-domaine
3. Envoyer depuis: alerts@mail.votre-autre-domaine.com
```

---

## 📊 Vérifier Configuration Complete

### Checklist DNS

Utiliser ces outils pour vérifier:

#### 1. DNS Checker
```
https://dnschecker.org

Vérifier:
- id0c.com (TXT) → SPF record visible
- resend._domainkey.id0c.com (CNAME) → Pointe vers Resend
- _resend.id0c.com (TXT) → Code vérification visible
```

#### 2. MX Toolbox
```
https://mxtoolbox.com/SuperTool.aspx

Entrer: id0c.com
Tests à vérifier:
✅ SPF Record Lookup
✅ DMARC Lookup
```

#### 3. Mail Tester (Après premier envoi)
```
1. Aller sur https://mail-tester.com
2. Noter l'adresse email fournie
3. Envoyer test depuis Admin Dashboard vers cette adresse
4. Retourner sur mail-tester.com
5. Voir score (objectif: ≥ 8/10)
```

---

## 🔧 Troubleshooting Vercel

### Problème: "Cannot add DNS record"

**Cause:** Domaine pas managé par Vercel

**Solution:**
1. Vérifier Settings → Domains
2. Si "DNS" n'est pas géré par Vercel:
   - Pointer nameservers vers Vercel, OU
   - Ajouter records chez votre registrar

### Problème: "Record already exists"

**Cause:** Record déjà présent

**Solution:**
1. Vérifier DNS Records existants
2. Supprimer ancien record similaire
3. Ajouter nouveau record Resend

### Problème: "Propagation takes too long"

**Cause:** TTL trop élevé sur anciens records

**Solution:**
1. Vérifier TTL des records (Settings → Domains → DNS)
2. Si TTL = 86400 (24h), attendre
3. Prochaine fois: utiliser TTL = 3600 (1h)

### Problème: Vercel ajoute domaine automatiquement

**Exemple:** Vous entrez `resend._domainkey` mais Vercel enregistre `resend._domainkey.id0c.com.id0c.com`

**Solution:**
- Vercel gère automatiquement le domaine de base
- Entrer juste: `resend._domainkey` (sans .id0c.com)
- Vercel ajoutera `.id0c.com` automatiquement

---

## 📈 Après Configuration

### Monitoring

**Dashboard Resend:**
```
https://resend.com/dashboard

Voir:
- Emails envoyés aujourd'hui
- Taux de délivrance
- Bounces / Complaints
- Quota utilisé (3,000/mois)
```

**Logs Supabase:**
```bash
# Voir activité
supabase functions logs send-email --tail
supabase functions logs idoc-alert-notify --tail
```

### Adresses Email Disponibles

Une fois domaine vérifié, toutes ces adresses fonctionnent:

```
alerts@id0c.com       ← Alertes système (configuré)
no-reply@id0c.com     ← Notifications auto
support@id0c.com      ← Support client
hello@id0c.com        ← Contact général
billing@id0c.com      ← Facturation
team@id0c.com         ← Équipe
contact@id0c.com      ← Formulaire contact
```

**Pas de configuration supplémentaire nécessaire!** Resend gère automatiquement tous les alias sur votre domaine.

---

## 🎉 Configuration Terminée!

Vous avez maintenant:

✅ **Domaine Vercel configuré pour emails**
- DNS SPF configuré
- DNS DKIM configuré
- Domaine vérifié dans Resend

✅ **Edge Functions déployées**
- `send-email` opérationnelle
- `idoc-alert-notify` mise à jour
- Secret RESEND_API_KEY configuré

✅ **Système email production-ready**
- 3,000 emails/mois (gratuit)
- Envoi depuis id0c.com
- Monitoring & analytics

✅ **Tests réussis**
- Email test reçu
- Pas dans spam
- HTML formaté proprement

---

## 📞 Aide Supplémentaire

### Documentation
- Resend: https://resend.com/docs
- Vercel DNS: https://vercel.com/docs/concepts/projects/domains
- Guide complet: `GUIDE_CONFIGURATION_EMAILS.md`

### Support
- Resend: support@resend.com
- Vercel: https://vercel.com/support

### Logs & Debug
```bash
# Voir erreurs functions
supabase functions logs send-email

# Vérifier DNS
dig TXT id0c.com
dig CNAME resend._domainkey.id0c.com

# Tester delivrabilité
https://mail-tester.com
```

---

**Temps total:** 30 minutes

**Difficulté:** Facile avec ce guide

**Résultat:** Emails professionnels opérationnels depuis votre domaine Vercel! 🚀
