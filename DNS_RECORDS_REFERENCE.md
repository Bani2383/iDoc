# 📋 DNS RECORDS REFERENCE - id0c.com

## 🎯 RÉFÉRENCE RAPIDE

Tous les records DNS à configurer dans **Vercel Dashboard → Domains → id0c.com → DNS Records**

---

## 🌐 WEB RECORDS (Site)

### Record 1: Domaine Racine
```
Type:  A
Name:  @
Value: 76.76.21.21
TTL:   Auto
```

### Record 2: WWW
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   Auto
```

---

## 📧 EMAIL RECORDS (Resend)

### Record 3: SPF (Sender Policy Framework)
```
Type:  TXT
Name:  @
Value: v=spf1 include:_spf.resend.com ~all
TTL:   Auto
```

**Explication**: Autorise Resend à envoyer des emails pour id0c.com

### Record 4: DMARC (Domain-based Message Authentication)
```
Type:  TXT
Name:  _dmarc
Value: v=DMARC1; p=none; rua=mailto:postmaster@id0c.com
TTL:   Auto
```

**Explication**: Configure la politique DMARC et l'adresse de rapport

### Record 5: DKIM (DomainKeys Identified Mail)
```
Type:  CNAME
Name:  resend._domainkey
Value: [À COPIER DEPUIS RESEND DASHBOARD]
TTL:   Auto
```

**Où trouver**: https://resend.com/domains → id0c.com → DNS Records
**Exemple de valeur**: `resend1234567890.resend.com`

### Record 6: Resend Verification
```
Type:  TXT
Name:  _resend
Value: [À COPIER DEPUIS RESEND DASHBOARD]
TTL:   Auto
```

**Où trouver**: https://resend.com/domains → id0c.com → DNS Records
**Exemple de valeur**: `resend_verify_abc123xyz789`

---

## 🔐 NAMESERVERS (Configurer chez Bolt)

```
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
```

**IMPORTANT**: Ces valeurs EXACTES seront affichées dans Vercel Dashboard quand vous activez "Use Vercel DNS"

---

## ✅ VALIDATION CHECKLIST

Après configuration, vérifier:

### Dans Vercel Dashboard
- [ ] Domaine id0c.com → Statut "Valid Configuration"
- [ ] HTTPS actif (cadenas vert)
- [ ] 6 DNS records configurés

### Dans Resend Dashboard
- [ ] Domaine id0c.com → Statut "Verified"
- [ ] SPF Check: ✓ Pass
- [ ] DKIM Check: ✓ Pass
- [ ] DMARC Check: ✓ Pass

### Tests automatiques
```bash
./scripts/validate-dns-setup.sh
```

### Test manual
```bash
# Nameservers
dig NS id0c.com +short

# A Record
dig A id0c.com +short

# SPF
dig TXT id0c.com +short | grep spf

# DKIM
dig CNAME resend._domainkey.id0c.com +short

# DMARC
dig TXT _dmarc.id0c.com +short

# Resend Verification
dig TXT _resend.id0c.com +short
```

---

## 🧪 TEST EMAIL COMPLET

### Test depuis Edge Function

```bash
curl -X POST \
  https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjE1MjYsImV4cCI6MjA0NjQ5NzUyNn0.m3wt4oxwjJbjk2iwVWGXtV0YT1GkCB_h9GgRW78rKqo" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["test@mail-tester.com"],
    "subject": "Test Production iDoc - DNS Complets",
    "html": "<h1>Test Email</h1><p>Envoyé depuis alerts@id0c.com via Resend</p><p>Configuration: Vercel DNS + Resend + Supabase Edge Functions</p>"
  }'
```

### Vérifier score deliverability

1. Aller sur https://www.mail-tester.com
2. Noter l'adresse email de test affichée
3. Remplacer `test@mail-tester.com` dans la commande ci-dessus
4. Envoyer l'email
5. Vérifier le score (attendu: 10/10)

**Critères pour 10/10**:
- ✓ SPF Pass
- ✓ DKIM Pass
- ✓ DMARC Pass
- ✓ No blacklist
- ✓ Valid HTML
- ✓ Proper headers

---

## 📊 EXEMPLE DE CONFIGURATION COMPLÈTE

```
DOMAIN: id0c.com
REGISTRAR: Bolt
DNS AUTHORITY: Vercel DNS
EMAIL SERVICE: Resend
BACKEND: Supabase

NAMESERVERS:
  → ns1.vercel-dns.com
  → ns2.vercel-dns.com

DNS RECORDS:
  A       @                    76.76.21.21
  CNAME   www                  cname.vercel-dns.com
  TXT     @                    v=spf1 include:_spf.resend.com ~all
  TXT     _dmarc               v=DMARC1; p=none; rua=mailto:postmaster@id0c.com
  CNAME   resend._domainkey    [depuis Resend]
  TXT     _resend              [depuis Resend]

EDGE FUNCTIONS:
  → send-email (alerts@id0c.com)
  → idoc-alert-notify (alerts@id0c.com)

SECRETS SUPABASE:
  → RESEND_API_KEY
```

---

## 🔄 ORDRE DE CONFIGURATION

```
1. Activer Vercel DNS
   → Vercel Dashboard → Use Vercel DNS
   → Noter les nameservers

2. Changer nameservers Bolt
   → Bolt Dashboard → Domains → Nameservers
   → Copier nameservers Vercel

3. ATTENDRE 15-30 minutes
   → Propagation DNS

4. Ajouter records WEB (1-2)
   → Vercel DNS Records

5. Ajouter records EMAIL (3-4)
   → Vercel DNS Records

6. Configurer Resend
   → Add domain id0c.com
   → Copier valeurs DKIM + Verification

7. Ajouter records Resend (5-6)
   → Vercel DNS Records

8. Verify domain Resend
   → Attendre "Verified"

9. Configurer Supabase Secret
   → RESEND_API_KEY

10. Valider configuration
    → ./scripts/validate-dns-setup.sh

11. Test email
    → curl send-email
    → Vérifier mail-tester.com
```

---

## 🚨 TROUBLESHOOTING

### Problème: Nameservers pas propagés

**Symptôme**: `dig NS id0c.com` ne montre pas Vercel

**Solution**:
1. Vérifier configuration Bolt
2. Attendre 15-30 minutes supplémentaires
3. Vérifier sur https://dnschecker.org/#NS/id0c.com

### Problème: Resend ne vérifie pas le domaine

**Symptôme**: Resend Dashboard → statut "Pending"

**Solution**:
1. Vérifier que records 5 et 6 sont bien ajoutés
2. Vérifier avec `dig CNAME resend._domainkey.id0c.com`
3. Attendre 5-10 minutes
4. Re-cliquer "Verify Domain"

### Problème: Email test échoue

**Symptôme**: Edge Function renvoie erreur

**Solution**:
1. Vérifier RESEND_API_KEY dans Supabase
2. Vérifier domaine verified dans Resend
3. Vérifier logs Supabase Edge Functions
4. Tester avec: `curl -v [URL]` pour voir erreur détaillée

### Problème: Score mail-tester.com < 10

**Symptôme**: Score 7/10, 8/10, ou 9/10

**Solution**:
1. Vérifier SPF: `dig TXT id0c.com +short | grep spf`
2. Vérifier DKIM: `dig CNAME resend._domainkey.id0c.com +short`
3. Vérifier DMARC: `dig TXT _dmarc.id0c.com +short`
4. Attendre propagation DNS complète (jusqu'à 48h)

---

## 📞 RESSOURCES UTILES

### Dashboards
- Vercel: https://vercel.com/dashboard
- Resend: https://resend.com/domains
- Supabase: https://supabase.com/dashboard/project/ffujpjaaramwhtmzqhlx

### Outils de vérification
- DNS Checker: https://dnschecker.org
- MX Toolbox: https://mxtoolbox.com/SuperTool.aspx?action=spf:id0c.com
- Mail Tester: https://www.mail-tester.com
- Google Postmaster: https://postmaster.google.com

### Documentation
- Vercel DNS: https://vercel.com/docs/concepts/projects/custom-domains#dns
- Resend DNS: https://resend.com/docs/dashboard/domains/introduction
- SPF: https://www.rfc-editor.org/rfc/rfc7208
- DKIM: https://www.rfc-editor.org/rfc/rfc6376
- DMARC: https://www.rfc-editor.org/rfc/rfc7489

---

## ✅ CONFIGURATION FINALE ATTENDUE

Une fois tout configuré, voici ce que vous devriez avoir:

```bash
# Nameservers
$ dig NS id0c.com +short
ns1.vercel-dns.com.
ns2.vercel-dns.com.

# A Record
$ dig A id0c.com +short
76.76.21.21

# WWW
$ dig CNAME www.id0c.com +short
cname.vercel-dns.com.

# SPF
$ dig TXT id0c.com +short
"v=spf1 include:_spf.resend.com ~all"

# DKIM
$ dig CNAME resend._domainkey.id0c.com +short
resend1234567890.resend.com.

# DMARC
$ dig TXT _dmarc.id0c.com +short
"v=DMARC1; p=none; rua=mailto:postmaster@id0c.com"

# Resend Verification
$ dig TXT _resend.id0c.com +short
"resend_verify_abc123xyz789"

# HTTPS
$ curl -I https://id0c.com
HTTP/2 200

# Email Test
$ curl -X POST [Edge Function URL]
{"success":true,"id":"abc-123-xyz"}
```

---

**DATE DE CRÉATION**: 2026-01-11
**VERSION**: 1.0
**STATUT**: Production Ready
