# ✅ GUIDE ULTRA-SIMPLE (Sans Bolt)

**OUBLIEZ Bolt pour la config DNS. Bolt n'est pas un registrar.**

---

## 🎯 CE QUE VOUS DEVEZ FAIRE

### 1️⃣ Trouver où sont vos DNS (5 minutes)

Allez sur: **https://whois.domaintools.com/id0c.com**

Notez le "Registrar" affiché.

Ou recherchez dans vos emails: `id0c.com renewal`

**Exemples**:
- GoDaddy → https://dcc.godaddy.com
- Namecheap → https://ap.namecheap.com  
- Cloudflare → https://dash.cloudflare.com
- OVH → https://ovh.com/manager

---

### 2️⃣ Ajouter 4 records DNS de base (5 minutes)

Dans votre dashboard DNS, ajoutez:

```
Record 1:
Type: A
Host: @
Value: 76.76.21.21

Record 2:
Type: CNAME
Host: www
Value: cname.vercel-dns.com

Record 3:
Type: TXT
Host: @
Value: v=spf1 include:_spf.resend.com ~all

Record 4:
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:postmaster@id0c.com
```

**SAVE / Enregistrer**

---

### 3️⃣ Configurer Resend (10 minutes)

#### A) Obtenir les valeurs DKIM
```
1. https://resend.com/domains
2. Add Domain → id0c.com
3. Resend affiche 2 records:
   - DKIM (resend._domainkey)
   - Verification (_resend)
4. NOTER ces 2 valeurs
```

#### B) Ajouter dans votre DNS
```
Record 5:
Type: CNAME
Host: resend._domainkey
Value: [valeur DKIM depuis Resend]

Record 6:
Type: TXT
Host: _resend
Value: [valeur verification depuis Resend]
```

**SAVE / Enregistrer**

#### C) Vérifier domaine
```
Retour sur Resend
→ Cliquer "Verify Domain"
→ Attendre "Verified" (5 min)
```

---

### 4️⃣ Configurer Supabase Secret (3 minutes)

#### A) Créer API Key Resend
```
1. https://resend.com/api-keys
2. Create API Key
3. Nom: "iDoc Production"
4. COPIER la clé (re_...)
```

#### B) Ajouter dans Supabase
```
1. https://supabase.com/dashboard/project/ffujpjaaramwhtmzqhlx/settings/vault
2. New Secret
3. Name: RESEND_API_KEY
4. Secret: [coller clé]
5. Add Secret
```

---

### 5️⃣ Connecter Vercel (2 minutes)

```
1. https://vercel.com/dashboard
2. Sélectionner projet iDoc
3. Settings → Domains
4. Add → id0c.com
5. Attendre "Valid Configuration"
```

---

### 6️⃣ Tester (2 minutes)

Attendre 10-15 minutes puis:

```bash
./scripts/validate-dns-setup.sh
```

Et tester email:

```bash
curl -X POST https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjE1MjYsImV4cCI6MjA0NjQ5NzUyNn0.m3wt4oxwjJbjk2iwVWGXtV0YT1GkCB_h9GgRW78rKqo" \
  -H "Content-Type: application/json" \
  -d '{"to":["test@mail-tester.com"],"subject":"Test","html":"<h1>Test</h1>"}'
```

Vérifier: https://www.mail-tester.com (10/10)

---

## ⏱️ DURÉE TOTALE

```
 5 min → Trouver dashboard DNS
 5 min → Ajouter 4 records de base
10 min → Configurer Resend + 2 records
 3 min → Configurer Supabase
 2 min → Connecter Vercel
15 min → Attendre propagation
 2 min → Tester
━━━━━━━━━━━━━━━━━━━━━━━━━━
42 min TOTAL
```

---

## 📋 CHECKLIST

Cochez au fur et à mesure:

- [ ] J'ai identifié mon registrar/DNS
- [ ] J'ai accès au dashboard DNS
- [ ] J'ai ajouté les 4 records de base
- [ ] J'ai configuré Resend
- [ ] J'ai ajouté les 2 records Resend
- [ ] Resend affiche "Verified"
- [ ] J'ai ajouté RESEND_API_KEY dans Supabase
- [ ] J'ai connecté domaine dans Vercel
- [ ] Vercel affiche "Valid Configuration"
- [ ] Le script validate-dns-setup.sh passe
- [ ] Test email fonctionne (10/10)

---

## 🆘 BESOIN D'AIDE

**Étape bloquante**: Quelle étape ne fonctionne pas ?

**Erreur rencontrée**: Quel message d'erreur voyez-vous ?

**Dashboard utilisé**: Quel site utilisez-vous pour DNS ?

---

**Ce guide évite complètement Bolt et fonctionne avec N'IMPORTE QUEL registrar !**
