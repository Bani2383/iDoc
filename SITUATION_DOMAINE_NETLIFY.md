# 🚨 SITUATION: Domaine id0c.com via Netlify

## CE QUI S'EST PASSÉ

Selon les informations WHOIS et votre compte Name.com:

1. **WHOIS indique**: 
   - Registrar: Name.com, Inc.
   - Organisation: **Netlify Inc.**
   - Le domaine existe et est actif

2. **Votre compte Name.com montre**:
   - 0 nom de domaine
   - Le domaine n'apparaît pas

## CONCLUSION

**Le domaine id0c.com a été enregistré via Netlify, pas directement chez Name.com.**

Netlify a utilisé Name.com comme registrar, mais C'EST NETLIFY qui gère le domaine.

---

## ✅ SOLUTIONS (3 OPTIONS)

### Option 1: Gérer DNS via Netlify (PLUS SIMPLE)

**Durée**: 20 minutes

Puisque le domaine est sur Netlify, configurez tout via Netlify:

```
1. Aller sur: https://app.netlify.com
2. Se connecter
3. Sites → Sélectionner votre site
4. Domain settings
5. Trouver "id0c.com"
6. Configure DNS records
```

**DNS Records à ajouter sur Netlify**:

```
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
TXT     @       v=spf1 include:_spf.resend.com ~all
TXT     _dmarc  v=DMARC1; p=none; rua=mailto:postmaster@id0c.com
CNAME   resend._domainkey   [VALEUR RESEND]
TXT     _resend             [VALEUR RESEND]
```

**Ensuite**:
- Suivez les étapes Resend du guide CONFIGURATION_NAME_COM.md (à partir de l'étape 4)

---

### Option 2: Transférer le domaine vers votre compte Name.com

**Durée**: 1-2 heures + 24-48h pour le transfert

**Étapes**:

```
1. Sur Netlify:
   - Domain settings → Transfer domain
   - Obtenir le code d'autorisation (auth code)
   - Déverrouiller le domaine

2. Sur Name.com:
   - Aller sur: https://www.name.com/domain-transfer
   - Entrer: id0c.com
   - Entrer le code d'autorisation
   - Payer les frais de transfert (~15-20$)
   
3. Attendre 24-48h pour le transfert

4. Une fois transféré, suivez CONFIGURATION_NAME_COM.md
```

**Avantages**:
- Contrôle total du domaine
- Plus de dépendance à Netlify

**Inconvénients**:
- Coûte de l'argent
- Prend 1-2 jours
- Risque de downtime

---

### Option 3: Pointer le domaine vers Vercel sans le transférer

**Durée**: 25 minutes

**Si vous voulez garder le domaine sur Netlify mais l'utiliser avec Vercel**:

```
1. Sur Netlify (https://app.netlify.com):
   Domain settings → DNS records
   
2. Supprimer tous les A records existants

3. Ajouter:
   A    @    76.76.21.21

4. Ajouter:
   CNAME    www    cname.vercel-dns.com

5. Ajouter les records email (SPF, DMARC, etc.)
```

Ensuite suivez les étapes Resend et Vercel des autres guides.

---

## 🎯 QUELLE OPTION CHOISIR ?

### Vous voulez la solution la plus rapide ?
→ **Option 1: Tout via Netlify** (20 min)

### Vous voulez quitter Netlify complètement ?
→ **Option 3: Pointer DNS vers Vercel** (25 min)

### Vous voulez un contrôle total ?
→ **Option 2: Transférer vers Name.com** (1-2 jours)

---

## 📋 OPTION 1 DÉTAILLÉE: Configuration via Netlify

### Étape 1: Accéder aux DNS Netlify

```
1. https://app.netlify.com
2. Se connecter
3. Cliquer sur "Domains" dans le menu
4. Trouver "id0c.com"
5. Cliquer dessus
6. Aller dans "DNS settings" ou "Domain management"
```

### Étape 2: Vérifier que id0c.com est bien là

Si id0c.com n'apparaît pas:
- Vérifier que vous êtes sur le bon compte Netlify
- Chercher dans tous vos sites Netlify
- Contacter support Netlify: support@netlify.com

### Étape 3: Configurer DNS Records

Dans "DNS records" ou "Add new record":

#### Record 1: A Record pour Vercel
```
Type:   A
Name:   @ (ou id0c.com)
Value:  76.76.21.21
TTL:    Auto ou 3600
```

#### Record 2: CNAME pour WWW
```
Type:   CNAME
Name:   www
Value:  cname.vercel-dns.com
TTL:    Auto ou 3600
```

#### Record 3: SPF
```
Type:   TXT
Name:   @ (ou id0c.com)
Value:  v=spf1 include:_spf.resend.com ~all
TTL:    Auto ou 3600
```

#### Record 4: DMARC
```
Type:   TXT
Name:   _dmarc
Value:  v=DMARC1; p=none; rua=mailto:postmaster@id0c.com
TTL:    Auto ou 3600
```

### Étape 4: Configurer Resend

Suivez exactement les étapes 4, 5, 6 de CONFIGURATION_NAME_COM.md:
- Ajouter domaine dans Resend
- Copier DKIM et Verification records
- Les ajouter sur Netlify DNS
- Créer API Key
- Configurer Supabase

### Étape 5: Connecter Vercel

```
1. https://vercel.com/dashboard
2. Votre projet → Settings → Domains
3. Add: id0c.com
4. Vercel détecte le A record
5. Attendre "Valid Configuration"
```

### Étape 6: Valider

```bash
# Attendre 10-15 minutes, puis:
dig id0c.com A
# Devrait retourner: 76.76.21.21

dig www.id0c.com CNAME
# Devrait retourner: cname.vercel-dns.com

./scripts/validate-dns-setup.sh
```

---

## 📋 OPTION 3 DÉTAILLÉE: Pointer DNS sans transférer

Identique à Option 1, mais:

**Différence**: Vous gardez le domaine chez Netlify, vous changez juste où il pointe.

**Avantages**:
- Rapide (25 min)
- Gratuit
- Réversible

**Inconvénients**:
- Toujours dépendant de Netlify pour DNS
- Si problème Netlify, le site est down

**Étapes**: Exactement comme Option 1

---

## 🆘 PROBLÈMES COURANTS

### "Je ne trouve pas id0c.com sur Netlify"

**Solutions**:
1. Vérifier que vous êtes sur le bon compte
2. Chercher dans "Domains" (pas dans "Sites")
3. Le domaine pourrait être dans un autre compte Netlify
4. Contacter support: support@netlify.com

### "Je n'ai pas accès à Netlify"

**Solution**:
- Soit quelqu'un d'autre a enregistré le domaine
- Soit vous avez utilisé un autre compte
- Cherchez emails de "netlify.com" dans votre boîte
- Si rien, contactez: support@netlify.com avec preuve de propriété

### "Je veux juste quitter Netlify"

**Solution**:
→ Option 2: Transférer vers Name.com
- Coûte ~15-20$
- Prend 1-2 jours
- Vous donne contrôle total

---

## 📞 SUPPORT

**Netlify Support**:
- Email: support@netlify.com
- Dashboard: https://app.netlify.com
- Docs: https://docs.netlify.com/domains-https/custom-domains/

**Name.com Support** (pour transfert):
- Email: abuse@name.com
- Téléphone: +1.720.310.1849
- Transfert: https://www.name.com/domain-transfer

---

## ✅ RECOMMANDATION FINALE

**Pour aujourd'hui**:
→ **Option 1 ou 3: Gérer DNS via Netlify** (20-25 min)

**Pour plus tard** (optionnel):
→ Transférer vers Name.com pour contrôle total

---

**Prochaine étape**: 

Connectez-vous sur https://app.netlify.com et trouvez id0c.com dans vos domaines.

Ensuite, suivez Option 1 ci-dessus.
