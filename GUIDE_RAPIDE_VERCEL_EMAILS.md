# ⚡ Guide Rapide - Emails sur Vercel (15 min)

## 🎯 Votre domaine est sur Bolt/Vercel? Parfait!

**Temps total: 15 minutes**

---

## 📋 Checklist Rapide

```
[ ] Étape 1: Compte Resend (2 min)
[ ] Étape 2: Ajouter domaine dans Resend (2 min)
[ ] Étape 3: Configurer DNS sur Vercel (5 min)
[ ] Étape 4: Vérifier domaine (2 min)
[ ] Étape 5: Déployer functions (3 min)
[ ] Étape 6: Tester (1 min)
```

---

## 🚀 Étape par Étape

### 1️⃣ Créer Compte Resend (2 min)

```
1. Aller sur: https://resend.com
2. Cliquer "Sign Up"
3. Entrer email + mot de passe
4. Confirmer email
5. Se connecter
```

✅ **Plan gratuit: 3,000 emails/mois**

---

### 2️⃣ Ajouter Domaine (2 min)

**Dans Resend Dashboard:**

```
1. Cliquer "Domains" (menu gauche)
2. Cliquer "Add Domain"
3. Entrer votre domaine: id0c.com
   (ou le domaine que vous avez sur Vercel)
4. Cliquer "Add"
```

**Resend va afficher 3 records DNS:**

```
📝 Copier ces 3 records (vous en aurez besoin!)

Record 1 (SPF):
  Type: TXT
  Name: @
  Value: v=spf1 include:_spf.resend.com ~all

Record 2 (DKIM):
  Type: CNAME
  Name: resend._domainkey
  Value: [valeur unique fournie par Resend]

Record 3 (Vérification):
  Type: TXT
  Name: _resend
  Value: [code unique fourni par Resend]
```

⚠️ **Garder cette page ouverte!**

---

### 3️⃣ Configurer DNS sur Vercel (5 min)

**Ouvrir nouvel onglet:**

```
1. Aller sur: https://vercel.com/dashboard
2. Cliquer sur votre projet
3. Settings → Domains
4. Cliquer sur votre domaine (ex: id0c.com)
5. Défiler jusqu'à "DNS Records"
```

**Ajouter Record 1 (SPF):**

```
Cliquer "Add" en haut à droite

Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

→ Cliquer "Save"
```

**Ajouter Record 2 (DKIM):**

```
Cliquer "Add"

Type: CNAME
Name: resend._domainkey
Value: [copier depuis Resend - ligne "Value" du Record 2]

→ Cliquer "Save"
```

**Ajouter Record 3 (Vérification):**

```
Cliquer "Add"

Type: TXT
Name: _resend
Value: [copier depuis Resend - ligne "Value" du Record 3]

→ Cliquer "Save"
```

✅ **Vous devriez maintenant voir 3 nouveaux records dans la liste!**

---

### 4️⃣ Vérifier Domaine (2 min)

**Retourner sur Resend:**

```
1. Dashboard → Domains
2. Votre domaine → "Verify DNS Records"
3. Attendre 10-30 secondes...
4. Status doit devenir "Verified" ✅
```

**Si status reste "Pending":**
- Attendre 5 minutes (propagation DNS)
- Re-cliquer "Verify DNS Records"
- Si toujours pending après 30 min, vérifier records Vercel

**Statuts:**
```
🟡 Pending   → Attendre propagation DNS
✅ Verified  → Parfait! Continuer
🔴 Failed    → Vérifier records DNS
```

---

### 5️⃣ Obtenir API Key + Déployer (3 min)

**Dans Resend Dashboard:**

```
1. API Keys → "Create API Key"
2. Name: iDoc Production
3. Permission: Full Access
4. Cliquer "Create"
5. 📋 COPIER LA CLÉ (commence par re_...)
```

⚠️ **Copier maintenant! Elle ne s'affichera qu'une fois.**

**Dans votre terminal:**

```bash
# Déployer avec le script automatique
./deploy-email-functions.sh re_VOTRE_CLE_ICI
```

Le script va:
- ✅ Déployer send-email
- ✅ Déployer idoc-alert-notify
- ✅ Configurer secret RESEND_API_KEY
- ✅ Proposer test

**Quand le script demande si vous voulez tester:**
```
Voulez-vous tester l'envoi d'email? (y/n) y
Entrer votre email de test: votre.email@gmail.com
```

---

### 6️⃣ Tester (1 min)

**Vous devriez recevoir un email dans 30-60 secondes:**

```
From: iDoc Alerts <alerts@id0c.com>
Subject: Test iDoc - Email Function

🎉 Test Réussi!

L'intégration Resend fonctionne parfaitement.
Vous pouvez maintenant envoyer des emails depuis id0c.com!
```

✅ **Si vous avez reçu l'email: TERMINÉ!**

---

## 🎉 C'est Tout!

Votre système d'emails est maintenant **opérationnel**!

### Ce qui fonctionne maintenant:

```
✅ Alertes système par email
   → Détecte erreurs templates
   → Envoie email automatiquement
   → From: alerts@id0c.com

✅ Prêt pour notifications clients
   → Document prêt
   → Confirmation paiement
   → etc.

✅ Monitoring dans Resend
   → Dashboard: https://resend.com/dashboard
   → Voir tous emails envoyés
   → Analytics & statistiques
```

---

## 📧 Adresses Email Disponibles

Toutes ces adresses **fonctionnent automatiquement**:

```
alerts@id0c.com       ← Déjà configuré
no-reply@id0c.com     ← Prêt à utiliser
support@id0c.com      ← Prêt à utiliser
hello@id0c.com        ← Prêt à utiliser
billing@id0c.com      ← Prêt à utiliser
team@id0c.com         ← Prêt à utiliser
contact@id0c.com      ← Prêt à utiliser
```

Pas de configuration supplémentaire! Utilisez n'importe quelle adresse @id0c.com.

---

## 🧪 Tester dans Admin Dashboard

```
1. Aller dans Admin Dashboard
2. Onglet "Notifications"
3. Activer "Enable Email Notifications"
4. Ajouter votre email dans "Email Recipients"
5. Cliquer "Save Settings"
6. Cliquer "Test Notifications"
7. Vérifier inbox (email sous 30s)
```

---

## 📊 Monitoring

**Dashboard Resend:**
```
https://resend.com/dashboard

Vous verrez:
- 📧 Emails envoyés
- ✅ Taux de délivrance
- 📈 Opens / Clicks
- 🚫 Bounces / Complaints
- 📊 Quota (0/3,000)
```

**Logs Supabase:**
```bash
supabase functions logs send-email --tail
supabase functions logs idoc-alert-notify --tail
```

---

## ❓ Problèmes?

### Email pas reçu

**Vérifier:**
```
1. Dossier Spam/Promotions
2. Logs Supabase: supabase functions logs send-email
3. Dashboard Resend → Logs (voir erreurs)
4. Status domaine Resend (doit être Verified ✅)
```

### Domaine pas vérifié

**Solutions:**
```
1. Attendre 15-30 min (propagation DNS)
2. Vérifier records dans Vercel (Settings → Domains → DNS)
3. Re-cliquer "Verify DNS Records" dans Resend
4. Vérifier avec: dig TXT id0c.com
```

### Script déploiement erreur

**Vérifier:**
```
1. Supabase CLI installé: npm i -g supabase
2. Authentifié: supabase login
3. API Key correcte (commence par re_)
4. Dans le bon dossier projet
```

---

## 🎯 Prochaines Étapes

Maintenant que les emails fonctionnent:

### Court terme (cette semaine)
```
[ ] Configurer DMARC (meilleure délivrabilité)
[ ] Tester score mail-tester.com (objectif: 10/10)
[ ] Créer templates emails réutilisables
```

### Moyen terme (ce mois)
```
[ ] Implémenter notification "document prêt"
[ ] Implémenter confirmation paiement
[ ] Créer système unsubscribe
[ ] Analytics ouvertures/clics
```

### Long terme
```
[ ] Newsletter système
[ ] Email automation
[ ] A/B testing
[ ] Segmentation utilisateurs
```

---

## 📚 Documentation Complète

Si vous voulez plus de détails:

```
CONFIGURATION_DNS_VERCEL.md          ← Guide détaillé Vercel
GUIDE_CONFIGURATION_EMAILS.md        ← Guide complet général
EMAIL_INTEGRATION_SUMMARY.md         ← Architecture & API
ETAPES_DEPLOIEMENT_EMAILS.md         ← Checklist complète
```

---

## ✅ Récapitulatif

**Ce que vous avez fait:**
```
✅ Compte Resend créé (gratuit)
✅ Domaine id0c.com ajouté
✅ 3 records DNS configurés sur Vercel
✅ Domaine vérifié dans Resend
✅ API Key obtenue
✅ Edge functions déployées
✅ Secret RESEND_API_KEY configuré
✅ Email test envoyé et reçu
```

**Capacité actuelle:**
```
✅ 3,000 emails/mois
✅ 100 emails/jour
✅ Envoi depuis id0c.com
✅ Monitoring complet
✅ Production-ready
```

**Coût:**
```
💰 Resend: $0/mois (plan gratuit)
💰 Domaine: déjà payé sur Bolt
💰 Supabase: inclus dans votre plan
💰 TOTAL: $0/mois
```

---

## 🚀 Système Opérationnel!

**Félicitations!** Vous avez un système d'emails professionnel complet en 15 minutes.

**Questions?** Consultez la documentation complète dans `CONFIGURATION_DNS_VERCEL.md`

**Besoin d'aide?**
- Logs: `supabase functions logs send-email`
- Support Resend: support@resend.com
- Documentation: https://resend.com/docs

---

**Temps écoulé: 15 minutes** ⏱️

**Status: ✅ OPÉRATIONNEL** 🎉
