# 🎯 CONFIGURATION DNS POUR NAME.COM

Votre domaine id0c.com est enregistré chez **Name.com, Inc.**

---

## ✅ ÉTAPE 1: Se connecter à Name.com

```
1. Aller sur: https://www.name.com/account/domain
2. Se connecter avec vos identifiants
3. Trouver "id0c.com" dans la liste
```

**Besoin d'accès ?**
- Email de récupération: Cherchez emails de "name.com" dans votre boîte
- Support: abuse@name.com ou +1.720.310.1849

---

## 🎯 ÉTAPE 2: Accéder aux DNS Records

```
1. Cliquer sur "id0c.com"
2. Dans le menu, cliquer sur "DNS Records" ou "Manage DNS"
3. Vous verrez une interface pour ajouter des records
```

---

## 📝 ÉTAPE 3: Ajouter les DNS Records

### Records pour Vercel (Site Web)

#### Record 1: A Record
```
Type:   A
Host:   @ (ou laissez vide)
Answer: 76.76.21.21
TTL:    300 (ou Auto)
```

#### Record 2: CNAME pour WWW
```
Type:   CNAME
Host:   www
Answer: cname.vercel-dns.com
TTL:    300 (ou Auto)
```

### Records pour Resend (Emails)

#### Record 3: SPF
```
Type:   TXT
Host:   @ (ou laissez vide)
Answer: v=spf1 include:_spf.resend.com ~all
TTL:    300
```

#### Record 4: DMARC
```
Type:   TXT
Host:   _dmarc
Answer: v=DMARC1; p=none; rua=mailto:postmaster@id0c.com
TTL:    300
```

#### Record 5: DKIM (À obtenir de Resend)
```
Type:   CNAME
Host:   resend._domainkey
Answer: [VALEUR DE RESEND - voir étape 4]
TTL:    300
```

#### Record 6: Verification Resend (À obtenir de Resend)
```
Type:   TXT
Host:   _resend
Answer: [VALEUR DE RESEND - voir étape 4]
TTL:    300
```

**IMPORTANT**: 
- Cliquer sur "Add Record" ou "+" après chaque saisie
- Ne supprimez PAS les records existants (sauf si en conflit)

---

## 🔧 ÉTAPE 4: Configurer Resend

### A) Ajouter le domaine dans Resend

```
1. https://resend.com/domains
2. Cliquer "Add Domain"
3. Entrer: id0c.com
4. Cliquer "Add"
```

### B) Copier les valeurs DNS

Resend affiche 2 records à ajouter:

**DKIM Record**:
```
Type: CNAME
Host: resend._domainkey
Value: [une longue valeur se terminant par .resend.com]
```

**Verification Record**:
```
Type: TXT
Host: _resend
Value: [une chaîne aléatoire]
```

### C) Retourner sur Name.com

1. Ajouter ces 2 records (5 et 6 ci-dessus)
2. Utiliser les valeurs exactes de Resend
3. Sauvegarder

### D) Vérifier dans Resend

```
1. Retour sur https://resend.com/domains
2. Cliquer sur "id0c.com"
3. Cliquer "Verify Domain"
4. Attendre 5-10 minutes
5. Status devrait passer à "Verified" ✅
```

---

## 🔑 ÉTAPE 5: Créer API Key Resend

```
1. https://resend.com/api-keys
2. "Create API Key"
3. Name: "iDoc Production"
4. Permission: "Sending access"
5. COPIER la clé (commence par re_...)
```

**IMPORTANT**: Gardez cette clé en sécurité, vous ne pourrez plus la revoir !

---

## 💾 ÉTAPE 6: Configurer Supabase

```
1. https://supabase.com/dashboard/project/ffujpjaaramwhtmzqhlx/settings/vault
2. Cliquer "New Secret"
3. Name: RESEND_API_KEY
4. Secret: [coller la clé de l'étape 5]
5. Cliquer "Add Secret"
```

---

## 🚀 ÉTAPE 7: Connecter Vercel

```
1. https://vercel.com/dashboard
2. Sélectionner votre projet iDoc
3. Settings → Domains
4. Cliquer "Add"
5. Entrer: id0c.com
6. Cliquer "Add"
7. Vercel détecte automatiquement le A record
8. Attendre "Valid Configuration" ✅
```

Si Vercel demande de vérifier:
- Retournez sur Name.com
- Vérifiez que le A record 76.76.21.21 est bien ajouté
- Attendez 5-10 minutes

---

## ✅ ÉTAPE 8: Valider la Configuration

Attendre 15-20 minutes pour la propagation DNS, puis:

```bash
./scripts/validate-dns-setup.sh
```

---

## 🧪 ÉTAPE 9: Tester l'Envoi d'Emails

```bash
curl -X POST \
  https://ffujpjaaramwhtmzqhlx.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdWpwamFhcmFtd2h0bXpxaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjE1MjYsImV4cCI6MjA0NjQ5NzUyNn0.m3wt4oxwjJbjk2iwVWGXtV0YT1GkCB_h9GgRW78rKqo" \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["test@mail-tester.com"],
    "subject": "Test Email iDoc",
    "html": "<h1>Email depuis id0c.com</h1><p>Test de configuration.</p>"
  }'
```

**Vérifier le score**:
```
1. Aller sur: https://www.mail-tester.com
2. Voir le score (devrait être 10/10)
```

---

## 📊 RÉCAPITULATIF

### Ce que vous avez fait:

✅ Identifié que le domaine est chez Name.com
✅ Ajouté 6 DNS records sur Name.com:
  - 1 A record → Pointe vers Vercel
  - 1 CNAME www → Pointe vers Vercel
  - 2 TXT (SPF + DMARC) → Configuration email
  - 1 CNAME (DKIM) → Signature email
  - 1 TXT (Resend) → Vérification domaine

✅ Configuré Resend pour envoyer depuis @id0c.com
✅ Ajouté RESEND_API_KEY dans Supabase
✅ Connecté le domaine à Vercel
✅ Testé et validé

### Résultat:

🌐 **Site web**: https://id0c.com → Application Vercel
📧 **Emails**: alerts@id0c.com, notifications@id0c.com → Resend
🔒 **Sécurité**: SPF, DKIM, DMARC configurés
✅ **Score email**: 10/10 sur Mail Tester

---

## ⏱️ DURÉE TOTALE

```
 5 min → Se connecter à Name.com
10 min → Ajouter 6 DNS records
10 min → Configurer Resend
 3 min → Configurer Supabase
 2 min → Connecter Vercel
15 min → Attendre propagation DNS
 2 min → Tester et valider
━━━━━━━━━━━━━━━━━━━━━━━━━
47 min TOTAL
```

---

## 🆘 PROBLÈMES COURANTS

### "Je ne trouve pas id0c.com sur Name.com"

**Solution**:
1. Vérifier que vous êtes connecté au bon compte
2. Chercher dans "Domain Manager" ou "My Domains"
3. Contacter support Name.com: abuse@name.com

### "Resend ne vérifie pas le domaine"

**Solution**:
1. Vérifier que les records DKIM et _resend sont corrects
2. Attendre 10-15 minutes supplémentaires
3. Utiliser: `dig resend._domainkey.id0c.com CNAME`
4. Vérifier qu'il retourne la valeur Resend

### "Vercel ne détecte pas le domaine"

**Solution**:
1. Vérifier le A record: `dig id0c.com A`
2. Devrait retourner: 76.76.21.21
3. Attendre 10-15 minutes
4. Essayer "Refresh" dans Vercel

### "Les emails ne s'envoient pas"

**Solution**:
1. Vérifier RESEND_API_KEY dans Supabase Vault
2. Vérifier que Resend affiche "Verified"
3. Vérifier SPF: `dig id0c.com TXT`
4. Tester avec mail-tester.com

---

## 📞 SUPPORT

**Name.com Support**:
- Email: abuse@name.com
- Téléphone: +1.720.310.1849
- Dashboard: https://www.name.com/account/domain

**Resend Support**:
- Documentation: https://resend.com/docs
- Status: https://status.resend.com

**Vercel Support**:
- Documentation: https://vercel.com/docs/domains
- Status: https://vercel-status.com

---

## ✅ CHECKLIST FINALE

Cochez au fur et à mesure:

- [ ] Connecté à Name.com
- [ ] Trouvé id0c.com dans la liste
- [ ] Ajouté A record (76.76.21.21)
- [ ] Ajouté CNAME www (cname.vercel-dns.com)
- [ ] Ajouté TXT SPF
- [ ] Ajouté TXT DMARC
- [ ] Créé compte Resend
- [ ] Ajouté domaine dans Resend
- [ ] Ajouté CNAME DKIM
- [ ] Ajouté TXT _resend
- [ ] Resend affiche "Verified"
- [ ] Créé API Key Resend
- [ ] Ajouté RESEND_API_KEY dans Supabase
- [ ] Connecté domaine dans Vercel
- [ ] Vercel affiche "Valid Configuration"
- [ ] Script validation passe
- [ ] Test email fonctionne (10/10)

**Si tout est coché**: Configuration terminée ! 🎉

---

**Prochaine étape**: Testez votre application sur https://id0c.com
