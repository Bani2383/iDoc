# 🚀 ACTIONS MANUELLES - 3 CLICS

## ⚡ TOUT EST PRÊT AUTOMATIQUEMENT

✅ **Edge Functions configurées** (Resend intégré)
✅ **Scripts de validation créés**
✅ **Documentation complète disponible**

---

## 📋 VOUS DEVEZ FAIRE 3 CHOSES UNIQUEMENT

### ❶ ACTIVER VERCEL DNS (2 minutes)

```
1. https://vercel.com/dashboard
2. Sélectionner votre projet iDoc
3. Settings → Domains
4. Cliquer sur "id0c.com"
5. Cliquer sur "Use Vercel DNS"
6. NOTER les nameservers affichés
```

**Exemple de nameservers** (les vôtres seront différents):
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

---

### ❷ CONFIGURER BOLT NAMESERVERS (2 minutes)

```
1. https://bolt.new
2. Project Settings
3. Domains & Hosting
4. Trouver "id0c.com"
5. Nameservers: REMPLACER par ceux de Vercel (étape ❶)
6. Désactiver toute gestion DNS chez Bolt
7. Save
```

**⏱️ ATTENDRE**: 15-30 minutes pour propagation DNS

---

### ❸ CONFIGURER RESEND + RECORDS DNS (10 minutes)

#### A) Ajouter les records WEB dans Vercel

Dans Vercel Dashboard → Domains → id0c.com → DNS Records:

```
Record 1:
  Type:  A
  Name:  @
  Value: 76.76.21.21

Record 2:
  Type:  CNAME
  Name:  www
  Value: cname.vercel-dns.com

Record 3:
  Type:  TXT
  Name:  @
  Value: v=spf1 include:_spf.resend.com ~all

Record 4:
  Type:  TXT
  Name:  _dmarc
  Value: v=DMARC1; p=none; rua=mailto:postmaster@id0c.com
```

#### B) Configurer Resend

```
1. https://resend.com/domains
2. Add Domain → "id0c.com"
3. Copier les 2 valeurs affichées:
   - DKIM (resend._domainkey)
   - Verification (_resend)
```

#### C) Ajouter records Resend dans Vercel

```
Record 5:
  Type:  CNAME
  Name:  resend._domainkey
  Value: [depuis Resend Dashboard]

Record 6:
  Type:  TXT
  Name:  _resend
  Value: [depuis Resend Dashboard]
```

#### D) Vérifier Resend

```
Dans Resend Dashboard:
→ Cliquer "Verify Domain"
→ Attendre statut "Verified" (peut prendre 5-10 min)
```

#### E) Configurer Supabase Secret

```
1. https://resend.com/api-keys
   → Create API Key
   → Nom: "iDoc Production"
   → Permission: "Sending Access"
   → COPIER la clé (re_...)

2. https://supabase.com/dashboard/project/ffujpjaaramwhtmzqhlx/settings/vault
   → New Secret
   → Name: RESEND_API_KEY
   → Secret: [coller clé Resend]
   → Add Secret
```

---

## ✅ VALIDATION AUTOMATIQUE

Une fois ces 3 étapes terminées, lancez:

```bash
chmod +x scripts/validate-dns-setup.sh
./scripts/validate-dns-setup.sh
```

Ce script vérifie automatiquement:
- Nameservers Vercel
- A Records
- HTTPS/SSL
- SPF, DKIM, DMARC
- Resend verification
- Edge Functions

---

## 🧪 TEST EMAIL

```bash
curl -X POST \
  https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjE1MjYsImV4cCI6MjA0NjQ5NzUyNn0.m3wt4oxwjJbjk2iwVWGXtV0YT1GkCB_h9GgRW78rKqo" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["test@mail-tester.com"],
    "subject": "Test Production iDoc",
    "html": "<h1>Email depuis id0c.com</h1><p>DNS Vercel + Resend configurés</p>"
  }'
```

Puis vérifiez: https://www.mail-tester.com
**Score attendu**: 10/10

---

## 📚 DOCUMENTATION COMPLÈTE

Si besoin de détails:
- `GUIDE_DNS_VERCEL.md` - Guide détaillé complet
- `CHECKLIST_PRODUCTION_DNS.md` - Checklist exhaustive
- `scripts/setup-vercel-dns.sh` - Script interactif guidé

---

## ⏱️ TIMELINE TOTALE

```
00:00 → Activer Vercel DNS              2 min   (ACTION 1)
00:02 → Configurer Bolt nameservers     2 min   (ACTION 2)
00:04 → Attendre propagation           20 min   (ATTENTE)
00:24 → Ajouter records DNS            10 min   (ACTION 3)
00:34 → Validation automatique          2 min   (SCRIPT)
00:36 → ✅ TERMINÉ
```

**Durée active**: 16 minutes
**Durée totale**: 36 minutes (avec attente DNS)

---

## 🔄 ROLLBACK SI PROBLÈME

Si besoin de revenir en arrière:

```
1. Bolt Dashboard
2. Domains → id0c.com
3. Nameservers → Restaurer anciens nameservers Bolt
4. Save
```

Propagation: 15-30 minutes

---

## 🆘 SUPPORT

Si problème lors de la validation:

1. Vérifier propagation DNS: https://dnschecker.org/#NS/id0c.com
2. Vérifier Vercel Dashboard: domaine "Valid Configuration"
3. Vérifier Resend Dashboard: domaine "Verified"
4. Relancer `./scripts/validate-dns-setup.sh`

---

## ✨ RÉCAPITULATIF

Ce qui est fait automatiquement par moi:
- ✅ Edge Functions `send-email` et `idoc-alert-notify` déployées
- ✅ Configuration Resend intégrée
- ✅ From par défaut: `alerts@id0c.com`
- ✅ Scripts de validation créés
- ✅ Documentation complète générée

Ce que VOUS devez faire:
1. Activer Vercel DNS (2 clics)
2. Changer nameservers Bolt (1 formulaire)
3. Configurer Resend + records DNS (6 records + 1 API key)

**C'est tout !**
